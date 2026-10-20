import {
  Attest,
  Band,
  BandHead,
  PageHeader,
} from "@/components/site/PageHeader";
import { pageByHref } from "@/config/site.config";
import { createPageSeo } from "@/utils/metadata";

const page = pageByHref("/gradlly-ams");

export const metadata = createPageSeo({
  title: "Gradlly AMS",
  description:
    "Apprenticeship management from enrolment to end-point assessment. Every review, hour and outcome recorded as it happens.",
  path: "/gradlly-ams",
});

/** content-v1.md §5, verbatim. */
const HANDLES = [
  "Enrolment and onboarding",
  "Off-the-job training records",
  "Progress reviews signed off by learner and employer",
  "Gateway Readiness Score for every apprentice approaching assessment",
  "ILR and funding compliance in one place",
  "Levy transfer: employers with unspent levy matched with SMEs that need funded apprenticeships",
];

const PORTALS = [
  {
    number: "i",
    name: "Provider portal",
    detail:
      "Delivery, funding compliance and ILR, with readiness scores across every cohort.",
  },
  {
    number: "ii",
    name: "Employer portal",
    detail: "Levy spend, apprentice progress and review sign-off in one view.",
  },
  {
    number: "iii",
    name: "Apprentice portal",
    detail:
      "An ePortfolio for logging hours, building KSB evidence and tracking progress to assessment.",
  },
  {
    number: "iv",
    name: "Gradlly Forge",
    detail:
      "The SME marketplace. Levy donors and SMEs matched, and transfers managed from pledge to funded start.",
  },
];

export default function GradllyAmsPage() {
  return (
    <>
      <PageHeader {...page}>
        <p className="measure text-body text-slate">
          Apprenticeship management from enrolment to end-point assessment.
          Every review, hour and outcome is recorded as it happens, so you go
          into audit with the evidence already in order.
        </p>
      </PageHeader>

      <Band id="what-it-handles">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <div className="h-0.5 w-12 bg-brass" aria-hidden />
            <h2
              id="what-it-handles-heading"
              className="wide mt-5 max-w-[14ch] text-display text-navy"
            >
              What it handles.
            </h2>
            <p className="measure mt-6 text-body text-slate">
              One place for delivery and funding compliance, so the evidence is
              built as the apprenticeship happens rather than rebuilt before an
              audit.
            </p>
          </div>

          <ol className="list-none">
            {HANDLES.map((item, index) => (
              <li
                key={item}
                className="flex items-baseline gap-5 border-t border-rule py-5 last:border-b"
              >
                <span className="text-ref text-brass-ink" aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-body text-navy">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </Band>

      <Band id="portals" tone="paper">
        <BandHead
          id="portals-heading"
          note="Each one is a place somebody signs in to do their part of the same apprenticeship."
        >
          Four portals.
        </BandHead>

        <ul className="mt-12 grid list-none gap-x-10 gap-y-8 md:mt-16 md:grid-cols-2 xl:grid-cols-4">
          {PORTALS.map(({ number, name, detail }) => (
            <li key={name}>
              <p className="mb-2 text-ref text-brass-ink">{number}</p>
              <Attest claim={name} mark="brass">
                {detail}
              </Attest>
            </li>
          ))}
        </ul>
      </Band>

      <Band tone="navy">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <p className="text-lead text-white/80">
            Next: what the apprentice walks away with.
          </p>
          <a
            href="/apprenticeship-passport"
            className="border border-white/40 px-6 py-3.5 text-small font-semibold text-white transition-colors duration-[140ms] ease-out hover:border-white"
          >
            04 Apprenticeship Passport
          </a>
        </div>
      </Band>
    </>
  );
}
