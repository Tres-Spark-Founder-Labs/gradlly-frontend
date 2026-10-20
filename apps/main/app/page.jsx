import {
  Attest,
  Band,
  BandHead,
  PageHeader,
} from "@/components/site/PageHeader";
import { pageByHref } from "@/config/site.config";

const page = pageByHref("/");

/** content-v1.md §2, the two product cards, as two stacked records. */
const PRODUCTS = [
  {
    number: "02",
    href: "/continuo",
    name: "Continuo",
    summary: "Verified skills for the workforce",
    audience: "For employers and agencies",
    mark: "teal",
    points: [
      ["Verified skills.", "Confirmed by whoever assessed or observed them"],
      [
        "Identity, right to work and DBS.",
        "Verified at source, live between jobs",
      ],
      ["Competence sign-off.", "Confirmed by the manager each quarter"],
    ],
  },
  {
    number: "03",
    href: "/gradlly-ams",
    name: "Gradlly AMS",
    summary: "With the Apprenticeship Passport",
    audience: "For training providers",
    mark: "brass",
    points: [
      [
        "Enrolment to end-point assessment.",
        "One place for delivery and funding compliance",
      ],
      [
        "Evidence built as delivery happens.",
        "Audit-ready without rebuilding by hand",
      ],
      [
        "A verified Passport for every apprentice.",
        "KSBs, hours and EPA result they keep",
      ],
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

const MARK_BG = { teal: "bg-teal", brass: "bg-brass" };
const MARK_INK = { teal: "text-teal", brass: "text-brass-ink" };

export default function OverviewPage() {
  return (
    <>
      <PageHeader {...page}>
        <p className="measure text-body text-slate">
          Gradlly builds two products for the UK workforce.{" "}
          <strong className="font-semibold text-navy">Continuo</strong> gives
          every worker verified skills and checks, and keeps them verified at
          every job.{" "}
          <strong className="font-semibold text-navy">Gradlly AMS</strong> runs
          apprenticeships, with a verified Passport for every apprentice. Use
          either on its own, or both together.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href="/book-a-demo"
            className="bg-navy px-6 py-3.5 text-center text-small font-semibold text-white transition-colors duration-[140ms] ease-out hover:bg-navy-deep"
          >
            Book a demo
          </a>
          <a
            href="/how-it-works"
            className="border border-navy px-6 py-3.5 text-center text-small font-semibold text-navy transition-colors duration-[140ms] ease-out hover:bg-navy hover:text-white"
          >
            See how it works
          </a>
        </div>
      </PageHeader>

      {/*
        Two products as two stacked records, each with its own number and its
        own page. Not two coloured panels side by side: that was the mockup's
        hero and it makes the two products look like a pricing comparison,
        which is the one thing content-v1.md says they are not.
      */}
      <Band id="products">
        <BandHead
          id="products-heading"
          note="Two products. Each works on its own."
        >
          Two products, and the line between them.
        </BandHead>

        <div className="mt-12 md:mt-16">
          {PRODUCTS.map(
            (
              { number, href, name, summary, audience, mark, points },
              index,
            ) => (
              <article
                key={name}
                className={`grid gap-8 border-t border-rule py-10 md:py-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 ${
                  index === PRODUCTS.length - 1 ? "border-b" : ""
                }`}
              >
                <div>
                  <p className="flex items-center gap-3 text-ref text-slate">
                    <span
                      className={`block h-3 w-1 ${MARK_BG[mark]}`}
                      aria-hidden
                    />
                    <span>
                      {number} <span className="text-rule">/</span> {audience}
                    </span>
                  </p>
                  <h3 className="wide mt-4 text-display text-navy">{name}</h3>
                  <p className="mt-3 text-lead text-slate">{summary}</p>
                  <p className="mt-6">
                    <a
                      href={href}
                      className={`text-small font-semibold ${MARK_INK[mark]} underline decoration-2 underline-offset-[6px] transition-colors duration-[120ms] ease-out hover:text-navy`}
                    >
                      Read page {number}
                    </a>
                  </p>
                </div>

                <ul className="list-none space-y-7">
                  {points.map(([claim, detail]) => (
                    <li key={claim}>
                      <Attest claim={claim} mark={mark}>
                        {detail}
                      </Attest>
                    </li>
                  ))}
                </ul>
              </article>
            ),
          )}
        </div>

        {/* content-v1.md's "Link between the cards", given its own line rather
            than squeezed into the gutter between two panels. */}
        <p className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-small text-slate">
          <span className="block h-1 w-6 bg-teal" aria-hidden />
          <span className="block h-1 w-6 bg-brass" aria-hidden />
          Works together when apprentices move into work
        </p>
      </Band>

      {/* content-v1.md §3. */}
      <Band id="the-problem" tone="paper">
        <BandHead id="the-problem-heading">
          Proof gets rebuilt at every step. It shouldn&rsquo;t.
        </BandHead>

        <ul className="mt-12 grid list-none gap-10 md:mt-16 md:grid-cols-3 md:gap-10">
          {PROBLEMS.map(({ claim, detail }) => (
            <li key={claim}>
              <Attest claim={claim}>{detail}</Attest>
            </li>
          ))}
        </ul>
      </Band>

      <Band tone="navy">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-16">
          <div>
            <h2 className="wide max-w-[16ch] text-display text-white">
              See it with your own programme.
            </h2>
            <p className="measure mt-5 text-body text-white/75">
              Whether you hire into regulated roles or run apprenticeships,
              we&rsquo;ll walk you through the parts of Gradlly that matter to
              you.
            </p>
          </div>
          <div>
            <a
              href="/book-a-demo"
              className="inline-block bg-white px-6 py-3.5 text-small font-semibold text-navy transition-colors duration-[140ms] ease-out hover:bg-paper"
            >
              Book a demo
            </a>
          </div>
        </div>
      </Band>
    </>
  );
}
