const MARK = {
  navy: "var(--color-navy)",
  teal: "var(--color-teal)",
  brass: "var(--color-brass)",
};

const MARK_CLASS = {
  navy: "bg-navy",
  teal: "bg-teal",
  brass: "bg-brass",
};

/**
 * The top of every page.
 *
 * Built like the head of a record rather than a hero: the page's number, its
 * name, a rule, and then the title. The rule draws across on load and is the
 * page's one orchestrated moment, because ruling a line is what you do before
 * you write on a form.
 *
 * `mark` is the product that owns the page and is the only thing on it that
 * decides colour. On the overview page that is navy, because the overview
 * belongs to neither product.
 */
export function PageHeader({
  number,
  label,
  title,
  lead,
  mark = "navy",
  children,
}) {
  return (
    <header
      className="border-b border-rule px-5 pb-14 pt-12 md:px-8 md:pb-20 md:pt-16 lg:px-12"
      style={{ "--mark": MARK[mark] }}
    >
      <div className="mx-auto max-w-[1320px]">
        <p
          className="enter flex items-center gap-3 text-ref text-slate"
          style={{ "--enter-delay": "0ms" }}
        >
          <span className={`block h-3 w-1 ${MARK_CLASS[mark]}`} aria-hidden />
          <span>
            {number} <span className="text-rule">/</span> {label}
          </span>
        </p>

        <div
          className="rule-draw mt-5 h-px bg-rule"
          style={{ "--enter-delay": "80ms" }}
          aria-hidden
        />

        <h1
          className="enter wide mt-8 max-w-[18ch] text-hero text-navy"
          style={{ "--enter-delay": "180ms" }}
        >
          {title}
        </h1>

        {lead ? (
          <p
            className="enter measure-lead mt-6 text-lead text-slate"
            style={{ "--enter-delay": "280ms" }}
          >
            {lead}
          </p>
        ) : null}

        {children ? (
          <div className="enter mt-10" style={{ "--enter-delay": "360ms" }}>
            {children}
          </div>
        ) : null}
      </div>
    </header>
  );
}

/**
 * A claim with the confirmation under it.
 *
 * The site's recurring idea, and the reason the design exists: this product's
 * whole proposition is not that something is true but that somebody confirmed
 * it, so every promise on the site carries who stands behind it in the same
 * shape. The 4px mark down the left is the product's colour.
 */
export function Attest({ claim, by, mark = "navy", children }) {
  return (
    <div className="attest" style={{ "--mark": MARK[mark] }}>
      <p className="wide-md text-subhead text-navy">{claim}</p>
      {children ? (
        <div className="mt-2 text-small text-slate">{children}</div>
      ) : null}
      {by ? (
        <p className="attest-rule mt-4 pt-3 text-ref text-slate">{by}</p>
      ) : null}
    </div>
  );
}

/** A plain section on a white page. */
export function Band({ id, children, className = "", tone = "white" }) {
  const background =
    tone === "paper"
      ? "bg-paper"
      : tone === "navy"
        ? "on-dark bg-navy"
        : "bg-white";

  return (
    <section
      id={id}
      className={`${background} px-5 py-16 md:px-8 md:py-24 lg:px-12 ${className}`}
    >
      <div className="mx-auto max-w-[1320px]">{children}</div>
    </section>
  );
}

/** A section heading, with the rule above it that the whole design hangs on. */
export function BandHead({ id, children, note }) {
  return (
    <>
      <div className="h-0.5 w-12 bg-navy" aria-hidden />
      <h2 id={id} className="wide-md mt-5 max-w-[22ch] text-section text-navy">
        {children}
      </h2>
      {note ? (
        <p className="measure mt-4 text-body text-slate">{note}</p>
      ) : null}
    </>
  );
}
