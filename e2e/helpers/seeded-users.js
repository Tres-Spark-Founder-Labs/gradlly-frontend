/**
 * Accounts created by `graddly-api/scripts/seed-test-data.ts`.
 *
 * If a spec fails on login, the database has not been seeded — that is a
 * precondition failure, not an application bug, and `assertSeeded` below makes
 * the difference visible rather than leaving a confusing timeout.
 */
export const USERS = {
  /** Mid-journey, behind pace: red band, projection overshoots the end date. */
  tyler: {
    email: "tyler.bowen@meridian-eng.co.uk",
    password: "TylerTest2026!",
    name: "Tyler Bowen",
  },
  /** 511/525 hours, near gateway, EPA date set — exercises the countdown. */
  caitlin: {
    email: "c.forsythe@meridian-eng.co.uk",
    password: "CaitlinTest2026!",
    name: "Caitlin Forsythe",
  },
  /** Pace risk, and carries an overdue review (client decision Q2). */
  joel: {
    email: "j.nkemdirim@meridian-eng.co.uk",
    password: "JoelTest2026!",
    name: "Joel Nkemdirim",
  },
  /** Provider staff at Aldgate Skills Academy. */
  provider: {
    email: "m.leigh@aldgateskills.ac.uk",
    password: "AldgateTest2026!",
    name: "Marcus Leigh",
  },
  /** Employer contact at Meridian Engineering. */
  employer: {
    email: "r.thornton@meridian-eng.co.uk",
    password: "MeridianTest2026!",
    name: "Rachel Thornton",
  },
};

/**
 * Log in through the real form. Deliberately not an API call with a cookie
 * injected — the login round trip is part of what these tests exist to cover,
 * and a stale-cookie class of bug is invisible to a test that sets its own.
 */
export async function login(page, user, baseURL) {
  await page.goto(`${baseURL}/login`);

  // Targeted by form control name rather than label text: the password field
  // sits next to a "Show password" toggle whose aria-label also contains the
  // word, so `getByLabel(/password/i)` matches two elements and fails strict
  // mode. The name attribute is what the form actually submits.
  await page.locator('input[name="email"]').fill(user.email);
  await page.locator('input[name="password"]').fill(user.password);
  await page.getByRole("button", { name: /sign in|log in/i }).click();
  await page.waitForURL((url) => !url.pathname.startsWith("/login"), {
    timeout: 30_000,
  });
}

/**
 * Cheap precondition check. Deliberately does **not** log in: the login
 * endpoint is throttled, and a per-test login is what tripped it into 429
 * before. Signing in happens once, in `auth.setup.js`.
 */
export async function assertSeeded(page) {
  const res = await page.request.get("http://localhost:3000/api/v1/health");
  if (!res.ok()) {
    throw new Error(
      `Preconditions not met: the API on :3000 is not answering (HTTP ${res.status()}). ` +
        `Start it with: cd graddly-api && npm run start`,
    );
  }
}

/** Clears cookies so a portal starts from a clean session (see OQ-16). */
export async function signOutCompletely(context) {
  await context.clearCookies();
}
