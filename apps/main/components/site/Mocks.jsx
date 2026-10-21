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

/**
 * A table with its toolbar.
 *
 * Carbon's data-table guidance keeps search, filters, sort, view settings and
 * the primary action together above the data they control, rather than
 * scattered around the page, and this is what that looks like in Gradlly: the
 * compliance evidence view a registered manager works in.
 *
 * Still no figures. The columns are named, the rows are structured, and where a
 * value would sit there is a sand block.
 */
export function TableToolbarMock({ className = "" }) {
  const columns = ["Worker", "Obligation", "Confirmed by", "Status"];
  const statuses = ["olive", "olive", "terracotta", "olive"];

  return (
    <Frame label="Compliance evidence" className={className}>
      {/* The toolbar. Search, filter, sort and the action, in that order,
          because that is the order the work happens in. */}
      <div className="flex flex-wrap items-center gap-2 pb-4">
        <span className="flex h-8 flex-1 min-w-32 items-center gap-2 rounded-control border border-hairline px-3">
          <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden>
            <circle
              cx="5"
              cy="5"
              r="3.6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              className="text-ink-muted"
            />
            <path
              d="M8 8l3 3"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              className="text-ink-muted"
            />
          </svg>
          <Blank w="w-12" />
        </span>
        {["Filter", "Sort", "View"].map((control) => (
          <span
            key={control}
            className="flex h-8 items-center rounded-control border border-hairline px-3 text-caption text-ink-muted"
          >
            {control}
          </span>
        ))}
        <span className="flex h-8 items-center rounded-control bg-terracotta px-3 text-caption font-medium text-linen">
          Export pack
        </span>
      </div>

      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-y border-hairline">
            {columns.map((column) => (
              <th
                key={column}
                scope="col"
                className="py-2.5 pr-4 text-caption font-medium text-ink-muted last:pr-0"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {statuses.map((status, index) => (
            <tr
              key={index}
              className="border-b border-hairline last:border-b-0"
            >
              <td className="py-3 pr-4">
                <Blank w="w-20" />
              </td>
              <td className="py-3 pr-4">
                <Blank w="w-16" />
              </td>
              <td className="py-3 pr-4">
                <Blank w="w-14" />
              </td>
              <td className="py-3">
                <span
                  className="block h-1.5 w-8 rounded-full"
                  style={{
                    backgroundColor:
                      status === "terracotta"
                        ? "var(--color-terracotta)"
                        : "var(--color-olive)",
                  }}
                  aria-hidden
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Frame>
  );
}

/**
 * The states a screen actually has.
 *
 * Empty, loading, error and success, drawn as four small panels. Designing only
 * the populated screen is the commonest way a product ships something that
 * breaks the first time a cohort is empty or a DAS call times out, so the
 * product designs all four and the site says so.
 */
export function StatesMock({ className = "" }) {
  const states = [
    {
      name: "Empty",
      body: "No apprentices enrolled yet",
      action: "Enrol an apprentice",
      mark: "olive",
    },
    {
      name: "Loading",
      body: null,
      action: null,
      mark: "olive",
    },
    {
      name: "Error",
      body: "The DAS balance could not be fetched",
      action: "Try again",
      mark: "terracotta",
    },
    {
      name: "Confirmed",
      body: "Evidence pack ready to download",
      action: "Download",
      mark: "olive",
    },
  ];

  return (
    <div className={`grid gap-4 sm:grid-cols-2 ${className}`}>
      {states.map(({ name, body, action, mark }) => (
        <div
          key={name}
          className="rounded-card border border-hairline bg-linen p-5"
        >
          <p className="flex items-center gap-2.5 text-caption text-ink-muted">
            <span
              className="mark h-3"
              style={{
                "--mark":
                  mark === "terracotta"
                    ? "var(--color-terracotta)"
                    : "var(--color-olive)",
              }}
              aria-hidden
            />
            {name}
          </p>
          {body ? (
            <p className="mt-3 text-body-sm text-ink">{body}</p>
          ) : (
            <span className="mt-3 flex flex-col gap-2" aria-hidden>
              <Blank w="w-28" />
              <Blank w="w-20" />
            </span>
          )}
          {action ? (
            <p className="mt-4 text-caption text-ink-muted underline decoration-hairline underline-offset-4">
              {action}
            </p>
          ) : (
            <p className="mt-4 text-caption text-ink-muted">Fetching</p>
          )}
        </div>
      ))}
    </div>
  );
}
