// config/env/server.ts
import { z } from "zod";

// ---------------------------------------------------------------------------
// Browser guard
// ---------------------------------------------------------------------------
if (typeof window !== "undefined") {
  throw new Error(
    [
      "❌ config/env/server.ts was imported in a browser context.",
      "Server-only env variables must never be accessed on the client.",
      "Find the client component that is importing this file and fix it.",
    ].join("\n"),
  );
}

// ---------------------------------------------------------------------------
// Schema — server-only variables
// ---------------------------------------------------------------------------

const serverSchema = z
  .object({
    JWT_ACCESS_TOKEN_NAME: z.string().min(1),
    JWT_REFRESH_TOKEN_NAME: z.string().min(1),
    COOKIE_DOMAIN: z.string().min(1),
    SENDGRID_API_KEY: z.string().min(1),
    AWS_REGION: z.string().min(1),
    AWS_S3_BUCKET: z.string().min(1),
    ESFA_API_BASE_URL: z.string().url(),
    SENTRY_DSN: z.string().min(1),
  })
  .strict();

type ServerOnlyEnv = z.infer<typeof serverSchema>;
export type ServerEnv = ServerOnlyEnv;

// ---------------------------------------------------------------------------
// Destructure from process.env
// ---------------------------------------------------------------------------

const {
  JWT_ACCESS_TOKEN_NAME,
  JWT_REFRESH_TOKEN_NAME,
  COOKIE_DOMAIN,
  SENDGRID_API_KEY,
  AWS_REGION,
  AWS_S3_BUCKET,
  ESFA_API_BASE_URL,
  SENTRY_DSN,
} = process.env;

// ---------------------------------------------------------------------------
// Parser
// ---------------------------------------------------------------------------

function parseServerEnv(env: unknown): ServerOnlyEnv {
  const result = serverSchema.safeParse(env);

  if (!result.success) {
    const fields = [
      ...new Set(
        result.error.issues
          .map((issue) => issue.path.join("."))
          .filter(Boolean),
      ),
    ];

    throw new Error(
      [
        "❌ Invalid server environment variables:",
        ...fields.map((f) => `  • ${f}`),
        "",
        "Ensure these are set in your .env.local or CI secrets.",
      ].join("\n"),
    );
  }

  return result.data;
}

// ---------------------------------------------------------------------------
// Validated export
// ---------------------------------------------------------------------------

export const serverEnv: ServerEnv = {
  ...parseServerEnv({
    JWT_ACCESS_TOKEN_NAME,
    JWT_REFRESH_TOKEN_NAME,
    COOKIE_DOMAIN,
    SENDGRID_API_KEY,
    AWS_REGION,
    AWS_S3_BUCKET,
    ESFA_API_BASE_URL,
    SENTRY_DSN,
  }),
};
