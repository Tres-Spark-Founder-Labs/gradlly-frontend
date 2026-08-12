// @ts-check

/**
 * Derives the portfolio's headline counts from the KSB heatmap the API
 * returns.
 *
 * This exists because `data/portfolio.data.js` used to supply them as
 * constants — a 218-line hardcoded KSB list with invented coverage states, and
 * hardcoded group totals ("Knowledge: 12 total, 8 evidenced"). Every apprentice
 * saw the same fabricated portfolio regardless of what they had uploaded
 * (OQ-15). Nothing here invents a value: an empty heatmap produces zeroes and
 * an empty gap list, which is a true statement about a learner who has
 * uploaded nothing.
 *
 * Grouping and counting only — no threshold or business rule. The strengths
 * themselves are assessed server-side in `PortfolioHeatmapService`.
 */

/** Mirrors the `strength` enum on `KsbHeatmapCellResponseDto`. */
export const KSB_STRENGTH = Object.freeze({
  NONE: "none",
  LOW: "low",
  ADEQUATE: "adequate",
});

/** Mirrors the `kind` enum. Order is the order they are displayed in. */
export const KSB_KINDS = Object.freeze([
  { key: "knowledge", label: "Knowledge", short: "K" },
  { key: "skill", label: "Skills", short: "S" },
  { key: "behaviour", label: "Behaviours", short: "B" },
]);

/**
 * @param {Array<{code?: string, kind?: string, title?: string, evidenceCount?: number, strength?: string, tutorAssessment?: string|null}>} cells
 */
export function summariseKsbCoverage(cells = []) {
  const total = cells.length;
  const evidenced = cells.filter(
    (c) => c.strength && c.strength !== KSB_STRENGTH.NONE,
  ).length;
  const adequate = cells.filter(
    (c) => c.strength === KSB_STRENGTH.ADEQUATE,
  ).length;
  const low = cells.filter((c) => c.strength === KSB_STRENGTH.LOW).length;
  const notStarted = total - evidenced;

  return {
    total,
    evidenced,
    adequate,
    low,
    notStarted,
    /** Null rather than 0 when there is no standard loaded — unknown, not zero. */
    percentEvidenced: total > 0 ? Math.round((evidenced / total) * 100) : null,
  };
}

/** Per-kind totals, so the grid's group headers are real counts. */
export function summariseByKind(cells = []) {
  return KSB_KINDS.map(({ key, label, short }) => {
    const inKind = cells.filter((c) => c.kind === key);
    return {
      key,
      label,
      short,
      total: inKind.length,
      evidenced: inKind.filter(
        (c) => c.strength && c.strength !== KSB_STRENGTH.NONE,
      ).length,
      cells: inKind,
    };
  });
}

/**
 * The KSBs still to evidence before gateway.
 *
 * Replaces a literal `GAPS = ["K11","S12","S15","S16","B8"]` — five specific
 * standards named to every apprentice as outstanding, invented. This returns
 * the codes that genuinely have no evidence, in the order the API listed them.
 */
export function ksbGaps(cells = [], limit = null) {
  const gaps = cells
    .filter((c) => !c.strength || c.strength === KSB_STRENGTH.NONE)
    .map((c) => c.code)
    .filter(Boolean);

  return limit === null ? gaps : gaps.slice(0, limit);
}
