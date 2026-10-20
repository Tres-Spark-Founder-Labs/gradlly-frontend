/**
 * content-v1.md §1, with Gradlly AMS pointing at its own page.
 *
 * Four anchors on the single page, and one real route: /gradlly-ams is the
 * original approved design and is kept as a page rather than folded into the
 * scroll.
 */
export const NAV = Object.freeze([
  { href: "/#continuo", label: "Continuo" },
  { href: "/gradlly-ams", label: "Gradlly AMS", external: true },
  { href: "/#passport", label: "Apprenticeship Passport" },
  { href: "/#how-it-works", label: "How it works" },
]);

/** Section anchors, for the in-page navigation and the footer. */
export const SECTIONS = Object.freeze([
  { href: "/#continuo", label: "Continuo" },
  { href: "/#passport", label: "Apprenticeship Passport" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#who-its-for", label: "Who it's for" },
  { href: "/#book-a-demo", label: "Book a demo" },
]);
