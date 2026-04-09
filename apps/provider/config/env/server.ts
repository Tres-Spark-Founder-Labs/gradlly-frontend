import { z } from 'zod';

import { type ClientEnv, clientEnv } from './client';

const serverSchema = z
  .object({
    JWT_ACCESS_TOKEN_NAME: z.string().min(1),
    JWT_REFRESH_TOKEN_NAME: z.string().min(1),
    COOKIE_DOMAIN: z.string().min(1),
    SENDGRID_API_KEY: z.string().min(1),
    AWS_REGION: z.string().min(1),
    AWS_S3_BUCKET: z.string().min(1),
    ESFA_API_BASE_URL: z.url(),
    SENTRY_DSN: z.string().min(1),
  })
  .strict();

type ServerOnlyEnv = z.infer<typeof serverSchema>;
export type ServerEnv = ServerOnlyEnv & ClientEnv;

const formatServerValidationError = (error: z.ZodError): never => {
  const fields = [...new Set(error.issues.map((issue) => issue.path.join('.')).filter(Boolean))];
  throw new Error(
    `Invalid server environment variables: ${fields.join(', ') || 'unknown validation error'}`,
  );
};

const parseServerEnv = (env: NodeJS.ProcessEnv): ServerOnlyEnv => {
  try {
    return serverSchema.parse({
      JWT_ACCESS_TOKEN_NAME: env.JWT_ACCESS_TOKEN_NAME,
      JWT_REFRESH_TOKEN_NAME: env.JWT_REFRESH_TOKEN_NAME,
      COOKIE_DOMAIN: env.COOKIE_DOMAIN,
      SENDGRID_API_KEY: env.SENDGRID_API_KEY,
      AWS_REGION: env.AWS_REGION,
      AWS_S3_BUCKET: env.AWS_S3_BUCKET,
      ESFA_API_BASE_URL: env.ESFA_API_BASE_URL,
      SENTRY_DSN: env.SENTRY_DSN,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      formatServerValidationError(error);
    }

    throw error;
  }
};

const serverEnvProxy = new Proxy({} as ServerEnv, {
  get() {
    throw new Error('serverEnv cannot be accessed in the browser.');
  },
});

export const serverEnv: ServerEnv =
  typeof window === 'undefined' ? { ...clientEnv, ...parseServerEnv(process.env) } : serverEnvProxy;
