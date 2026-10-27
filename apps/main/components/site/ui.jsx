/**
 * The component set for the marketing site's visual system.
 *
 * ── RULES THIS FILE HOLDS TO, FROM THE REBUILD BRIEF ─────────────────────────
 *
 *   The serif carries display type only, never body, labels or controls.
 *   Olive carries the actions, matching /gradlly-ams's own buttons. Outlined
 *     is the secondary. Terracotta stays the Gradlly AMS / Passport product
 *     mark — it identifies a section, it doesn't drive a click.
 *   Olive is also the accent colour: headline emphasis, icons, status, links.
 *   Cards carry a shadow (.shadow-card), not just a hairline. See globals.css
 *     for why: the previous system separated surfaces tonally on purpose, and
 *     this rebuild's reference visibly lifts its cards off the page instead.
 *   10px on controls, up to 20px on cards, full stadium on buttons.
 *   Whitespace still does most of the work: no gradients, no glass.
 */

import { Ref } from "./Grid";
import { Reveal } from "./Reveal";

const MARK = {
  olive: "var(--color-olive)",
  terracotta: "var(--color-terracotta)",
};

/**
 * Text in a product's colour. Olive passes on every surface at 9.77:1.
 * Terracotta does not, at 2.84:1 on cream, so text uses the darker
 * terracotta-ink and the plain terracotta stays a fill.
 */
const MARK_INK = {
  olive: "text-olive",
  terracotta: "text-terracotta-ink",
};

/* ── Layout ───────────────────────────────────────────────────────────────── */

/**
 * A section.
 *
 * Vertical rhythm is 80px at mobile rising to 120px at wide. The container is
 * 1200px, narrow enough that an oversized serif headline has room to breathe
 * before the line wraps.
 *
 * `tone="olive"` is kept in the surface map below for completeness but nothing
 * in this rebuild passes it — the dark full-bleed band retired along with the
 * hero panel. `sand` still alternates sections tonally, which is a layout
 * rhythm rather than a visual-identity choice and survived the rebuild intact.
 */
export function Band({
  id,
  children,
  tone = "cream",
  className = "",
  labelledBy,
}) {
  const surface = {
    cream: "bg-cream",
    linen: "bg-linen",
    sand: "bg-sand",
    olive: "bg-olive text-linen",
    ink: "bg-ink text-linen",
  }[tone];

  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`${surface} px-6 py-20 md:px-10 md:py-28 lg:px-12 lg:py-30 ${className}`}
    >
      <div className="mx-auto max-w-[1200px]">{children}</div>
    </section>
  );
}

/**
 * A section heading.
 *
 * Asymmetric where there is a note: heading on the left at serif display
 * scale, note on the right as sans body.
 */
