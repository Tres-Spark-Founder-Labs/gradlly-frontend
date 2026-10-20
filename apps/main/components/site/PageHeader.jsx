const MARK = {
  teal: "var(--color-teal)",
  brass: "var(--color-brass)",
  navy: "var(--color-navy)",
};

/**
 * The top of every page.
 *
 * ── THE COMPOSITION, AND WHY IT CHANGED ─────────────────────────────────────
 *
 * The first version put the heading in a left column and the lead alone in a
 * right one. At 1440 that left most of the width empty with a single sentence
 * floating in it, which reads as an unfinished wireframe rather than as a
 * designed page. This audience is comfortable with density and reads a page
 * the way a specification is read; a mostly-empty screen says there is nothing
 * to say.
 *
 * So the claim and its lead stack on the left, and the right column carries
 * something of substance: an `aside` the page supplies. Where a page has no
 * aside the heading widens to take the space instead of leaving a hole.
 */
export function PageHeader({
  number,
  label,
  title,
  lead,
  mark = "navy",
  aside,
  children,
}) {
  return (
    <header className="border-b border-mist px-5 pb-14 pt-10 md:px-8 md:pb-18 md:pt-14 lg:px-12">
      <div className="mx-auto max-w-[1320px]">
        <p
          className="enter flex items-center gap-2.5 text-caption text-steel"
          style={{ "--enter-delay": "0ms" }}
        >
          <span
            className="mark h-3"
            style={{ "--mark": MARK[mark] }}
            aria-hidden
          />
          <span>
            <span className="font-mono text-ref">{number}</span>{" "}
            <span className="text-mist">/</span> {label}
          </span>
        </p>

        <div
          className={
            aside
              ? "mt-7 grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16"
              : "mt-7"
          }
        >
          <div>
            <h1
              className={`enter text-display font-semibold text-navy ${aside ? "max-w-[16ch]" : "max-w-[22ch]"}`}
              style={{ "--enter-delay": "90ms" }}
            >
              {title}
            </h1>

            {lead ? (
              <p
                className="enter measure mt-6 text-lead text-graphite"
                style={{ "--enter-delay": "180ms" }}
              >
                {lead}
              </p>
            ) : null}

            {children ? (
              <div className="enter mt-9" style={{ "--enter-delay": "270ms" }}>
                {children}
              </div>
            ) : null}
          </div>

          {aside ? (
            <div className="enter lg:pt-2" style={{ "--enter-delay": "320ms" }}>
              {aside}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
