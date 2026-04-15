// apps/main/proxy.ts

import { createProxy } from "@gradlly/config/next/proxy";

export const proxy = createProxy({
  portalId: "main",
  extraPublicRoutes: ["/", "/docs"],
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon|icons|images|fonts|robots\\.txt|sitemap\\.xml|manifest\\.json).*)",
  ],
};
