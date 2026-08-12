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
  // Portals share a cookie jar by host on localhost, so parallel workers would
  // sign each other out. This is the same defect recorded as OQ-16 — the tests
  // run serially until it is addressed rather than pretending it isn't there.
  workers: 1,
  fullyParallel: false,
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
