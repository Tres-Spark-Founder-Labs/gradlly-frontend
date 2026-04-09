import { z } from 'zod';

export const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_ENV: z.enum(['development', 'staging', 'production']),
  NEXT_PUBLIC_API_BASE_URL: z.url(),
  NEXT_PUBLIC_EMPLOYER_URL: z.url(),
  NEXT_PUBLIC_PROVIDER_URL: z.url(),
  NEXT_PUBLIC_APPRENTICE_URL: z.url(),
  NEXT_PUBLIC_FLOW_URL: z.url(),
});

export const serverEnvSchema = z.object({
  JWT_ACCESS_TOKEN_NAME: z.string().min(1),
  JWT_REFRESH_TOKEN_NAME: z.string().min(1),
  COOKIE_DOMAIN: z.string().min(1),
  SENDGRID_API_KEY: z.string().min(1),
  AWS_REGION: z.string().min(1),
  AWS_S3_BUCKET: z.string().min(1),
  ESFA_API_BASE_URL: z.url(),
  SENTRY_DSN: z.string().min(1),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;
export type ServerOnlyEnv = z.infer<typeof serverEnvSchema>;
export type ServerEnv = ClientEnv & ServerOnlyEnv;

const formatValidationError = (scope: 'client' | 'server', error: z.ZodError): never => {
  const fields = [...new Set(error.issues.map((issue) => issue.path.join('.')).filter(Boolean))];
  throw new Error(
    `Invalid ${scope} environment variables: ${fields.join(', ') || 'unknown validation error'}`,
  );
};

export const parseClientEnv = (env: NodeJS.ProcessEnv): ClientEnv => {
  const isProduction = env['NODE_ENV'] === 'production';
  const defaults: ClientEnv = {
    NEXT_PUBLIC_APP_ENV: 'development',
    NEXT_PUBLIC_API_BASE_URL: 'http://localhost:4000',
    NEXT_PUBLIC_EMPLOYER_URL: 'http://localhost:3000',
    NEXT_PUBLIC_PROVIDER_URL: 'http://localhost:3001',
    NEXT_PUBLIC_APPRENTICE_URL: 'http://localhost:3002',
    NEXT_PUBLIC_FLOW_URL: 'http://localhost:3003',
  };

  try {
    return clientEnvSchema.parse({
      NEXT_PUBLIC_APP_ENV:
        env['NEXT_PUBLIC_APP_ENV'] ?? (isProduction ? undefined : defaults.NEXT_PUBLIC_APP_ENV),
      NEXT_PUBLIC_API_BASE_URL:
        env['NEXT_PUBLIC_API_BASE_URL'] ??
        (isProduction ? undefined : defaults.NEXT_PUBLIC_API_BASE_URL),
      NEXT_PUBLIC_EMPLOYER_URL:
        env['NEXT_PUBLIC_EMPLOYER_URL'] ??
        (isProduction ? undefined : defaults.NEXT_PUBLIC_EMPLOYER_URL),
      NEXT_PUBLIC_PROVIDER_URL:
        env['NEXT_PUBLIC_PROVIDER_URL'] ??
        (isProduction ? undefined : defaults.NEXT_PUBLIC_PROVIDER_URL),
      NEXT_PUBLIC_APPRENTICE_URL:
        env['NEXT_PUBLIC_APPRENTICE_URL'] ??
        (isProduction ? undefined : defaults.NEXT_PUBLIC_APPRENTICE_URL),
      NEXT_PUBLIC_FLOW_URL:
        env['NEXT_PUBLIC_FLOW_URL'] ?? (isProduction ? undefined : defaults.NEXT_PUBLIC_FLOW_URL),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      formatValidationError('client', error);
    }

    throw error;
  }
};

export const parseServerEnv = (env: NodeJS.ProcessEnv): ServerOnlyEnv => {
  try {
    return serverEnvSchema.parse({
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
      formatValidationError('server', error);
    }

    throw error;
  }
};
