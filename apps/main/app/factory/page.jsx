import { DashboardHero } from "@/components/factory/DashboardHero";
import { Footer } from "@/components/factory/Footer";
import { Nav } from "@/components/factory/Nav";
import { RecordExplorer } from "@/components/factory/RecordExplorer";
import {
  BoneCard,
  Button,
  Eyebrow,
  FeatureCard,
  StatusPulse,
} from "@/components/factory/ui";
import { CONTENT } from "@/content/landing";

/**
 * Factory — the same page, a second visual system.
 *
 * ── WHAT THIS IS, AND IS NOT ─────────────────────────────────────────────────
 *
 * Same content, same information architecture as / — every section here has
 * a matching one there, in the same order, built from the same CONTENT
 * object. Nothing is reworded and nothing new is claimed; this is a style
 * comparison, not a second draft of the copy.
 *
 * Two components are simplified rather than fully reproduced — RecordExplorer
 * (no filter, no mobile single-open accordion) and the form at the bottom
 * (real inputs, no submit handler — see its own note). Both would be straight
 * duplication of production components already built for /, in service of a
 * page whose only job is showing what the same content looks like in a
 * different system.
 *
 * One reference component is missing on purpose: the Logo Strip / Trust Bar.
 * The reference calls for real partner wordmarks, and this project has none
 * to show — the same reason the main site carries no testimonials and no
 * client logos anywhere. Leaving the slot empty was the choice there too.
 */
const {
  products,
  positioning,
  recordItems,
  capabilities,
  problems,
  continuoCore,
  continuoGroups,
  ways,
  passportPoints,
  continuoFlow,
  amsFlow,
  audiences,
  demoCovers,
} = CONTENT;

/* Real strings, duplicated rather than imported from the main site's own
   Diagrams.jsx / Mocks.jsx, whose local consts aren't exported and whose
   components are built for the other visual system. Not new copy — the same
   four portals and the same three Passport entries those files already draw. */
const PORTALS = [
  {
    name: "Provider portal",
    who: "Training provider",
    detail:
      "Delivery, funding compliance and ILR, with readiness scores across every cohort.",
  },
  {
    name: "Employer portal",
    who: "Employer",
    detail: "Levy spend, apprentice progress and review sign-off in one view.",
  },
  {
    name: "Apprentice portal",
    who: "Apprentice",
    detail:
      "An ePortfolio for logging hours, building KSB evidence and tracking progress to assessment.",
  },
  {
    name: "Gradlly Forge",
    who: "Levy donors and SMEs",
    detail:
      "The SME marketplace. Levy donors and SMEs matched, and transfers managed from pledge to funded start.",
  },
];

const PASSPORT_ENTRIES = [
  "Knowledge, skills and behaviours",
  "Off-the-job hours",
  "End-point assessment result",
];

function SectionHead({ eyebrow, children, note }) {
  return (
    <div
      className={
        note
          ? "grid gap-6 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-end lg:gap-12"
          : ""
      }
    >
      <div>
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h2
          className={`display text-heading-lg font-normal tracking-tight text-bone md:text-display ${eyebrow ? "mt-3" : ""}`}
        >
          {children}
        </h2>
      </div>
      {note ? <p className="text-body text-warm-granite">{note}</p> : null}
    </div>
  );
}

