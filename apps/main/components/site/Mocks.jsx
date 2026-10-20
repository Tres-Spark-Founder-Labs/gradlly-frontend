/**
 * Product visuals.
 *
 * ── WHAT THESE DELIBERATELY DO NOT CONTAIN ──────────────────────────────────
 *
 * No figures, no names, no dates, no percentages. Where a value would sit there
 * is a neutral block.
 *
 * That is the point rather than an omission. The visuals these replaced carried
 * £142,400, 94% and £8,000 inside simulated dashboards, which reads as a
 * screenshot of real data, and that was the fabricated proof this site had
 * stripped out of it. The brief for this restyle says the same thing from the
 * other direction: do not create imagery that implies features or data the
 * project does not have.
 *
 * So these show the shape of Gradlly's actual features and nothing a reader
 * could mistake for a measurement. Drawn in markup rather than shipped as
 * images: sharp at any density, nothing to download, correctable in a line when
 * the real interface changes.
 */

/** The frame. Linen on cream, a hairline, 24px, and the one place a shadow is
    allowed: an overlapping product visual, which the brief permits. */
function Frame({ label, mark = "olive", children, className = "" }) {
  const dot = mark === "terracotta" ? "bg-terracotta" : "bg-olive";

  return (
    <figure
      className={`overflow-hidden rounded-card border border-hairline bg-linen ${className}`}
    >
      <figcaption className="flex items-center gap-2.5 border-b border-hairline px-6 py-4">
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden />
        <span className="text-caption text-ink-muted">{label}</span>
      </figcaption>
      <div className="px-6 py-5">{children}</div>
    </figure>
  );
}

/** A neutral block where a value would be. Never a number. */
function Blank({ w = "w-14" }) {
  return <span className={`block h-2 rounded-full bg-sand ${w}`} aria-hidden />;
}

/** Continuo: a worker's record, each skill carrying its confirmation. */
export function RecordMock({ className = "" }) {
  const rows = [
    { skill: "Moving and handling", by: "Confirmed by assessor" },
    { skill: "Medication administration", by: "Confirmed by line manager" },
    { skill: "Right to work", by: "Verified at source" },
  ];

  return (
    <Frame label="Skills record" className={className}>
      <ul className="list-none">
        {rows.map(({ skill, by }) => (
          <li
            key={skill}
            className="flex items-center gap-4 border-b border-hairline py-4 last:border-b-0"
          >
            <span
              className="mark h-8"
              style={{ "--mark": "var(--color-olive)" }}
              aria-hidden
            />
            <span className="flex-1">
              <span className="block text-body-sm font-medium text-ink">
                {skill}
              </span>
              <span className="mt-0.5 block text-caption text-ink-muted">
                {by}
              </span>
            </span>
            <Blank w="w-10" />
          </li>
        ))}
      </ul>
    </Frame>
  );
}

/** Gradlly AMS: a cohort, with progress drawn rather than stated. */
export function CohortMock({ className = "" }) {
  const widths = ["w-[72%]", "w-[45%]", "w-[88%]", "w-[31%]"];

  return (
    <Frame label="Cohort progress" mark="terracotta" className={className}>
      <ul className="list-none space-y-4">
        {widths.map((width, index) => (
          <li key={width} className="flex items-center gap-4">
            <span
              className="h-7 w-7 shrink-0 rounded-full bg-sand"
              aria-hidden
            />
            <span className="flex-1">
              <Blank w={index % 2 === 0 ? "w-24" : "w-16"} />
              <span
                className="mt-2.5 block h-1.5 overflow-hidden rounded-full bg-sand"
                aria-hidden
              >
                <span
                  className={`block h-full rounded-full bg-terracotta ${width}`}
                />
              </span>
            </span>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

/** The Apprenticeship Passport: entries, each with who confirmed it. */
export function PassportMock({ className = "" }) {
  const entries = [
    "Knowledge, skills and behaviours",
    "Off-the-job hours",
    "End-point assessment result",
  ];

  return (
    <Frame
      label="Apprenticeship Passport"
      mark="terracotta"
      className={className}
    >
      <ul className="list-none">
        {entries.map((entry) => (
          <li
            key={entry}
            className="border-b border-hairline py-4 last:border-b-0"
          >
            <span className="block text-body-sm font-medium text-ink">
              {entry}
            </span>
            <span className="mt-1.5 flex items-center gap-2.5">
              <span
                className="mark h-3"
                style={{ "--mark": "var(--color-terracotta)" }}
                aria-hidden
              />
              <span className="text-caption text-ink-muted">
                Confirmed, with the date attached
              </span>
            </span>
          </li>
        ))}
      </ul>
    </Frame>
  );
}
