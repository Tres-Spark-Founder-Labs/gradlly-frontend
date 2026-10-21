/**
 * Factory's component set.
 *
 * Rules this file holds to, straight from the reference:
 *
 *   Geist weight 400 almost everywhere. 500 only where a label must dominate
 *   a dense surface — this file uses it nowhere, by design; nothing here is
 *   that dense yet.
 *   Flat radii only: 3px controls, 10px cards, 20px at the largest panel.
 *   No shadows, anywhere. Depth is the bone card on the obsidian canvas.
 *   Signal orange and metric green are status colour, never chrome — neither
 *   appears as a button fill or a card background in this file.
 */

const MECH = "mech";

/* ── Eyebrow and status ──────────────────────────────────────────────────── */

/**
 * A 6px filled dot, signal orange, sitting before a label — "Status Pulse" in
 * the reference. Used alone (a live indicator) or as the leading mark in an
 * Eyebrow.
 */
export function StatusPulse({ tone = "orange", className = "" }) {
  const fill = tone === "green" ? "bg-metric-green" : "bg-signal-orange";
  return (
    <span
      aria-hidden
      className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${fill} ${className}`}
    />
  );
}

/**
 * Geist Mono, 12px, uppercase, tight tracking — the system's "instrument"
 * voice. Used for section eyebrows, column headers and status tags. `dark`
 * sets it for use on the bone card, where the canvas-voice colours invert.
 */
export function Eyebrow({ children, pulse = true, dark = false }) {
  return (
    <p
      className={`flex items-center gap-2.5 font-mono text-caption uppercase tracking-tight ${
        dark ? "text-card-ink-soft" : "text-pale-stone"
      }`}
    >
      {pulse ? <StatusPulse /> : null}
      {children}
    </p>
  );
}

/* ── Actions ──────────────────────────────────────────────────────────────── */

/**
 * `variant`:
 *   dark   — carbon-lift fill, bone text. The default committed action on the
 *            canvas.
 *   onBone — obsidian fill, bone text. The same dark-filled idea, but a shade
 *            darker, for a button sitting inside a bone card: the reference's
 *            CTA Section Card specifically calls out #101010 there rather than
 *            carbon-lift, for the extra contrast a light card can carry.
 *   light  — chalk fill, obsidian text. The one chromatic-contrast button in
 *            the system, reserved for the single highest-emphasis trigger
 *            (Log In in the nav).
 *   ghost  — transparent, 1px ash-stroke border, square corners. A
 *            typographic button: text/border lighten to chalk on hover, no
 *            fill ever appears.
 */
export function Button({ href, children, variant = "dark", arrow = false }) {
  const style = {
    dark: "rounded-control bg-carbon-lift text-bone hover:bg-ash-stroke",
    onBone: "rounded-control bg-obsidian-canvas text-bone hover:bg-carbon-lift",
    light: "rounded-control bg-chalk text-obsidian-canvas hover:bg-bone",
    ghost:
      "rounded-none border border-ash-stroke text-bone hover:border-chalk hover:text-chalk",
  }[variant];

  const padding = variant === "ghost" ? "px-3 py-3" : "px-3.5 py-2.5";

  return (
    <a
      href={href}
      className={`${MECH} inline-flex items-center gap-2 text-body-sm ${padding} ${style}`}
    >
      {children}
      {arrow ? <span aria-hidden>→</span> : null}
    </a>
  );
}

/* ── Surfaces ─────────────────────────────────────────────────────────────── */

/**
 * The Light Surface Card — "the figure on dark ground", and the one place in
 * this system a surface turns bright. Bone fill, 10px radius, no shadow,
 * optional grain. Content inside is dark (--color-card-ink), via `on-bone`
 * so focus rings invert correctly too.
 */
export function BoneCard({ children, className = "", grain = false }) {
  return (
    <div
      className={`on-bone rounded-card bg-bone p-3 text-card-ink ${grain ? "grain" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Feature Card: implied by its border, not a fill — the reference is explicit
 * that this card has no background. 1px carbon-lift hairline, 10px radius.
 */
export function FeatureCard({ children, className = "" }) {
  return (
    <div
      className={`rounded-card border border-carbon-lift p-2.5 ${className}`}
    >
      {children}
    </div>
  );
}

/* ── Data ─────────────────────────────────────────────────────────────────── */

/**
 * A metric tile: a label and a value, no background, a hairline divider.
 *
 * ── WHY `value` IS ALWAYS A WORD HERE, NEVER A NUMBER ───────────────────────
 *
 * The reference's own example tiles show a number — "36px weight 400 bone" is
 * sized for a figure like a count or a percentage. This project has no
 * figures to put there: there is no cohort to measure, and Mocks.jsx in the
 * main system documents the same constraint for the same reason. So every
 * tile on this page reads a state instead — MET, PENDING, VERIFIED — which is
 * real: it is the gateway-readiness data this codebase already carries in two
 * other places (HeroStack's old plate, VerifyDemo's current footer), not
 * invented for Factory.
 */
export function MetricTile({ label, value, tone = "bone", sparkline }) {
  const valueColour =
    tone === "green"
      ? "text-metric-green"
      : tone === "muted"
        ? "text-warm-granite"
        : "text-bone";

  return (
    <div className="border-b border-carbon-lift p-2.5">
      <p className="font-mono text-caption uppercase tracking-tight text-pale-stone">
        {label}
      </p>
      <p
        className={`display mt-2 text-heading font-normal tracking-tight ${valueColour}`}
      >
        {value}
      </p>
      {sparkline ? <div className="mt-3 h-10">{sparkline}</div> : null}
    </div>
  );
}

/**
 * A sparkline: a shape, not a chart. No axis, no points, no number — the same
 * rule Mocks.jsx and Diagrams.jsx hold to on the main site, carried over here.
 * `points` is an SVG polyline point list in a 120×40 box.
 */
export function Sparkline({ points, tone = "orange" }) {
  const stroke =
    tone === "green"
      ? "var(--color-metric-green)"
      : "var(--color-signal-orange)";
  return (
    <svg
      viewBox="0 0 120 40"
      preserveAspectRatio="none"
      className="block h-full w-full"
      aria-hidden
    >
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
