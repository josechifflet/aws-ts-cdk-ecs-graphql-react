import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const config = {
  projectName: process.env.PROJECT_NAME as string,
  environment: process.env.ENVIRONMENT as string,
  region: process.env.AWS_REGION as string,
  account: process.env.AWS_ACCOUNT as string,
  dbVendor: process.env.DB_VENDOR || "postgres",
  dbHost: process.env.DB_HOST as string,
  dbPort: parseInt(process.env.DB_PORT || "5432"),
  dbName: process.env.DB_NAME || "default_username",
  dbUser: process.env.DB_USER || "default_db_name",
  dbPassword: process.env.POSTGRES_PASSWORD || "default_pass",
  apiPort: parseInt(process.env.API_PORT || "4000"),
  jwtSecretKey: process.env.JWT_SECRET_KEY || "secretExample",
  refreshTokenMinutesToExpire: parseInt(process.env.REFRESH_TOKEN_MINUTES_TO_EXPIRE || "60"),
  encryptPassword: process.env.ENCRYPT_PASSWORD || "encryptPasswordExample",
  isRemoteEnv: process.env.IS_REMOTE_ENV === "true"
};

export const envConfig = Object.entries(process.env).reduce((prev, [k, v]) => {
  if (v) prev[k] = v;
  return prev;
}, {} as { [k: string]: string });