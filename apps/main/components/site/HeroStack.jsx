import { VerifyDemo } from "./VerifyDemo";

/**
 * The plates that float over the hero's olive panel.
 *
 * ── WHAT THIS IS FOR ────────────────────────────────────────────────────────
 *
 * The reference boards for this project put a collage of light cards over a
 * deep olive field: a main plate with two smaller ones overlapping it, so the
 * product reads as a set of connected views rather than one flat screen. One
 * card centred on a dark panel reads as a screenshot; three overlapping ones
 * read as a product.
 *
 * The main plate is the record confirming itself, which is Continuo. The two
 * small ones are Gradlly AMS, so the hero shows both products rather than
 * stating that there are two and showing one.
 *
 * ── NO NUMBERS, ON PURPOSE ──────────────────────────────────────────────────
 *
 * Every figure on this site has to be sourced, and nothing here can be: there
 * is no cohort to measure. So the plates carry the *shape* of a view and none
 * of its values. The pace chart has no axis labels and no percentage, and the
 * readiness list reports states rather than counts.
 *
 * That is also why the pace line tracks its target rather than beating it. A
 * line climbing away from the target would be a claim about outcomes, made with
 * invented data, in the first screen of the site.
 *
 * ── STATE IS NEVER COLOUR ALONE ─────────────────────────────────────────────
 *
 * Each readiness row carries the word for its state next to the mark. A reader
 * who cannot separate olive from sand gets the same information as one who can.
 */

/* The pace line and the target it tracks. Positions in a 120 x 44 box, chosen
   to read as "on track" rather than as a result. */
const PACE = "0,34 17,30 34,31 51,25 68,22 85,17 102,14 120,9";
const TARGET = "0,36 120,8";

function PacePlate() {
  return (
    <figure className="plate w-full p-5">
      <figcaption className="text-caption text-ink-muted">
        Off-the-job pace
      </figcaption>

      <svg
        viewBox="0 0 120 44"
        preserveAspectRatio="none"
        className="mt-4 block h-16 w-full"
        role="img"
        aria-label="A line showing logged off-the-job hours tracking the statutory target."
      >
        <polyline
          points={TARGET}
          fill="none"
          stroke="var(--color-sand)"
          strokeWidth="2"
          strokeDasharray="4 4"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <polyline
          points={PACE}
          fill="none"
          stroke="var(--color-olive)"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-caption text-ink-muted">
        <span className="flex items-center gap-2">
          <span aria-hidden className="block h-0.5 w-4 rounded-full bg-olive" />
          Logged
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden className="block h-0.5 w-4 rounded-full bg-sand" />
          Target
        </span>
      </div>
    </figure>
  );
}

/** The real gateway criteria, each with the word for its state. */
const READY = [
  { criterion: "Off-the-job hours", state: "Met" },
  { criterion: "KSB coverage", state: "Met" },
  { criterion: "Employer sign-off", state: "Pending" },
];

function ReadyPlate() {
  return (
    <figure className="plate w-full p-5">
      <figcaption className="text-caption text-ink-muted">
        Gateway readiness
      </figcaption>

      <ul className="mt-3 list-none">
        {READY.map(({ criterion, state }) => (
          <li
            key={criterion}
            className="flex items-center justify-between gap-4 border-b border-hairline py-2.5 last:border-b-0"
          >
            <span className="flex min-w-0 items-center gap-2.5">
              <span
                aria-hidden
                className={`block h-3.5 w-1 shrink-0 rounded-full ${
                  state === "Met" ? "bg-olive" : "bg-sand"
                }`}
              />
              <span className="text-body-sm text-ink">{criterion}</span>
            </span>
            <span className="shrink-0 text-caption text-ink-muted">
              {state}
            </span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

/**
 * The collage.
 *
 * ── WHAT OVERLAPS WHAT, AND WHY IT MATTERS ──────────────────────────────────
 *
 * The first version of this put both small plates over the middle of the record
 * and hid two of its three rows, which is the failure mode of every collage: it
 * looks composed in a thumbnail and destroys the thing it is composed from. The
 * second moved them out and they fought each other instead, truncating a
 * criterion and clipping the chart's own legend.
 *
 * What makes it work is a measurement rather than an eye. The record's content
 * box ends 24px short of its right edge, so a plate whose left edge lands in
 * that 24px strip overlaps the card and covers none of it — not a caption, not
 * a date block, not a row.
 *
 * Both the card and the plates are sized as a percentage of the column, and the
 * plates are positioned from the *card*, not from the column. Positioning them
 * from the column was the third version of this and it was wrong by 34px,
 * because the card is narrower than the column it sits in; a right offset that
 * clears the card at 1440 eats a row's date block at 1280. A percentage read off
 * the card holds at every width inside the breakpoint, which is the only kind of
 * alignment worth having.
 *
 * The depth comes from the two small plates overlapping each other, where there
 * is nothing to lose, rather than from either of them overlapping the record.
 * A collage that covers the product view is a worse picture of the product than
 * no collage at all, and that is the trade this makes: the layering is real but
 * it is shallow, because the view underneath is the point.
 *
 * ── AND BELOW 1280 ──────────────────────────────────────────────────────────
 *
 * Nothing overlaps and nothing is absolute: an overlapping collage on a 390px
 * screen is three cards covering each other, and between 1024 and 1280 there is
 * not enough column for the overhang to land anywhere but off the side of the
 * viewport. So the collage is an xl-and-up composition and everything below it
 * is a stack in reading order, record first. That is the same rule the sticky
 * section headings follow: the device appears where there is room for it.
 */
export function HeroStack() {
  return (
    <div className="xl:relative">
      <div className="xl:w-[76%]">
        <VerifyDemo />
      </div>

      {/* 74% clears the card's content box, which ends at 76% minus its 24px
          of padding. One plate high and one low rather than two stacked: when
          they sat one directly under the other their edges lined up and the
          pair read as a single tall card with a chart in its lid, and the lower
          one covered the chart's legend. Apart, each crosses a different
          corner and the record is flanked rather than fenced. */}
      <div className="mt-5 w-full xl:absolute xl:-top-[96px] xl:left-[74%] xl:mt-0 xl:w-[44%]">
        <PacePlate />
      </div>

      <div className="mt-5 w-full xl:absolute xl:-bottom-[72px] xl:left-[78%] xl:mt-0 xl:w-[40%]">
        <ReadyPlate />
      </div>
    </div>
  );
}
