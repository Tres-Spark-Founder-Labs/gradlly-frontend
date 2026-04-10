// config/env/client.ts
import { z } from "zod";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const clientSchema = z
  .object({
    NEXT_PUBLIC_APP_ENV: z.enum(["development", "staging", "production"]),
    NEXT_PUBLIC_API_BASE_URL: z.string().url(),
    NEXT_PUBLIC_EMPLOYER_URL: z.string().url(),
    NEXT_PUBLIC_PROVIDER_URL: z.string().url(),
    NEXT_PUBLIC_APPRENTICE_URL: z.string().url(),
    NEXT_PUBLIC_FLOW_URL: z.string().url(),
    NEXT_PUBLIC_MAIN_URL: z.string().url(),
  })
  .strict();

export type ClientEnv = z.infer<typeof clientSchema>;

// ---------------------------------------------------------------------------
// Destructure from process.env
// ---------------------------------------------------------------------------

const {
  NEXT_PUBLIC_APP_ENV,
  NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_EMPLOYER_URL,
  NEXT_PUBLIC_PROVIDER_URL,
  NEXT_PUBLIC_APPRENTICE_URL,
  NEXT_PUBLIC_FLOW_URL,
  NEXT_PUBLIC_MAIN_URL,
} = process.env;

// ---------------------------------------------------------------------------
// Parser — accepts unknown, Zod validates the shape entirely
// ---------------------------------------------------------------------------

function parseClientEnv(env: unknown): ClientEnv {
  const result = clientSchema.safeParse(env);

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
        "❌ Invalid client environment variables:",
        ...fields.map((f) => `  • ${f}`),
        "",
        "Check your .env.local file.",
      ].join("\n"),
    );
  }

  return result.data;
}

// ---------------------------------------------------------------------------
// Plain object built from destructured locals — no index signature anywhere
// ---------------------------------------------------------------------------

export const clientEnv: ClientEnv = parseClientEnv({
  NEXT_PUBLIC_APP_ENV,
  NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_EMPLOYER_URL,
  NEXT_PUBLIC_PROVIDER_URL,
  NEXT_PUBLIC_APPRENTICE_URL,
  NEXT_PUBLIC_FLOW_URL,
  NEXT_PUBLIC_MAIN_URL,
});
