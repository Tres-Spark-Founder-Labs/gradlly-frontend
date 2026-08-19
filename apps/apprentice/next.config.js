// ============================================================
// FILE: apps/provider/next.config.mjs
// (mirror in apps/employer, apps/apprentice, apps/flow)
// ============================================================

const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // Allow each portal's dev hostname to talk to its own dev server.
  // Keep the explicit entries for tooling that doesn't honour the wildcard.
  allowedDevOrigins: [
    "*.gradlly.local",
    "employer.gradlly.local",
    "provider.gradlly.local",
    "apprentice.gradlly.local",
    "flow.gradlly.local",
    "main.gradlly.local",
  ],

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.gradlly.com" },
      // S3 uploads buckets (avatars, organisation logos).
      { protocol: "https", hostname: "*.s3.*.amazonaws.com" },
      { protocol: "https", hostname: "*.amazonaws.com" },
    ],
  },

  /**
   * `/curriculum` rendered the evidence library under an authoring-tool name.
   * It is now `/portfolio` — the PRD §5.2.3 term — and the old path redirects
   * so bookmarks and any link still pointing at it keep working.
   *
   * Permanent (308): the rename is a correction, not an experiment.
   */
  async redirects() {
    return [
      {
        source: "/curriculum",
        destination: "/portfolio",
        permanent: true,
      },
    ];
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

export default nextConfig;
