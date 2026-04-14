// packages/utils/src/proxy/index.ts
import { NextResponse, type NextRequest } from "next/server";

// ─── Types ─────────────────────────────────────────────────────────────────

export type PortalId = "main" | "employer" | "provider" | "apprentice" | "flow";

export interface ProxyOptions {
  portalId: PortalId;
  extraPublicRoutes?: readonly string[];
  allowedRoles?: readonly string[];
}

// ─── Route tables ──────────────────────────────────────────────────────────

/**
 * Routes that never require a session.
 * Pattern rules:
 *   - Exact strings  → matched with Set.has()
 *   - Strings ending in '/' → matched with startsWith()
 */
const SHARED_PUBLIC_ROUTES = new Set([
  "/login",
  "/register",
  "/forgot-password",
  "/auth/error",
  "/api/health",
]);

const SHARED_PUBLIC_PREFIXES = [
  "/reset-password/", // /reset-password/[token]
  "/auth/",
  "/invite/", // magic-link invite acceptance
] as const;

/**
 * Prefixes that should be completely ignored by proxy.
 * Next.js static file serving handles these — no auth, no headers.
 * Kept lean: matcher config (bottom of file) is the primary filter.
 */
const STATIC_PREFIXES = [
  "/_next/",
  "/favicon",
  "/icons/",
  "/images/",
  "/fonts/",
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.json",
] as const;

// ─── Cookie names ──────────────────────────────────────────────────────────

const SESSION_COOKIE = "gradlly_session";
const SESSION_COOKIE_SEC = "__Secure-gradlly_session"; // prod: Secure prefix

// ─── JWT edge decode ───────────────────────────────────────────────────────
// Lightweight decode only — no signature verification.
// Signature is verified by NestJS on every API call.
// This layer only checks: exists, not expired, correct portal, correct role.

interface SessionPayload {
  readonly sub: string;
  readonly role: string;
  readonly orgId: string;
  readonly portalId: PortalId;
  readonly exp: number;
  readonly iat: number;
}

function decodeJwtPayload(token: string): SessionPayload | null {
  try {
    const segment = token.split(".")[1];
    if (!segment) return null;

    // base64url → base64 → JSON
    const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    const decoded = atob(padded);
    const parsed = JSON.parse(decoded) as unknown;

    // Runtime shape guard — never trust JWT claims blindly
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      typeof (parsed as Record<string, unknown>)["sub"] !== "string" ||
      typeof (parsed as Record<string, unknown>)["role"] !== "string" ||
      typeof (parsed as Record<string, unknown>)["orgId"] !== "string" ||
      typeof (parsed as Record<string, unknown>)["portalId"] !== "string" ||
      typeof (parsed as Record<string, unknown>)["exp"] !== "number"
    ) {
      return null;
    }

    return parsed as SessionPayload;
  } catch {
    return null;
  }
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function getSessionToken(req: NextRequest): string | undefined {
  return (
    req.cookies.get(SESSION_COOKIE_SEC)?.value ?? // prod takes priority
    req.cookies.get(SESSION_COOKIE)?.value
  );
}

function isStaticAsset(pathname: string): boolean {
  return STATIC_PREFIXES.some((p) => pathname.startsWith(p));
}

function isPublicRoute(
  pathname: string,
  extraRoutes: readonly string[],
): boolean {
  if (SHARED_PUBLIC_ROUTES.has(pathname)) return true;
  if (SHARED_PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) return true;
  if (extraRoutes.some((r) => pathname === r || pathname.startsWith(r)))
    return true;
  return false;
}

function isTokenExpired(payload: SessionPayload): boolean {
  // 30s clock-skew buffer
  return Math.floor(Date.now() / 1000) > payload.exp - 30;
}

function redirectToLogin(req: NextRequest): NextResponse {
  const loginUrl = new URL("/login", req.nextUrl.origin);
  loginUrl.searchParams.set(
    "callbackUrl",
    req.nextUrl.pathname + req.nextUrl.search,
  );

  const res = NextResponse.redirect(loginUrl);

  // Clear both cookie variants so the browser doesn't loop
  res.cookies.delete(SESSION_COOKIE);
  res.cookies.delete(SESSION_COOKIE_SEC);

  return res;
}

// ─── Security headers ──────────────────────────────────────────────────────
// Applied to every authenticated (and public-page) response.
// HSTS is intentionally omitted — set at CDN/load-balancer level for preload.
// CSP nonce-based approach is a v2 item — marked inline below.

