import { z } from 'zod';

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_ENV: z.enum(['development', 'staging', 'production']),
  NEXT_PUBLIC_API_BASE_URL: z.url(),
  NEXT_PUBLIC_EMPLOYER_URL: z.url(),
  NEXT_PUBLIC_PROVIDER_URL: z.url(),
  NEXT_PUBLIC_APPRENTICE_URL: z.url(),
  NEXT_PUBLIC_FLOW_URL: z.url(),
});

const serverOnlyEnvSchema = z.object({
  JWT_ACCESS_TOKEN_NAME: z.string().min(1),
  JWT_REFRESH_TOKEN_NAME: z.string().min(1),
  COOKIE_DOMAIN: z.string().min(1),
  SENDGRID_API_KEY: z.string().min(1),
  AWS_REGION: z.string().min(1),
  AWS_S3_BUCKET: z.string().min(1),
  ESFA_API_BASE_URL: z.url(),
  SENTRY_DSN: z.string().min(1),
});

const formatErrors = (error: z.ZodError, scope: 'client' | 'server'): never => {
  const fields = error.issues.map((issue) => issue.path.join('.')).filter(Boolean);
  const uniqueFields = [...new Set(fields)].join(', ');
  throw new Error(`Invalid ${scope} environment variables: ${uniqueFields}`);
};

export type ClientEnv = z.infer<typeof clientEnvSchema>;
export type ServerOnlyEnv = z.infer<typeof serverOnlyEnvSchema>;
export type ServerEnv = ClientEnv & ServerOnlyEnv;

export const parseClientEnv = (env: NodeJS.ProcessEnv): ClientEnv => {
  try {
    return clientEnvSchema.parse({
      NEXT_PUBLIC_APP_ENV: env['NEXT_PUBLIC_APP_ENV'],
      NEXT_PUBLIC_API_BASE_URL: env['NEXT_PUBLIC_API_BASE_URL'],
      NEXT_PUBLIC_EMPLOYER_URL: env['NEXT_PUBLIC_EMPLOYER_URL'],
      NEXT_PUBLIC_PROVIDER_URL: env['NEXT_PUBLIC_PROVIDER_URL'],
      NEXT_PUBLIC_APPRENTICE_URL: env['NEXT_PUBLIC_APPRENTICE_URL'],
      NEXT_PUBLIC_FLOW_URL: env['NEXT_PUBLIC_FLOW_URL'],
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      formatErrors(error, 'client');
    }

    throw error;
  }
};

export const parseServerEnv = (env: NodeJS.ProcessEnv): ServerOnlyEnv => {
  try {
    return serverOnlyEnvSchema.parse({
      JWT_ACCESS_TOKEN_NAME: env['JWT_ACCESS_TOKEN_NAME'],
      JWT_REFRESH_TOKEN_NAME: env['JWT_REFRESH_TOKEN_NAME'],
      COOKIE_DOMAIN: env['COOKIE_DOMAIN'],
      SENDGRID_API_KEY: env['SENDGRID_API_KEY'],
      AWS_REGION: env['AWS_REGION'],
      AWS_S3_BUCKET: env['AWS_S3_BUCKET'],
      ESFA_API_BASE_URL: env['ESFA_API_BASE_URL'],
      SENTRY_DSN: env['SENTRY_DSN'],
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      formatErrors(error, 'server');
    }

    throw error;
  }
};
