import { describe, expect, it } from "vitest";

import { AUTH_COOKIES, COOKIE_PORTAL_SCOPE } from "./index";

/**
 * Cookie names must not collide across portals.
 *
 * Browsers scope cookies by host and ignore the port, so on localhost the four
 * portals are one origin as far as the cookie jar is concerned. While every
 * portal wrote `gradlly_at` and `gradlly_rt`, signing into one signed you out
 * of the rest (OQ-16), and the Playwright suite had to run a single worker to
 * avoid the tests doing it to each other.
 *
 * The regression these tests guard is a quiet one: reverting to a bare name
 * breaks nothing that any single-portal test would notice. Everything still
 * logs in, every assertion still passes, and the damage only shows when a
 * second portal is open — which is precisely the case a serial suite never
 * exercised.
 */
describe("session cookie names are scoped to the portal", () => {
  it("takes its scope from NEXT_PUBLIC_PORTAL", () => {
    // vitest.config.js sets this to "employer" for this app.
    expect(COOKIE_PORTAL_SCOPE).toBe("employer");
  });

  it("suffixes both session cookies with the portal", () => {
    expect(AUTH_COOKIES.ACCESS).toBe("gradlly_at_employer");
    expect(AUTH_COOKIES.REFRESH).toBe("gradlly_rt_employer");
  });

  it("never uses the shared names that caused OQ-16", () => {
    // Asserted by value rather than by pattern: a name that merely *starts*
    // with the old prefix is not the problem, an exact collision is.
    expect(Object.values(AUTH_COOKIES)).not.toContain("gradlly_at");
    expect(Object.values(AUTH_COOKIES)).not.toContain("gradlly_rt");
  });

  it("gives the access and refresh cookies distinct names", () => {
    // A copy-paste slip here would make the refresh token overwrite the access
    // token, which fails as an expired session rather than as a bug.
    expect(AUTH_COOKIES.ACCESS).not.toBe(AUTH_COOKIES.REFRESH);
  });

  it("would produce a different name for every other portal", () => {
    // The property that actually matters is cross-portal, and a test inside one
    // app can only see its own build. This asserts the shape instead: the name
    // is the portal, so four portals give four names.
    const others = ["provider", "apprentice", "flow"];
    for (const portal of others) {
      expect(AUTH_COOKIES.ACCESS).not.toBe(`gradlly_at_${portal}`);
      expect(AUTH_COOKIES.REFRESH).not.toBe(`gradlly_rt_${portal}`);
    }
  });
});
