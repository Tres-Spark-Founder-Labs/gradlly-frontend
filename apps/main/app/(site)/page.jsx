import { DemoForm } from "@/components/site/DemoForm";
import {
  EvidenceCompare,
  LevyFlow,
  PortalMap,
  ShareDiagram,
} from "@/components/site/Diagrams";
import { Col, Disclose, Grid, Ref, StickyPair } from "@/components/site/Grid";
import { ListDetail } from "@/components/site/ListDetail";
import {
  PassportMock,
  RecordLineMock,
  TableToolbarMock,
} from "@/components/site/Mocks";
import { Reveal } from "@/components/site/Reveal";
import { SectionNav } from "@/components/site/SectionNav";
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
import { VerifyDemo } from "@/components/site/VerifyDemo";
import { SITE } from "@/config/site.config";
import { CONTENT } from "@/content/landing";

/**
 * One page, carrying content-v1.md sections 2 to 9.
 *
 * ── THE SECOND REBUILD ───────────────────────────────────────────────────────
 *
 * The first restyle of this file put a dark olive panel behind the hero, gave
 * every section a numbered reference in place of an eyebrow, and built a bento
 * of glass cards for the Continuo pillars. All three retired on a brief that
 * named a lighter, more conventional reference and said plainly that the first
 * system was being replaced, not extended: see the comment at the top of
 * globals.css for what carried across and what did not.
 *
 * §5 Gradlly AMS still lives at /gradlly-ams, which is the original approved
 * design and was out of scope for this rebuild, so the nav item and the
 * Passport section link out to it rather than repeating it here.
 */
const SECTIONS = [
  { id: "positioning", label: "What Gradlly builds" },
  { id: "the-problem", label: "The problem" },
  { id: "continuo", label: "Continuo" },
  { id: "the-record", label: "The record" },
  { id: "compliance", label: "Compliance evidence" },
  { id: "portals", label: "The four portals" },
  { id: "passport", label: "Apprenticeship Passport" },
  { id: "how-it-works", label: "How it works" },
  { id: "who-its-for", label: "Who it's for" },
  { id: "book-a-demo", label: "Book a demo" },
];

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

const MARK_VAR = {
  olive: "var(--color-olive)",
  terracotta: "var(--color-terracotta)",
};

