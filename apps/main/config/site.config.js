/**
 * Marketing site configuration.
 *
 * Replaces `portal.config.js`, which was a copy of the provider portal's and
 * described this app as "Main Portal" with a description about ILR
 * submissions and Ofsted readiness (docs/marketing/SURVEY.md section 2c).
 */

/**
 * Indexing follows the deployment environment rather than a hardcoded flag.
 * Production is indexed; preview and local are not, because a preview URL
 * ranking for the brand is worse than not ranking at all. VERCEL_ENV is set by
 * the platform, so this cannot be got wrong by forgetting to flip something.
 */
export const IS_PRODUCTION_DEPLOYMENT = process.env.VERCEL_ENV === "production";

/**
 * The canonical origin. Deliberately not hardcoded: the production domain is
 * recorded in .env.example with its source, because it appears in no other file
 * in this repository.
 *
 * The fallback is localhost rather than a guess at production. A canonical
 * pointing at a real host that is wrong tells search engines the content
 * belongs somewhere it does not, which is worse than one pointing nowhere.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3005"
).replace(/\/$/, "");

export const SITE = Object.freeze({
  brand: "Gradlly",
  tagline: "From trained to trusted.",
  supportingLine: "Skills you can prove. Workers you can trust.",
  description:
    "Gradlly builds two products for the UK workforce. Continuo gives every worker verified skills and checks, kept verified at every job. Gradlly AMS runs apprenticeships, with a verified Passport for every apprentice.",
  locale: "en_GB",
  lang: "en-GB",
  themeColor: "#fafaf9",

  /**
   * The two values the client still has to supply, which are the first two
   * items of the "Before launch" list in docs/marketing/content-v1.md.
   *
   * They shipped as literal bracketed text — "[CONTACT EMAIL]" in the demo
   * section and "[REGISTERED COMPANY DETAILS]" in the footer — each carrying a
   * title attribute that pointed at a launch checklist which did not exist. A
   * visitor does not read a title attribute, and a page printing its own
   * placeholders in square brackets reads as broken rather than as unfinished.
   *
   * Null, so the lines that need them do not render at all. That is the rule
   * PORTAL_SIGN_IN already follows below, for the same reason it gives: the
   * previous site ended up with nine dead links by rendering the slot anyway.
   *
   * To go live, replace a null with the real value; the line appears on its
   * own and nothing else changes.
   */
  contactEmail: null,
  registeredDetails: null,
});

/**
 * The seven pages, numbered.
 *
 * The number is not decoration. There are seven of these and each one is a
 * part of one argument, so the page header says which part you are reading and
 * the navigation says how many there are. A reader who lands on page four from
 * a search result can see what they have not read.
 *
 * `mark` is the product that owns the page, and it is the only thing that
 * decides colour anywhere on it.
 */
export const PAGES = Object.freeze([
  {
    number: "01",
    href: "/",
    label: "Overview",
    navLabel: "Overview",
    title: "From trained to trusted.",
    lead: "Skills you can prove. Workers you can trust.",
    mark: "navy",
  },
  {
    number: "02",
    href: "/continuo",
    label: "Continuo",
    navLabel: "Continuo",
    title: "Verified skills for the workforce.",
    lead: "For employers and agencies in regulated work",
    mark: "teal",
  },
  {
    number: "03",
    href: "/gradlly-ams",
    label: "Gradlly AMS",
    navLabel: "Gradlly AMS",
    title: "The apprenticeship, with the evidence built in.",
    lead: "For training providers and employers",
    mark: "brass",
  },
  {
    number: "04",
    href: "/apprenticeship-passport",
    label: "Apprenticeship Passport",
    navLabel: "Passport",
    title: "What the apprentice keeps.",
    lead: "Included with Gradlly AMS",
    mark: "brass",
  },
  {
    number: "05",
    href: "/how-it-works",
    label: "How it works",
    navLabel: "How it works",
    title: "Two products, two flows.",
    lead: "Each works on its own.",
    mark: "navy",
  },
  {
    number: "06",
    href: "/who-its-for",
    label: "Who it's for",
    navLabel: "Who it's for",
    title: "Built for each side of the journey.",
    lead: "Four audiences, two products.",
    mark: "navy",
  },
  {
    number: "07",
    href: "/book-a-demo",
    label: "Book a demo",
    navLabel: "Book a demo",
    title: "See Gradlly with your own programme.",
    lead: "Whichever part of it matters to you.",
    mark: "navy",
  },
]);

export const LEGAL_PAGES = Object.freeze([
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/accessibility", label: "Accessibility" },
]);

export function pageByHref(href) {
  return PAGES.find((page) => page.href === href);
}

/**
 * Where "Sign in" goes.
 *
 * Four portals, four destinations, every one read from the environment. A
 * portal whose variable is unset is left out rather than rendered as a link to
 * nowhere, which is how the previous site came to have nine dead href="#"
 * links. The names already existed in the Turbo build allowlist.
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
