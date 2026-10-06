import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

import { expect, test as setup } from "@playwright/test";

import { USERS, login } from "./helpers/seeded-users";

const AUTH_DIR = path.join(process.cwd(), "e2e", ".auth");
const APPRENTICE = "http://localhost:3001";
const EMPLOYER = "http://localhost:3002";
const FLOW = "http://localhost:3003";
const PROVIDER = "http://localhost:3004";

function assertPinnedAuditEnvironment() {
  if (process.env.ACCESSIBILITY_AUDIT !== "1") return;

  if (process.env.MFA_REQUIRED_FOR_ADMINS !== "false") {
    throw new Error(
      "Audit precondition failed: set MFA_REQUIRED_FOR_ADMINS=false for the pinned API deployment and this Playwright process.",
    );
  }

  const expectedFrontend = process.env.AUDIT_FRONTEND_COMMIT;
  const expectedApi = process.env.AUDIT_API_COMMIT;
  if (!expectedFrontend || !expectedApi) {
    throw new Error(
      "Audit precondition failed: set AUDIT_FRONTEND_COMMIT and AUDIT_API_COMMIT so the report identifies an immutable stack.",
    );
  }

  const repositories = [
    {
      name: "frontend",
      path: process.cwd(),
      expectedCommit: expectedFrontend,
    },
    {
      name: "API",
      path: path.resolve(process.cwd(), "..", "graddly-api"),
      expectedCommit: expectedApi,
    },
  ];

  for (const repository of repositories) {
    const actualCommit = execFileSync("git", ["rev-parse", "HEAD"], {
      cwd: repository.path,
      encoding: "utf8",
    }).trim();
    if (actualCommit !== repository.expectedCommit) {
      throw new Error(
        `Audit precondition failed: ${repository.name} HEAD is ${actualCommit}, expected ${repository.expectedCommit}.`,
      );
    }

    const worktreeChanges = execFileSync("git", ["status", "--porcelain"], {
      cwd: repository.path,
      encoding: "utf8",
    }).trim();
    if (worktreeChanges) {
      throw new Error(
        `Audit precondition failed: ${repository.name} worktree is not clean, so commit ${actualCommit} does not identify the code under test.`,
      );
    }
  }
}

async function assertPortalReady(page, baseURL, portal) {
  const response = await page.request.get(`${baseURL}/login`, {
    failOnStatusCode: false,
    timeout: 15_000,
  });
  if (!response.ok()) {
    throw new Error(
      `Audit precondition failed: ${portal} portal at ${baseURL} returned HTTP ${response.status()}. ` +
        "Start the complete, pinned frontend stack before running Playwright; this config deliberately has no webServer.",
    );
  }
}

setup.beforeAll(() => {
  assertPinnedAuditEnvironment();
});

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
    await assertPortalReady(page, APPRENTICE, "apprentice");
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
  await assertPortalReady(page, APPRENTICE, "apprentice");
  await login(page, USERS.caitlin, APPRENTICE);

  await expect(page).not.toHaveURL(/\/login/);
  await context.storageState({ path: path.join(AUTH_DIR, "caitlin.json") });
});

setup("authenticate as provider staff (Marcus)", async ({ page, context }) => {
  fs.mkdirSync(AUTH_DIR, { recursive: true });
  await context.clearCookies();
  await assertPortalReady(page, PROVIDER, "provider");
  await login(page, USERS.provider, PROVIDER);

  await expect(page).not.toHaveURL(/\/login/);
  await context.storageState({ path: path.join(AUTH_DIR, "provider.json") });
});

setup("authenticate as employer owner (Rachel)", async ({ page, context }) => {
  fs.mkdirSync(AUTH_DIR, { recursive: true });
  await context.clearCookies();
  await assertPortalReady(page, EMPLOYER, "employer");
  await login(page, USERS.employer, EMPLOYER);

  await expect(page).not.toHaveURL(/\/login/);
  await context.storageState({ path: path.join(AUTH_DIR, "employer.json") });
});

setup("authenticate as Flow owner (Olivia)", async ({ page, context }) => {
  fs.mkdirSync(AUTH_DIR, { recursive: true });
  await context.clearCookies();
  await assertPortalReady(page, FLOW, "flow");
  await login(page, USERS.flow, FLOW);

  await expect(page).not.toHaveURL(/\/login/);
  await context.storageState({ path: path.join(AUTH_DIR, "flow.json") });
});
