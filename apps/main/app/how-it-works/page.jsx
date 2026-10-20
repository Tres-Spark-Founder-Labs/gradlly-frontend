import { Band, PageHeader } from "@/components/site/PageHeader";
import { pageByHref } from "@/config/site.config";
import { createPageSeo } from "@/utils/metadata";

const page = pageByHref("/how-it-works");

export const metadata = createPageSeo({
  title: "How it works",
  description:
    "Two products, two flows. How Continuo verifies and shares skills, and how Gradlly AMS runs an apprenticeship from enrolment to Passport.",
  path: "/how-it-works",
});

/** content-v1.md §7, verbatim. */
const CONTINUO = [
  {
    step: "Verify skills and checks",
    detail:
      "Skills are confirmed by the trainer, assessor or employer who saw them. Identity, right to work and DBS are checked at source, with the worker's consent.",
  },
  {
    step: "Share",
    detail:
      "The worker sends one link to an employer or agency, full or partial, time-limited or revocable.",
  },
  {
    step: "Onboard",
    detail:
      "The employer deploys the worker on verified skills instead of retesting and repeating checks.",
  },
  {
    step: "Stay current",
    detail:
      "New skills, renewals, live checks and quarterly sign-offs keep the record true at every job after.",
  },
];

const AMS = [
  {
    step: "Enrol",
    detail:
      "The provider enrols the apprentice and the employer in AMS, with funding and ILR in one place.",
  },
  {
    step: "Deliver",
    detail:
      "Off-the-job hours, reviews and KSB evidence are logged as they happen.",
  },
  {
    step: "Reach gateway",
    detail:
      "A Gateway Readiness Score shows who is ready for end-point assessment.",
  },
  {
    step: "Complete with a Passport",
    detail:
      "The apprentice leaves with a verified Passport of what they achieved.",
  },
];

/**
 * The only numbered content on the site.
 *
 * Numbered markers are the commonest piece of generated-page furniture and are
 * right in one situation: when the content is a sequence. These two lists are,
 * and nothing else in content-v1.md is.
 *
 * Set as two ruled columns rather than cards, so step three of one flow sits
 * beside step three of the other and the two can be read against each other.
 */
function Flow({ title, steps, mark, label }) {
  const rule = mark === "teal" ? "border-teal" : "border-brass";
  const ink = mark === "teal" ? "text-teal" : "text-brass-ink";

  return (
    <div>
      <p className={`text-ref ${ink}`}>{label}</p>
      <h2
        className={`wide mt-2 border-t-2 pt-5 text-section text-navy ${rule}`}
      >
        {title}
      </h2>
      <ol className="mt-2 list-none">
        {steps.map(({ step, detail }, index) => (
          <li key={step} className="border-b border-rule py-6">
            <div className="flex items-baseline gap-5">
              <span className={`text-ref ${ink}`} aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="wide-md text-subhead text-navy">{step}</p>
                <p className="mt-2 text-small text-slate">{detail}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader {...page}>
        <p className="measure text-body text-slate">
          Continuo verifies what a worker can do and keeps it true. Gradlly AMS
          runs an apprenticeship and hands the apprentice a Passport at the end
          of it. Neither needs the other.
        </p>
      </PageHeader>

      <Band id="flows">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Flow
            title="How Continuo works"
            steps={CONTINUO}
            mark="teal"
            label="02 / Continuo"
          />
          <Flow
            title="How AMS works"
            steps={AMS}
            mark="brass"
            label="03 / Gradlly AMS"
          />
        </div>
      </Band>

      {/* The one place the two colours meet, because the claim is the handoff
          between them. */}
      <Band id="better-together" tone="paper">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <p className="flex items-center gap-2" aria-hidden>
              <span className="block h-1 w-8 bg-teal" />
              <span className="block h-1 w-8 bg-brass" />
            </p>
            <h2
              id="better-together-heading"
              className="wide mt-5 max-w-[12ch] text-display text-navy"
            >
              Better together.
            </h2>
          </div>
          <p className="measure self-end text-body text-slate">
            When an apprentice finishes, they can carry their Passport&rsquo;s
            verified achievements into Continuo, with their consent. Their first
            employer onboards from proof on day one.
          </p>
        </div>
      </Band>

      <Band tone="navy">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <p className="text-lead text-white/80">Next: who each part is for.</p>
          <a
            href="/who-its-for"
            className="border border-white/40 px-6 py-3.5 text-small font-semibold text-white transition-colors duration-[140ms] ease-out hover:border-white"
          >
            06 Who it&rsquo;s for
          </a>
        </div>
      </Band>
    </>
  );
}
