import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import {
  createConnection,
  getConnection,
  getConnectionManager,
  Connection,
} from "typeorm";

import path from "path";
import { logError, logInfo, logSuccess } from "../utils/helpers/logger";
import { config } from "../config";

import _ from "lodash";
export class Db {
  public readonly config: PostgresConnectionOptions;

  constructor(loggingEnabled?: boolean) {
    this.config = {
      type: "postgres",
      host: config.dbHost,
      port: config.dbPort,
      username: config.dbUser,
      password: config.dbPassword,
      database: config.dbName,
      logging: loggingEnabled ? "all" : ["error"],
      entities: [path.resolve(__dirname, "../entities/*{.js,.ts}")],
      migrations: [path.resolve(__dirname, "migrations/**/*{.js,.ts}")],
    };
  }

  public connectDb = async (
    retry?: boolean,
    retryMsInterval?: number
  ): Promise<Connection | undefined> => {
    let connection!: Connection;
    try {
      if (!getConnectionManager().has("default")) {
        connection = await createConnection(this.config);
        logSuccess("DB CONNECTION SUCCESSFULLY CREATED 💾 🗂 💾", "TypeORM");
      } else if (!getConnection().isConnected) {
        connection = await getConnection().connect();
        logSuccess("DB CONNECTION SUCCESSFULLY CONNECTED 💾 🗂 💾", "TypeORM");
      } else {
        connection = getConnection();
        logSuccess("DB ALREADY CONNECTED 💾 🗂 💾", "TypeORM");
      }
    } catch (err) {
      logError("DB CONNECTION REFUSED 📛 🆘 📛 ", "TypeORM");
      logError(`${err}`, "TypeORM");
      if (retry) {
        if (this.config.logging === "all")
          logInfo(
            `It will try to reestablish connection ${
              retryMsInterval || 60 * 1000
            } ms`,
            "TypeORM"
          );
      }
    }
    return connection;
  };

  public disconnectDb = async (): Promise<void> => {
    try {
      await getConnection().close();
      if (this.config.logging === "all")
        logSuccess("DB CONNECTION CLOSED SUCCESSFULLY 💾 🗂 💾", "TypeORM");
    } catch (err) {
      logError(`${err}`, `TypeORM`);
    }
  };

  public getConnection = getConnection;

  public syncModels = async (dropBefore: boolean) => {
    try {
      getConnection().synchronize(dropBefore);
      if (this.config.logging === "all")
        logInfo(
          "Synchronization between API models and DB was done!!!",
          "TypeORM"
        );
    } catch (err) {
      logError(
        "Synchronization between API models models and DB failed",
        "TypeORM"
      );
    }
  };

  public runMigrations = async () => {
    try {
      logInfo("Running migrations...", "TypeORM");
      const connection = getConnection();
      const hasPendingMigrations = await connection?.showMigrations();
      if (hasPendingMigrations) {
        const appliedMigrations = await connection?.runMigrations();
        logSuccess(
          `${
            appliedMigrations?.length || 0
          } migrations were successfully applied!`,
          `TypeORM`
        );
      } else logSuccess(`There is no pending migration to apply!`, `TypeORM`);

      return true;
    } catch (err) {
      logError(`Error running migrations. ERROR: ${err}`, `TypeORM`);
      return false;
    }
  };
}

export const db = new Db(!config.isRemoteEnv);
