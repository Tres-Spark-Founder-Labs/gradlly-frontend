import { SECTIONS } from "@/config/nav";
import { LEGAL_PAGES, PORTAL_SIGN_IN } from "@/config/site.config";

/**
 * Footer — obsidian canvas, 96px of vertical padding (`py-12` against this
 * theme's 8px spacing unit), Geist Mono uppercase column headings, no
 * dividers between columns. The same real sitemap the main Footer.jsx reads
 * from config/nav and config/site.config, so the two footers never drift
 * into listing different pages.
 */
export function Footer() {
  return (
    <footer className="border-t border-carbon-lift py-12">
      <div className="mx-auto max-w-[1200px] px-3 md:px-5">
        <p className="font-mono text-caption uppercase tracking-wide text-bone">
          Factory
        </p>
        <p className="mt-2 text-body-sm text-warm-granite">
          A comparison build. From trained to trusted.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 md:gap-9">
          <nav aria-label="Sections">
            <h2 className="font-mono text-caption uppercase tracking-tight text-bone">
              On this page
            </h2>
            <ul className="mt-4 list-none">
              {[
                ...SECTIONS,
                { href: "/gradlly-ams", label: "Gradlly AMS" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href.startsWith("/#") ? `#${href.slice(2)}` : href}
                    className="mech block py-1.5 text-body-sm text-warm-granite hover:text-bone"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {PORTAL_SIGN_IN.length > 0 ? (
            <div>
              <h2 className="font-mono text-caption uppercase tracking-tight text-bone">
                Sign in
              </h2>
              <ul className="mt-4 list-none">
                {PORTAL_SIGN_IN.map(({ name, url }) => (
                  <li key={name}>
                    <a
                      href={url}
                      className="mech block py-1.5 text-body-sm text-warm-granite hover:text-bone"
                    >
                      {name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div>
            <h2 className="font-mono text-caption uppercase tracking-tight text-bone">
              Legal
            </h2>
            <ul className="mt-4 list-none">
              {LEGAL_PAGES.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="mech block py-1.5 text-body-sm text-warm-granite hover:text-bone"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-10 border-t border-carbon-lift pt-6 text-caption text-warm-granite">
          © 2026 Gradlly. Factory is a style comparison, not a published page —{" "}
          <code className="font-mono">noindex</code>.
        </p>
      </div>
    </footer>
  );
}
