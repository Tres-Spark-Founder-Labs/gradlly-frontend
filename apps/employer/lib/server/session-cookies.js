// ============================================================
// FILE: apps/provider/lib/server/session-cookies.js
// ============================================================

import "server-only";

import { cookies } from "next/headers";

import { serverEnv } from "@/config/env/server";
import { AUTH_COOKIES } from "@/features/auth/constants";

/**
 * Server-side session cookie operations.
 *
 *   • read{Access,Refresh}Token  — safe in any server context.
 *   • writeSessionCookies        — only from Route Handlers / Server Actions.
 *   • clearSessionCookies        — only from Route Handlers / Server Actions.
 *
 * The BACKEND owns real token expiry via the JWT `exp` claim. The
 * cookie `maxAge` here is just a generous upper bound so dead values
 * don't linger forever.
 */

const ACCESS_COOKIE_MAX_AGE = 60 * 60; // 1 hour
const REFRESH_COOKIE_MAX_AGE = 60 * 60 * 24 * 14; // 14 days

function cookieBase() {
  const isProd = serverEnv.NODE_ENV === "production";
  return {
    secure: isProd,
    sameSite: "lax",
    path: "/",
  };
}

// Both tokens are httpOnly — the BFF proxy reads them server-side and the
// browser never has direct access to the raw token values.
function accessOptions() {
  return { ...cookieBase(), httpOnly: true };
}

function refreshOptions() {
  return { ...cookieBase(), httpOnly: true };
}

export async function readAccessToken() {
  const store = await cookies();
  return store.get(AUTH_COOKIES.ACCESS)?.value ?? null;
}

export async function readRefreshToken() {
  const store = await cookies();
  return store.get(AUTH_COOKIES.REFRESH)?.value ?? null;
}

export async function writeSessionCookies({ accessToken, refreshToken }) {
  const store = await cookies();

  if (accessToken) {
    store.set({
      ...accessOptions(),
      name: AUTH_COOKIES.ACCESS,
      value: accessToken,
      maxAge: ACCESS_COOKIE_MAX_AGE,
    });
  }
  if (refreshToken) {
    store.set({
      ...refreshOptions(),
      name: AUTH_COOKIES.REFRESH,
      value: refreshToken,
      maxAge: REFRESH_COOKIE_MAX_AGE,
    });
  }
}

export async function clearSessionCookies() {
  const store = await cookies();
  store.set({
    ...accessOptions(),
    name: AUTH_COOKIES.ACCESS,
    value: "",
    maxAge: 0,
  });
  store.set({
    ...refreshOptions(),
    name: AUTH_COOKIES.REFRESH,
    value: "",
    maxAge: 0,
  });
}
