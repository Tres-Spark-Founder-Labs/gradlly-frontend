/**
 * Every section below the hero, and the spine that runs through them.
 *
 * The spine is the page's one structural idea: a 2px rule down the left of the
 * content whose colour says which product you are reading about. Because the
 * colour already carries that, no section needs a label above its heading,
 * which is both a standing rule here and the commonest template tell.
 *
 * `tone` sets the colour. `--spine` is read by the `.spine` class in
 * globals.css, which also owns the scroll-linked drawing.
 */
const TONE = {
  neutral: "var(--color-rule)",
  teal: "var(--color-teal)",
  brass: "var(--color-brass)",
};

export function Section({
  id,
  tone = "neutral",
  children,
  className = "",
  labelledBy,
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`px-5 py-16 md:px-10 md:py-24 lg:px-16 lg:py-28 ${className}`}
      style={{ "--spine": TONE[tone] }}
    >
      <div className="relative mx-auto max-w-[1140px]">
        <span className="spine absolute left-0 top-0" aria-hidden />
        <div className="pl-6 md:pl-10">{children}</div>
      </div>
    </section>
  );
}

/**
 * A section heading and, under it, the line from content-v1.md that says who
 * the section is for.
 *
 * Below rather than above on purpose. Above, in small tracked-out capitals, it
 * would be an eyebrow, and an eyebrow over every heading is the single most
 * recognisable piece of generated-page chrome. Below, in sentence case and in
 * the product's own colour, it reads as what it is: a note about who should
 * carry on reading.
 */
export function SectionHead({ id, children, note, tone = "neutral" }) {
  const noteColour =
    tone === "teal"
      ? "text-teal"
      : tone === "brass"
        ? "text-brass-ink"
        : "text-slate";

  return (
    <>
      <h2 id={id} className="measure font-display text-section text-navy">
        {children}
      </h2>
      {note ? (
        <p className={`mt-3 text-small font-medium ${noteColour}`}>{note}</p>
      ) : null}
    </>
  );
}
