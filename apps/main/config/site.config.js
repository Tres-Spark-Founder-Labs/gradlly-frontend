/**
 * Marketing site configuration.
 *
 * Replaces `portal.config.js`, which was a copy of the provider portal's and
 * described this app as "Main Portal" with a description about ILR
 * submissions and Ofsted readiness (see docs/marketing/SURVEY.md section 2c).
 */

/**
 * Indexing follows the deployment environment, not a hardcoded flag.
 *
 * Production is indexed. Preview deployments and local development are not,
 * because a preview URL ranking for the brand is worse than not ranking at
 * all. `VERCEL_ENV` is "production", "preview" or "development" and is set by
 * the platform, so this cannot be got wrong by forgetting to flip something.
 */
export const IS_PRODUCTION_DEPLOYMENT = process.env.VERCEL_ENV === "production";

/**
 * The canonical origin.
 *
 * Deliberately not hardcoded. The production domain is recorded in
 * `.env.example` with its source, because it appears in no other file in this
 * repository and a domain asserted in code is a domain nobody can verify.
 *
 * The fallback is localhost rather than a guess at production: a wrong
 * canonical pointing at a real host is worse than one pointing nowhere, since
 * it tells search engines the content belongs somewhere it does not.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3005"
).replace(/\/$/, "");

export const SITE = Object.freeze({
  brand: "Gradlly",
  /** content-v1.md positioning. */
  tagline: "From trained to trusted.",
  supportingLine: "Skills you can prove. Workers you can trust.",
  /**
   * The meta description, taken from content-v1.md's positioning summary
   * rather than written fresh. Trimmed to fit a search result without being
   * cut mid-clause.
   */
  description:
    "Gradlly builds two products for the UK workforce. Continuo gives every worker verified skills and checks, kept verified at every job. Gradlly AMS runs apprenticeships, with a verified Passport for every apprentice.",
  locale: "en_GB",
  lang: "en-GB",
  themeColor: "#13233a",
});

/**
 * Where "Sign in" goes.
 *
 * Four portals, four destinations, every one read from the environment. A
 * portal whose variable is unset is not rendered at all rather than rendered
 * as a link to nowhere, which is how the previous site's nine dead `href="#"`
 * links came to exist.
 *
 * The names already existed in the Turbo build allowlist, so these are not new
 * variables (turbo.json).
 */
export const PORTAL_SIGN_IN = [
  { name: "Employer", url: process.env.NEXT_PUBLIC_EMPLOYER_URL },
  { name: "Provider", url: process.env.NEXT_PUBLIC_PROVIDER_URL },
  { name: "Apprentice", url: process.env.NEXT_PUBLIC_APPRENTICE_URL },
  { name: "Flow", url: process.env.NEXT_PUBLIC_FLOW_URL },
]
  .filter((portal) => Boolean(portal.url))
  .map((portal) => ({
    ...portal,
    // Every portal signs in at the same route. `(auth)` is a route group and
    // contributes nothing to the path.
    url: `${portal.url.replace(/\/$/, "")}/login`,
  }));