export default function HomePage() {
  return (
    <>
      {/* ── Hero, §2 ─────────────────────────────────────────────────────────
             Plain cream, no panel. The headline sits directly on the page, in
             near-black with one olive word, which is the whole of what the new
             reference's hero does with colour. The record still confirms
             itself beside it — see VerifyDemo for what changed there and what
             did not. ──────────────────────────────────────────────────────── */}
      <header className="relative px-4 pb-20 pt-14 md:px-8 md:pb-28 md:pt-20 lg:px-12">
        <div className="mx-auto max-w-[1200px]">
          <Grid className="items-center">
            <Col span="col-span-4 md:col-span-6 lg:col-span-5">
              <p
                className="enter flex items-center gap-2.5 text-caption text-ink-muted"
                style={{ "--enter-delay": "0ms" }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full bg-olive"
                  aria-hidden
                />
                Verified skills and apprenticeships, for UK regulated work
              </p>

              <h1
                className="enter display mt-7 max-w-[11ch] text-display text-ink"
                style={{ "--enter-delay": "120ms" }}
              >
                From trained to <Accent>trusted</Accent>.
              </h1>

              <p
                className="enter measure-lead mt-8 text-lead text-ink-soft"
                style={{ "--enter-delay": "260ms" }}
              >
                Skills you can prove. Workers you can trust.
              </p>

              <div
                className="enter mt-9 flex flex-col gap-3 sm:flex-row"
                style={{ "--enter-delay": "340ms" }}
              >
                <Button href="/#book-a-demo">Book a demo</Button>
                <Button href="/#how-it-works" variant="outline">
                  See how it works
                </Button>
              </div>
            </Col>

            <Col
              span="col-span-4 md:col-span-6 lg:col-span-6 lg:col-start-7"
              className="mt-12 lg:mt-0"
            >
              <div className="enter" style={{ "--enter-delay": "420ms" }}>
                <VerifyDemo />
              </div>
            </Col>
          </Grid>

          {/* The body copy and the two products, below the fold rather than
              crowding the demonstration. */}
          <Grid className="mt-20 rule-top-hair">
            <Col span="col-span-4 md:col-span-6 lg:col-span-5">
              <p className="measure text-body text-ink-soft">
                Gradlly builds two products for the UK workforce.{" "}
                <strong className="font-semibold text-ink">Continuo</strong>{" "}
                gives every worker verified skills and checks, and keeps them
                verified at every job.{" "}
                <strong className="font-semibold text-ink">Gradlly AMS</strong>{" "}
                runs apprenticeships, with a verified Passport for every
                apprentice. Use either on its own, or both together.
              </p>
            </Col>
            <Col span="col-span-4 md:col-span-6 lg:col-span-6 lg:col-start-7">
              <ul className="grid list-none gap-8 sm:grid-cols-2">
                {products.map(({ href, name, summary, audience, mark }) => (
                  <li key={name} className="flex gap-4">
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
                      <p className="mt-3">
                        <TextLink href={href}>Read {name}</TextLink>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </Col>
          </Grid>
        </div>
      </header>

      {/* Local navigation. The global nav says which product area you are in;
          this says which part of it you are reading. */}
      <div className="sticky top-17 z-40 border-y border-hairline bg-cream/95 py-3 backdrop-blur-sm lg:hidden">
        <div className="mx-auto max-w-[1200px]">
          <SectionNav sections={SECTIONS} />
        </div>
      </div>

      {/* ── 01 What Gradlly builds. ─────────────────────────────────────────── */}
      <Band id="positioning" labelledBy="positioning-heading">
        <StickyPair
          aside={
            <Reveal>
              <Ref>What Gradlly builds</Ref>
              <h2
                id="positioning-heading"
                className="display mt-5 max-w-[11ch] text-section text-ink"
              >
                Two products and a Passport.
              </h2>
              <p className="measure mt-6 text-body text-ink-soft">
                Each works on its own, and they work together when apprentices
                move into work.
              </p>
            </Reveal>
          }
        >
          <Reveal>
            <table className="table-stack w-full border-collapse text-left">
              <caption className="sr-only">
                Gradlly products, what each one is, and who buys it
              </caption>
              <thead>
                <tr className="border-b border-ink">
                  <th
                    scope="col"
                    className="py-3 pr-6 text-caption font-medium text-ink-muted md:w-40"
                  >
                    Product
                  </th>
                  <th
                    scope="col"
                    className="py-3 pr-6 text-caption font-medium text-ink-muted"
                  >
                    What it is
                  </th>
                  <th
                    scope="col"
                    className="py-3 text-caption font-medium text-ink-muted md:w-44"
                  >
                    Who buys it
                  </th>
                </tr>
              </thead>
              <tbody>
                {positioning.map(({ product, what, who, mark, href }) => (
                  <tr
                    key={product}
                    className="border-b border-hairline align-top"
                  >
                    <th scope="row" className="py-5 pr-6 text-left font-normal">
                      <span className="flex items-start gap-3">
                        <span
                          className="mark mt-1.5 h-4"
                          style={{ "--mark": MARK_VAR[mark] }}
                          aria-hidden
                        />
                        <a
                          href={href}
                          className="display text-subhead text-ink underline decoration-ink/20 decoration-1 underline-offset-[5px] transition-colors duration-200 ease-out hover:decoration-ink"
                        >
                          {product}
                        </a>
                      </span>
                    </th>
                    <td
                      data-label="What it is"
                      className="py-5 pr-6 text-body-sm text-ink-soft"
                    >
                      {what}
                    </td>
                    <td
                      data-label="Who buys it"
                      className="py-5 text-caption text-ink-muted"
                    >
                      {who}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </StickyPair>
      </Band>

      {/* ── 02 The problem, §3 ───────────────────────────────────────────── */}
      <Band id="the-problem" tone="sand" labelledBy="the-problem-heading">
        <StickyPair
          aside={
            <Reveal>
              <Ref>The problem</Ref>
              <h2
                id="the-problem-heading"
                className="display mt-5 max-w-[12ch] text-section text-ink"
              >
                Proof gets rebuilt at every step. It shouldn&rsquo;t.
              </h2>
              <p className="measure mt-6 text-body text-ink-soft">
                Continuo and Gradlly AMS answer one of these each, and the third
                between them.
              </p>
            </Reveal>
          }
        >
          <Reveal>
            <SpecList items={problems} />
          </Reveal>

          <Reveal className="mt-14">
            <EvidenceCompare />
          </Reveal>
        </StickyPair>
      </Band>

      {/* ── 03 Continuo, §4 ─────────────────────────────────────────────────── */}
      <Band id="continuo" labelledBy="continuo-heading">
        <BandHead
          id="continuo-heading"
          tone="olive"
          eyebrow="For employers and agencies in regulated work"
          note="Continuo proves what a worker can do, backed by the checks that show they're cleared to do it, and keeps that proof true between jobs, not just at the moment of hire. The record belongs to the worker, and it's free for them, always."
        >
          Continuo. Verified skills for the workforce.
        </BandHead>

        {/* The claim the product rests on. This used to be the page's one
            solid-olive surface; it is a card now, like everything else, with
            olive carrying the heading and the rule rather than the fill. */}
        <div className="shadow-card mt-16 rounded-card border-2 border-olive bg-linen px-6 py-12 md:px-14 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)] lg:items-center lg:gap-24">
            <Reveal>
              <h3 className="display max-w-[12ch] text-section text-olive">
                Verified skills, not claimed ones.
              </h3>
              <p className="measure mt-6 text-body text-ink-soft">
                Every skill on a Continuo record is confirmed by the trainer,
                assessor or employer who saw it, with the date and the evidence.
                Employers hire and deploy on what workers can actually do, not
                on what a CV says.
              </p>
            </Reveal>
            <Reveal>
              <SpecList items={continuoCore} />
            </Reveal>
          </div>
        </div>

        {/* What that looks like on an actual record. The claim above is
            abstract ("verified skills, not claimed ones"); this is the same
            Skills line the-record section shows in its own detail panel,
            reused rather than redrawn, so a reader sees one concrete example
            before the three pillars below generalise from it. */}
        <Reveal className="mt-14 flex justify-center">
          <div className="w-full max-w-[460px]">
            <RecordLineMock item={recordItems[0]} />
          </div>
        </Reveal>

        {/* Three pillars, each with its three points. The first rebuild drew
            these as a bento of glass cards over a drifting field; both retired
            with the panel. What is left is plainer and, for a page that is
            light everywhere else now, more consistent: three equal cards,
            shadowed like every other card, the text arriving with a stagger
            rather than a blurred backdrop doing the work of holding a
            reader's attention. */}
        <Reveal className="mt-20 grid gap-5 md:grid-cols-3" stagger={100}>
          {continuoGroups.map(({ title, points }) => (
            <div
              key={title}
              className="shadow-card rounded-card border border-hairline bg-linen p-7 md:p-8"
            >
              <span
                className="mark mb-6 h-3.5"
                style={{ "--mark": "var(--color-olive)" }}
                aria-hidden
              />
              <h3 className="display text-subhead text-ink">{title}</h3>
              <Reveal
                as="ul"
                className="mt-5 list-none"
                stagger={70}
                distance={12}
              >
                {points.map((point) => (
                  <li
                    key={point}
                    className="border-t border-hairline py-4 text-body-sm text-ink-soft"
                  >
                    {point}
                  </li>
                ))}
              </Reveal>
            </div>
          ))}
        </Reveal>

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

      {/* ── 04 What a record carries. ───────────────────────────────────── */}
      <Band id="the-record" tone="linen" labelledBy="the-record-heading">
        <Grid className="lg:items-start">
          <Col
            span="col-span-4 md:col-span-6 lg:col-span-4"
            className="lg:sticky lg:top-28"
          >
            <Reveal>
              <Ref tone="olive">The record</Ref>
              <h2
                id="the-record-heading"
                className="display mt-5 max-w-[12ch] text-section text-ink"
              >
                Every line, and who stands behind it.
              </h2>
              <p className="measure mt-6 text-body text-ink-soft">
                A Continuo record is not one document. Filter it, open a line,
                and the confirmation behind it is the thing you are reading.
              </p>
              <p className="measure mt-5 text-body text-ink-soft">
                The worker decides what a hirer sees: full or partial,
                time-limited or revocable.
              </p>
            </Reveal>
          </Col>
          <Col span="col-span-4 md:col-span-6 lg:col-span-8 lg:col-start-5">
            <Reveal>
              <ListDetail items={recordItems} label="what a record carries" />
            </Reveal>
          </Col>
        </Grid>

        <Reveal className="mt-16">
          <h3 className="display text-subhead text-ink">
            What the worker shares
          </h3>
          <div className="mt-6">
            <ShareDiagram />
          </div>
        </Reveal>
      </Band>

      {/* ── 05 Compliance evidence, with the table and its toolbar. ───────── */}
      <Band id="compliance" labelledBy="compliance-heading">
        <Grid>
          <Col span="col-span-4 md:col-span-6 lg:col-span-5">
            <Ref tone="olive">Compliance evidence</Ref>
            <h2
              id="compliance-heading"
              className="display mt-5 max-w-[13ch] text-section text-ink"
            >
              Organised by obligation, not by folder.
            </h2>
            <p className="measure mt-6 text-body text-ink-soft">
              Proof organised by each regulated obligation, not buried in
              folders. Gaps and upcoming lapses flagged before they become
              breaches. Evidence packs for any regulator, funder or client
              audit, on demand.
            </p>

            <div className="mt-10">
              {capabilities.map(({ summary, detail }) => (
                <Disclose key={summary} summary={summary}>
                  {detail}
                </Disclose>
              ))}
            </div>
          </Col>
          <Col
            span="col-span-4 md:col-span-6 lg:col-span-6 lg:col-start-7"
            className="lg:sticky lg:top-28"
          >
            <TableToolbarMock />
          </Col>
        </Grid>
      </Band>

      {/* ── 06 The four portals, and what the Forge does. ─────────────────── */}
      <Band id="portals" labelledBy="portals-heading">
        <Grid className="items-end">
          <Col span="col-span-4 md:col-span-6 lg:col-span-5">
            <Ref tone="terracotta">The four portals</Ref>
            <h2
              id="portals-heading"
              className="display mt-5 max-w-[13ch] text-section text-ink"
            >
              Four doors onto one apprenticeship.
            </h2>
          </Col>
          <Col span="col-span-4 md:col-span-6 lg:col-span-6 lg:col-start-7">
            <p className="measure text-lead text-ink-soft">
              Provider, employer, apprentice and the Forge marketplace. Not four
              products: four ways into the same record, which is why nothing has
              to be reconciled between them.
            </p>
            <p className="mt-6">
              <TextLink href="/gradlly-ams">
                See the Gradlly AMS platform
              </TextLink>
            </p>
          </Col>
        </Grid>
        <Reveal className="mt-14">
          <PortalMap />
        </Reveal>

        <Reveal className="mt-20">
          <h3 className="display max-w-[16ch] text-section text-ink">
            What the Forge does.
          </h3>
          <p className="measure mt-5 text-body text-ink-soft">
            Employers with unspent levy matched with SMEs that need funded
            apprenticeships, and the transfer managed from pledge to funded
            start.
          </p>
          <div className="mt-10">
            <LevyFlow />
          </div>
        </Reveal>
      </Band>

      {/* ── 07 Passport, §6 ──────────────────────────────────────────────── */}
      <Band id="passport" tone="linen" labelledBy="passport-heading">
        <BandHead
          id="passport-heading"
          eyebrow="Included with Gradlly AMS"
          tone="terracotta"
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
          <div className="self-start">
            <PassportMock />
          </div>
        </div>
      </Band>

      {/* ── 08 How it works, §7 ──────────────────────────────────────────────
          Dark band, numbered-card grids: the structure /gradlly-ams's own
          "How it works" uses (components/Home/HowItWorks.jsx), carried onto
          the homepage's two flows. Product colour stays on the hover
          underline and the mark bars, never on body text, because olive and
          terracotta text both fall under AA contrast against --color-ink. */}
      <Band id="how-it-works" tone="ink" labelledBy="how-it-works-heading">
        <Reveal>
          <Ref tone="linen">How it works</Ref>
          <h2
            id="how-it-works-heading"
            className="display measure-display mt-5 text-section text-linen"
          >
            Two products. <em className="italic">Each works on its own.</em>
          </h2>
          <p className="measure mt-5 text-lead text-linen/60">
            Two products, two flows. Each works on its own.
          </p>
        </Reveal>

        <div className="mt-20 space-y-20">
          <div>
            <span
              className="mark h-3.5"
              style={{ "--mark": "var(--color-olive)" }}
              aria-hidden
            />
            <h3 className="display mt-4 text-subhead text-linen">
              How Continuo works
            </h3>

            <Reveal className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-card border border-linen/10 bg-linen/10 md:grid-cols-2 lg:grid-cols-4">
              {continuoFlow.map(({ claim, detail }, index) => (
                <div
                  key={claim}
                  className="group relative h-full bg-ink p-8 transition-colors hover:bg-linen/5"
                >
                  <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-olive transition-transform duration-300 group-hover:scale-x-100" />
                  <div className="display text-6xl leading-none text-linen/10">
                    {index + 1}
                  </div>
                  <h4 className="display mt-4 text-subhead text-linen">
                    {claim}
                  </h4>
                  <p className="mt-3 text-body-sm leading-relaxed text-linen/50">
                    {detail}
                  </p>
                </div>
              ))}
            </Reveal>
          </div>

          <div>
            <span
              className="mark h-3.5"
              style={{ "--mark": "var(--color-terracotta)" }}
              aria-hidden
            />
            <h3 className="display mt-4 text-subhead text-linen">
              How Gradlly AMS works
            </h3>

            <Reveal className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-card border border-linen/10 bg-linen/10 md:grid-cols-2 lg:grid-cols-4">
              {amsFlow.map(({ claim, detail }, index) => (
                <div
                  key={claim}
                  className="group relative h-full bg-ink p-8 transition-colors hover:bg-linen/5"
                >
                  <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-terracotta transition-transform duration-300 group-hover:scale-x-100" />
                  <div className="display text-6xl leading-none text-linen/10">
                    {index + 1}
                  </div>
                  <h4 className="display mt-4 text-subhead text-linen">
                    {claim}
                  </h4>
                  <p className="mt-3 text-body-sm leading-relaxed text-linen/50">
                    {detail}
                  </p>
                </div>
              ))}
            </Reveal>
          </div>
        </div>

        <div className="mt-20 grid gap-8 border-t border-linen/10 pt-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-20">
          <div>
            <p className="flex items-center gap-2" aria-hidden>
              <span className="block h-1 w-9 rounded-full bg-olive" />
              <span className="block h-1 w-9 rounded-full bg-terracotta" />
            </p>
            <h3 className="display mt-6 text-section text-linen">
              Better together
            </h3>
          </div>
          <div className="self-end">
            <p className="measure text-body text-linen/60">
              When an apprentice finishes, they can carry their Passport&rsquo;s
              verified achievements into Continuo, with their consent. Their
              first employer onboards from proof on day one.
            </p>
          </div>
        </div>
      </Band>

      {/* ── 09 Who it's for, §8 ──────────────────────────────────────────── */}
      <Band id="who-its-for" tone="sand" labelledBy="who-its-for-heading">
        <BandHead
          id="who-its-for-heading"
          eyebrow="Who it's for"
          note="Four audiences reading the same record from different sides."
        >
          Built for each side of the journey.
        </BandHead>

        <ul className="mt-16 grid list-none gap-6 md:grid-cols-2">
          {audiences.map(({ who, detail, products: owned }) => (
            <li
              key={who}
              className="shadow-card rounded-card border border-hairline bg-linen p-7"
            >
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

      {/* ── 10 Book a demo, §9 ──────────────────────────────────────────────── */}
      <Band id="book-a-demo" labelledBy="book-a-demo-heading">
        <BandHead
          id="book-a-demo-heading"
          eyebrow="Book a demo"
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
            {SITE.contactEmail ? (
              <p className="mt-8 text-body-sm text-ink-soft">
                Or email us at{" "}
                <TextLink href={`mailto:${SITE.contactEmail}`}>
                  {SITE.contactEmail}
                </TextLink>
              </p>
            ) : null}
          </div>
        </div>
      </Band>
    </>
  );
}
