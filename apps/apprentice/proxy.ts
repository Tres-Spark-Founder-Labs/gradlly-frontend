// apps/apprentice/proxy.ts

import { createProxy } from "@gradlly/config/next/proxy";

export const proxy = createProxy({
  portalId: "apprentice",
  extraPublicRoutes: ["/", "/docs"],
  // // OTJ quick-log is accessible from a shared link sent via SMS
  // extraPublicRoutes: ['/quick-log/'],
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon|icons|images|fonts|robots\\.txt|sitemap\\.xml|manifest\\.json).*)",
  ],
};
