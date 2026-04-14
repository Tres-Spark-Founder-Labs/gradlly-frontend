// apps/flow/proxy.ts

import { createProxy } from "@gradlly/config/next/proxy";

export const proxy = createProxy({
  portalId: "flow",
  allowedRoles: [
    // 'flow_sme_owner',
    // 'flow_levy_donor',
  ],
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon|icons|images|fonts|robots\\.txt|sitemap\\.xml|manifest\\.json).*)",
  ],
};
