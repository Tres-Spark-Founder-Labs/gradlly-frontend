import { SECTIONS } from "@/config/nav";
import { LEGAL_PAGES, PORTAL_SIGN_IN, SITE } from "@/config/site.config";

import { Wordmark } from "./Wordmark";

/**
 * The footer.
 *
 * ── WHY THIS IS DARK AGAIN ───────────────────────────────────────────────────
 *
 * It was made sand for the second rebuild, on the reasoning that the
 * rebuild's reference had no dark surface anywhere, so a solid-olive footer
 * would have been the one holdout. That's no longer true: the page now
 * carries two dark moments of its own (How it works, the book-a-demo CTA),
 * matching /gradlly-ams's own rhythm of light sections closing on a dark
 * footer. So this goes back to --color-ink, with linen text throughout —
 * the Wordmark's "Gradlly" inherits it, since the component sets no colour
 * of its own.
 */
export function Footer() {
  return (
    <footer className="border-t border-hairline-dark bg-ink px-5 py-16 text-linen md:px-8 md:py-20 lg:px-12">
      <div className="mx-auto max-w-[1320px]">
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 border-b border-linen/15 pb-10">
          <Wordmark />
          <p className="text-body-sm text-linen/60">{SITE.tagline}</p>
        </div>

        <div className="grid gap-10 pt-10 md:grid-cols-[1.5fr_1fr_1fr] md:gap-14">
          <nav aria-label="Sections">
            <h2 className="text-caption text-linen/60">On this page</h2>
            <ul className="mt-4 grid list-none gap-x-10 sm:grid-cols-2">
              {[
                ...SECTIONS,
                { href: "/gradlly-ams", label: "Gradlly AMS" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="block py-2 text-body-sm text-linen/80 transition-colors duration-[140ms] ease-out hover:text-linen"
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
              <h2 className="text-caption text-linen/60">Sign in</h2>
              <ul className="mt-4 list-none">
                {PORTAL_SIGN_IN.map(({ name, url }) => (
                  <li key={name}>
                    <a
                      href={url}
                      className="block py-2 text-body-sm text-linen/80 transition-colors duration-[140ms] ease-out hover:text-linen"
                    >
                      {name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div>
            <h2 className="text-caption text-linen/60">Legal</h2>
            <ul className="mt-4 list-none">
              {LEGAL_PAGES.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="block py-2 text-body-sm text-linen/80 transition-colors duration-[140ms] ease-out hover:text-linen"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-12 border-t border-linen/15 pt-6 text-caption text-linen/60">
          © 2026 Gradlly.
          {SITE.registeredDetails ? ` ${SITE.registeredDetails}` : ""}
        </p>
      </div>
    </footer>
  );
}
