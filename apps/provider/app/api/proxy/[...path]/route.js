import { NextResponse } from "next/server";

import { AUTH_API_PATHS } from "@/features/auth/constants";
import { $apiServer, ApiServerError } from "@/lib/api/server";
import {
  readAccessToken,
  readRefreshToken,
  writeSessionCookies,
  clearSessionCookies,
} from "@/lib/server/session-cookies";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MUTATING = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const NULL_BODY_STATUSES = new Set([204, 205, 304]);

// ─── Exports ──────────────────────────────────────────────────────────────────

export async function GET(req, ctx) {
  return dispatch(req, ctx, "GET");
}
export async function POST(req, ctx) {
  return dispatch(req, ctx, "POST");
}
export async function PUT(req, ctx) {
  return dispatch(req, ctx, "PUT");
}
export async function PATCH(req, ctx) {
  return dispatch(req, ctx, "PATCH");
}
export async function DELETE(req, ctx) {
  return dispatch(req, ctx, "DELETE");
}

// ─── Dispatcher ───────────────────────────────────────────────────────────────

async function dispatch(req, ctx, method) {
  if (MUTATING.has(method) && req.headers?.get?.("x-gradlly-csrf") !== "1") {
    return fail({ message: "Forbidden" }, 403);
  }

  const path = (await ctx?.params)?.path ?? [];
  const upstreamPath = "/" + path?.join?.("/") + new URL(req?.url).search;
  const body = await readBody(req, method);

  if (upstreamPath?.startsWith?.(AUTH_API_PATHS?.LOGIN))
    return openSession(upstreamPath, method, body);
  if (upstreamPath?.startsWith?.(AUTH_API_PATHS?.VERIFY_EMAIL))
    return openSession(upstreamPath, method, body);
  if (upstreamPath?.startsWith?.(AUTH_API_PATHS?.LOGOUT)) return closeSession();

  return proxyRequest(upstreamPath, method, body);
}

// ─── Session handlers ─────────────────────────────────────────────────────────

async function openSession(path, method, body) {
  try {
    const result = await $apiServer(path, { method, body });
    const tokens = result?.data?.data ?? result?.data;
    await writeSessionCookies({
      accessToken: tokens?.accessToken,
      refreshToken: tokens?.refreshToken,
    });
    return success();
  } catch (e) {
    return rejectWith(e);
  }
}

async function closeSession() {
  const refreshToken = await readRefreshToken();
  try {
    if (refreshToken) {
      await $apiServer(AUTH_API_PATHS?.LOGOUT, {
        method: "POST",
        body: { refreshToken },
      });
    }
  } catch {
    // Best-effort — cookies are always cleared
  }
  await clearSessionCookies();
  return success();
}

// ─── Authenticated proxy ──────────────────────────────────────────────────────

async function proxyRequest(path, method, body) {
  const accessToken = await readAccessToken();

  try {
    const result = await $apiServer(path, { method, body, accessToken });
    return resolveWith(result);
  } catch (e) {
    if (!(e instanceof ApiServerError) || e?.status !== 401)
      return rejectWith(e);

    const freshToken = await rotateTokens();
    if (!freshToken) {
      await clearSessionCookies();
      return rejectWith(e);
    }

    try {
      const retried = await $apiServer(path, {
        method,
        body,
        accessToken: freshToken,
      });
      return resolveWith(retried);
    } catch (retryErr) {
      return rejectWith(retryErr);
    }
  }
}

let rotating = null;

async function rotateTokens() {
  rotating ??= doRotate().finally(() => {
    rotating = null;
  });
  return rotating;
}

async function doRotate() {
  const refreshToken = await readRefreshToken();
  if (!refreshToken) return null;

  try {
    const result = await $apiServer(AUTH_API_PATHS?.REFRESH, {
      method: "POST",
      body: { refreshToken },
    });
    const tokens = result?.data?.data ?? result?.data;
    if (!tokens?.accessToken) return null;

    await writeSessionCookies({
      accessToken: tokens?.accessToken,
      refreshToken: tokens?.refreshToken ?? refreshToken,
    });
    return tokens?.accessToken;
  } catch {
    return null;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function readBody(req, method) {
  if (method === "GET" || method === "HEAD") return undefined;
  if (!(req?.headers?.get?.("content-type") ?? "").includes("application/json"))
    return undefined;
  try {
    return await req?.json?.();
  } catch {
    return undefined;
  }
}

function resolveWith(result) {
  const status = result?.status ?? 200;

  if (NULL_BODY_STATUSES.has(status)) {
    return new NextResponse(null, { status });
  }

  return NextResponse.json(result?.data ?? {}, { status });
}

function rejectWith(e) {
  if (e instanceof ApiServerError) {
    return NextResponse.json(e?.data ?? { message: e?.message }, {
      status: e?.status,
    });
  }
  return NextResponse.json({ message: "Proxy error" }, { status: 502 });
}

function success() {
  return NextResponse.json({ ok: true });
}

function fail(payload, status) {
  return NextResponse.json(payload, { status });
}
