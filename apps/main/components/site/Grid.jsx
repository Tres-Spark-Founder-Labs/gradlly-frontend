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
 * A reference label: a figure number and, usually, a short name.
 *
 * This is the modernist device that replaces an eyebrow, and it is information
 * rather than decoration. The number is the one the section nav shows for this
 * section, so a reader who jumps to the compliance section from the rail, or
 * from a search result, can see they landed on 05 of 10 rather than inferring
 * it from how far down the scrollbar sits.
 *
 * (An earlier version of this comment claimed the numbers made cross-references
 * of the form "see 04" resolvable. There are none in the copy. Agreement with
 * the nav is the actual reason, and it is a better one.)
 *
 * The label is optional. Where the heading beneath it already is the label, as
 * with "How it works", repeating it would be noise, so the number stands alone
 * and the rule goes with the label it would otherwise have pointed at.
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
      {children ? (
        <>
          <span aria-hidden className="h-px w-5 bg-current opacity-40" />
          <span>{children}</span>
        </>
      ) : null}
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

/**
 * A heading that stays while its content scrolls past.
 *
 * ── THE PROBLEM THIS FIXES ──────────────────────────────────────────────────
 *
 * Several sections had a short heading in a left column and a long list in the
 * same column beneath it, which left the right half of a 1440 screen empty for
 * the whole length of the list. The page read as a narrow column of text with a
 * wide margin, which is not what a twelve column grid is for.
 *
 * So the heading moves into its own column and sticks. The content scrolls past
 * it, the reader keeps the heading in view while reading a list that may be ten
 * rows long, and the width gets used.
 *
 * Sticky only from the large breakpoint. Below it the two stack, because a
 * sticky heading on a phone eats a third of the viewport for the whole section.
 */
export function StickyPair({ aside, children, asideSpan, contentSpan }) {
  return (
    <Grid className="items-start">
      <Col
        span={asideSpan ?? "col-span-4 md:col-span-6 lg:col-span-4"}
        className="lg:sticky lg:top-28"
      >
        {aside}
      </Col>
      <Col
        span={
          contentSpan ?? "col-span-4 md:col-span-6 lg:col-span-7 lg:col-start-6"
        }
      >
        {children}
      </Col>
    </Grid>
  );
}
