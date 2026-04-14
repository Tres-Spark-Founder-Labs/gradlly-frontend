import { z } from "zod";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const clientSchema = z
  .object({
    NEXT_PUBLIC_EMPLOYER_URL: z.string().url(),
    NEXT_PUBLIC_PROVIDER_URL: z.string().url(),
    NEXT_PUBLIC_APPRENTICE_URL: z.string().url(),
    NEXT_PUBLIC_FLOW_URL: z.string().url(),
    NEXT_PUBLIC_MAIN_URL: z.string().url(),
  })
  .strict();

export type ClientEnv = z.infer<typeof clientSchema>;

// ---------------------------------------------------------------------------
// Parser
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

    // In Docker / CI — surface a clear message pointing to the real cause
    throw new Error(
      [
        "❌ Invalid client environment variables:",
        ...fields.map((f) => `  • ${f}`),
        "",
        "In Docker: ensure ARG and ENV are declared in your Dockerfile",
        "and passed via --build-arg at build time.",
        "NEXT_PUBLIC_* variables are inlined at build time, not runtime.",
      ].join("\n"),
    );
  }

  return result.data;
}

export const clientEnv: ClientEnv = parseClientEnv({
  NEXT_PUBLIC_EMPLOYER_URL: process.env["NEXT_PUBLIC_EMPLOYER_URL"],
  NEXT_PUBLIC_PROVIDER_URL: process.env["NEXT_PUBLIC_PROVIDER_URL"],
  NEXT_PUBLIC_APPRENTICE_URL: process.env["NEXT_PUBLIC_APPRENTICE_URL"],
  NEXT_PUBLIC_FLOW_URL: process.env["NEXT_PUBLIC_FLOW_URL"],
  NEXT_PUBLIC_MAIN_URL: process.env["NEXT_PUBLIC_MAIN_URL"],
});
