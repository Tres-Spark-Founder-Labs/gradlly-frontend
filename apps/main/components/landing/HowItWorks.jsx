import { Section, SectionHead } from "./Section";

/** content-v1.md §7, verbatim. */
const CONTINUO = [
  {
    step: "Verify skills and checks.",
    detail:
      "Skills are confirmed by the trainer, assessor or employer who saw them. Identity, right to work and DBS are checked at source, with the worker's consent.",
  },
  {
    step: "Share.",
    detail:
      "The worker sends one link to an employer or agency, full or partial, time-limited or revocable.",
  },
  {
    step: "Onboard.",
    detail:
      "The employer deploys the worker on verified skills instead of retesting and repeating checks.",
  },
  {
    step: "Stay current.",
    detail:
      "New skills, renewals, live checks and quarterly sign-offs keep the record true at every job after.",
  },
];

const AMS = [
  {
    step: "Enrol.",
    detail:
      "The provider enrols the apprentice and the employer in AMS, with funding and ILR in one place.",
  },
  {
    step: "Deliver.",
    detail:
      "Off-the-job hours, reviews and KSB evidence are logged as they happen.",
  },
  {
    step: "Reach gateway.",
    detail:
      "A Gateway Readiness Score shows who is ready for end-point assessment.",
  },
  {
    step: "Complete with a Passport.",
    detail:
      "The apprentice leaves with a verified Passport of what they achieved.",
  },
];

/**
 * The only numbered content on the page.
 *
 * Numbered markers are the commonest piece of generated-page furniture and are
 * right in exactly one situation: when the content is a sequence. These two
 * lists are, and nothing else in content-v1.md is, so this is the only place
 * they appear.
 */
function Flow({ title, steps, tone }) {
  const marker = tone === "teal" ? "bg-teal" : "bg-brass";
  const rule = tone === "teal" ? "border-teal" : "border-brass";

  return (
    <div>
      <h3
        className={`border-t-2 pb-5 pt-5 font-display text-subhead font-medium text-navy ${rule}`}
      >
        {title}
      </h3>
      <ol className="list-none space-y-6">
        {steps.map(({ step, detail }, index) => (
          <li key={step} className="flex gap-4">
            <span
              className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-meta font-semibold text-white ${marker}`}
              aria-hidden
            >
              {index + 1}
            </span>
            <div>
              <p className="text-small font-semibold text-navy">{step}</p>
              <p className="mt-1 text-small text-slate">{detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function HowItWorks() {
  return (
    <Section id="how-it-works" labelledBy="how-it-works-heading">
      <SectionHead id="how-it-works-heading">How it works</SectionHead>

      <p className="measure mt-6 text-body text-slate">
        Two products, two flows. Each works on its own.
      </p>

      <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-2 md:gap-10">
        <Flow title="How Continuo works" steps={CONTINUO} tone="teal" />
        <Flow title="How AMS works" steps={AMS} tone="brass" />
      </div>

      {/* The one place the two colours meet in body copy, so the rule carries
          both: the claim is literally about the handoff between them. */}
      <div className="mt-14 border-t-2 border-navy pt-5 md:mt-20">
        <h3 className="font-display text-subhead font-medium text-navy">
          Better together
        </h3>
        <p className="measure mt-3 text-small text-slate">
          When an apprentice finishes, they can carry their Passport&rsquo;s
          verified achievements into Continuo, with their consent. Their first
          employer onboards from proof on day one.
        </p>
      </div>
    </Section>
  );
}
