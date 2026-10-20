/**
 * Product mockups.
 *
 * ── WHAT THESE DELIBERATELY DO NOT CONTAIN ──────────────────────────────────
 *
 * No figures, no names, no dates, no percentages. The mockups this replaced
 * carried £142,400, 94% and £8,000 inside simulated dashboards, which reads as
 * a screenshot of real data and is the fabricated proof that was stripped from
 * this site on purpose.
 *
 * So these show the *shape* of the product and nothing a reader could mistake
 * for a measurement: a record with its confirmation rows, a cohort with
 * progress drawn as a bar rather than stated as a number, a Passport with its
 * entries. Where a value would sit, there is a neutral block.
 *
 * Drawn in markup rather than shipped as an image: they stay sharp at any
 * density, they cost nothing to download, and they can be corrected in a line
 * when the real interface changes.
 */

/** The chrome every mockup sits in. Glass, so the wash behind it shows through. */
function Frame({ label, mark = "teal", children, className = "" }) {
  const dot = mark === "brass" ? "bg-brass" : "bg-teal";

  return (
    <div
      className={`overflow-hidden rounded-xl border border-paper/60 bg-paper/70 shadow-glass backdrop-blur-xl ${className}`}
    >
      <div className="flex items-center gap-2.5 border-b border-mist/70 px-4 py-3">
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden />
        <span className="font-mono text-ref text-steel">{label}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

/** A neutral block where a value would be. Never a number. */
function Blank({ w = "w-16" }) {
  return <span className={`block h-2 rounded-full bg-mist ${w}`} aria-hidden />;
}

/**
 * Continuo: a worker's record, with each skill carrying its confirmation.
 * This is the one mockup that shows the product's actual proposition.
 */
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
            className="flex items-center gap-3 border-b border-mist/60 py-3 last:border-b-0"
          >
            <span
              className="mark h-7"
              style={{ "--mark": "var(--color-teal)" }}
              aria-hidden
            />
            <span className="flex-1">
              <span className="block text-body-sm font-medium text-navy">
                {skill}
              </span>
              <span className="mt-0.5 block text-caption text-steel">{by}</span>
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
    <Frame label="Cohort progress" mark="brass" className={className}>
      <ul className="list-none space-y-3.5">
        {widths.map((width, index) => (
          <li key={width} className="flex items-center gap-3">
            <span
              className="h-6 w-6 shrink-0 rounded-full bg-brass-wash"
              aria-hidden
            />
            <span className="flex-1">
              <Blank w={index % 2 === 0 ? "w-24" : "w-20"} />
              <span
                className="mt-2 block h-1.5 overflow-hidden rounded-full bg-mist/70"
                aria-hidden
              >
                <span
                  className={`block h-full rounded-full bg-brass ${width}`}
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
    <Frame label="Apprenticeship Passport" mark="brass" className={className}>
      <ul className="list-none">
        {entries.map((entry) => (
          <li
            key={entry}
            className="border-b border-mist/60 py-3 last:border-b-0"
          >
            <span className="block text-body-sm font-medium text-navy">
              {entry}
            </span>
            <span className="mt-1.5 flex items-center gap-2">
              <span
                className="mark h-3"
                style={{ "--mark": "var(--color-brass)" }}
                aria-hidden
              />
              <span className="text-caption text-steel">
                Confirmed, with the date attached
              </span>
            </span>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

/**
 * The atmospheric wash the glass has something to refract.
 *
 * Two soft radial fields in the product colours at low opacity, heavily
 * blurred, sitting behind content and never over it. Decorative, so it is
 * aria-hidden and carries no information.
 */
export function Wash({ className = "" }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
    >
      <div className="absolute -left-24 top-[-10%] h-[28rem] w-[28rem] rounded-full bg-teal/15 blur-[90px]" />
      <div className="absolute -right-20 top-[20%] h-[24rem] w-[24rem] rounded-full bg-brass/15 blur-[90px]" />
    </div>
  );
}
