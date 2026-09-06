import { defineConfig, devices } from "@playwright/test";

/**
 * Browser-level tests.
 *
 * ── WHY THIS EXISTS ─────────────────────────────────────────────────────────
 *
 * Every significant defect found on 12 August 2026 was found by launching the
 * application, not by the 1,143 API unit tests or the 287 component tests that
 * were all passing at the time:
 *
 *   • the worker process could not boot at all (dead on `main`)
 *   • a stale org cookie locked users out with no recoverable path
 *   • all four portals shared one cookie jar on localhost
 *   • the local database was empty, so nothing had ever been exercised
 *
 * None of those are visible without a running browser against a running stack.
 *
 * ── WHAT IT DOES NOT DO ─────────────────────────────────────────────────────
 *
 * It does **not** start the servers. The API, the worker, Postgres and Redis
 * all have to be up, and the database seeded (`scripts/seed-test-data.ts`).
 * `webServer` is deliberately not configured: a config that silently boots a
 * half-stack would produce failures that look like application bugs and are
 * not. The specs assert their preconditions instead and say plainly what is
 * missing.
 */
const APPS = {
  apprentice: "http://localhost:3001",
  employer: "http://localhost:3002",
  flow: "http://localhost:3003",
  provider: "http://localhost:3004",
  main: "http://localhost:3005",
};

export default defineConfig({
  testDir: "./e2e",
  // Runs parallel. It previously could not: every portal wrote `gradlly_at` and
  // `gradlly_rt`, and because browsers scope cookies by host and ignore the
  // port, all four localhost portals shared one jar — so a second worker
  // signing in would sign the first one out mid-test. Cookie names now carry
  // the portal (`gradlly_at_employer` and so on, see COOKIE_PORTAL_SCOPE in
  // each app's features/auth/constants), which closes OQ-16 and removes the
  // reason for `workers: 1` and `fullyParallel: false`.
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  // Generous because these run against `next dev`, which compiles routes on
  // demand. The setup project warms the routes first, so this headroom covers
  // variance rather than a cold build.
  timeout: 120_000,
  expect: { timeout: 20_000 },
  use: {
    baseURL: APPS.apprentice,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off",
  },
  projects: [
    /**
     * Logs in once per role and saves the session. Everything else reuses it —
     * see the comment in `auth.setup.js` for why (the API throttles repeated
     * logins, correctly, and the first version of this suite tripped it).
     */
    { name: "setup", testMatch: /auth\.setup\.js/ },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["setup"],
    },
  ],
});

export { APPS };
