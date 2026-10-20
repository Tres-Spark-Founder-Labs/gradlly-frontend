import { SECTIONS } from "@/config/nav";
import { LEGAL_PAGES, PORTAL_SIGN_IN, SITE } from "@/config/site.config";

import { Wordmark } from "./Wordmark";

/**
 * Abyss, the deepest surface, bookending the page against the paper above it.
 *
 * It carries the whole page set with its reference numbers, because a reader at
 * the bottom of page four needs to see where to go next and how much of the
 * argument is left.
 */
export function Footer() {
  return (
    <footer className="on-dark bg-abyss px-5 py-16 text-paper md:px-8 md:py-20 lg:px-12">
      <div className="mx-auto max-w-[1320px]">
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 border-b border-paper/15 pb-10">
          <Wordmark />
          <p className="text-body-sm text-paper/55">{SITE.tagline}</p>
        </div>

        <div className="grid gap-10 pt-10 md:grid-cols-[1.5fr_1fr_1fr] md:gap-14">
          <nav aria-label="Sections">
            <h2 className="font-mono text-ref text-paper/40">On this page</h2>
            <ul className="mt-4 grid list-none gap-x-10 sm:grid-cols-2">
              {[
                ...SECTIONS,
                { href: "/gradlly-ams", label: "Gradlly AMS" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="block py-2 text-body-sm text-paper/75 transition-colors duration-[140ms] ease-out hover:text-paper"
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
              <h2 className="font-mono text-ref text-paper/40">Sign in</h2>
              <ul className="mt-4 list-none">
                {PORTAL_SIGN_IN.map(({ name, url }) => (
                  <li key={name}>
                    <a
                      href={url}
                      className="block py-2 text-body-sm text-paper/75 transition-colors duration-[140ms] ease-out hover:text-paper"
                    >
                      {name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div>
            <h2 className="font-mono text-ref text-paper/40">Legal</h2>
            <ul className="mt-4 list-none">
              {LEGAL_PAGES.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="block py-2 text-body-sm text-paper/75 transition-colors duration-[140ms] ease-out hover:text-paper"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-12 border-t border-paper/15 pt-6 text-caption text-paper/45">
          © 2026 Gradlly.{" "}
          <span title="Placeholder. Recorded in docs/marketing/LAUNCH-CHECKLIST.md.">
            [REGISTERED COMPANY DETAILS]
          </span>
        </p>
      </div>
    </footer>
  );
}
