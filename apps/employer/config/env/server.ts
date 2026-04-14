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
    API_BASE_URL: z.string().url(),
  })
  .strict();

export type ServerEnv = z.infer<typeof serverSchema>;

// ---------------------------------------------------------------------------
// Parser
// ---------------------------------------------------------------------------

function parseServerEnv(env: unknown): ServerEnv {
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

export const serverEnv: ServerEnv = parseServerEnv({
  API_BASE_URL: process.env["API_BASE_URL"],
});
