import fs from "node:fs";
import path from "node:path";

import { expect, test as setup } from "@playwright/test";

import { USERS, login } from "./helpers/seeded-users";

const AUTH_DIR = path.join(process.cwd(), "e2e", ".auth");
const APPRENTICE = "http://localhost:3001";
const PROVIDER = "http://localhost:3004";

/**
 * Sign in once per role and save the session for the specs to reuse.
 *
 * ── WHY, RATHER THAN LOGGING IN PER TEST ────────────────────────────────────
 *
 * The first version of this suite logged in inside `beforeEach`. Seven tests
 * meant seven logins in a few seconds and the API's throttler returned **429**
 * — correctly. The rate limit is real protection on a credential endpoint and
 * the tests were abusing it, so the tests changed rather than the limit.
 *
 * A saved storage state also keeps the login round trip covered exactly once,
 * which is the right number: it is a real user journey, not something every
 * unrelated assertion should repeat.
 */
setup(
  "authenticate as apprentice (Tyler) and warm the routes",
  async ({ page, context }) => {
    fs.mkdirSync(AUTH_DIR, { recursive: true });
    await context.clearCookies();
    await login(page, USERS.tyler, APPRENTICE);

    // Prove the session actually works before saving it — otherwise every spec
    // inherits a broken state and fails for a reason none of them name.
    await expect(page).not.toHaveURL(/\/login/);

    /**
     * Warm the routes **inside this session, before saving it**.
     *
     * `next dev` compiles each route on first request (~5s here), which blew the
     * assertion timeouts and made working screens look broken. The obvious fix —
     * a separate warmup step reusing the saved state — was worse: browsing
     * rotates the refresh token server-side, so the file written before the
     * warmup held a token the server had already replaced. Every spec then
     * inherited a dead session and rendered "Session unavailable".
     *
     * Warming first and saving afterwards means the file holds the tokens that
     * are actually current.
     */
    for (const route of ["/", "/journey", "/otj-logs", "/portfolio"]) {
      await page
        .goto(`${APPRENTICE}${route}`, {
          waitUntil: "networkidle",
          timeout: 120_000,
        })
        .catch(() => {
          // Warmup failure is not a test failure; the specs assert the behaviour.
        });
    }

    await context.storageState({ path: path.join(AUTH_DIR, "tyler.json") });
  },
);

setup("authenticate as apprentice (Caitlin)", async ({ page, context }) => {
  fs.mkdirSync(AUTH_DIR, { recursive: true });
  await context.clearCookies();
  await login(page, USERS.caitlin, APPRENTICE);

  await expect(page).not.toHaveURL(/\/login/);
  await context.storageState({ path: path.join(AUTH_DIR, "caitlin.json") });
});

setup("authenticate as provider staff (Marcus)", async ({ page, context }) => {
  fs.mkdirSync(AUTH_DIR, { recursive: true });
  await context.clearCookies();
  await login(page, USERS.provider, PROVIDER);

  await expect(page).not.toHaveURL(/\/login/);
  await context.storageState({ path: path.join(AUTH_DIR, "provider.json") });
});
