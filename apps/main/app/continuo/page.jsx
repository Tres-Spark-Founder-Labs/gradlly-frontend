import { PageHeader } from "@/components/site/PageHeader";
import { Attestation, Band, BandHead } from "@/components/site/ui";
import { pageByHref } from "@/config/site.config";
import { createPageSeo } from "@/utils/metadata";

const page = pageByHref("/continuo");

export const metadata = createPageSeo({
  title: "Continuo",
  description:
    "Continuo proves what a worker can do, backed by the checks that show they're cleared to do it, and keeps that proof true between jobs.",
  path: "/continuo",
});

/** content-v1.md §4, verbatim. */
const CORE = [
  "Each skill confirmed by whoever assessed or observed it, with the date and evidence attached",
  "Described against recognised occupational standards, so any employer can read them",
  "New skills confirmed in every role, so the record grows with the worker's career",
  "Shared by the worker with one link, so the next employer deploys them from day one",
];

const GROUPS = [
  {
    number: "i",
    title: "Verified checks",
    points: [
      "Identity, right to work, DBS, qualifications and site cards, captured at source",
      "Nothing added without the worker's consent",
      "Every employer adds conduct, attendance and performance confirmations alongside skills",
    ],
  },
  {
    number: "ii",
    title: "A compliance evidence engine",
    points: [
      "Proof organised by each regulated obligation, not buried in folders",
      "Gaps and upcoming lapses flagged before they become breaches",
      "Evidence packs for any regulator, funder or client audit, on demand",
    ],
  },
  {
    number: "iii",
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

export default function ContinuoPage() {
  return (
    <>
      <PageHeader {...page}>
        <p className="measure text-body text-graphite">
          Continuo proves what a worker can do, backed by the checks that show
          they&rsquo;re cleared to do it, and keeps that proof true between
          jobs, not just at the moment of hire. The record belongs to the
          worker, and it&rsquo;s free for them, always.
        </p>
      </PageHeader>

      {/* The claim the product rests on, set as the largest thing on the page
          after the title. No panel: the statement carries itself. */}
      <Band id="core">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <div className="h-0.5 w-12 bg-teal" aria-hidden />
            <h2
              id="core-heading"
              className="font-semibold mt-5 max-w-[14ch] text-display text-navy"
            >
              Verified skills, not claimed ones.
            </h2>
            <p className="measure mt-6 text-body text-graphite">
              Every skill on a Continuo record is confirmed by the trainer,
              assessor or employer who saw it, with the date and the evidence.
              Employers hire and deploy on what workers can actually do, not on
              what a CV says.
            </p>
          </div>

          <ul className="list-none">
            {CORE.map((point) => (
              <li
                key={point}
                className="border-t border-mist py-5 text-body text-navy last:border-b"
              >
                {point}
              </li>
            ))}
          </ul>
        </div>
      </Band>

      {/* Three ruled groups, numbered in lowercase roman so they read as parts
          of one explanation rather than as a ranked list. */}
      <Band id="what-it-does" tone="fog">
        <BandHead id="what-it-does-heading">What the record carries.</BandHead>

        <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-3 md:gap-10">
          {GROUPS.map(({ number, title, points }) => (
            <div key={title}>
              <p className="text-ref text-teal">{number}</p>
              <h3 className="font-semibold mt-2 text-heading-sm text-navy">
                {title}
              </h3>
              <ul className="mt-5 list-none">
                {points.map((point) => (
                  <li
                    key={point}
                    className="border-t border-mist py-3.5 text-body-sm text-graphite"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Band>

      <Band id="four-ways">
        <BandHead id="four-ways-heading">
          Four ways to work with Continuo.
        </BandHead>

        <ul className="mt-12 grid list-none gap-x-10 gap-y-8 md:mt-16 md:grid-cols-2 xl:grid-cols-4">
          {WAYS.map(({ name, detail }) => (
            <li key={name}>
              <Attestation claim={name} mark="teal">
                {detail}
              </Attestation>
            </li>
          ))}
        </ul>
      </Band>

      <Band tone="navy">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <p className="text-lead text-paper/75">
            Next: how the apprenticeship side works.
          </p>
          <a
            href="/gradlly-ams"
            className="border border-white/40 px-6 py-3.5 text-body-sm font-semibold text-paper transition-colors duration-[140ms] ease-out hover:border-white"
          >
            03 Gradlly AMS
          </a>
        </div>
      </Band>
    </>
  );
}
