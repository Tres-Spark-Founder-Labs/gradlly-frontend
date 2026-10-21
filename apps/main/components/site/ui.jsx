/**
 * The component set for the Kindsight-derived visual system.
 *
 * Rules this file holds to, from the brief:
 *
 *   The serif carries display type only, never body, labels or controls.
 *   Terracotta carries the actions. Outlined is the secondary.
 *   Chartreuse is emphasis, never body text, and appears once per page.
 *   Thin low-contrast borders and tonal surface change, not shadows.
 *   10px on controls, up to 24px on cards.
 *   Whitespace does most of the work: no extra dividers, no decoration.
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
 * Vertical rhythm is 80px at mobile rising to 120px at wide, which is the
 * spacing the reference uses and the main reason its pages read as calm. The
 * container is 1200px, narrower than the 1320 this site used before, because an
 * oversized serif needs the page to stop before the headline runs out of
 * breath.
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
    olive: "on-olive bg-olive text-linen",
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
 * Asymmetric where there is a note: heading on the left at serif display scale,
 * note on the right as sans body. The brief asks for asymmetrical compositions
 * where the content supports one, and a heading plus its summary is the case
 * that always does.
 */
export function BandHead({
  id,
  number,
  eyebrow,
  children,
  note,
  tone = "ink",
  dark = false,
}) {
  return (
    <div
      className={
        note
          ? "grid gap-8 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-end lg:gap-20"
          : ""
      }
    >
      <Reveal>
        {/* One eyebrow device on the page, not two. This was a coloured dot and
            a line of copy, while the sections built straight on the grid
            primitives used a numbered reference instead, so a reader scrolling
            saw 01, 02, a heading with no number, then 04 — which reads as a
            mistake because it was one. The number is the nav's, so the rail and
            the section agree about where you are. */}
        {number ? (
          <Ref number={number} tone={dark ? "linen" : tone}>
            {eyebrow}
          </Ref>
        ) : null}
        <h2
          id={id}
          className={`display measure-display text-section ${dark ? "text-linen" : "text-ink"} ${number ? "mt-6" : ""}`}
        >
          {children}
        </h2>
      </Reveal>
      {note ? (
        <Reveal stagger={0}>
          <p
            className={`measure text-lead ${dark ? "text-linen/75" : "text-ink-soft"}`}
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
    primary:
      "bg-terracotta text-linen hover:bg-coral border border-transparent",
    outline: "border border-ink text-ink hover:bg-ink hover:text-linen",
    "outline-coral":
      "border border-coral text-coral hover:bg-coral hover:text-linen",
    "on-olive":
      "bg-chartreuse text-ink hover:bg-linen border border-transparent",
    "outline-olive": "border border-linen/40 text-linen hover:border-linen",
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

export function TextLink({ href, children, dark = false, className = "" }) {
  return (
    <a
      href={href}
      className={`text-body-sm font-medium underline decoration-1 underline-offset-[5px] transition-colors duration-200 ease-out ${
        dark
          ? "text-linen decoration-linen/40 hover:decoration-linen"
          : "text-ink decoration-ink/30 hover:decoration-ink"
      } ${className}`}
    >
      {children}
    </a>
  );
}

/* ── Content ──────────────────────────────────────────────────────────────── */

/**
 * The hand-drawn chartreuse underline, under one italic word in a display
 * headline.
 *
 * An SVG stroke rather than a border: a straight rule under a 112px serif reads
 * as a link underline. The path is uneven on purpose, and it sits behind the
 * glyphs so a descender crosses it.
 *
 * One per page. The brief calls this a selective gesture and it stops being one
 * the moment a second heading carries it.
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
 * Gradlly's own recurring idea, kept through the restyle: the product's
 * proposition is not that something is true but that somebody confirmed it, so
 * a promise carries who stands behind it. Now set in the warm palette, with the
 * mark in the product's colour.
 */
export function Attestation({
  claim,
  by,
  mark = "olive",
  dark = false,
  children,
}) {
  return (
    <div>
      <h3
        className={`text-subhead font-medium ${dark ? "text-linen" : "text-ink"}`}
      >
        {claim}
      </h3>
      {children ? (
        <p
          className={`measure mt-3 text-body-sm ${dark ? "text-linen/70" : "text-ink-soft"}`}
        >
          {children}
        </p>
      ) : null}
      {by ? (
        <p
          className={`mt-4 flex items-start gap-3 text-caption ${dark ? "text-linen/55" : "text-ink-muted"}`}
        >
          <span
            className="mark mt-1 h-3"
            style={{ "--mark": dark ? "var(--color-chartreuse)" : MARK[mark] }}
            aria-hidden
          />
          {by}
        </p>
      ) : null}
    </div>
  );
}

/**
 * A card.
 *
 * Linen on cream, a hairline, 24px, no shadow. The brief is explicit that
 * surfaces separate tonally rather than by elevation, so the only thing holding
 * this off the page is half a step of warmth.
 */
export function Card({ children, className = "", tone = "linen" }) {
  const surface = tone === "sand" ? "bg-sand" : "bg-linen";
  return (
    <div
      className={`rounded-card border border-hairline ${surface} p-7 md:p-9 ${className}`}
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
export function SpecList({
  items,
  numbered = false,
  mark = "olive",
  dark = false,
}) {
  const Tag = numbered ? "ol" : "ul";
  const rule = dark ? "border-linen/15" : "border-hairline";

  return (
    <Tag className="list-none">
      {items.map((item, index) => {
        const { claim, detail } =
          typeof item === "string" ? { claim: item, detail: null } : item;

        return (
          <li
            key={claim}
            className={`flex gap-6 border-t ${rule} py-6 last:border-b`}
          >
            {numbered ? (
              <span
                className={`display w-8 shrink-0 text-subhead ${dark ? "text-linen/50" : MARK_INK[mark]}`}
                aria-hidden
              >
                {index + 1}
              </span>
            ) : null}
            <div>
              <p
                className={
                  detail
                    ? `text-subhead font-medium ${dark ? "text-linen" : "text-ink"}`
                    : `text-body ${dark ? "text-linen/85" : "text-ink"}`
                }
              >
                {claim}
              </p>
              {detail ? (
                <p
                  className={`measure mt-2.5 text-body-sm ${dark ? "text-linen/70" : "text-ink-soft"}`}
                >
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
