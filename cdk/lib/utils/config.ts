/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as dotEnv from 'dotenv';
import * as path from 'path';
import {envVarsSchema, envVarsSchemaType} from './env-schema';

dotEnv.config({ path: path.resolve(__dirname, "../.env") });

class Config {
  config: envVarsSchemaType;

  constructor() {
    this.config = this.loadConfig();
  }

  public loadConfig = (): envVarsSchemaType => {
    const validateEnvVarsSchemaResult = envVarsSchema.safeParse(process.env);
    if (!validateEnvVarsSchemaResult.success)
      throw new Error(validateEnvVarsSchemaResult.error.toString());

    console.log('All env vars are valid');
    this.config = validateEnvVarsSchemaResult.data;
    return validateEnvVarsSchemaResult.data;
  };
}

export const configEnvironment = new Config();
export const {config} = configEnvironment;
