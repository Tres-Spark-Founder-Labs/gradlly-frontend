import "server-only";
import { z } from "zod";

/**
 * Server-only environment.
 *
 * `server-only` makes this file throw at build time if a client module
 * imports it transitively. Anything secret or server-shaped lives here.
 */

const schema = z
  .object({
    API_BASE_URL: z.string().url(),
    AUTH_COOKIE_DOMAIN: z.string().optional(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
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
        "❌ Invalid server environment variables:",
        ...fields.map((f) => `  • ${f}`),
        "",
        "Ensure these are set in .env.local or CI secrets.",
      ].join("\n"),
    );
  }
  return result.data;
}

export const serverEnv = parse({
  API_BASE_URL: process.env.API_BASE_URL,
  AUTH_COOKIE_DOMAIN: process.env.AUTH_COOKIE_DOMAIN,
  NODE_ENV: process.env.NODE_ENV,
});
