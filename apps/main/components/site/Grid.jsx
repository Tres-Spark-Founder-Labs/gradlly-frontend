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
 * An eyebrow: a small dot in the section's product colour, and a label.
 *
 * ── WHAT THIS REPLACED ───────────────────────────────────────────────────────
 *
 * The first restyle of this site used a figure number here instead — 01, 02,
 * 03 — on the reasoning that it was information (agreement with the section
 * nav) rather than decoration. That was a genuine Swiss-modernist device, and
 * it is exactly the kind of thing the brief for this rebuild named directly:
 * the numbered references are retired along with the rest of that system. A
 * dot and a label is the more conventional device, and conventional is the
 * point this time — it is also one less thing for a section that gets
 * reordered, merged or split to keep in sync.
 *
 * `tone` sets the dot and text colour together, so a reader never has to
 * infer which product a section belongs to from colour alone at a glance —
 * the label beside it always says so in words too.
 */
export function Ref({ children, tone = "ink" }) {
  const ink = {
    ink: "text-ink-muted",
    olive: "text-olive",
    terracotta: "text-terracotta-ink",
    linen: "text-linen/60",
  }[tone];
  const dot = {
    ink: "bg-ink-muted",
    olive: "bg-olive",
    terracotta: "bg-terracotta",
    linen: "bg-linen/60",
  }[tone];

  if (!children) return null;

  return (
    <p className={`flex items-center gap-2.5 text-caption ${ink}`}>
      <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${dot}`} />
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
