// apps/provider/proxy.ts

import { createProxy } from "@gradlly/config/next/proxy";

export const proxy = createProxy({
  portalId: "provider",
  extraPublicRoutes: ["/", "/docs"],
  allowedRoles: [
    "/",
    "provider_programme_manager",
    // 'provider_tutor',
    // 'provider_compliance',
    // 'provider_quality',
  ],
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon|icons|images|fonts|robots\\.txt|sitemap\\.xml|manifest\\.json).*)",
  ],
};
