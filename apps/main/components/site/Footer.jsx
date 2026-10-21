import { SECTIONS } from "@/config/nav";
import { LEGAL_PAGES, PORTAL_SIGN_IN, SITE } from "@/config/site.config";

import { Wordmark } from "./Wordmark";

/**
 * The footer.
 *
 * ── WHY THIS IS LIGHT NOW ────────────────────────────────────────────────────
 *
 * It used to be the deepest surface on the page, a solid olive band bookending
 * the paper above it, on the same reasoning that justified the hero panel.
 * That reasoning retired along with the panel: this rebuild's reference has no
 * dark surface anywhere, and a footer left solid olive would have been the one
 * holdout, not a deliberate anchor. So it is sand now, the same tone the page
 * already alternates sections through, with ink text and hairline dividers —
 * the last section rather than a different kind of surface.
 */
export function Footer() {
  return (
    <footer className="border-t border-hairline bg-sand px-5 py-16 md:px-8 md:py-20 lg:px-12">
      <div className="mx-auto max-w-[1320px]">
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 border-b border-hairline-dark pb-10">
          <Wordmark />
          <p className="text-body-sm text-ink-muted">{SITE.tagline}</p>
        </div>

        <div className="grid gap-10 pt-10 md:grid-cols-[1.5fr_1fr_1fr] md:gap-14">
          <nav aria-label="Sections">
            <h2 className="text-caption text-ink-muted">On this page</h2>
            <ul className="mt-4 grid list-none gap-x-10 sm:grid-cols-2">
              {[
                ...SECTIONS,
                { href: "/gradlly-ams", label: "Gradlly AMS" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="block py-2 text-body-sm text-ink-soft transition-colors duration-[140ms] ease-out hover:text-ink"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/*
            Every portal whose origin is set in the environment, and no others.
            A portal with an unset variable is left out rather than rendered as
            a link to nowhere, which is how the previous site came to have nine
            dead href="#" links.
          */}
          {PORTAL_SIGN_IN.length > 0 ? (
            <div id="sign-in" className="scroll-mt-24">
              <h2 className="text-caption text-ink-muted">Sign in</h2>
              <ul className="mt-4 list-none">
                {PORTAL_SIGN_IN.map(({ name, url }) => (
                  <li key={name}>
                    <a
                      href={url}
                      className="block py-2 text-body-sm text-ink-soft transition-colors duration-[140ms] ease-out hover:text-ink"
                    >
                      {name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div>
            <h2 className="text-caption text-ink-muted">Legal</h2>
            <ul className="mt-4 list-none">
              {LEGAL_PAGES.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="block py-2 text-body-sm text-ink-soft transition-colors duration-[140ms] ease-out hover:text-ink"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-12 border-t border-hairline-dark pt-6 text-caption text-ink-muted">
          © 2026 Gradlly.
          {SITE.registeredDetails ? ` ${SITE.registeredDetails}` : ""}
        </p>
      </div>
    </footer>
  );
}
