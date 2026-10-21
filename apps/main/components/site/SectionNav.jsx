"use client";

import { useEffect, useState } from "react";

/**
 * Local navigation: where you are inside this page.
 *
 * The global navigation says which product area you are in. This says which
 * part of it you are reading, which is a different question and needs a
 * different control. With ten sections on one page, a reader who arrives at the
 * compliance section from a search result has no way to know what is above or
 * below it without one.
 *
 * It is a sticky rail at desktop and a horizontal scroller under the header at
 * mobile, so the hierarchy survives the breakpoint rather than disappearing at
 * it.
 *
 * No numbers on the rows any more. The numbered-reference system this nav used
 * to agree with — 01, 02, 03 on every section heading — retired with the rest
 * of the first restyle; an active-row border and weight carry the same "where
 * you are" information a figure used to.
 *
 * The active section comes from an IntersectionObserver with a rootMargin that
 * puts the detection line a third of the way down the viewport, rather than
 * from scroll position arithmetic: the observer fires once per crossing
 * instead of on every frame.
 */
export function SectionNav({ sections }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const targets = sections
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // The band is the top third of the viewport: a section counts as current
      // once its heading has reached reading position, not when its first pixel
      // appears.
      { rootMargin: "-12% 0px -66% 0px", threshold: 0 },
    );

    for (const target of targets) observer.observe(target);
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav aria-label="Sections of this page" className="lg:sticky lg:top-28">
      <p className="hidden text-caption text-ink-muted lg:block">
        On this page
      </p>

      {/* Mobile: a scroller. The same list, the same order, laid along the one
          axis a narrow screen has to spare. */}
      <ul className="flex list-none gap-6 overflow-x-auto overscroll-x-contain px-6 pb-1 md:px-10 lg:mt-4 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0">
        {sections.map(({ id, label }) => {
          const current = active === id;
          return (
            <li key={id} className="shrink-0 lg:w-full lg:shrink">
              <a
                href={`#${id}`}
                aria-current={current ? "true" : undefined}
                className={`block whitespace-nowrap py-1.5 text-caption transition-colors duration-200 ease-out hover:text-ink lg:whitespace-normal lg:border-l lg:py-2 lg:pl-4 ${
                  current
                    ? "font-medium text-ink lg:border-ink"
                    : "text-ink-muted lg:border-hairline"
                }`}
              >
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/**
 * Breadcrumbs.
 *
 * Only where a reader can genuinely be somewhere other than the top, which on
 * this site is the Gradlly AMS route. A breadcrumb trail on a single-page site
 * would be a control that always reads "Home", which teaches a reader to ignore
 * breadcrumbs everywhere else.
 */
export function Breadcrumbs({ trail }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex list-none flex-wrap items-center gap-2 text-caption text-ink-muted">
        {trail.map(({ href, label }, index) => {
          const last = index === trail.length - 1;
          return (
            <li key={label} className="flex items-center gap-2">
              {index > 0 ? (
                <span aria-hidden className="opacity-50">
                  /
                </span>
              ) : null}
              {last ? (
                <span aria-current="page" className="text-ink">
                  {label}
                </span>
              ) : (
                <a
                  href={href}
                  className="underline decoration-ink/25 decoration-1 underline-offset-[4px] transition-colors duration-200 ease-out hover:text-ink hover:decoration-ink"
                >
                  {label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
