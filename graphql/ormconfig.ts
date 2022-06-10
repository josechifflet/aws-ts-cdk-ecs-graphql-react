// ======================
// Only for typeorm-cli
// ======================

import { ConnectionOptions } from "typeorm";
import { config as envConfig } from "./src/config";

const config: ConnectionOptions = {
  type: envConfig.dbVendor || "postgres" as any,
  synchronize: false,
  host: envConfig.dbHost || "localhost",
  port: envConfig.dbPort,
  username: envConfig.dbUser || "default_username",
  password: envConfig.dbPassword || "default_pass",
  database: envConfig.dbName || "default_db_name",
  logging: true,
  migrations: [__dirname, "src/db/migrations/**/*{.js,.ts}"],
  cli: {
    migrationsDir: "src/db/migrations",
  },
};

export = config