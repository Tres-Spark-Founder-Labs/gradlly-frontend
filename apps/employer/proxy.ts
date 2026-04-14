// apps/employer/proxy.ts
// ─── Employer portal proxy ─────────────────────────────────────────────────
// Named export `proxy` is required by Next.js 16 (replaces `middleware`).

import { createProxy } from "@gradlly/config/next/proxy";

export const proxy = createProxy({
  portalId: "employer",
  allowedRoles: [
    // 'employer_admin',
    // 'employer_ld_manager',
    // 'employer_line_manager',
    // 'employer_finance',
  ],
});

export const config = {
  matcher: [
    /*
     * Match everything EXCEPT:
     * - _next/static  (static files)
     * - _next/image   (image optimisation)
     * - favicon.ico, icons/, images/, fonts/
     * - robots.txt, sitemap.xml, manifest.json
     */
    "/((?!_next/static|_next/image|favicon|icons|images|fonts|robots\\.txt|sitemap\\.xml|manifest\\.json).*)",
  ],
};
