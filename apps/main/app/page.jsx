import { DemoForm } from "@/components/site/DemoForm";
import {
  CohortMock,
  PassportMock,
  RecordMock,
  Wash,
} from "@/components/site/Mocks";
import {
  Band,
  BandHead,
  Button,
  SpecList,
  TextLink,
} from "@/components/site/ui";

/**
 * One page, carrying content-v1.md sections 2 to 9.
 *
 * Gradlly AMS is the exception: §5 lives at /gradlly-ams, which is the original
 * approved design, so the nav item and the Passport section link out to it
 * rather than repeating it here.
 */

/** content-v1.md §2, the two product cards. */
const PRODUCTS = [
  {
    href: "/#continuo",
    name: "Continuo",
    summary: "Verified skills for the workforce",
    audience: "Employers and agencies",
    mark: "teal",
  },
  {
    href: "/gradlly-ams",
    name: "Gradlly AMS",
    summary: "With the Apprenticeship Passport",
    audience: "Training providers",
    mark: "brass",
  },
];

/** content-v1.md §3, verbatim. */
const PROBLEMS = [
  {
    claim: "Skills and checks are proved again at every job.",
    detail:
      "Employers can't trust what a worker says they can do, so skills are retested and DBS, right to work and qualifications checked again, even when they're still valid.",
  },
  {
    claim: "Evidence is pieced together before every audit.",
    detail:
      "Enrolment, off-the-job hours, reviews and assessment sit in separate tools, so provider teams rebuild the evidence by hand.",
  },
  {
    claim: "Apprentices finish with nothing they can carry.",
    detail:
      "What an apprentice achieved lives in the provider's system. Their next employer can't see it or trust it without starting again.",
  },
];

/** content-v1.md §4. */
const CONTINUO_CORE = [
  "Each skill confirmed by whoever assessed or observed it, with the date and evidence attached",
  "Described against recognised occupational standards, so any employer can read them",
  "New skills confirmed in every role, so the record grows with the worker's career",
  "Shared by the worker with one link, so the next employer deploys them from day one",
];

