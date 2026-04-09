import { z } from 'zod';

const clientSchema = z
  .object({
    NEXT_PUBLIC_APP_ENV: z.enum(['development', 'staging', 'production']),
    NEXT_PUBLIC_API_BASE_URL: z.url(),
    NEXT_PUBLIC_EMPLOYER_URL: z.url(),
    NEXT_PUBLIC_PROVIDER_URL: z.url(),
    NEXT_PUBLIC_APPRENTICE_URL: z.url(),
    NEXT_PUBLIC_FLOW_URL: z.url(),
    NEXT_PUBLIC_MAIN_URL: z.url(),
  })
  .strict();

export type ClientEnv = z.infer<typeof clientSchema>;

const formatClientValidationError = (error: z.ZodError): never => {
  const fields = [...new Set(error.issues.map((issue) => issue.path.join('.')).filter(Boolean))];
  throw new Error(
    `Invalid client environment variables: ${fields.join(', ') || 'unknown validation error'}`,
  );
};

const parseClientEnv = (env: Partial<Record<keyof ClientEnv, string | undefined>>): ClientEnv => {
  try {
    return clientSchema.parse(env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      formatClientValidationError(error);
    }

    throw error;
  }
};

const clientRuntimeEnv = {
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_EMPLOYER_URL: process.env.NEXT_PUBLIC_EMPLOYER_URL,
  NEXT_PUBLIC_PROVIDER_URL: process.env.NEXT_PUBLIC_PROVIDER_URL,
  NEXT_PUBLIC_APPRENTICE_URL: process.env.NEXT_PUBLIC_APPRENTICE_URL,
  NEXT_PUBLIC_FLOW_URL: process.env.NEXT_PUBLIC_FLOW_URL,
  NEXT_PUBLIC_MAIN_URL: process.env.NEXT_PUBLIC_MAIN_URL,
};

export const clientEnv: ClientEnv = parseClientEnv(clientRuntimeEnv);
