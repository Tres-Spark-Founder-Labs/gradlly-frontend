import { z } from "zod";

/**
 * Client-safe environment.
 *
 * Only `NEXT_PUBLIC_*` variables — these are inlined into the browser
 * bundle at build time. Never put secrets here.
 */

const schema = z
  .object({
    NEXT_PUBLIC_PORTAL: z.enum(["employer", "provider", "apprentice", "flow"]),
    NEXT_PUBLIC_EMPLOYER_URL: z.string().url(),
    NEXT_PUBLIC_PROVIDER_URL: z.string().url(),
    NEXT_PUBLIC_APPRENTICE_URL: z.string().url(),
    NEXT_PUBLIC_FLOW_URL: z.string().url(),
    NEXT_PUBLIC_MAIN_URL: z.string().url(),
  })
  .strict();

/**
 * CI sets SKIP_ENV_VALIDATION so it can build without production secrets.
 * The flag had been set in both workflows and read nowhere, so the build step
 * could never compile any app whose pages reach this module — a flag that
 * silently does nothing is worse than no flag.
 *
 * Only ever bypasses validation where it is explicitly set. Real builds
 * (Vercel, Docker) do not set it and still fail loudly on a missing value.
 */
const SKIP_VALIDATION =
  process.env.SKIP_ENV_VALIDATION === "true" ||
  process.env.SKIP_ENV_VALIDATION === "1";

function parse(env) {
  const result = schema.safeParse(env);
  if (!result.success) {
    if (SKIP_VALIDATION) return env;
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
  NEXT_PUBLIC_EMPLOYER_URL: process.env.NEXT_PUBLIC_EMPLOYER_URL,
  NEXT_PUBLIC_PROVIDER_URL: process.env.NEXT_PUBLIC_PROVIDER_URL,
  NEXT_PUBLIC_APPRENTICE_URL: process.env.NEXT_PUBLIC_APPRENTICE_URL,
  NEXT_PUBLIC_FLOW_URL: process.env.NEXT_PUBLIC_FLOW_URL,
  NEXT_PUBLIC_MAIN_URL: process.env.NEXT_PUBLIC_MAIN_URL,
});
