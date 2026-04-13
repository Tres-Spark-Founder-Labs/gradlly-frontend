import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { loadEnvConfig } from "@next/env";

import type { NextConfig } from "next";

// ─── Constants live here — next.config runs before transpilation,
//     so it cannot import from workspace packages at all. ──────────
const WORKSPACE_PACKAGES = [
  "@gradlly/ui",
  "@gradlly/utils",
  "@gradlly/hooks",
] as const;

const DEV_ORIGINS = [
  "*.gradlly.local",
  "employer.gradlly.local",
  "provider.gradlly.local",
  "apprentice.gradlly.local",
  "flow.gradlly.local",
  "main.gradlly.local",
] as const;

const IMAGE_HOSTS = ["**.gradlly.com", "**.account.gov.uk"] as const;

// ─────────────────────────────────────────────────────────────────

const isProd = process.env.NODE_ENV === "production";

export function createNextConfig(
  appDir: string,
  overrides: Partial<NextConfig> = {},
): NextConfig {
  const workspaceRoot = join(dirname(fileURLToPath(appDir)), "../..");
  loadEnvConfig(workspaceRoot);

  const base: NextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    compress: true,

    allowedDevOrigins: [...DEV_ORIGINS],

    transpilePackages: [...WORKSPACE_PACKAGES],

    images: {
      remotePatterns: IMAGE_HOSTS.map((hostname) => ({
        protocol: "https" as const,
        hostname,
      })),
    },

    async headers() {
      return [
        {
          source: "/(.*)",
          headers: [
            { key: "X-Frame-Options", value: "DENY" },
            { key: "X-Content-Type-Options", value: "nosniff" },
            {
              key: "Referrer-Policy",
              value: "strict-origin-when-cross-origin",
            },
            {
              key: "Permissions-Policy",
              value: "camera=(), microphone=(), geolocation=()",
            },
            { key: "X-DNS-Prefetch-Control", value: "on" },
            ...(isProd
              ? [
                  {
                    key: "Strict-Transport-Security",
                    value: "max-age=63072000; includeSubDomains; preload",
                  },
                ]
              : []),
          ],
        },
      ];
    },
  };

  return {
    ...base,
    ...overrides,
    transpilePackages: [
      ...(base.transpilePackages ?? []),
      ...(overrides.transpilePackages ?? []),
    ],
    images: {
      ...base.images,
      ...overrides.images,
      remotePatterns: [
        ...(base.images?.remotePatterns ?? []),
        ...(overrides.images?.remotePatterns ?? []),
      ],
    },
  };
}
