"use client";

import { useId, useState } from "react";

/**
 * Diagrams.
 *
 * ── WHY DIAGRAMS AND NOT PICTURES ───────────────────────────────────────────
 *
 * There is no photograph of verification, and a simulated dashboard with
 * numbers in it is a fabricated claim with a frame around it, which this site
 * removed on purpose. What is left is the honest graphical form for a product
 * whose subject is a mechanism: draw the mechanism.
 *
 * Every one of these explains something content-v1.md states, and none of them
 * contains a figure, a name or a date. They are drawn in SVG so they stay sharp
 * at any density, cost nothing to download, and can be corrected in a line.
 *
 * Motion answers an action. Hovering or focusing a step in a flow lights its
 * path; choosing a share mode redraws what that mode reaches. Nothing plays on
 * scroll.
 */

const OLIVE = "var(--color-olive)";
const TERRACOTTA = "var(--color-terracotta)";
const HAIRLINE = "var(--color-hairline)";

/* ── A flow, drawn ─────────────────────────────────────────────────────────── */

/**
 * The steps of a flow as connected nodes, with the connecting line drawn
 * between them rather than implied by stacking.
 *
 * Hovering or focusing a step fills its node and thickens the segment leading
 * to it, so a reader can trace the sequence with a pointer instead of counting.
 */
