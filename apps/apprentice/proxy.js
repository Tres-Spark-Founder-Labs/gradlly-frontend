import { NextResponse } from "next/server";

const REFRESH_TOKEN_COOKIE = "gradlly_rt";
// Apprentice portal has no signup or verify-email routes
const AUTH_PATHS = ["/login", "/forgot-password", "/reset-password"];
const HOME_PATH = "/";
const LOGIN_PATH = "/login";

const isAuthPath = (pathname) =>
  AUTH_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

const redirectTo = (request, pathname) => {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  return NextResponse.redirect(url);
};

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = Boolean(
    request.cookies.get(REFRESH_TOKEN_COOKIE)?.value,
  );

  if (isAuthPath(pathname)) {
    return isAuthenticated
      ? redirectTo(request, HOME_PATH)
      : NextResponse.next();
  }

  return isAuthenticated
    ? NextResponse.next()
    : redirectTo(request, LOGIN_PATH);
}

export const config = {
  matcher: [
    "/((?!_next/|api/|.*\\.(?:ico|png|jpg|jpeg|svg|webp|css|js|woff2?|ttf|map)$).*)",
  ],
};
