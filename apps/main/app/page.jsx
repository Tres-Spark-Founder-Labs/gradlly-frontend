import { DemoForm } from "@/components/site/DemoForm";
import { CohortMock, PassportMock, RecordMock } from "@/components/site/Mocks";
import {
  Accent,
  Attestation,
  Band,
  BandHead,
  Button,
  Card,
  SpecList,
  TextLink,
} from "@/components/site/ui";
import { CONTENT } from "@/content/landing";

/**
 * One page, carrying content-v1.md sections 2 to 9.
 *
 * §5 Gradlly AMS lives at /gradlly-ams, which is the original approved design,
 * so the nav item and the Passport section link out to it rather than repeating
 * it here.
 */
const {
  products,
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

const MARK_VAR = {
  olive: "var(--color-olive)",
  terracotta: "var(--color-terracotta)",
};

export default function HomePage() {
  return (
    <>
      {/* ── Hero, §2 ─────────────────────────────────────────────────────── */}
      <header className="px-6 pb-20 pt-16 md:px-10 md:pb-28 md:pt-24 lg:px-12">
        <div className="mx-auto max-w-[1200px]">
          <p
            className="enter flex items-center gap-3 text-caption text-ink-muted"
            style={{ "--enter-delay": "0ms" }}
          >
            <span
              className="mark h-3.5"
              style={{ "--mark": "var(--color-olive)" }}
              aria-hidden
            />
            Verified skills and apprenticeships, for UK regulated work
          </p>

          {/* The one accent on the page: "trusted" italic, under a drawn
              chartreuse stroke. The word is chosen because the whole
              proposition turns on it. */}
          <h1
            className="enter display mt-10 max-w-[13ch] text-display text-ink"
            style={{ "--enter-delay": "120ms" }}
          >
            From trained to <Accent>trusted</Accent>.
          </h1>

          <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-start lg:gap-20">
            <div>
              <p
                className="enter measure-lead text-lead text-ink-soft"
                style={{ "--enter-delay": "240ms" }}
              >
                Skills you can prove. Workers you can trust.
              </p>
              <p
                className="enter measure mt-6 text-body text-ink-soft"
                style={{ "--enter-delay": "300ms" }}
              >
                Gradlly builds two products for the UK workforce.{" "}
                <strong className="font-semibold text-ink">Continuo</strong>{" "}
                gives every worker verified skills and checks, and keeps them
                verified at every job.{" "}
                <strong className="font-semibold text-ink">Gradlly AMS</strong>{" "}
                runs apprenticeships, with a verified Passport for every
                apprentice. Use either on its own, or both together.
              </p>

              <div
                className="enter mt-10 flex flex-col gap-3 sm:flex-row"
                style={{ "--enter-delay": "360ms" }}
              >
                <Button href="/#book-a-demo">Book a demo</Button>
                <Button href="/#how-it-works" variant="outline">
                  See how it works
                </Button>
              </div>
            </div>

            {/* The product visual, offset against the heading. No figures in
                it, by design: see Mocks.jsx. */}
            <div
              className="enter grid gap-5 sm:grid-cols-2 lg:grid-cols-5"
              style={{ "--enter-delay": "440ms" }}
            >
              <RecordMock className="sm:col-span-2 lg:col-span-5" />
              <CohortMock className="lg:col-span-3" />
              <PassportMock className="lg:col-span-2" />
            </div>
          </div>

          <div
            className="enter mt-20 border-t border-hairline pt-10"
            style={{ "--enter-delay": "520ms" }}
          >
            <p className="text-caption text-ink-muted">
              Two products. Each works on its own.
            </p>
            <ul className="mt-6 grid list-none gap-10 md:grid-cols-2 md:gap-16">
              {products.map(({ href, name, summary, audience, mark }) => (
                <li key={name} className="flex gap-5">
                  <span
                    className="mark h-auto self-stretch"
                    style={{ "--mark": MARK_VAR[mark] }}
                    aria-hidden
                  />
                  <div>
                    <h2 className="display text-subhead text-ink">{name}</h2>
                    <p className="mt-1.5 text-body-sm text-ink-soft">
                      {summary}
                    </p>
                    <p className="mt-1 text-caption text-ink-muted">
                      {audience}
                    </p>
                    <p className="mt-4">
                      <TextLink href={href}>Read {name}</TextLink>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      {/* ── The problem, §3 ──────────────────────────────────────────────── */}
      <Band id="the-problem" tone="sand">
        <BandHead
          id="the-problem-heading"
          note="Continuo and Gradlly AMS answer one of these each, and the third between them."
        >
          Proof gets rebuilt at every step. It shouldn&rsquo;t.
        </BandHead>
        <div className="mt-16">
          <SpecList items={problems} />
        </div>
      </Band>

      {/* ── Continuo, §4 ─────────────────────────────────────────────────── */}
      <Band id="continuo">
        <BandHead
          id="continuo-heading"
          eyebrow="For employers and agencies in regulated work"
          note="Continuo proves what a worker can do, backed by the checks that show they're cleared to do it, and keeps that proof true between jobs, not just at the moment of hire. The record belongs to the worker, and it's free for them, always."
        >
          Continuo. Verified skills for the workforce.
        </BandHead>

        {/* The claim the product rests on, on the page's one olive surface. */}
        <div className="on-olive mt-16 rounded-card bg-olive px-7 py-12 text-linen md:px-14 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
            <div>
              <h3 className="display max-w-[12ch] text-section text-linen">
                Verified skills, not claimed ones.
              </h3>
              <p className="measure mt-6 text-body text-linen/75">
                Every skill on a Continuo record is confirmed by the trainer,
                assessor or employer who saw it, with the date and the evidence.
                Employers hire and deploy on what workers can actually do, not
                on what a CV says.
              </p>
            </div>
            <SpecList items={continuoCore} dark />
          </div>
        </div>

        <div className="mt-20 grid gap-14 md:grid-cols-3 md:gap-10">
          {continuoGroups.map(({ title, points }) => (
            <div key={title}>
              <span
                className="mark mb-6 h-3.5"
                style={{ "--mark": "var(--color-olive)" }}
                aria-hidden
              />
              <h3 className="display text-subhead text-ink">{title}</h3>
              <ul className="mt-5 list-none">
                {points.map((point) => (
                  <li
                    key={point}
                    className="border-t border-hairline py-4 text-body-sm text-ink-soft"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <h3 className="display text-section text-ink">
            Four ways to work with Continuo.
          </h3>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {ways.map(({ name, detail }) => (
              <Card key={name}>
                <h4 className="display text-subhead text-ink">{name}</h4>
                <p className="mt-3 text-body-sm text-ink-soft">{detail}</p>
              </Card>
            ))}
          </div>
        </div>
      </Band>

      {/* ── Passport, §6 ─────────────────────────────────────────────────── */}
      <Band id="passport" tone="linen">
        <BandHead
          id="passport-heading"
          eyebrow="Included with Gradlly AMS"
          mark="terracotta"
          note="Every apprentice leaves with a verified record of what they achieved. It's built automatically as they train, owned by them, and free for them."
        >
          The Apprenticeship Passport. What the apprentice keeps.
        </BandHead>

        <div className="mt-16 grid gap-14 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-20">
          <div>
            <ul className="list-none">
              {passportPoints.map((point) => (
                <li
                  key={point}
                  className="flex gap-5 border-t border-hairline py-6 last:border-b"
                >
                  <span
                    className="mark h-auto self-stretch"
                    style={{ "--mark": "var(--color-terracotta)" }}
                    aria-hidden
                  />
                  <span className="text-body text-ink">{point}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8">
              <TextLink href="/gradlly-ams">
                See the Gradlly AMS platform
              </TextLink>
            </p>
          </div>
          <PassportMock className="self-start" />
        </div>
      </Band>

      {/* ── How it works, §7 ─────────────────────────────────────────────── */}
      <Band id="how-it-works">
        <BandHead
          id="how-it-works-heading"
          note="Two products, two flows. Each works on its own."
        >
          How it works
        </BandHead>

        <div className="mt-16 grid gap-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <span
              className="mark mb-6 h-3.5"
              style={{ "--mark": "var(--color-olive)" }}
              aria-hidden
            />
            <h3 className="display text-section text-ink">
              How Continuo works
            </h3>
            <div className="mt-8">
              <SpecList items={continuoFlow} numbered mark="olive" />
            </div>
          </div>

          <div>
            <span
              className="mark mb-6 h-3.5"
              style={{ "--mark": "var(--color-terracotta)" }}
              aria-hidden
            />
            <h3 className="display text-section text-ink">How AMS works</h3>
            <div className="mt-8">
              <SpecList items={amsFlow} numbered mark="terracotta" />
            </div>
          </div>
        </div>

        <div className="mt-20 grid gap-8 border-t border-hairline pt-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-20">
          <div>
            <p className="flex items-center gap-2" aria-hidden>
              <span className="block h-1 w-9 rounded-full bg-olive" />
              <span className="block h-1 w-9 rounded-full bg-terracotta" />
            </p>
            <h3 className="display mt-6 text-section text-ink">
              Better together
            </h3>
          </div>
          <p className="measure self-end text-body text-ink-soft">
            When an apprentice finishes, they can carry their Passport&rsquo;s
            verified achievements into Continuo, with their consent. Their first
            employer onboards from proof on day one.
          </p>
        </div>
      </Band>

      {/* ── Who it's for, §8 ─────────────────────────────────────────────── */}
      <Band id="who-its-for" tone="sand">
        <BandHead id="who-its-for-heading">
          Built for each side of the journey.
        </BandHead>

        <ul className="mt-16 grid list-none gap-14 md:grid-cols-2 md:gap-x-20">
          {audiences.map(({ who, detail, products: owned }) => (
            <li key={who}>
              <span className="flex gap-1.5" aria-hidden>
                {owned.map(({ name, mark }) => (
                  <span
                    key={name}
                    className="block h-1 w-9 rounded-full"
                    style={{ backgroundColor: MARK_VAR[mark] }}
                  />
                ))}
              </span>
              <h3 className="display mt-6 text-subhead text-ink">{who}</h3>
              <p className="measure mt-3 text-body-sm text-ink-soft">
                {detail}
              </p>
              <p className="mt-4 flex flex-wrap gap-x-5">
                {owned.map(({ name, href }) => (
                  <TextLink key={name} href={href}>
                    {name}
                  </TextLink>
                ))}
              </p>
            </li>
          ))}
        </ul>
      </Band>

      {/* ── Book a demo, §9 ──────────────────────────────────────────────── */}
      <Band id="book-a-demo">
        <BandHead
          id="book-a-demo-heading"
          note="Whether you hire into regulated roles or run apprenticeships, we'll walk you through the parts of Gradlly that matter to you."
        >
          See Gradlly with your own programme.
        </BandHead>

        <div className="mt-16 grid gap-14 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-20">
          <Card>
            <DemoForm />
          </Card>

          <div>
            <h3 className="display text-subhead text-ink">
              What a demo covers
            </h3>
            <ul className="mt-6 list-none">
              {demoCovers.map(({ name, detail }) => (
                <li key={name} className="border-t border-hairline py-5">
                  <Attestation claim={name}>{detail}</Attestation>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-body-sm text-ink-soft">
              Or email us at{" "}
              <span
                className="font-semibold text-ink"
                title="Placeholder. Recorded in docs/marketing/LAUNCH-CHECKLIST.md."
              >
                [CONTACT EMAIL]
              </span>
            </p>
          </div>
        </div>
      </Band>
    </>
  );
}
