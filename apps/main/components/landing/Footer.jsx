import { PORTAL_SIGN_IN, SITE } from "@/config/site.config";

import { Wordmark } from "./Wordmark";

/** content-v1.md §10. */
const LINKS = [
  { href: "#continuo", label: "Continuo" },
  { href: "/gradlly-ams", label: "Gradlly AMS" },
  { href: "#passport", label: "Apprenticeship Passport" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/accessibility", label: "Accessibility" },
];

/**
 * The one navy region on the page, which closes it where the spine ends.
 * Paper ink on navy is 14.31:1.
 *
 * `#sign-in` lands here, so the nav's Sign in link has a real destination that
 * lists all four portals rather than a dropdown that has to trap focus.
 */
export function Footer() {
  return (
    <footer className="on-navy bg-navy px-5 py-16 text-paper md:px-10 md:py-20 lg:px-16">
      <div className="mx-auto max-w-[1140px]">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-display text-subhead text-paper">
          <Wordmark />
          <span className="text-paper/70">{SITE.tagline}</span>
        </p>

        <nav aria-label="Footer" className="mt-10">
          <ul className="flex list-none flex-wrap gap-x-7 gap-y-3">
            {LINKS.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className="text-small text-paper/80 underline decoration-transparent decoration-2 underline-offset-4 transition-colors duration-[120ms] ease-out hover:text-paper hover:decoration-paper/60"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/*
          Every portal whose origin is set in the environment, and no others. A
          portal with an unset variable is left out rather than rendered as a
          link to nowhere, which is how the previous site came to have nine
          dead href="#" links.

          Middle dots here, and nowhere else on the page: these are four peers
          of one kind, which is the one case a separated list is right. Every
          other list on the page is ruled.
        */}
        {PORTAL_SIGN_IN.length > 0 ? (
          <div id="sign-in" className="mt-10 scroll-mt-28">
            <h2 className="text-small font-semibold text-paper">Sign in</h2>
            <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-2">
              {PORTAL_SIGN_IN.map(({ name, url }, index) => (
                <span key={name} className="flex items-center gap-2">
                  {index > 0 ? (
                    <span aria-hidden className="text-paper/40">
                      ·
                    </span>
                  ) : null}
                  <a
                    href={url}
                    className="text-small text-paper/80 underline decoration-paper/30 decoration-2 underline-offset-4 transition-colors duration-[120ms] ease-out hover:text-paper hover:decoration-paper"
                  >
                    {name}
                  </a>
                </span>
              ))}
            </p>
          </div>
        ) : null}

        <p className="mt-12 border-t border-paper/20 pt-6 text-meta text-paper/60">
          © 2026 Gradlly.{" "}
          <span title="Placeholder. Recorded in docs/marketing/LAUNCH-CHECKLIST.md.">
            [REGISTERED COMPANY DETAILS]
          </span>
        </p>
      </div>
    </footer>
  );
}
