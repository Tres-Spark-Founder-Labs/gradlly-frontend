export const AUTH_API_PATHS = Object.freeze({
  SIGNUP: "/api/v1/auth/signup",
  LOGIN: "/api/v1/auth/login",
  REFRESH: "/api/v1/auth/refresh",
  LOGOUT: "/api/v1/auth/logout",
  ME: "/api/v1/auth/me",
  VERIFY_EMAIL: "/api/v1/auth/verify-email",
  RESEND_VERIFICATION: "/api/v1/auth/resend-verification",
  FORGOT_PASSWORD: "/api/v1/auth/forgot-password",
  RESET_PASSWORD: "/api/v1/auth/reset-password",
  ACCEPT_INVITATION: "/api/v1/invitations/accept",
  MFA_ENROLL: "/api/v1/auth/mfa/enroll",
  MFA_CONFIRM: "/api/v1/auth/mfa/confirm",
  MFA_DISABLE: "/api/v1/auth/mfa/disable",
  MFA_VERIFY: "/api/v1/auth/mfa/verify",
});

/**
 * The portal this build serves, used to scope every cookie the app owns.
 *
 * ── WHY COOKIE NAMES CARRY THE PORTAL ───────────────────────────────────────
 *
 * Browsers scope cookies by host and ignore the port. On localhost all four
 * portals are `localhost`, so one set of names means one cookie jar: signing
 * into the provider portal overwrites the employer session, and the employer
 * tab is silently signed out. That is OQ-16, and it is why the Playwright suite
 * had to run a single worker with parallelism disabled.
 *
 * The suffix comes from `NEXT_PUBLIC_PORTAL`, which Next inlines at build time
 * so the same expression resolves in the browser, on the server and in the
 * proxy's edge runtime. The fallback is this app's own portal rather than a
 * generic default: an unset variable then degrades to a name that is still
 * unique to this portal, instead of putting every portal back in one jar —
 * which is the failure this whole change exists to remove.
 */
export const COOKIE_PORTAL_SCOPE = process.env.NEXT_PUBLIC_PORTAL || "employer";

export const AUTH_COOKIES = Object.freeze({
  ACCESS: `gradlly_at_${COOKIE_PORTAL_SCOPE}`,
  REFRESH: `gradlly_rt_${COOKIE_PORTAL_SCOPE}`,
});

export const AUTH_REDIRECTS = Object.freeze({
  DASHBOARD_HOME_PAGE: "/",
  VERIFY_EMAIL_PAGE: "/verify-email",
  LOGIN_PAGE: "/login",
});

/**
 * Validates a post-login redirect target. Only same-origin absolute paths are
 * allowed (must start with a single "/"), preventing open-redirect attacks.
 */
export function safeRedirectPath(
  path,
  fallback = AUTH_REDIRECTS.DASHBOARD_HOME_PAGE,
) {
  if (typeof path !== "string") return fallback;
  if (!path.startsWith("/") || path.startsWith("//")) return fallback;
  return path;
}