export default function FactoryPage() {
  return (
    <>
      <Nav />

      <main id="main-content">
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <header className="px-3 pb-12 pt-12 md:px-5 md:pb-20 md:pt-16">
          <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-12">
            <div>
              <Eyebrow>
                Verified skills and apprenticeships, for UK regulated work
              </Eyebrow>
              <h1 className="display mt-5 text-display font-normal tracking-tight text-bone">
                From trained to trusted.
              </h1>
              <p className="mt-6 max-w-[38ch] text-body text-warm-granite">
                Skills you can prove. Workers you can trust.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button href="#book-a-demo" variant="dark">
                  Book a demo
                </Button>
                <Button href="#how-it-works" variant="ghost" arrow>
                  See how it works
                </Button>
              </div>
            </div>

            <DashboardHero />
          </div>

          <div className="mx-auto mt-16 grid max-w-[1200px] gap-8 border-t border-carbon-lift pt-10 sm:grid-cols-2">
            <p className="max-w-[48ch] text-body-sm text-warm-granite">
              Gradlly builds two products for the UK workforce.{" "}
              <strong className="text-bone">Continuo</strong> gives every worker
              verified skills and checks, and keeps them verified at every job.{" "}
              <strong className="text-bone">Gradlly AMS</strong> runs
              apprenticeships, with a verified Passport for every apprentice.
              Use either on its own, or both together.
            </p>
            <ul className="list-none space-y-5">
              {products.map(({ href, name, summary, audience }) => (
                <li key={name}>
                  <h2 className="text-body font-normal text-bone">{name}</h2>
                  <p className="mt-1 text-body-sm text-warm-granite">
                    {summary} — {audience}
                  </p>
                  <a
                    href={href}
                    className="mech mt-1.5 inline-block text-body-sm text-signal-orange hover:text-bone"
                  >
                    Read {name} →
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </header>

        {/* ── Positioning ───────────────────────────────────────────────── */}
        <section
          id="positioning"
          aria-labelledby="positioning-heading"
          className="px-3 py-12 md:px-5 md:py-24"
        >
          <div className="mx-auto max-w-[1200px]">
            <SectionHead eyebrow="What Gradlly builds">
              <span id="positioning-heading">Two products and a Passport.</span>
            </SectionHead>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {positioning.map(({ product, what, who }) => (
                <FeatureCard key={product}>
                  <h3 className="text-body font-normal text-bone">{product}</h3>
                  <p className="mt-3 text-body-sm text-warm-granite">{what}</p>
                  <p className="mt-4 border-t border-carbon-lift pt-3 font-mono text-caption uppercase tracking-tight text-pale-stone">
                    {who}
                  </p>
                </FeatureCard>
              ))}
            </div>
          </div>
        </section>

        {/* ── The problem ───────────────────────────────────────────────── */}
        <section
          id="the-problem"
          aria-labelledby="problem-heading"
          className="border-t border-carbon-lift px-3 py-12 md:px-5 md:py-24"
        >
          <div className="mx-auto max-w-[1200px]">
            <SectionHead
              eyebrow="The problem"
              note="Continuo and Gradlly AMS answer one of these each, and the third between them."
            >
              <span id="problem-heading">
                Proof gets rebuilt at every step.
              </span>
            </SectionHead>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {problems.map(({ claim, detail }) => (
                <FeatureCard key={claim}>
                  <h3 className="text-body font-normal text-bone">{claim}</h3>
                  <p className="mt-3 text-body-sm text-warm-granite">
                    {detail}
                  </p>
                </FeatureCard>
              ))}
            </div>
          </div>
        </section>

        {/* ── Continuo ──────────────────────────────────────────────────── */}
        <section
          id="continuo"
          aria-labelledby="continuo-heading"
          className="border-t border-carbon-lift px-3 py-12 md:px-5 md:py-24"
        >
          <div className="mx-auto max-w-[1200px]">
            <SectionHead
              eyebrow="For employers and agencies in regulated work"
              note="Continuo proves what a worker can do, backed by the checks that show they're cleared to do it, and keeps that proof true between jobs, not just at the moment of hire. The record belongs to the worker, and it's free for them, always."
            >
              <span id="continuo-heading">
                Continuo. Verified skills for the workforce.
              </span>
            </SectionHead>

            <BoneCard grain className="mt-10 md:p-5">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)] lg:items-center lg:gap-14">
                <div>
                  <h3 className="text-heading font-normal tracking-tight text-card-ink">
                    Verified skills, not claimed ones.
                  </h3>
                  <p className="mt-4 text-body-sm text-card-ink-soft">
                    Every skill on a Continuo record is confirmed by the
                    trainer, assessor or employer who saw it, with the date and
                    the evidence. Employers hire and deploy on what workers can
                    actually do, not on what a CV says.
                  </p>
                </div>
                <ul className="list-none">
                  {continuoCore.map((point) => (
                    <li
                      key={point}
                      className="border-t border-ash-stroke/20 py-3.5 text-body-sm text-card-ink first:border-t-0"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </BoneCard>

            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {continuoGroups.map(({ title, points }) => (
                <FeatureCard key={title}>
                  <h3 className="text-body font-normal text-bone">{title}</h3>
                  <ul className="mt-4 list-none">
                    {points.map((point) => (
                      <li
                        key={point}
                        className="border-t border-carbon-lift py-3 text-body-sm text-warm-granite first:border-t-0"
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                </FeatureCard>
              ))}
            </div>

            <div className="mt-16">
              <h3 className="text-heading font-normal tracking-tight text-bone">
                Four ways to work with Continuo.
              </h3>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {ways.map(({ name, detail }) => (
                  <FeatureCard key={name}>
                    <h4 className="text-body font-normal text-bone">{name}</h4>
                    <p className="mt-3 text-body-sm text-warm-granite">
                      {detail}
                    </p>
                  </FeatureCard>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── The record ────────────────────────────────────────────────── */}
        <section
          id="the-record"
          aria-labelledby="record-heading"
          className="border-t border-carbon-lift px-3 py-12 md:px-5 md:py-24"
        >
          <div className="mx-auto max-w-[1200px]">
            <SectionHead eyebrow="The record">
              <span id="record-heading">
                Every line, and who stands behind it.
              </span>
            </SectionHead>
            <p className="mt-6 max-w-[62ch] text-body-sm text-warm-granite">
              A Continuo record is not one document. Filter it, open a line, and
              the confirmation behind it is the thing you are reading. The
              worker decides what a hirer sees: full or partial, time-limited or
              revocable.
            </p>

            <div className="mt-10">
              <RecordExplorer items={recordItems} />
            </div>
          </div>
        </section>

        {/* ── Compliance evidence ───────────────────────────────────────── */}
        <section
          id="compliance"
          aria-labelledby="compliance-heading"
          className="border-t border-carbon-lift px-3 py-12 md:px-5 md:py-24"
        >
          <div className="mx-auto max-w-[1200px]">
            <SectionHead eyebrow="Compliance evidence">
              <span id="compliance-heading">
                Organised by obligation, not by folder.
              </span>
            </SectionHead>
            <p className="mt-6 max-w-[62ch] text-body-sm text-warm-granite">
              Proof organised by each regulated obligation, not buried in
              folders. Gaps and upcoming lapses flagged before they become
              breaches. Evidence packs for any regulator, funder or client
              audit, on demand.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {capabilities.map(({ summary, detail }) => (
                <FeatureCard key={summary}>
                  <h3 className="text-body font-normal text-bone">{summary}</h3>
                  <p className="mt-3 text-body-sm text-warm-granite">
                    {detail}
                  </p>
                </FeatureCard>
              ))}
            </div>
          </div>
        </section>

        {/* ── The four portals ──────────────────────────────────────────── */}
        <section
          id="portals"
          aria-labelledby="portals-heading"
          className="border-t border-carbon-lift px-3 py-12 md:px-5 md:py-24"
        >
          <div className="mx-auto max-w-[1200px]">
            <SectionHead
              eyebrow="The four portals"
              note="Provider, employer, apprentice and the Forge marketplace. Not four products: four ways into the same record, which is why nothing has to be reconciled between them."
            >
              <span id="portals-heading">
                Four doors onto one apprenticeship.
              </span>
            </SectionHead>

            <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
              <div className="grid gap-6 lg:order-1">
                {PORTALS.slice(0, 2).map((portal) => (
                  <FeatureCard key={portal.name}>
                    <p className="font-mono text-caption uppercase tracking-tight text-pale-stone">
                      {portal.who}
                    </p>
                    <h3 className="mt-2 text-body font-normal text-bone">
                      {portal.name}
                    </h3>
                    <p className="mt-2 text-body-sm text-warm-granite">
                      {portal.detail}
                    </p>
                  </FeatureCard>
                ))}
              </div>

              <div className="flex justify-center lg:order-2">
                <BoneCard className="max-w-[260px] text-center">
                  <p className="font-mono text-caption uppercase tracking-tight text-card-ink-soft">
                    One apprenticeship
                  </p>
                  <p className="mt-2 text-heading font-normal tracking-tight text-card-ink">
                    One shared record
                  </p>
                  <p className="mt-3 text-body-sm text-card-ink-soft">
                    Four doors onto the same evidence, so nothing has to be
                    reconciled between them.
                  </p>
                </BoneCard>
              </div>

              <div className="grid gap-6 lg:order-3">
                {PORTALS.slice(2).map((portal) => (
                  <FeatureCard key={portal.name}>
                    <p className="font-mono text-caption uppercase tracking-tight text-pale-stone">
                      {portal.who}
                    </p>
                    <h3 className="mt-2 text-body font-normal text-bone">
                      {portal.name}
                    </h3>
                    <p className="mt-2 text-body-sm text-warm-granite">
                      {portal.detail}
                    </p>
                  </FeatureCard>
                ))}
              </div>
            </div>

            <p className="mt-10">
              <a
                href="/gradlly-ams"
                className="mech text-body-sm text-signal-orange hover:text-bone"
              >
                See the Gradlly AMS platform →
              </a>
            </p>
          </div>
        </section>

        {/* ── Apprenticeship Passport ───────────────────────────────────── */}
        <section
          id="passport"
          aria-labelledby="passport-heading"
          className="border-t border-carbon-lift px-3 py-12 md:px-5 md:py-24"
        >
          <div className="mx-auto max-w-[1200px]">
            <SectionHead
              eyebrow="Included with Gradlly AMS"
              note="Every apprentice leaves with a verified record of what they achieved. It's built automatically as they train, owned by them, and free for them."
            >
              <span id="passport-heading">
                The Apprenticeship Passport. What the apprentice keeps.
              </span>
            </SectionHead>

            <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-14">
              <ul className="list-none border-t border-carbon-lift">
                {passportPoints.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 border-b border-carbon-lift py-5"
                  >
                    <span
                      aria-hidden
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-signal-orange"
                    />
                    <span className="text-body text-bone">{point}</span>
                  </li>
                ))}
              </ul>

              <FeatureCard className="self-start">
                <p className="font-mono text-caption uppercase tracking-tight text-pale-stone">
                  Apprenticeship Passport
                </p>
                <ul className="mt-4 list-none">
                  {PASSPORT_ENTRIES.map((entry) => (
                    <li
                      key={entry}
                      className="border-t border-carbon-lift py-3.5 first:border-t-0"
                    >
                      <span className="block text-body-sm text-bone">
                        {entry}
                      </span>
                      <span className="mt-1 flex items-center gap-2 text-caption text-pale-stone">
                        <StatusPulse tone="green" />
                        Confirmed, with the date attached
                      </span>
                    </li>
                  ))}
                </ul>
              </FeatureCard>
            </div>
          </div>
        </section>

        {/* ── How it works ──────────────────────────────────────────────── */}
        <section
          id="how-it-works"
          aria-labelledby="how-it-works-heading"
          className="border-t border-carbon-lift px-3 py-12 md:px-5 md:py-24"
        >
          <div className="mx-auto max-w-[1200px]">
            <SectionHead note="Two products, two flows. Each works on its own.">
              <span id="how-it-works-heading">How it works</span>
            </SectionHead>

            <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-14">
              <div>
                <h3 className="text-heading font-normal tracking-tight text-bone">
                  How Continuo works
                </h3>
                <ol className="mt-6 list-none">
                  {continuoFlow.map(({ claim, detail }, index) => (
                    <li
                      key={claim}
                      className="flex gap-4 border-t border-carbon-lift py-5 first:border-t-0"
                    >
                      <span className="font-mono text-caption text-signal-orange">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <p className="text-body text-bone">{claim}</p>
                        <p className="mt-1.5 text-body-sm text-warm-granite">
                          {detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <h3 className="text-heading font-normal tracking-tight text-bone">
                  How AMS works
                </h3>
                <ol className="mt-6 list-none">
                  {amsFlow.map(({ claim, detail }, index) => (
                    <li
                      key={claim}
                      className="flex gap-4 border-t border-carbon-lift py-5 first:border-t-0"
                    >
                      <span className="font-mono text-caption text-metric-green">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <p className="text-body text-bone">{claim}</p>
                        <p className="mt-1.5 text-body-sm text-warm-granite">
                          {detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* ── Who it's for ──────────────────────────────────────────────── */}
        <section
          id="who-its-for"
          aria-labelledby="who-heading"
          className="border-t border-carbon-lift px-3 py-12 md:px-5 md:py-24"
        >
          <div className="mx-auto max-w-[1200px]">
            <SectionHead
              eyebrow="Who it's for"
              note="Four audiences reading the same record from different sides."
            >
              <span id="who-heading">Built for each side of the journey.</span>
            </SectionHead>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {audiences.map(({ who, detail, products: owned }) => (
                <FeatureCard key={who}>
                  <h3 className="text-body font-normal text-bone">{who}</h3>
                  <p className="mt-3 text-body-sm text-warm-granite">
                    {detail}
                  </p>
                  <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-carbon-lift pt-3">
                    {owned.map(({ name, href }) => (
                      <a
                        key={name}
                        href={href}
                        className="mech text-body-sm text-signal-orange hover:text-bone"
                      >
                        {name}
                      </a>
                    ))}
                  </p>
                </FeatureCard>
              ))}
            </div>
          </div>
        </section>

        {/* ── Book a demo ───────────────────────────────────────────────── */}
        <section
          id="book-a-demo"
          aria-labelledby="demo-heading"
          className="border-t border-carbon-lift px-3 py-12 md:px-5 md:py-24"
        >
          <div className="mx-auto max-w-[1200px]">
            <SectionHead note="Whether you hire into regulated roles or run apprenticeships, we'll walk you through the parts of Gradlly that matter to you.">
              <span id="demo-heading">
                See Gradlly with your own programme.
              </span>
            </SectionHead>

            <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14">
              <BoneCard grain className="max-w-[480px] md:p-5">
                <p className="flex items-center gap-2.5 font-mono text-caption uppercase tracking-tight text-card-ink-soft">
                  <StatusPulse />
                  Book a demo
                </p>
                <h3 className="mt-4 text-heading font-normal tracking-tight text-card-ink">
                  Talk to Gradlly
                </h3>

                {/* A real-looking form, not a real one. No onSubmit, no
                    endpoint — the production three-step form lives at / and
                    this page exists to compare a visual system, not to run a
                    second, half-duplicated lead-capture path. */}
                <div className="mt-6 space-y-4">
                  <label className="block">
                    <span className="text-caption text-card-ink-soft">
                      Name
                    </span>
                    <input
                      type="text"
                      name="name"
                      className="mech mt-1.5 w-full rounded-control border border-ash-stroke/30 bg-transparent px-3 py-2.5 text-body-sm text-card-ink placeholder:text-card-ink-soft/60 focus:border-obsidian-canvas focus:outline-none"
                      placeholder="Jess Okafor"
                    />
                  </label>
                  <label className="block">
                    <span className="text-caption text-card-ink-soft">
                      Work email
                    </span>
                    <input
                      type="email"
                      name="email"
                      className="mech mt-1.5 w-full rounded-control border border-ash-stroke/30 bg-transparent px-3 py-2.5 text-body-sm text-card-ink placeholder:text-card-ink-soft/60 focus:border-obsidian-canvas focus:outline-none"
                      placeholder="you@company.com"
                    />
                  </label>
                  <button
                    type="button"
                    className="mech w-full rounded-control bg-obsidian-canvas px-3.5 py-3 text-body-sm text-bone hover:bg-carbon-lift"
                  >
                    Request a demo
                  </button>
                  <p className="text-caption text-card-ink-soft">
                    Visual only on this page — book a real demo at{" "}
                    <a href="/#book-a-demo" className="underline">
                      the live site
                    </a>
                    .
                  </p>
                </div>
              </BoneCard>

              <div>
                <h3 className="text-body font-normal text-bone">
                  What a demo covers
                </h3>
                <ul className="mt-5 list-none">
                  {demoCovers.map(({ name, detail }) => (
                    <li key={name} className="border-t border-carbon-lift py-4">
                      <p className="text-body-sm font-normal text-bone">
                        {name}
                      </p>
                      <p className="mt-1.5 text-body-sm text-warm-granite">
                        {detail}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
