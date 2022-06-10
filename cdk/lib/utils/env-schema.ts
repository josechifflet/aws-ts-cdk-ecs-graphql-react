import {z} from 'zod';

export const envVarsSchema = z.object({
  PROJECT_NAME: z.string(),
  ENVIRONMENT : z.string(),
  AWS_REGION : z.string(),
  AWS_ACCOUNT : z.string(),
  DB_HOST : z.string(),
  DB_PORT: z.string(),
  DB_NAME : z.string(),
  DB_USER : z.string(),
  API_PORT: z.string(),
});

export type envVarsSchemaType = z.infer<typeof envVarsSchema>;
