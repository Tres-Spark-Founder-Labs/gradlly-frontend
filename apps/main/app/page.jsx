import {
  ArcField,
  AudienceField,
  GridFill,
  PlateStack,
  WeaveField,
} from "@/components/site/Art";
import { DemoForm } from "@/components/site/DemoForm";
import {
  EvidenceCompare,
  FlowPath,
  LevyFlow,
  PortalMap,
  ShareDiagram,
} from "@/components/site/Diagrams";
import { Col, Disclose, Grid, Ref } from "@/components/site/Grid";
import { ListDetail } from "@/components/site/ListDetail";
import { PassportMock, StatesMock } from "@/components/site/Mocks";
import { Screenshot } from "@/components/site/Screenshot";
import { SectionNav } from "@/components/site/SectionNav";
import { Field } from "@/components/site/Texture";
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
import { CONTENT } from "@/content/landing";

/**
 * One page, carrying content-v1.md sections 2 to 9.
 *
 * §5 Gradlly AMS lives at /gradlly-ams, which is the original approved design,
 * so the nav item and the Passport section link out to it rather than repeating
 * it here.
 */
/**
 * The page index.
 *
 * Eleven sections is long enough that a reader needs to see the shape of it,
 * and long enough that the local navigation is a requirement rather than a
 * nicety. The numbers are referenced from the prose, so they have to be
 * stable.
 */
