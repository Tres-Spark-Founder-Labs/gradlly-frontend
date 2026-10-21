/**
 * Swiss grid primitives.
 *
 * Twelve columns, a 24px gutter, flush-left ragged-right type, and a rule above
 * a block rather than a box around it. The grid is the design: a reader should
 * be able to see the columns without being shown them.
 *
 * `span` is a Tailwind class string rather than a number, because the spans
 * differ per breakpoint and expressing that as props would mean reinventing
 * half of Tailwind's responsive syntax.
 */
export function Grid({ children, className = "" }) {
  return <div className={`grid-12 ${className}`}>{children}</div>;
}

export function Col({
  span = "col-span-4 lg:col-span-12",
  children,
  className = "",
}) {
  return <div className={`${span} ${className}`}>{children}</div>;
}

/**
 * A reference label: a figure number and a short name, on a rule.
 *
 * This is the modernist device that replaces an eyebrow. It is information
 * rather than decoration: with the page this long, a reader scanning for the
 * compliance section needs the page to be indexed, and the number is what makes
 * the cross-references in the text ("see 04") resolvable.
 */
export function Ref({ number, children, tone = "ink" }) {
  const ink = {
    ink: "text-ink-muted",
    olive: "text-olive",
    terracotta: "text-terracotta-ink",
    linen: "text-linen/60",
  }[tone];

  return (
    <p className={`flex items-baseline gap-3 text-caption ${ink}`}>
      <span className="tabular-nums">{number}</span>
      <span aria-hidden className="h-px w-5 bg-current opacity-40" />
      <span>{children}</span>
    </p>
  );
}

/**
 * Progressive disclosure.
 *
 * The essential line is always visible; the detail opens when it is asked for.
 * A native `details` element, so it works without JavaScript, is keyboard
 * operable for free, and is found by in-page search even while closed, which a
 * scripted accordion is not.
 */
export function Disclose({ summary, children, defaultOpen = false }) {
  return (
    <details className="group rule-top-hair pb-6" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 [&::-webkit-details-marker]:hidden">
        <span className="display text-subhead text-ink">{summary}</span>
        <span
          aria-hidden
          className="mt-1 shrink-0 text-caption text-ink-muted transition-transform duration-200 ease-out group-open:rotate-45"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" focusable="false">
            <path
              d="M7 1v12M1 7h12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </summary>
      <div className="measure mt-4 text-body-sm text-ink-soft">{children}</div>
    </details>
  );
}
