import { buildSchema } from "type-graphql";
import express, { Application } from "express";
import cors from "cors";
import path from "path";
import { createServer } from "http";
import { ApolloServer } from "apollo-server-express";
import { PubSub, PubSubEngine } from "graphql-subscriptions";
import { json, urlencoded } from "body-parser";
import { db } from "./db";
import { resolvers } from "./resolvers";

import { logInfo } from "./utils/helpers/logger";
import { config } from "./config";
import { Context, Session } from "./utils/auth/types";
import { customAuthChecker, jwtMiddleware } from "./utils/auth";

import { graphqlUploadExpress } from "graphql-upload";

require("reflect-metadata");

export const pubsub: PubSubEngine = new PubSub();
declare global {
  namespace Express {
    interface Request {
      user: Session;
    }
  }
}

async function main() {

  // Connect to db, run pending migrations and run seeds
  const conn = await db.connectDb(true);
  if (conn?.isConnected) {
    // await db.syncModels(true)
    await db.runMigrations();
  }

  // Build the graphQL `schema` from resolvers and its class decorators
  const schema = await buildSchema({
    resolvers,
    emitSchemaFile: path.resolve(__dirname, "../schema.gql"),
    authChecker: customAuthChecker,
    pubSub: pubsub,
  });

  // Create an express app
  const app: Application = express();

  // Create an http server
  const server = createServer(app);

  // Create an apollo server
  const apolloServer = new ApolloServer({
    schema,
    subscriptions: {
      path: "/graphql",
    },
    context: ({ req }) => {
      const context: Context = {
        req,
        user: req.user,
      };
      return context;
    },
    uploads: false,
  });

  // endpoint to check if http and express server are running fine
  app.get("/healthz", (req, res) => {
    res.send("Everything is fine!!!");
  });

  // Authorization
  app.use(jwtMiddleware(false));

  app.use(graphqlUploadExpress({ maxFileSize: 1000000000, maxFiles: 100 }));

  // Add apollo server to express app, the apollo server is now running in `/graphql`
  apolloServer.applyMiddleware({ app, path: "/graphql" });

  /* Attach subscription server to GraphQL server */
  apolloServer.installSubscriptionHandlers(server);

  // cors and others middlewares
  app.use(cors());
  app.use(json());
  app.use(urlencoded({ extended: false }));

  server.listen({ host: "0.0.0.0", port: config.apiPort }, (): void => {
    logInfo(`Enviornment: ===>>> ${config.environment} <<<===`, "Node");
    logInfo(`Express server is now running on port ${config.apiPort}`, "Express");
    logInfo(`is now running on /graphql`, "GraphQL");
  });
}
if (require.main === module) {
  main();
}
