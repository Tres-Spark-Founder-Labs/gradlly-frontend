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
   * Portal 3's routes now carry the names PRD §5.2 gives them. Every old path
   * redirects, so nothing that worked before 404s — bookmarks, emailed links
   * and any internal link missed in the sweep all keep working.
   *
   * Permanent (308) throughout: these are corrections, not experiments.
   *
   *   §5.2.1 OTJ Tracker               /progress    -> /otj-logs
   *   §5.2.2 Journey Milestones        /assessments -> /journey
   *                                    /courses     -> /journey
   *   §5.2.3 KSB Portfolio             /curriculum  -> /portfolio
   *   §5.2.4 Communications & Documents /reports    -> /documents
   *                                    /analytics   -> /
   *
   * The `/courses` and `/reports` children are listed explicitly rather than
   * wildcarded. `/courses/live`, `/courses/archived` and `/courses/drafts`
   * were an invented status split over one component, and
   * `/reports/completion` and `/reports/engagement` were one component behind
   * two names — so each lands on the single surviving screen rather than on a
   * sub-path that no longer exists.
   */
  async redirects() {
    return [
      { source: "/curriculum", destination: "/portfolio", permanent: true },
      { source: "/progress", destination: "/otj-logs", permanent: true },
      { source: "/assessments", destination: "/journey", permanent: true },
      { source: "/courses", destination: "/journey", permanent: true },
      { source: "/courses/live", destination: "/journey", permanent: true },
      { source: "/courses/archived", destination: "/journey", permanent: true },
      { source: "/courses/drafts", destination: "/journey", permanent: true },
      { source: "/reports", destination: "/documents", permanent: true },
      {
        source: "/reports/completion",
        destination: "/documents",
        permanent: true,
      },
      {
        source: "/reports/engagement",
        destination: "/documents",
        permanent: true,
      },
      { source: "/analytics", destination: "/", permanent: true },
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
