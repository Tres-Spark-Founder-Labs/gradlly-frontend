import { NextResponse } from "next/server";

import { AUTH_COOKIES } from "@/features/auth/constants";

// Public auth pages. Authenticated users are bounced away from these.
// NOTE: /accept-invitation is intentionally NOT here — accepting an invitation
// requires an authenticated session, so it is treated as a protected route.
const AUTH_PATHS = [
  "/login",
  "/signup",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
];

// Pre-account Levy funnel: reachable with OR without a session, and NOT bounced
// to the dashboard when signed in (an SME may re-check eligibility any time).
const PUBLIC_PATHS = ["/eligibility", "/register"];

const HOME_PATH = "/";
const LOGIN_PATH = "/login";

const matchesAny = (pathname, paths) =>
  paths.some((path) => pathname === path || pathname.startsWith(`${path}/`));

export function proxy(request) {
  const { pathname, search } = request.nextUrl;
  const isAuthenticated = Boolean(
    request.cookies.get(AUTH_COOKIES.REFRESH)?.value,
  );

  // ── Public funnel pages (always allowed) ────────────────────────────────────
  if (matchesAny(pathname, PUBLIC_PATHS)) return NextResponse.next();

  // ── Public auth pages ──────────────────────────────────────────────────────
  if (matchesAny(pathname, AUTH_PATHS)) {
    if (!isAuthenticated) return NextResponse.next();
    // Already signed in: send to the dashboard (drop any stale query string).
    const url = request.nextUrl.clone();
    url.pathname = HOME_PATH;
    url.search = "";
    return NextResponse.redirect(url);
  }

  // ── Protected routes ───────────────────────────────────────────────────────
  if (isAuthenticated) return NextResponse.next();

  // Not signed in: redirect to login, preserving the original destination
  // (e.g. /accept-invitation?token=… so the user returns here after signing in).
  const url = request.nextUrl.clone();
  url.pathname = LOGIN_PATH;
  url.search = `?redirect=${encodeURIComponent(`${pathname}${search}`)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/((?!_next/|api/|.*\\.(?:ico|png|jpg|jpeg|svg|webp|css|js|woff2?|ttf|map)$).*)",
  ],
};
