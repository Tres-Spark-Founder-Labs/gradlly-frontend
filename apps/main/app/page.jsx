import { PageHeader } from "@/components/site/PageHeader";
import {
  Attestation,
  Band,
  BandHead,
  Button,
  DarkCta,
  SpecList,
  TextLink,
} from "@/components/site/ui";
import { pageByHref } from "@/config/site.config";

const page = pageByHref("/");

/** content-v1.md §2, the two product cards. */
const PRODUCTS = [
  {
    number: "02",
    href: "/continuo",
    name: "Continuo",
    summary: "Verified skills for the workforce",
    audience: "Employers and agencies in regulated work",
    mark: "teal",
    points: [
      {
        claim: "Verified skills",
        by: "Confirmed by whoever assessed or observed them",
      },
      {
        claim: "Identity, right to work and DBS",
        by: "Verified at source, live between jobs",
      },
      {
        claim: "Competence sign-off",
        by: "Confirmed by the manager each quarter",
      },
    ],
  },
  {
    number: "03",
    href: "/gradlly-ams",
    name: "Gradlly AMS",
    summary: "With the Apprenticeship Passport",
    audience: "Training providers and employers",
    mark: "brass",
    points: [
      {
        claim: "Enrolment to end-point assessment",
        by: "One place for delivery and funding compliance",
      },
      {
        claim: "Evidence built as delivery happens",
        by: "Audit-ready without rebuilding by hand",
      },
      {
        claim: "A verified Passport for every apprentice",
        by: "KSBs, hours and EPA result they keep",
      },
    ],
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

const MARK_INK = { teal: "text-teal", brass: "text-brass-ink" };

export default function OverviewPage() {
  return (
    <>
      {/*
        The right column of the header. Not decoration: it is the two products
        named, marked and linked, which is the one thing a first-time reader
        needs before anything else on the site makes sense. It also stops the
        header being a single sentence floating in two thirds of empty width.
      */}
      <PageHeader
        {...page}
        aside={
          <div className="rounded-md border border-mist">
            <p className="border-b border-mist px-6 py-4 font-mono text-ref text-steel">
              Two products
            </p>
            {PRODUCTS.map(({ number, href, name, summary, mark }) => (
              <a
                key={name}
                href={href}
                className="flex items-start gap-4 border-b border-mist px-6 py-5 transition-colors duration-[140ms] ease-out last:border-b-0 hover:bg-fog"
              >
                <span
                  className="mark mt-1 h-10"
                  style={{
                    "--mark":
                      mark === "teal"
                        ? "var(--color-teal)"
                        : "var(--color-brass)",
                  }}
                  aria-hidden
                />
                <span className="flex-1">
                  <span className="block text-heading-sm font-semibold text-navy">
                    {name}
                  </span>
                  <span className="mt-1 block text-body-sm text-graphite">
                    {summary}
                  </span>
                </span>
                <span className="mt-1 font-mono text-ref text-steel">
                  {number}
                </span>
              </a>
            ))}
          </div>
        }
      >
        <p className="measure text-body text-graphite">
          Gradlly builds two products for the UK workforce.{" "}
          <strong className="font-semibold text-navy">Continuo</strong> gives
          every worker verified skills and checks, and keeps them verified at
          every job.{" "}
          <strong className="font-semibold text-navy">Gradlly AMS</strong> runs
          apprenticeships, with a verified Passport for every apprentice. Use
          either on its own, or both together.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/book-a-demo">Book a demo</Button>
          <Button href="/how-it-works" variant="outline">
            See how it works
          </Button>
        </div>
      </PageHeader>

      {/*
        Two products as two records, each with its reference number and its own
        page. Not two coloured panels side by side: that reads as a pricing
        comparison, which content-v1.md is explicit they are not.
      */}
      <Band id="products">
        <BandHead
          id="products-heading"
          note="Two products. Each works on its own, and they work together when apprentices move into work."
        >
          Two products, and the line between them.
        </BandHead>

        <div className="mt-12 md:mt-16">
          {PRODUCTS.map(
            ({ number, href, name, summary, audience, mark, points }) => (
              <article
                key={name}
                className="grid gap-8 border-t border-mist py-10 last:border-b md:py-14 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16"
              >
                <div>
                  <p className="flex items-center gap-2.5 text-caption text-steel">
                    <span
                      className="mark h-3"
                      style={{
                        "--mark":
                          mark === "teal"
                            ? "var(--color-teal)"
                            : "var(--color-brass)",
                      }}
                      aria-hidden
                    />
                    <span className="font-mono text-ref">{number}</span>{" "}
                    <span className="text-mist">/</span> {audience}
                  </p>
                  <h3 className="mt-4 text-heading-lg font-semibold text-navy">
                    {name}
                  </h3>
                  <p className="mt-2 text-lead text-graphite">{summary}</p>
                  <p className="mt-6">
                    <a
                      href={href}
                      className={`text-body-sm font-semibold ${MARK_INK[mark]} underline decoration-1 underline-offset-[3px] transition-colors duration-[140ms] ease-out hover:text-navy`}
                    >
                      Read {name}
                    </a>
                  </p>
                </div>

                <ul className="list-none space-y-8">
                  {points.map(({ claim, by }) => (
                    <li key={claim}>
                      <Attestation claim={claim} by={by} mark={mark} />
                    </li>
                  ))}
                </ul>
              </article>
            ),
          )}
        </div>
      </Band>

      <Band id="the-problem" tone="fog">
        <BandHead id="the-problem-heading">
          Proof gets rebuilt at every step. It shouldn&rsquo;t.
        </BandHead>

        <div className="mt-12 md:mt-16">
          <SpecList items={PROBLEMS} />
        </div>

        <p className="mt-10">
          <TextLink href="/how-it-works">
            See how Gradlly answers each of the three
          </TextLink>
        </p>
      </Band>

      <DarkCta
        heading="See it with your own programme."
        action={
          <Button href="/book-a-demo" variant="inverse">
            Book a demo
          </Button>
        }
      >
        Whether you hire into regulated roles or run apprenticeships,
        we&rsquo;ll walk you through the parts of Gradlly that matter to you.
      </DarkCta>
    </>
  );
}
