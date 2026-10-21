import { Button } from "./ui";

/**
 * Top navigation — the reference's own nav items (Product, Enterprise,
 * Pricing, News, Company, Careers) are a SaaS company's generic site map, not
 * Gradlly's. Swapped for the real page's own four sections plus the AMS
 * route, which is what this nav actually needs to point at, in the same slot
 * the reference draws.
 */
const LINKS = [
  { href: "#continuo", label: "Continuo" },
  { href: "#the-record", label: "The record" },
  { href: "#portals", label: "Portals" },
  { href: "#book-a-demo", label: "Demo" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 bg-obsidian-canvas/90 backdrop-blur-sm">
      <div className="mx-auto flex h-8 max-w-[1200px] items-center justify-between gap-6 px-3 md:px-5">
        <a
          href="#main-content"
          className="font-mono text-caption uppercase tracking-wide text-bone"
        >
          Factory
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex list-none items-center gap-6">
            {LINKS.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className="mech text-body-sm uppercase text-bone hover:text-pale-stone"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#sign-in"
            className="mech hidden text-body-sm text-bone hover:text-pale-stone sm:inline"
          >
            Sign in
          </a>
          <Button href="#book-a-demo" variant="light">
            Book a demo
          </Button>
        </div>
      </div>
    </header>
  );
}