const CONTINUO_GROUPS = [
  {
    title: "Verified checks",
    points: [
      "Identity, right to work, DBS, qualifications and site cards, captured at source",
      "Nothing added without the worker's consent",
      "Conduct, attendance and performance confirmations alongside skills",
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
      "Quarterly sign-off, done by a manager in minutes on a phone",
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
      "A managed service for large employers and agencies. We verify and return a verified record.",
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

/** content-v1.md §6. */
const PASSPORT_POINTS = [
  "KSBs, off-the-job hours and the EPA result, each showing who confirmed it and when",
  "Created by AMS during delivery, so there's nothing extra for providers to do",
  "Shared by the apprentice with one link: full or partial, time-limited or revocable",
  "Kept after completion, and can be carried into Continuo when they move into work",
];

/** content-v1.md §7. */
const CONTINUO_FLOW = [
  {
    claim: "Verify skills and checks",
    detail:
      "Skills are confirmed by the trainer, assessor or employer who saw them. Identity, right to work and DBS are checked at source, with the worker's consent.",
  },
  {
    claim: "Share",
    detail:
      "The worker sends one link to an employer or agency, full or partial, time-limited or revocable.",
  },
  {
    claim: "Onboard",
    detail:
      "The employer deploys the worker on verified skills instead of retesting and repeating checks.",
  },
  {
    claim: "Stay current",
    detail:
      "New skills, renewals, live checks and quarterly sign-offs keep the record true at every job after.",
  },
];

const AMS_FLOW = [
  {
    claim: "Enrol",
    detail:
      "The provider enrols the apprentice and the employer in AMS, with funding and ILR in one place.",
  },
  {
    claim: "Deliver",
    detail:
      "Off-the-job hours, reviews and KSB evidence are logged as they happen.",
  },
  {
    claim: "Reach gateway",
    detail:
      "A Gateway Readiness Score shows who is ready for end-point assessment.",
  },
  {
    claim: "Complete with a Passport",
    detail:
      "The apprentice leaves with a verified Passport of what they achieved.",
  },
];

/** content-v1.md §8. */
const AUDIENCES = [
  {
    who: "Employers and agencies in regulated work",
    detail:
      "Hire and deploy on verified skills, onboard without repeating checks, and be audit-ready every day.",
    products: ["Continuo"],
  },
  {
    who: "Training providers",
    detail:
      "Run delivery and compliance in one place, and send learners out with proof employers trust.",
    products: ["Gradlly AMS"],
  },
  {
    who: "Levy-paying employers and SMEs",
    detail:
      "See every apprentice's progress, sign off reviews, and put unspent levy to work.",
    products: ["Gradlly AMS"],
  },
  {
    who: "Apprentices and workers",
    detail:
      "A free, verified record of your skills and checks that you own and share on your terms.",
    products: ["Passport", "Continuo"],
  },
];

const MARK_VAR = { teal: "var(--color-teal)", brass: "var(--color-brass)" };
const BAR = {
  Continuo: "bg-teal",
  "Gradlly AMS": "bg-brass",
  Passport: "bg-brass",
};
const INK = {
  Continuo: "text-teal",
  "Gradlly AMS": "text-brass-ink",
  Passport: "text-brass-ink",
};

export default function HomePage() {
  return (
    <>
      {/* ── Hero, §2 ─────────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden border-b border-mist px-5 pb-16 pt-12 md:px-8 md:pb-24 md:pt-16 lg:px-12">
        <Wash />
        <div className="mx-auto max-w-[1320px]">
          <p
            className="enter flex items-center gap-2.5 text-caption text-steel"
            style={{ "--enter-delay": "0ms" }}
          >
            <span
              className="mark h-3"
              style={{ "--mark": "var(--color-teal)" }}
              aria-hidden
            />
            Verified skills and apprenticeships, for UK regulated work
          </p>

          <div className="mt-7 grid gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-16">
            <div>
              <h1
                className="enter max-w-[14ch] text-display font-semibold text-navy"
                style={{ "--enter-delay": "90ms" }}
              >
                From trained to trusted.
              </h1>
              <p
                className="enter measure mt-6 text-lead text-graphite"
                style={{ "--enter-delay": "180ms" }}
              >
                Skills you can prove. Workers you can trust.
              </p>
              <p
                className="enter measure mt-5 text-body text-graphite"
                style={{ "--enter-delay": "230ms" }}
              >
                Gradlly builds two products for the UK workforce.{" "}
                <strong className="font-semibold text-navy">Continuo</strong>{" "}
                gives every worker verified skills and checks, and keeps them
                verified at every job.{" "}
                <strong className="font-semibold text-navy">Gradlly AMS</strong>{" "}
                runs apprenticeships, with a verified Passport for every
                apprentice. Use either on its own, or both together.
              </p>

              <div
                className="enter mt-9 flex flex-col gap-3 sm:flex-row"
                style={{ "--enter-delay": "300ms" }}
              >
                <Button href="/#book-a-demo">Book a demo</Button>
                <Button href="/#how-it-works" variant="outline">
                  See how it works
                </Button>
              </div>

              <p
                className="enter mt-10 text-caption text-steel"
                style={{ "--enter-delay": "340ms" }}
              >
                Two products. Each works on its own.
              </p>
              <ul
                className="enter mt-3 grid list-none gap-3 sm:grid-cols-2"
                style={{ "--enter-delay": "360ms" }}
              >
                {PRODUCTS.map(({ href, name, summary, audience, mark }) => (
                  <li key={name}>
                    <a href={href} className="tile block p-5">
                      <span className="flex items-start gap-3">
                        <span
                          className="mark h-9"
                          style={{ "--mark": MARK_VAR[mark] }}
                          aria-hidden
                        />
                        <span>
                          <span className="block text-heading-sm font-semibold text-navy">
                            {name}
                          </span>
                          <span className="mt-0.5 block text-body-sm text-graphite">
                            {summary}
                          </span>
                          <span className="mt-2 block text-caption text-steel">
                            {audience}
                          </span>
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* The mockups. No figures in them, by design: see Mocks.jsx. */}
            <div
              className="enter grid gap-4 self-start"
              style={{ "--enter-delay": "420ms" }}
            >
              <RecordMock />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <CohortMock />
                <PassportMock />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── The problem, §3 ──────────────────────────────────────────────── */}
      <Band id="the-problem" tone="fog">
        <BandHead
          id="the-problem-heading"
          note="Continuo and Gradlly AMS answer one of these each, and the third between them."
        >
          Proof gets rebuilt at every step. It shouldn&rsquo;t.
        </BandHead>
        <div className="mt-12 md:mt-16">
          <SpecList items={PROBLEMS} />
        </div>
      </Band>

      {/* ── Continuo, §4, as a bento ─────────────────────────────────────── */}
      <section
        id="continuo"
        className="relative overflow-hidden px-5 py-14 md:px-8 md:py-20 lg:px-12 lg:py-24"
      >
        <Wash />
        <div className="mx-auto max-w-[1320px]">
          <BandHead
            id="continuo-heading"
            eyebrow="For employers and agencies in regulated work"
            mark="teal"
            note="Continuo proves what a worker can do, backed by the checks that show they're cleared to do it, and keeps that proof true between jobs, not just at the moment of hire. The record belongs to the worker, and it's free for them, always."
          >
            Continuo. Verified skills for the workforce.
          </BandHead>

          <div className="mt-12 grid gap-4 md:mt-16 lg:grid-cols-3">
            {/* The claim the product rests on takes the wide, dark tile. */}
            <div className="tile tile-dark p-7 md:p-9 lg:col-span-2">
              <h3 className="max-w-[18ch] text-heading font-semibold text-paper">
                Verified skills, not claimed ones.
              </h3>
              <p className="measure mt-5 text-body text-paper/75">
                Every skill on a Continuo record is confirmed by the trainer,
                assessor or employer who saw it, with the date and the evidence.
                Employers hire and deploy on what workers can actually do, not
                on what a CV says.
              </p>
              <ul className="mt-7 grid list-none gap-x-10 sm:grid-cols-2">
                {CONTINUO_CORE.map((point) => (
                  <li
                    key={point}
                    className="border-t border-paper/15 py-3 text-body-sm text-paper/85"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="tile p-7">
              <h3 className="text-heading-sm font-semibold text-navy">
                Four ways to work with Continuo
              </h3>
              <ul className="mt-4 list-none">
                {WAYS.map(({ name, detail }) => (
                  <li key={name} className="border-t border-mist/70 py-3">
                    <p className="text-body-sm font-semibold text-navy">
                      {name}
                    </p>
                    <p className="mt-1 text-caption text-graphite">{detail}</p>
                  </li>
                ))}
              </ul>
            </div>

            {CONTINUO_GROUPS.map(({ title, points }) => (
              <div key={title} className="tile p-7">
                <span
                  className="mark mb-5 h-3"
                  style={{ "--mark": "var(--color-teal)" }}
                  aria-hidden
                />
                <h3 className="text-heading-sm font-semibold text-navy">
                  {title}
                </h3>
                <ul className="mt-4 list-none">
                  {points.map((point) => (
                    <li
                      key={point}
                      className="border-t border-mist/70 py-3 text-body-sm text-graphite"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Passport, §6 ─────────────────────────────────────────────────── */}
      <Band id="passport" tone="fog">
        <BandHead
          id="passport-heading"
          eyebrow="Included with Gradlly AMS"
          mark="brass"
          note="Every apprentice leaves with a verified record of what they achieved. It's built automatically as they train, owned by them, and free for them."
        >
          The Apprenticeship Passport. What the apprentice keeps.
        </BandHead>

        <div className="mt-12 grid gap-4 md:mt-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div className="tile p-7 md:p-9">
            <ul className="list-none">
              {PASSPORT_POINTS.map((point) => (
                <li
                  key={point}
                  className="flex gap-3.5 border-t border-mist/70 py-4 first:border-t-0 first:pt-0"
                >
                  <span
                    className="mark mt-1 h-4"
                    style={{ "--mark": "var(--color-brass)" }}
                    aria-hidden
                  />
                  <span className="text-body text-navy">{point}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6">
              <TextLink href="/gradlly-ams">
                See the Gradlly AMS platform
              </TextLink>
            </p>
          </div>
          <PassportMock className="self-start" />
        </div>
      </Band>

      {/* ── How it works, §7 ─────────────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="relative overflow-hidden px-5 py-14 md:px-8 md:py-20 lg:px-12 lg:py-24"
      >
        <Wash />
        <div className="mx-auto max-w-[1320px]">
          <BandHead
            id="how-it-works-heading"
            note="Two products, two flows. Each works on its own."
          >
            How it works
          </BandHead>

          <div className="mt-12 grid gap-4 md:mt-16 lg:grid-cols-2">
            <div className="tile p-7 md:p-9">
              <span
                className="mark mb-5 h-3"
                style={{ "--mark": "var(--color-teal)" }}
                aria-hidden
              />
              <h3 className="text-heading font-semibold text-navy">
                How Continuo works
              </h3>
              <div className="mt-5">
                <SpecList items={CONTINUO_FLOW} numbered mark="teal" />
              </div>
            </div>

            <div className="tile p-7 md:p-9">
              <span
                className="mark mb-5 h-3"
                style={{ "--mark": "var(--color-brass)" }}
                aria-hidden
              />
              <h3 className="text-heading font-semibold text-navy">
                How AMS works
              </h3>
              <div className="mt-5">
                <SpecList items={AMS_FLOW} numbered mark="brass" />
              </div>
            </div>

            <div className="tile tile-dark p-7 md:col-span-2 md:p-9">
              <div className="flex flex-wrap items-start gap-x-16 gap-y-5">
                <div>
                  <p className="flex items-center gap-2" aria-hidden>
                    <span className="block h-1 w-8 bg-teal" />
                    <span className="block h-1 w-8 bg-brass" />
                  </p>
                  <h3 className="mt-4 text-heading font-semibold text-paper">
                    Better together
                  </h3>
                </div>
                <p className="measure text-body text-paper/75">
                  When an apprentice finishes, they can carry their
                  Passport&rsquo;s verified achievements into Continuo, with
                  their consent. Their first employer onboards from proof on day
                  one.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Who it's for, §8 ─────────────────────────────────────────────── */}
      <Band id="who-its-for" tone="fog">
        <BandHead id="who-its-for-heading">
          Built for each side of the journey.
        </BandHead>

        <ul className="mt-12 grid list-none gap-4 md:mt-16 md:grid-cols-2">
          {AUDIENCES.map(({ who, detail, products }) => (
            <li key={who} className="tile p-7">
              <span className="flex gap-1" aria-hidden>
                {products.map((product) => (
                  <span
                    key={product}
                    className={`block h-1 w-8 ${BAR[product]}`}
                  />
                ))}
              </span>
              <h3 className="mt-5 text-heading-sm font-semibold text-navy">
                {who}
              </h3>
              <p className="mt-2.5 text-body-sm text-graphite">{detail}</p>
              <p className="mt-4 text-caption">
                {products.map((product, index) => (
                  <span key={product} className={INK[product]}>
                    {index > 0 ? ", " : ""}
                    {product}
                  </span>
                ))}
              </p>
            </li>
          ))}
        </ul>
      </Band>

      {/* ── Book a demo, §9 ──────────────────────────────────────────────── */}
      <section
        id="book-a-demo"
        className="relative overflow-hidden border-t border-mist px-5 py-14 md:px-8 md:py-20 lg:px-12 lg:py-24"
      >
        <Wash />
        <div className="mx-auto max-w-[1320px]">
          <BandHead
            id="book-a-demo-heading"
            note="Whether you hire into regulated roles or run apprenticeships, we'll walk you through the parts of Gradlly that matter to you."
          >
            See Gradlly with your own programme.
          </BandHead>

          <div className="mt-12 grid gap-4 md:mt-16 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
            <div className="tile p-7 md:p-9">
              <DemoForm />
            </div>

            <div className="tile p-7 md:p-9">
              <h3 className="text-heading-sm font-semibold text-navy">
                What a demo covers
              </h3>
              <ul className="mt-4 list-none">
                {[
                  [
                    "Continuo",
                    "How a skill is confirmed, what the worker's record looks like, and how an evidence pack comes out of it.",
                  ],
                  [
                    "Gradlly AMS",
                    "Enrolment through to gateway, with ILR and funding in the same place as delivery.",
                  ],
                  [
                    "The Passport",
                    "What an apprentice leaves with, and how it is shared.",
                  ],
                ].map(([name, detail]) => (
                  <li key={name} className="border-t border-mist/70 py-4">
                    <p className="text-body-sm font-semibold text-navy">
                      {name}
                    </p>
                    <p className="mt-1 text-caption text-graphite">{detail}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-body-sm text-graphite">
                Or email us at{" "}
                <span
                  className="font-semibold text-navy"
                  title="Placeholder. Recorded in docs/marketing/LAUNCH-CHECKLIST.md."
                >
                  [CONTACT EMAIL]
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