export function BandHead({ id, eyebrow, children, note, tone = "ink" }) {
  const dark = tone === "linen";
  return (
    <div
      className={
        note
          ? "grid gap-8 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-end lg:gap-20"
          : ""
      }
    >
      <Reveal>
        {eyebrow ? <Ref tone={tone}>{eyebrow}</Ref> : null}
        <h2
          id={id}
          className={`display measure-display text-section ${dark ? "text-linen" : "text-ink"} ${eyebrow ? "mt-5" : ""}`}
        >
          {children}
        </h2>
      </Reveal>
      {note ? (
        <Reveal stagger={0}>
          <p
            className={`measure text-lead ${dark ? "text-linen/60" : "text-ink-soft"}`}
          >
            {note}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}

/* ── Actions ──────────────────────────────────────────────────────────────── */

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
}) {
  const style = {
    primary: "bg-olive text-linen hover:bg-olive/90 border border-transparent",
    outline: "border border-ink text-ink hover:bg-ink hover:text-linen",
    "outline-coral":
      "border border-coral text-coral hover:bg-coral hover:text-linen",
  }[variant];

  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center rounded-full px-7 py-3.5 text-body-sm font-medium transition-colors duration-200 ease-out ${style} ${className}`}
    >
      {children}
    </a>
  );
}

export function TextLink({ href, children, tone = "ink", className = "" }) {
  const style =
    tone === "linen"
      ? "text-linen underline decoration-linen/40 hover:decoration-linen"
      : "text-ink underline decoration-ink/30 hover:decoration-ink";
  return (
    <a
      href={href}
      className={`text-body-sm font-medium decoration-1 underline-offset-[5px] transition-colors duration-200 ease-out ${style} ${className}`}
    >
      {children}
    </a>
  );
}

/* ── Content ──────────────────────────────────────────────────────────────── */

/**
 * One meaningful word in a display headline, in olive italic with a hand-drawn
 * underline under it. Both the word and the stroke are olive — the stroke is
 * currentColor, and .accent in globals.css sets that colour directly, so there
 * is one place this can be changed rather than one per call site. Used once
 * per page at most.
 */
export function Accent({ children }) {
  return (
    <span className="accent">
      {children}
      <svg
        viewBox="0 0 200 12"
        preserveAspectRatio="none"
        aria-hidden
        focusable="false"
      >
        <path
          d="M2 8.2 C 38 3.1, 74 10.4, 112 5.6 S 170 2.4, 198 6.9"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  );
}

/**
 * A claim with the confirmation under it.
 *
 * Gradlly's own recurring idea, kept through both restyles: the product's
 * proposition is not that something is true but that somebody confirmed it,
 * so a promise carries who stands behind it.
 */
export function Attestation({
  claim,
  by,
  mark = "olive",
  tone = "ink",
  children,
}) {
  const dark = tone === "linen";
  return (
    <div>
      <h3
        className={`text-subhead font-medium ${dark ? "text-linen" : "text-ink"}`}
      >
        {claim}
      </h3>
      {children ? (
        <p
          className={`measure mt-3 text-body-sm ${dark ? "text-linen/60" : "text-ink-soft"}`}
        >
          {children}
        </p>
      ) : null}
      {by ? (
        <p
          className={`mt-4 flex items-start gap-3 text-caption ${dark ? "text-linen/50" : "text-ink-muted"}`}
        >
          <span
            className="mark mt-1 h-3"
            style={{ "--mark": MARK[mark] }}
            aria-hidden
          />
          {by}
        </p>
      ) : null}
    </div>
  );
}

/**
 * A card: white, bordered, shadowed, 20px.
 *
 * This is the one surface treatment the rebuild's reference uses everywhere —
 * the product preview, the comparison panels, the form. It replaces the first
 * system's flat tonal card, which separated from the page by warmth alone.
 */
export function Card({ children, className = "", tone = "linen" }) {
  const surface = tone === "sand" ? "bg-sand" : "bg-linen";
  return (
    <div
      className={`shadow-card rounded-card border border-hairline ${surface} p-7 md:p-9 ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * A ruled list.
 *
 * `numbered` is used only where the rows genuinely are a sequence, which in
 * Gradlly's copy is the two flows in How it works and nothing else.
 */
export function SpecList({ items, numbered = false, mark = "olive" }) {
  const Tag = numbered ? "ol" : "ul";

  return (
    <Tag className="list-none">
      {items.map((item, index) => {
        const { claim, detail } =
          typeof item === "string" ? { claim: item, detail: null } : item;

        return (
          <li
            key={claim}
            className="flex gap-6 border-t border-hairline py-6 last:border-b"
          >
            {numbered ? (
              <span
                className={`display w-8 shrink-0 text-subhead ${MARK_INK[mark]}`}
                aria-hidden
              >
                {index + 1}
              </span>
            ) : null}
            <div>
              <p
                className={
                  detail
                    ? "text-subhead font-medium text-ink"
                    : "text-body text-ink"
                }
              >
                {claim}
              </p>
              {detail ? (
                <p className="measure mt-2.5 text-body-sm text-ink-soft">
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
