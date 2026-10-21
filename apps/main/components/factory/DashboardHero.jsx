import { MetricTile, Sparkline, StatusPulse } from "./ui";

/**
 * The hero's dashboard frame — "Product hero: the live software factory
 * preview" in the reference, macOS chrome on a dark panel, a grid of metric
 * tiles inside.
 *
 * ── THE FOUR TILES, AND WHY NONE OF THEM HAS A NUMBER ───────────────────────
 *
 * The reference's own example tile shows a count or a percentage at 36px.
 * This project has neither to show — see ui.jsx's note on MetricTile. These
 * four tiles are the same gateway-readiness read HeroStack and VerifyDemo
 * already carry on the main site: three real criteria and their real state,
 * plus the record's own overall status. "2 of 3 met" isn't restated as a
 * number here either; the three tiles beside each other already show it.
 *
 * The one sparkline is the same shape VerifyDemo's deleted PacePlate drew —
 * logged hours tracking a target, not beating it — carried over because it is
 * a legitimate shape (no axis, no value) rather than new invented motion.
 */
const PACE = "0,30 20,27 40,28 60,22 80,19 100,13 120,8";

export function DashboardHero() {
  return (
    <figure className="dashboard-enter overflow-hidden rounded-card border border-carbon-lift bg-carbon-lift/40">
      <figcaption className="flex items-center justify-between gap-4 border-b border-carbon-lift px-3 py-2.5">
        <span className="flex items-center gap-2" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-ash-stroke" />
          <span className="h-2.5 w-2.5 rounded-full bg-ash-stroke" />
          <span className="h-2.5 w-2.5 rounded-full bg-ash-stroke" />
        </span>
        <span className="font-mono text-caption uppercase tracking-tight text-pale-stone">
          continuo.record
        </span>
        <span className="flex items-center gap-1.5">
          <StatusPulse />
          <span className="font-mono text-caption uppercase tracking-tight text-signal-orange">
            Live
          </span>
        </span>
      </figcaption>

      <div className="grid grid-cols-2">
        <MetricTile
          label="Continuo record"
          value="VERIFIED"
          tone="green"
          sparkline={<Sparkline points={PACE} tone="green" />}
        />
        <MetricTile label="Off-the-job hours" value="MET" tone="green" />
        <MetricTile label="KSB coverage" value="MET" tone="green" />
        <MetricTile label="Employer sign-off" value="PENDING" tone="muted" />
      </div>

      <p className="border-t border-carbon-lift px-3 py-2.5 text-caption text-warm-granite">
        Confirmed by whoever assessed or observed it. No figure here is a
        measurement — see the record itself below.
      </p>
    </figure>
  );
}
