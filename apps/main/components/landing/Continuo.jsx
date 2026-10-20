import { Section, SectionHead } from "./Section";

/** content-v1.md §4, verbatim. */
const CORE = [
  "Each skill confirmed by whoever assessed or observed it, with the date and evidence attached",
  "Described against recognised occupational standards, so any employer can read them",
  "New skills confirmed in every role, so the record grows with the worker's career",
  "Shared by the worker with one link, so the next employer deploys them from day one",
];

const GROUPS = [
  {
    title: "Verified checks",
    points: [
      "Identity, right to work, DBS, qualifications and site cards, captured at source",
      "Nothing added without the worker's consent",
      "Every employer adds conduct, attendance and performance confirmations alongside skills",
    ],
  },
  {
    title: "A compliance evidence engine",
    points: [
      "Proof organised by each regulated obligation, not buried in folders",
      "Gaps and upcoming lapses flagged before they become breaches",
      "Evidence packs for any regulator, funder or client audit, on demand",
    ],
  },
  {
    title: "Continuous, not one-off",
    points: [
      "Quarterly skills and competence sign-off, done by a manager in minutes on a phone",
      "A Health Score showing how fresh and complete each record is",
      "One view across bank, agency and multiple employers",
    ],
  },
];

const WAYS = [
  {
    name: "Self-serve platform",
    detail:
      "Employers verify skills, run checks and confirm records themselves.",
  },
  {
    name: "Verify Bureau",
    detail:
      "A managed service for large employers and agencies. We verify skills and checks and return a verified record.",
  },
  {
    name: "Trust Score",
    detail:
      "A worker's verified skills and compliance status, shared by the worker with hirers and platforms.",
  },
  {
    name: "Framework Licence",
    detail:
      "White-label skills and credential infrastructure for sector bodies to run their own schemes.",
  },
];

export function Continuo() {
  return (
    <Section id="continuo" tone="teal" labelledBy="continuo-heading">
      <SectionHead
        id="continuo-heading"
        tone="teal"
        note="For employers and agencies in regulated work"
      >
        Continuo. Verified skills for the workforce.
      </SectionHead>

      <p className="measure mt-6 text-body text-slate">
        Continuo proves what a worker can do, backed by the checks that show
        they&rsquo;re cleared to do it, and keeps that proof true between jobs,
        not just at the moment of hire. The record belongs to the worker, and
        it&rsquo;s free for them, always.
      </p>

      {/* The plate carries the claim the whole product rests on, so it is the
          one place in this section that is not quiet. White ink: teal is
          7.83:1 against it. */}
      <div className="on-plate mt-12 rounded-plate bg-teal p-7 md:mt-16 md:p-10">
        <h3 className="font-display text-plate text-white">
          Verified skills, not claimed ones
        </h3>
        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <p className="text-body text-white/90">
            Every skill on a Continuo record is confirmed by the trainer,
            assessor or employer who saw it, with the date and the evidence.
            Employers hire and deploy on what workers can actually do, not on
            what a CV says.
          </p>
          <ul className="list-none space-y-4">
            {CORE.map((point) => (
              <li
                key={point}
                className="border-t border-white/25 pt-3 text-small text-white/90"
              >
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Three ruled columns. Cards here would be the kit: the content is three
          parallel explanations, not three objects. */}
      <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-3 md:gap-8">
        {GROUPS.map(({ title, points }) => (
          <div key={title} className="border-t-2 border-teal pt-5">
            <h3 className="font-display text-subhead font-medium text-navy">
              {title}
            </h3>
            <ul className="mt-4 list-none space-y-3">
              {points.map((point) => (
                <li key={point} className="text-small text-slate">
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Cards, because these genuinely are four parallel objects: four ways to
          buy the same product. */}
      <h3 className="mt-16 font-display text-subhead font-medium text-navy md:mt-24">
        Four ways to work with Continuo
      </h3>
      <ul className="mt-6 grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {WAYS.map(({ name, detail }) => (
          <li
            key={name}
            className="rounded-card border border-l-2 border-rule border-l-teal bg-white p-5 transition-[border-left-width] duration-[120ms] ease-out hover:border-l-[3px]"
          >
            <p className="text-small font-semibold text-navy">{name}</p>
            <p className="mt-2 text-small text-slate">{detail}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
