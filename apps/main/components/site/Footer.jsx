import { LEGAL_PAGES, PAGES, PORTAL_SIGN_IN, SITE } from "@/config/site.config";

import { Wordmark } from "./Wordmark";

/**
 * The footer carries the whole page set, numbered, because with seven pages a
 * reader at the bottom of one of them needs to see where to go next and how
 * much there is.
 *
 * Navy, matching the header, so the shell closes the way it opened. Paper ink
 * on navy is 14.31:1.
 */
export function Footer() {
  return (
    <footer className="on-dark bg-navy-deep px-5 py-16 text-white md:px-8 md:py-20 lg:px-12">
      <div className="mx-auto max-w-[1320px]">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <Wordmark />
          <p className="text-small text-white/60">{SITE.tagline}</p>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-[1.4fr_1fr] md:gap-16">
          <nav aria-label="All pages">
            <h2 className="text-ref text-white/40">Pages</h2>
            <ul className="mt-4 grid list-none gap-x-10 sm:grid-cols-2">
              {PAGES.map(({ number, href, label }) => (
                <li key={href} className="border-b border-rule-dark">
                  <a
                    href={href}
                    className="flex items-baseline gap-3 py-3 text-small text-white/75 transition-colors duration-[120ms] ease-out hover:text-white"
                  >
                    <span className="text-ref text-white/35">{number}</span>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            {/*
              Every portal whose origin is set in the environment, and no
              others. A portal with an unset variable is left out rather than
              rendered as a link to nowhere, which is how the previous site came
              to have nine dead href="#" links.
            */}
            {PORTAL_SIGN_IN.length > 0 ? (
              <div id="sign-in" className="scroll-mt-24">
                <h2 className="text-ref text-white/40">Sign in</h2>
                <ul className="mt-4 list-none">
                  {PORTAL_SIGN_IN.map(({ name, url }) => (
                    <li key={name} className="border-b border-rule-dark">
                      <a
                        href={url}
                        className="block py-3 text-small text-white/75 transition-colors duration-[120ms] ease-out hover:text-white"
                      >
                        {name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <h2 className="mt-10 text-ref text-white/40">Legal</h2>
            <ul className="mt-4 flex list-none flex-wrap gap-x-6 gap-y-2">
              {LEGAL_PAGES.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-small text-white/70 transition-colors duration-[120ms] ease-out hover:text-white"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-14 border-t border-rule-dark pt-6 text-ref text-white/50">
          © 2026 Gradlly.{" "}
          <span title="Placeholder. Recorded in docs/marketing/LAUNCH-CHECKLIST.md.">
            [REGISTERED COMPANY DETAILS]
          </span>
        </p>
      </div>
    </footer>
  );
}