const SECTIONS = [
  { id: "positioning", number: "01", label: "What Gradlly builds" },
  { id: "the-problem", number: "02", label: "The problem" },
  { id: "continuo", number: "03", label: "Continuo" },
  { id: "the-record", number: "04", label: "What a record carries" },
  { id: "compliance", number: "05", label: "Compliance evidence" },
  { id: "sharing", number: "06", label: "Sharing a record" },
  { id: "portals", number: "07", label: "The four portals" },
  { id: "levy", number: "08", label: "Levy transfer" },
  { id: "passport", number: "09", label: "Apprenticeship Passport" },
  { id: "how-it-works", number: "10", label: "How it works" },
  { id: "states", number: "11", label: "Every state, designed" },
  { id: "who-its-for", number: "12", label: "Who it's for" },
  { id: "book-a-demo", number: "13", label: "Book a demo" },
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
             The record confirms itself. See VerifyDemo for why this and not a
             headline beside a static screenshot. ─────────────────────────── */}
      <header className="relative overflow-hidden px-6 pb-16 pt-14 md:px-10 md:pb-24 md:pt-20 lg:px-12">
        <Field tone="mixed" density="strong" />
        <div className="mx-auto max-w-[1200px]">
          <Grid className="items-center">
            <Col span="col-span-4 md:col-span-6 lg:col-span-6">
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

              <h1
                className="enter display mt-8 max-w-[11ch] text-display text-ink"
                style={{ "--enter-delay": "120ms" }}
              >
                From trained to <Accent>trusted</Accent>.
              </h1>

              <p
                className="enter measure-lead mt-9 text-lead text-ink-soft"
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

            <Col span="col-span-4 md:col-span-6 lg:col-span-6">
              <div className="enter" style={{ "--enter-delay": "420ms" }}>
                <VerifyDemo />
              </div>
            </Col>
          </Grid>

          {/* The body copy and the two products, below the fold rather than
              crowding the demonstration. A reader who has watched a line
              confirm itself already knows what the paragraph is going to say. */}
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
          this says which part of it you are reading, which is a different
          question and needs its own control. Sticky rail at desktop, horizontal
          scroller at mobile, same order either way. */}
      <div className="sticky top-17 z-40 border-y border-hairline bg-cream/95 py-3 backdrop-blur-sm lg:hidden">
        <div className="mx-auto max-w-[1200px]">
          <SectionNav sections={SECTIONS} />
        </div>
      </div>

      {/* ── 01 What Gradlly builds. The positioning table from the approved
             copy, which no version of this site has used until now. ────────── */}
      <Band id="positioning">
        <Grid>
          <Col span="col-span-4 md:col-span-6 lg:col-span-4">
            <Ref number="01">What Gradlly builds</Ref>
            <h2 className="display mt-6 max-w-[11ch] text-section text-ink">
              Two products and a Passport.
            </h2>
            {/* A record confirmed once, then again in each role, opening
                outward from the first line. */}
            <ArcField className="mt-10 hidden lg:block" />
          </Col>
          <Col span="col-span-4 md:col-span-6 lg:col-span-7 lg:col-start-6">
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
          </Col>
        </Grid>
      </Band>

      {/* ── 02 The problem, §3 ───────────────────────────────────────────── */}
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

        {/* The second problem, drawn. "Not buried in folders" is a claim every
            compliance product makes and nobody illustrates. */}
        <div className="mt-16">
          <EvidenceCompare />
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

      {/* ── 04 What a record carries. List and detail, over the approved
             §4 content. ──────────────────────────────────────────────────── */}
      <Band id="the-record" tone="linen">
        <Grid className="items-end">
          <Col span="col-span-4 md:col-span-6 lg:col-span-5">
            <Ref number="04" tone="olive">
              What a record carries
            </Ref>
            <h2 className="display mt-6 max-w-[12ch] text-section text-ink">
              Every line, and who stands behind it.
            </h2>
          </Col>
          <Col span="col-span-4 md:col-span-6 lg:col-span-6 lg:col-start-7">
            <p className="measure text-lead text-ink-soft">
              A Continuo record is not one document. Filter it, open a line, and
              the confirmation behind it is the thing you are reading.
            </p>
          </Col>
        </Grid>

        <div className="mt-16">
          <ListDetail items={recordItems} label="what a record carries" />
        </div>
      </Band>

      {/* ── 05 Compliance evidence, with the table and its toolbar. ───────── */}
      <Band id="compliance">
        <Grid>
          <Col span="col-span-4 md:col-span-6 lg:col-span-5">
            <Ref number="05" tone="olive">
              Compliance evidence
            </Ref>
            <h2 className="display mt-6 max-w-[13ch] text-section text-ink">
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
          <Col span="col-span-4 md:col-span-6 lg:col-span-6 lg:col-start-7">
            {/* The real thing, now that there are screenshots of it: search,
                status tabs, filters and the export actions sitting together
                above the data they control. The drawn version it replaces was
                a stand-in for exactly this. */}
            <Screenshot
              name="apprentice-table"
              alt="The employer portal's apprentice list: cohort tiles for active, on track, at risk and end-point assessment this quarter, above a toolbar with status tabs, filters, a search field, CSV and PDF export, and an enrol action."
              width={1810}
              height={330}
              caption="Employer portal, apprentice list."
            />
            <GridFill className="mt-8" />
          </Col>
        </Grid>
      </Band>

      {/* ── 06 Sharing a record. One clause in the copy, four behaviours. ── */}
      <Band id="sharing" tone="linen" className="relative overflow-hidden">
        <Grid className="items-end">
          <Col span="col-span-4 md:col-span-6 lg:col-span-5">
            <Ref number="06" tone="olive">
              Sharing a record
            </Ref>
            <h2 className="display mt-6 max-w-[13ch] text-section text-ink">
              The worker decides what a hirer sees.
            </h2>
          </Col>
          <Col span="col-span-4 md:col-span-6 lg:col-span-6 lg:col-start-7">
            <p className="measure text-lead text-ink-soft">
              Shared by the worker with one link: full or partial, time-limited
              or revocable. Four behaviours in one clause, so here they are as a
              control you can work.
            </p>
          </Col>
        </Grid>
        <div className="mt-14">
          <ShareDiagram />
        </div>
      </Band>

      {/* ── 07 The four portals. ─────────────────────────────────────────── */}
      <Band id="portals">
        <Grid className="items-end">
          <Col span="col-span-4 md:col-span-6 lg:col-span-5">
            <Ref number="07" tone="terracotta">
              The four portals
            </Ref>
            <h2 className="display mt-6 max-w-[13ch] text-section text-ink">
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
        <div className="mt-14">
          <PortalMap />
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2 lg:gap-14">
          <Screenshot
            name="apprentice-progress"
            alt="The apprentice portal's progress tiles: off-the-job progress, next review, days to end-point assessment, pace status, approved hours and open reviews."
            width={1560}
            height={345}
            caption="Apprentice portal, progress."
          />
          <div className="self-center">
            <h3 className="display text-subhead text-ink">
              What the apprentice sees
            </h3>
            <p className="measure mt-3 text-body-sm text-ink-soft">
              Off-the-job progress against the statutory target, the next
              review, days to end-point assessment, and whether their pace is on
              track. The same hours the provider reports and the employer signs
              off, read from the same record.
            </p>
          </div>
        </div>
      </Band>

      {/* ── 08 Levy transfer, which the copy gives one line and which is the
             whole of Gradlly Forge. ───────────────────────────────────────── */}
      <Band id="levy" tone="sand" className="relative overflow-hidden">
        <Grid className="items-end">
          <Col span="col-span-4 md:col-span-6 lg:col-span-5">
            <Ref number="08" tone="terracotta">
              Levy transfer
            </Ref>
            <h2 className="display mt-6 max-w-[14ch] text-section text-ink">
              Unspent levy, matched to an SME that needs it.
            </h2>
          </Col>
          <Col span="col-span-4 md:col-span-6 lg:col-span-6 lg:col-start-7">
            <p className="measure text-lead text-ink-soft">
              Employers with unspent levy matched with SMEs that need funded
              apprenticeships, and the transfer managed from pledge to funded
              start.
            </p>
          </Col>
        </Grid>
        <div className="mt-14">
          <LevyFlow />
        </div>

        <div className="mt-14">
          <Screenshot
            name="levy-health"
            alt="The employer portal's levy health panel: a health score, warnings that utilisation is low and that funds are expiring, a note that the balance was entered manually rather than synced from the ESFA, and an export action."
            width={1550}
            height={390}
            caption="Employer portal, levy health. The panel says plainly when a balance was entered by hand rather than synced from the ESFA, because an employer acting on a stale figure is the failure this screen exists to prevent."
          />
        </div>
      </Band>

      {/* ── 09 Passport, §6 ──────────────────────────────────────────────── */}
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
          <div className="self-start">
            <PassportMock />
            {/* A record built a layer at a time during delivery, then handed
                over whole. */}
            <PlateStack className="mt-5" />
          </div>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <Screenshot
            name="ksb-coverage"
            alt="The KSB coverage heatmap: knowledge, skill and behaviour codes from an apprenticeship standard, each showing how many pieces of evidence are mapped to it and whether coverage is none, low or adequate."
            width={1560}
            height={600}
            caption="Apprentice portal, KSB coverage. Every knowledge, skill and behaviour in the standard, with the evidence mapped to it."
          />
          <Screenshot
            name="epa-pack"
            alt="The end-point assessment evidence pack: accepted evidence items, KSB coverage summary, review history, off-the-job summary, commitment statement and reflective statements, each with its readiness, and an export action."
            width={1560}
            height={530}
            caption="Apprentice portal, end-point assessment pack. It states which sections are not ready rather than exporting a pack that looks complete."
          />
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
              <FlowPath
                steps={continuoFlow}
                tone="olive"
                label="How Continuo works"
              />
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
              <FlowPath
                steps={amsFlow}
                tone="terracotta"
                label="How Gradlly AMS works"
              />
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
          <div className="self-end">
            <p className="measure text-body text-ink-soft">
              When an apprentice finishes, they can carry their Passport&rsquo;s
              verified achievements into Continuo, with their consent. Their
              first employer onboards from proof on day one.
            </p>
            {/* Two sets of lines that run on their own and cross once, which is
                exactly what the copy says about the two products. */}
            <WeaveField className="mt-8" />
          </div>
        </div>
      </Band>

      {/* ── 08 Every state, designed. ────────────────────────────────────── */}
      <Band id="states" tone="linen">
        <Grid className="items-end">
          <Col span="col-span-4 md:col-span-6 lg:col-span-5">
            <Ref number="08">Every state, designed</Ref>
            <h2 className="display mt-6 max-w-[13ch] text-section text-ink">
              Including the ones nobody demos.
            </h2>
          </Col>
          <Col span="col-span-4 md:col-span-6 lg:col-span-6 lg:col-start-7">
            <p className="measure text-body text-ink-soft">
              A cohort with nobody in it yet. A DAS call that times out. An
              evidence pack that is ready. Designing only the populated screen
              is how a product ships something that breaks the first time
              reality is not ideal, so every screen in Gradlly has its empty,
              loading, error and confirmed states drawn.
            </p>
          </Col>
        </Grid>
        <div className="mt-14">
          <StatesMock />
        </div>
      </Band>

      {/* ── 09 Who it's for, §8 ──────────────────────────────────────────── */}
      <Band id="who-its-for" tone="sand">
        <BandHead
          id="who-its-for-heading"
          note="Four audiences reading the same record from different sides."
        >
          Built for each side of the journey.
        </BandHead>

        <AudienceField className="mt-12 max-w-[520px]" />

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
