// ============================================================
// Active-organisation cookie
// ============================================================
//
// The API client is a plain module and cannot read React Query state, yet every
// authenticated request must carry the caller's active organisation as the
// `X-Organisation-Id` header — analogous to how `X-Portal-Type` is always sent.
//
// We persist the active org id in a first-party JS cookie. This makes it:
//   • the single source of truth read on every request (no React dependency),
//   • durable across hard reloads and new tabs of the same portal,
//   • available to the client before `useMe` resolves on a cold load.
//
// `useAuthUser` keeps the cookie in sync with the `me` query, and the org
// switcher writes it directly before refetching `me`. An explicit per-call
// header still overrides it (see invitations).

import { COOKIE_PORTAL_SCOPE } from "@/features/auth/constants";

// Scoped to the portal for the same reason the session cookies are: an
// unscoped name is shared across all four portals on localhost, so switching
// organisation in one portal silently changes which organisation another
// portal's requests are made against. See COOKIE_PORTAL_SCOPE.
const ACTIVE_ORG_COOKIE = `gradlly_active_org_${COOKIE_PORTAL_SCOPE}`;
// Persist for a year; the value is non-sensitive (an org id the user belongs to)
// and the backend still authorises every request against the session.
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

function isBrowser() {
  return typeof document !== "undefined";
}

export function getActiveOrgId() {
  if (!isBrowser()) return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${ACTIVE_ORG_COOKIE}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

export function setActiveOrgId(orgId) {
  if (!isBrowser()) return;

  // Clearing the cookie (logout / no org) — expire it immediately.
  if (!orgId) {
    document.cookie = `${ACTIVE_ORG_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
    return;
  }

  // No-op when unchanged so we don't rewrite the cookie on every render.
  if (getActiveOrgId() === orgId) return;

  document.cookie =
    `${ACTIVE_ORG_COOKIE}=${encodeURIComponent(orgId)}; ` +
    `path=/; max-age=${ONE_YEAR_SECONDS}; SameSite=Lax`;
}
