import { z } from "zod";

const schema = z
  .object({
    NEXT_PUBLIC_PORTAL: z.enum(["employer", "provider", "apprentice", "flow"]),
    NEXT_PUBLIC_APP_URL: z.string().url().optional(),
    NEXT_PUBLIC_EMPLOYER_URL: z.string().url(),
    NEXT_PUBLIC_PROVIDER_URL: z.string().url(),
    NEXT_PUBLIC_APPRENTICE_URL: z.string().url(),
    NEXT_PUBLIC_FLOW_URL: z.string().url(),
    NEXT_PUBLIC_MAIN_URL: z.string().url(),
  })
  .strict();

function parse(env) {
  const result = schema.safeParse(env);
  if (!result.success) {
    const fields = [
      ...new Set(
        result.error.issues.map((i) => i.path.join(".")).filter(Boolean),
      ),
    ];
    throw new Error(
      [
        "❌ Invalid client environment variables:",
        ...fields.map((f) => `  • ${f}`),
        "",
        "NEXT_PUBLIC_* values are inlined at build time, not runtime.",
        "In Docker, declare ARG and ENV and pass via --build-arg.",
      ].join("\n"),
    );
  }
  return result.data;
}

export const clientEnv = parse({
  NEXT_PUBLIC_PORTAL: process.env.NEXT_PUBLIC_PORTAL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_EMPLOYER_URL: process.env.NEXT_PUBLIC_EMPLOYER_URL,
  NEXT_PUBLIC_PROVIDER_URL: process.env.NEXT_PUBLIC_PROVIDER_URL,
  NEXT_PUBLIC_APPRENTICE_URL: process.env.NEXT_PUBLIC_APPRENTICE_URL,
  NEXT_PUBLIC_FLOW_URL: process.env.NEXT_PUBLIC_FLOW_URL,
  NEXT_PUBLIC_MAIN_URL: process.env.NEXT_PUBLIC_MAIN_URL,
});