export function FlowPath({ steps, tone = "olive", label }) {
  const [active, setActive] = useState(-1);
  const colour = tone === "terracotta" ? TERRACOTTA : OLIVE;

  return (
    <ol className="list-none" aria-label={label}>
      {steps.map(({ claim, detail }, index) => {
        const lit = index <= active;
        const isLast = index === steps.length - 1;

        return (
          <li
            key={claim}
            className="group relative flex gap-5 pb-8 last:pb-0"
            onMouseEnter={() => setActive(index)}
            onMouseLeave={() => setActive(-1)}
            onFocus={() => setActive(index)}
            onBlur={() => setActive(-1)}
          >
            {/* The spine between the nodes. Drawn, not a border, so its weight
                can change without the row reflowing. */}
            <span
              className="absolute left-0 top-0 flex w-5 justify-center"
              style={{ height: isLast ? "1.5rem" : "100%" }}
              aria-hidden
            >
              <span
                className="mt-6 w-px flex-1 transition-colors duration-300 ease-out"
                style={{
                  backgroundColor: lit ? colour : HAIRLINE,
                  display: isLast ? "none" : "block",
                }}
              />
            </span>

            <span
              className="relative z-10 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ease-out"
              style={{
                borderColor: lit ? colour : HAIRLINE,
                backgroundColor: lit ? colour : "var(--color-linen)",
              }}
              aria-hidden
            >
              <span
                className="block h-1.5 w-1.5 rounded-full transition-colors duration-300 ease-out"
                style={{
                  backgroundColor: lit ? "var(--color-linen)" : HAIRLINE,
                }}
              />
            </span>

            <span className="min-w-0 flex-1">
              <span
                tabIndex={0}
                className="block text-subhead font-medium text-ink outline-none focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-4"
              >
                {claim}
              </span>
              <span className="measure mt-2 block text-body-sm text-ink-soft">
                {detail}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/* ── How a record is shared ────────────────────────────────────────────────── */

const SHARE_MODES = [
  {
    id: "full",
    label: "Full",
    reaches: [0, 1, 2, 3],
    note: "Everything on the record: skills, checks and the confirmations behind them.",
  },
  {
    id: "partial",
    label: "Partial",
    reaches: [0, 1],
    note: "Only the lines the worker chooses. An agency placing a care shift sees the skills and the DBS, and nothing else.",
  },
  {
    id: "timed",
    label: "Time-limited",
    reaches: [0, 1, 2],
    note: "The link stops working on a date the worker sets, without anyone having to remember to revoke it.",
  },
  {
    id: "revoked",
    label: "Revoked",
    reaches: [],
    note: "The worker withdraws access. The record stays theirs; what the hirer could see is gone.",
  },
];

const SHARE_ROWS = ["Skills", "Identity and right to work", "DBS", "Conduct"];

/**
 * What a share link reaches.
 *
 * content-v1.md says a record is "shared by the worker with one link, full or
 * partial, time-limited or revocable", which is four behaviours stated in one
 * clause and easy to read past. Making it a control a reader can work turns the
 * clause into something they understand.
 */
export function ShareDiagram() {
  const groupId = useId();
  const [mode, setMode] = useState(SHARE_MODES[0]);

  return (
    <div>
      <fieldset>
        <legend className="text-caption text-ink-muted">
          What the worker shares
        </legend>
        <div className="mt-3 flex flex-wrap gap-2" role="radiogroup">
          {SHARE_MODES.map((option) => {
            const current = option.id === mode.id;
            return (
              <label
                key={option.id}
                htmlFor={`${groupId}-${option.id}`}
                className={`cursor-pointer rounded-control border px-4 py-2 text-body-sm transition-colors duration-200 ease-out ${
                  current
                    ? "border-ink bg-ink text-linen"
                    : "border-hairline text-ink-soft hover:border-ink hover:text-ink"
                }`}
              >
                <input
                  id={`${groupId}-${option.id}`}
                  type="radio"
                  name={groupId}
                  checked={current}
                  onChange={() => setMode(option)}
                  className="sr-only"
                />
                {option.label}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-8 grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
        {/* The record. Every line is always on it; what changes is reach. */}
        <ul className="list-none">
          {SHARE_ROWS.map((row, index) => {
            const reached = mode.reaches.includes(index);
            return (
              <li
                key={row}
                className="flex items-center gap-3 border-t border-hairline py-3 last:border-b"
              >
                <span
                  className="block w-1 rounded-full transition-all duration-300 ease-out"
                  style={{
                    height: "1.25rem",
                    backgroundColor: reached ? OLIVE : HAIRLINE,
                  }}
                  aria-hidden
                />
                <span
                  className="text-body-sm transition-colors duration-300 ease-out"
                  style={{
                    color: reached
                      ? "var(--color-ink)"
                      : "var(--color-ink-muted)",
                  }}
                >
                  {row}
                </span>
              </li>
            );
          })}
        </ul>

        {/* The link itself. Dashes when it carries something, a break when it
            does not. */}
        <svg
          width="92"
          height="20"
          viewBox="0 0 92 20"
          className="hidden sm:block"
          aria-hidden
          focusable="false"
        >
          <path
            d="M2 10 H90"
            fill="none"
            stroke={mode.reaches.length > 0 ? OLIVE : HAIRLINE}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={mode.reaches.length > 0 ? "4 7" : "2 10"}
            className="transition-[stroke] duration-300 ease-out"
          />
        </svg>

        <div className="rounded-card border border-hairline bg-linen p-5">
          <p className="text-caption text-ink-muted">The hirer sees</p>
          <p className="mt-2 text-body-sm text-ink">
            {mode.reaches.length === 0
              ? "Nothing. The link no longer resolves."
              : `${mode.reaches.length} of ${SHARE_ROWS.length} parts of the record`}
          </p>
        </div>
      </div>

      <p className="measure mt-6 text-body-sm text-ink-soft" aria-live="polite">
        {mode.note}
      </p>
    </div>
  );
}

/* ── The four portals ──────────────────────────────────────────────────────── */

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

/**
 * Four portals around one apprenticeship.
 *
 * The point the list in content-v1.md does not make on its own is that these are
 * not four products. They are four doors onto the same record, which is why
 * evidence does not have to be reconciled between them, and the diagram says
 * that by putting the apprenticeship in the middle.
 */
export function PortalMap() {
  const [active, setActive] = useState(-1);

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center">
      <ul className="list-none space-y-4">
        {PORTALS.slice(0, 2).map((portal, index) => (
          <PortalCard
            key={portal.name}
            portal={portal}
            active={active === index}
            onEnter={() => setActive(index)}
            onLeave={() => setActive(-1)}
          />
        ))}
      </ul>

      <div className="flex items-center justify-center">
        <div className="rounded-card border border-ink bg-olive px-6 py-8 text-center">
          <p className="text-caption text-linen/60">One apprenticeship</p>
          <p className="display mt-2 text-subhead text-linen">
            One shared record
          </p>
          <p className="mx-auto mt-3 max-w-[22ch] text-caption text-linen/70">
            Four doors onto the same evidence, so nothing has to be reconciled
            between them.
          </p>
        </div>
      </div>

      <ul className="list-none space-y-4">
        {PORTALS.slice(2).map((portal, index) => (
          <PortalCard
            key={portal.name}
            portal={portal}
            active={active === index + 2}
            onEnter={() => setActive(index + 2)}
            onLeave={() => setActive(-1)}
          />
        ))}
      </ul>
    </div>
  );
}

function PortalCard({ portal, active, onEnter, onLeave }) {
  return (
    <li
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      className="rounded-card border bg-linen p-5 transition-colors duration-200 ease-out"
      style={{
        borderColor: active ? "var(--color-ink)" : HAIRLINE,
      }}
    >
      <p className="flex items-center gap-2.5 text-caption text-ink-muted">
        <span
          className="block w-1 rounded-full transition-colors duration-200 ease-out"
          style={{
            height: "0.875rem",
            backgroundColor: active ? TERRACOTTA : HAIRLINE,
          }}
          aria-hidden
        />
        {portal.who}
      </p>
      <h4
        tabIndex={0}
        className="display mt-2 text-subhead text-ink outline-none focus-visible:underline focus-visible:underline-offset-4"
      >
        {portal.name}
      </h4>
      <p className="mt-2 text-body-sm text-ink-soft">{portal.detail}</p>
    </li>
  );
}

/* ── Evidence, before and after ────────────────────────────────────────────── */

/**
 * Proof organised by obligation rather than buried in folders.
 *
 * content-v1.md states both halves of this in one bullet. Drawing them side by
 * side is the only way the difference lands, because "not buried in folders" is
 * a claim every compliance product makes and nobody illustrates.
 */
export function EvidenceCompare() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="rounded-card border border-hairline bg-linen p-6">
        <p className="text-caption text-ink-muted">How it usually sits</p>
        <ul className="mt-5 list-none space-y-2.5">
          {[
            "2024 audit",
            "DBS scans",
            "Inductions",
            "Misc",
            "Old site cards",
          ].map((folder, index) => (
            <li
              key={folder}
              className="flex items-center gap-3"
              style={{
                paddingLeft: `${index % 3 === 0 ? 0 : (index % 3) * 14}px`,
              }}
            >
              <svg width="14" height="12" viewBox="0 0 14 12" aria-hidden>
                <path
                  d="M1 3.2A1.2 1.2 0 0 1 2.2 2h2.9l1.2 1.4h5.5A1.2 1.2 0 0 1 13 4.6v5.2A1.2 1.2 0 0 1 11.8 11H2.2A1.2 1.2 0 0 1 1 9.8z"
                  fill="none"
                  stroke={HAIRLINE}
                  strokeWidth="1.2"
                />
              </svg>
              <span className="text-body-sm text-ink-muted">{folder}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-caption text-ink-muted">
          Rebuilt by hand before every audit.
        </p>
      </div>

      <div className="rounded-card border border-ink bg-linen p-6">
        <p className="text-caption text-ink-muted">How Continuo holds it</p>
        <ul className="mt-5 list-none">
          {[
            "Right to work",
            "Safeguarding",
            "Competence",
            "Qualifications",
          ].map((obligation) => (
            <li
              key={obligation}
              className="flex items-center justify-between gap-4 border-t border-hairline py-2.5 last:border-b"
            >
              <span className="flex items-center gap-3">
                <span
                  className="block w-1 rounded-full"
                  style={{ height: "0.875rem", backgroundColor: OLIVE }}
                  aria-hidden
                />
                <span className="text-body-sm text-ink">{obligation}</span>
              </span>
              <span className="text-caption text-ink-muted">Complete</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-caption text-ink-muted">
          One obligation, one row, evidence attached.
        </p>
      </div>
    </div>
  );
}

/* ── Levy transfer ─────────────────────────────────────────────────────────── */

/**
 * Levy transfer, which content-v1.md gives one line and which is the whole of
 * Gradlly Forge: employers with unspent levy matched with SMEs that need funded
 * apprenticeships.
 */
export function LevyFlow() {
  const stages = [
    {
      label: "Levy-paying employer",
      note: "Unspent levy, with an expiry date",
    },
    { label: "Gradlly Forge", note: "Matched by sector, region and programme" },
    {
      label: "SME",
      note: "A funded apprenticeship that would not have started",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-stretch">
      {stages.map((stage, index) => (
        <div key={stage.label} className="contents">
          <div
            className={`rounded-card border p-5 ${
              index === 1
                ? "border-ink bg-olive text-linen"
                : "border-hairline bg-linen"
            }`}
          >
            <p
              className={`text-caption ${index === 1 ? "text-linen/60" : "text-ink-muted"}`}
            >
              {index === 1 ? "The marketplace" : index === 0 ? "From" : "To"}
            </p>
            <p
              className={`display mt-2 text-subhead ${index === 1 ? "text-linen" : "text-ink"}`}
            >
              {stage.label}
            </p>
            <p
              className={`mt-2 text-body-sm ${index === 1 ? "text-linen/75" : "text-ink-soft"}`}
            >
              {stage.note}
            </p>
          </div>

          {index < stages.length - 1 ? (
            <div className="flex items-center justify-center py-2 md:py-0">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                aria-hidden
                focusable="false"
                className="rotate-90 md:rotate-0"
              >
                <path
                  d="M4 20 H34"
                  stroke={TERRACOTTA}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="4 6"
                />
              </svg>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
