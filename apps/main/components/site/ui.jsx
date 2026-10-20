/**
 * The component set from docs/marketing/STYLE-REFERENCE.md.
 *
 * Every visual decision here is made in that document, including the reasoning
 * and the contrast measurements. Nothing in this file invents a value.
 */

const MARK = {
  teal: "var(--color-teal)",
  brass: "var(--color-brass)",
  navy: "var(--color-navy)",
};

const MARK_INK = {
  teal: "text-teal",
  brass: "text-brass-ink",
  navy: "text-navy",
};

/* ── Layout ───────────────────────────────────────────────────────────────── */

/**
 * A section. Separated from its neighbours by surface change or a hairline,
 * never by empty space, which is what keeps the page reading as one document.
 */
export function Band({
  id,
  children,
  tone = "paper",
  bordered = false,
  className = "",
}) {
  const surface =
    tone === "fog"
      ? "bg-fog"
      : tone === "navy"
        ? "on-dark bg-navy text-paper"
        : "bg-paper";

  return (
    <section
      id={id}
      className={`${surface} ${bordered ? "border-t border-mist" : ""} px-5 py-14 md:px-8 md:py-20 lg:px-12 lg:py-24 ${className}`}
    >
      <div className="mx-auto max-w-[1320px]">{children}</div>
    </section>
  );
}

/**
 * A band heading.
 *
 * Two columns when there is a note: heading left, note right, both aligned to
 * the same baseline. One column when there is not. The first version stacked
 * them in a narrow left measure, which left two thirds of a 1440 screen empty
 * beside three lines of text.
 */
export function BandHead({ id, eyebrow, children, note, mark = "navy" }) {
  return (
    <div
      className={
        note
          ? "grid gap-6 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-end lg:gap-16"
          : ""
      }
    >
      <div>
        {eyebrow ? (
          <p className="flex items-center gap-2.5 text-caption text-steel">
            <span
              className="mark h-3"
              style={{ "--mark": MARK[mark] }}
              aria-hidden
            />
            {eyebrow}
          </p>
        ) : null}
        <h2
          id={id}
          className={`max-w-[20ch] text-heading-lg font-semibold text-navy ${eyebrow ? "mt-4" : ""}`}
        >
          {children}
        </h2>
      </div>
      {note ? <p className="measure text-lead text-graphite">{note}</p> : null}
    </div>
  );
}

/* ── Actions ──────────────────────────────────────────────────────────────── */

/**
 * The one saturated fill in the system. One per region.
 *
 * `inverse` is for the navy band, where teal on navy is 2.02:1 and unreadable;
 * there the button is paper with navy text.
 */
export function Button({
  href,
  children,
  variant = "primary",
  className = "",
}) {
  const style = {
    primary: "bg-teal text-paper hover:bg-[#0c4a4d] border border-transparent",
    outline: "border border-navy text-navy hover:bg-navy hover:text-paper",
    inverse: "bg-paper text-navy hover:bg-fog border border-transparent",
    "outline-inverse": "border border-paper/40 text-paper hover:border-paper",
  }[variant];

  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center rounded-md px-6 py-3 text-body-sm font-semibold transition-colors duration-[140ms] ease-out ${style} ${className}`}
    >
      {children}
    </a>
  );
}

/** Navy, underlined in mist. Never teal: teal means "this is the action". */
export function TextLink({ href, children, className = "" }) {
  return (
    <a
      href={href}
      className={`text-body-sm font-medium text-navy underline decoration-mist decoration-1 underline-offset-[3px] transition-colors duration-[140ms] ease-out hover:decoration-navy ${className}`}
    >
      {children}
    </a>
  );
}

/* ── Content ──────────────────────────────────────────────────────────────── */

/**
 * The signature component, and the one that says what the product is.
 *
 * A claim, a hairline, and who stands behind it. The product's proposition is
 * not that something is true but that somebody confirmed it, so every promise
 * on the site carries the confirmation in the same shape.
 */
export function Attestation({ claim, by, mark = "teal", children }) {
  return (
    <div>
      <p className="text-heading-sm font-semibold text-navy">{claim}</p>
      {children ? (
        <p className="measure mt-2.5 text-body-sm text-graphite">{children}</p>
      ) : null}
      {by ? (
        <p className="mt-4 flex items-start gap-2.5 border-t border-mist pt-3.5 text-caption text-steel">
          <span
            className="mark mt-0.5 h-3.5"
            style={{ "--mark": MARK[mark] }}
            aria-hidden
          />
          {by}
        </p>
      ) : null}
    </div>
  );
}

/** Paper on a hairline. No shadow; hover takes the border to navy. */
export function Card({ title, children, mark, href }) {
  const body = (
    <>
      {mark ? (
        <span
          className="mark absolute inset-y-0 left-0 h-full"
          style={{ "--mark": MARK[mark] }}
          aria-hidden
        />
      ) : null}
      <p className="text-heading-sm font-semibold text-navy">{title}</p>
      <p className="mt-2.5 text-body-sm text-graphite">{children}</p>
      {href ? (
        <p className="mt-5 font-mono text-ref text-steel">Read more</p>
      ) : null}
    </>
  );

  const shell =
    "relative overflow-hidden rounded-md border border-mist bg-paper p-7 transition-colors duration-[140ms] ease-out hover:border-navy md:p-8";

  return href ? (
    <a href={href} className={`block ${shell}`}>
      {body}
    </a>
  ) : (
    <div className={shell}>{body}</div>
  );
}

/**
 * A ruled list, not cards.
 *
 * `numbered` adds a two-digit reference in the mono face, and is used only when
 * the rows genuinely are a sequence. Numbered markers applied to a set that is
 * not ordered are the commonest piece of generated-page furniture.
 */
export function SpecList({ items, numbered = false, mark = "teal" }) {
  const Tag = numbered ? "ol" : "ul";

  return (
    <Tag className="list-none">
      {items.map((item, index) => {
        const { claim, detail } =
          typeof item === "string" ? { claim: item, detail: null } : item;

        return (
          <li
            key={claim}
            className="flex gap-5 border-t border-mist py-5 last:border-b"
          >
            {numbered ? (
              <span
                className={`w-7 shrink-0 font-mono text-ref ${MARK_INK[mark]}`}
                aria-hidden
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            ) : null}
            <div>
              <p
                className={
                  detail
                    ? "text-heading-sm font-semibold text-navy"
                    : "text-body text-navy"
                }
              >
                {claim}
              </p>
              {detail ? (
                <p className="measure mt-2 text-body-sm text-graphite">
                  {detail}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </Tag>
  );
}

/**
 * One highlighted block per page, identified to a product. Decorative surface
 * only, never carrying the primary action.
 */
export function Wash({ mark = "teal", children }) {
  const surface = mark === "brass" ? "bg-brass-wash" : "bg-teal-wash";

  return (
    <div className={`rounded-md ${surface} p-7 md:p-10`}>
      <span
        className="mark mb-6 h-3.5"
        style={{ "--mark": MARK[mark] }}
        aria-hidden
      />
      {children}
    </div>
  );
}

/**
 * The closing band. Navy, which is the inverse of the page, and that is what
 * makes it read as the end of an argument rather than another section.
 */
export function DarkCta({ heading, children, action }) {
  return (
    <Band tone="navy">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:items-end lg:gap-16">
        <div>
          <h2 className="measure-display text-heading-lg font-semibold text-paper">
            {heading}
          </h2>
          <p className="measure mt-5 text-lead text-paper/75">{children}</p>
        </div>
        <div className="lg:text-right">{action}</div>
      </div>
    </Band>
  );
}