function applySecurityHeaders(
  res: NextResponse,
  portalId: PortalId,
): NextResponse {
  const isProd = process.env.NODE_ENV === "production";

  // Build CSP — kept in an array for readability and easy per-portal extension
  const csp = [
    "default-src 'self'",
    // TODO v2: replace 'unsafe-inline'/'unsafe-eval' with nonce-based approach
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    // GOV.UK account assets are needed for One Login avatar/badge
    "img-src 'self' data: blob: https://*.gradlly.com https://*.account.gov.uk",
    // NestJS API and GOV.UK One Login token endpoint
    "connect-src 'self' https://api.gradlly.com https://*.gradlly.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    // form-action must include One Login — it POSTs back the OIDC code here
    "form-action 'self' https://oidc.account.gov.uk",
    isProd ? "upgrade-insecure-requests" : "",
  ]
    .filter(Boolean)
    .join("; ");

  res.headers.set("Content-Security-Policy", csp);
  res.headers.set("X-Portal-Id", portalId); // used by NestJS guards + logging
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  return res;
}

// ─── In-process rate limiter ───────────────────────────────────────────────
// Protects /login and /auth/* from brute-force at proxy layer.
// Node.js runtime — this map is per-process, per-instance.
// Production: swap for Upstash Redis / Vercel KV for distributed limiting.

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const RL_MAP = new Map<string, RateLimitEntry>();
const RL_WINDOW = 60_000; // 1 minute
const RL_MAX = 20; // requests per window per IP

function isRateLimited(ip: string, pathname: string): boolean {
  // Only gate auth surfaces
  if (pathname !== "/login" && !pathname.startsWith("/auth/")) return false;

  const now = Date.now();
  const entry = RL_MAP.get(ip);

  if (!entry || now > entry.resetAt) {
    RL_MAP.set(ip, { count: 1, resetAt: now + RL_WINDOW });
    return false;
  }

  entry.count += 1;
  return entry.count > RL_MAX;
}

// ─── Factory ───────────────────────────────────────────────────────────────

/**
 * createProxy
 *
 * Called once per portal at the top of that portal's proxy.ts.
 * Returns the proxy function Next.js 16 expects as a named export.
 *
 * portalId is still necessary here — it is injected into:
 *   - X-Portal-Id response header  (read by NestJS to scope RBAC)
 *   - Security headers CSP build   (per-portal connect-src extension point)
 *   - Session portal validation    (blocks cross-portal token reuse)
 *   - Structured logs              (distinguishes portals in Datadog/Sentry)
 *
 * Even though each app is a separate Next.js process on its own domain,
 * portalId as an explicit constant makes the intent readable and keeps
 * NestJS from having to infer identity from the Host header alone.
 */
export function createProxy(options: ProxyOptions) {
  const { portalId, extraPublicRoutes = [], allowedRoles = [] } = options;

  return async function proxy(req: NextRequest): Promise<NextResponse> {
    const { pathname } = req.nextUrl;

    // ── 0. Static assets — hard skip, zero overhead ──────────────────────
    if (isStaticAsset(pathname)) return NextResponse.next();

    // ── 1. Rate limiting on auth surfaces ────────────────────────────────
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";

    if (isRateLimited(ip, pathname)) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: { "Retry-After": "60" },
      });
    }

    // ── 2. Public routes — security headers only, no session check ───────
    if (isPublicRoute(pathname, extraPublicRoutes)) {
      return applySecurityHeaders(NextResponse.next(), portalId);
    }

    // ── 3. Session extraction ─────────────────────────────────────────────
    const token = getSessionToken(req);

    if (!token) {
      return redirectToLogin(req);
    }

    // ── 4. JWT decode + validation ────────────────────────────────────────
    const payload = decodeJwtPayload(token);

    if (!payload) {
      // Malformed token — wipe and redirect
      return redirectToLogin(req);
    }

    if (isTokenExpired(payload)) {
      // Expired — redirect to login; refresh token flow is NestJS-side
      return redirectToLogin(req);
    }

    if (payload.portalId !== portalId) {
      // Token issued for a different portal — hard block, no redirect
      // (e.g. employer token used on provider portal)
      return new NextResponse("Forbidden", { status: 403 });
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(payload.role)) {
      // Role not permitted on this portal
      return new NextResponse("Forbidden", { status: 403 });
    }

    // ── 5. Forward user identity to RSC + Route Handlers ─────────────────
    // These headers are set server-side and cannot be spoofed by the client.
    // NestJS also validates them independently via its own JWT guard.
    const forwardedHeaders = new Headers(req.headers);
    forwardedHeaders.set("x-user-id", payload.sub);
    forwardedHeaders.set("x-user-role", payload.role);
    forwardedHeaders.set("x-org-id", payload.orgId);
    forwardedHeaders.set("x-portal-id", portalId);

    const res = NextResponse.next({
      request: { headers: forwardedHeaders },
    });

    return applySecurityHeaders(res, portalId);
  };
}
