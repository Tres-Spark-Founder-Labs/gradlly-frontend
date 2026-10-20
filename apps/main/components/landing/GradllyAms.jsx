import { Section, SectionHead } from "./Section";

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
    name: "Provider portal",
    detail:
      "Delivery, funding compliance and ILR, with readiness scores across every cohort.",
  },
  {
    name: "Employer portal",
    detail: "Levy spend, apprentice progress and review sign-off in one view.",
  },
  {
    name: "Apprentice portal",
    detail:
      "An ePortfolio for logging hours, building KSB evidence and tracking progress to assessment.",
  },
  {
    name: "Gradlly Forge",
    detail:
      "The SME marketplace. Levy donors and SMEs matched, and transfers managed from pledge to funded start.",
  },
];

export function GradllyAms() {
  return (
    <Section id="gradlly-ams" tone="brass" labelledBy="gradlly-ams-heading">
      <SectionHead
        id="gradlly-ams-heading"
        tone="brass"
        note="For training providers and employers"
      >
        Gradlly AMS runs the apprenticeship, with the evidence built in.
      </SectionHead>

      <p className="measure mt-6 text-body text-slate">
        Apprenticeship management from enrolment to end-point assessment. Every
        review, hour and outcome is recorded as it happens, so you go into audit
        with the evidence already in order.
      </p>

      <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
        {/* A ruled list, because this is one list of six things rather than six
            objects. The rules do the separating that six cards would. */}
        <div>
          <h3 className="font-display text-subhead font-medium text-navy">
            What it handles
          </h3>
          <ul className="mt-5 list-none">
            {HANDLES.map((item) => (
              <li
                key={item}
                className="border-b border-rule py-3 text-small text-slate first:border-t"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Cards: four portals really are four products you log into. */}
        <div>
          <h3 className="font-display text-subhead font-medium text-navy">
            Four portals
          </h3>
          <ul className="mt-5 grid list-none gap-4 sm:grid-cols-2">
            {PORTALS.map(({ name, detail }) => (
              <li
                key={name}
                className="rounded-card border border-l-2 border-rule border-l-brass bg-white p-5 transition-[border-left-width] duration-[120ms] ease-out hover:border-l-[3px]"
              >
                <p className="text-small font-semibold text-navy">{name}</p>
                <p className="mt-2 text-small text-slate">{detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/*
        The link to the Gradlly AMS page, which is the previous site kept at
        its own route. Placed at the end of the section that describes the
        product, which is where a reader who wants more of it will be.
      */}
      <p className="mt-10 text-small">
        <a
          href="/gradlly-ams"
          className="font-semibold text-brass-ink underline decoration-brass/40 decoration-2 underline-offset-4 transition-colors duration-[120ms] ease-out hover:decoration-brass"
        >
          See the Gradlly AMS platform in detail
        </a>
      </p>
    </Section>
  );
}
