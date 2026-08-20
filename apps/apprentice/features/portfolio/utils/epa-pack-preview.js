/**
 * F3.3.4 AC4 — "Apprentice can preview the pack before generating the final
 * export."
 *
 * The preview is built from data the apprentice already has on screen
 * elsewhere, because the pack's own manifest only exists after the build. It
 * therefore describes what the pack *will* contain, and the completed job's
 * manifest describes what it *did* contain — the component shows the manifest
 * once it arrives.
 *
 * ── AC1 AND THE MISSING REFLECTIVE STATEMENTS ───────────────────────────────
 *
 * AC1 lists six things the pack compiles, and one of them — reflective
 * statements — comes from F3.3.3, which is not built. `epa-pack-builder.service.ts`
 * has no reflective handling at all, so the section is currently absent rather
 * than empty.
 *
 * Absent and empty look identical in a file listing, and that is the dangerous
 * case: an apprentice submitting to an EPAO would have no way to tell that a
 * required section is missing rather than merely unused. So the preview lists
 * the section with an explicit unavailable state. The export still succeeds —
 * it must not fail — but nobody can mistake the omission for a complete pack.
 */

export const PACK_SECTION_STATUS = Object.freeze({
  READY: "ready",
  EMPTY: "empty",
  UNAVAILABLE: "unavailable",
});

/**
 * Builds the preview rows.
 *
 * `counts` carries what the caller could resolve; anything it could not is
 * reported honestly rather than defaulted to zero, because "0 items" and "we
 * could not check" mean different things to someone about to submit for
 * assessment.
 */
export function buildPackPreview({
  evidenceCount,
  ksbCoveredCount,
  ksbTotalCount,
  reviewCount,
  otjHours,
  hasCommitmentStatement,
} = {}) {
  const row = (key, label, status, detail) => ({ key, label, status, detail });

  const countRow = (key, label, value, unit) => {
    if (value === null || value === undefined) {
      return row(
        key,
        label,
        PACK_SECTION_STATUS.UNAVAILABLE,
        "Could not check",
      );
    }
    if (value === 0) {
      return row(key, label, PACK_SECTION_STATUS.EMPTY, `No ${unit} yet`);
    }
    return row(
      key,
      label,
      PACK_SECTION_STATUS.READY,
      `${value} ${value === 1 ? unit.replace(/s$/, "") : unit}`,
    );
  };

  return [
    countRow("evidence", "Accepted evidence items", evidenceCount, "items"),
    ksbTotalCount
      ? row(
          "ksb",
          "KSB coverage summary",
          ksbCoveredCount > 0
            ? PACK_SECTION_STATUS.READY
            : PACK_SECTION_STATUS.EMPTY,
          `${ksbCoveredCount ?? 0} of ${ksbTotalCount} covered`,
        )
      : row(
          "ksb",
          "KSB coverage summary",
          PACK_SECTION_STATUS.UNAVAILABLE,
          "Could not check",
        ),
    countRow("reviews", "Review history", reviewCount, "reviews"),
    otjHours === null || otjHours === undefined
      ? row(
          "otj",
          "Off-the-job summary",
          PACK_SECTION_STATUS.UNAVAILABLE,
          "Could not check",
        )
      : row(
          "otj",
          "Off-the-job summary",
          otjHours > 0 ? PACK_SECTION_STATUS.READY : PACK_SECTION_STATUS.EMPTY,
          `${otjHours} hours logged`,
        ),
    row(
      "commitment",
      "Commitment statement",
      hasCommitmentStatement
        ? PACK_SECTION_STATUS.READY
        : PACK_SECTION_STATUS.EMPTY,
      hasCommitmentStatement ? "Included" : "Not signed yet",
    ),
    /**
     * Listed deliberately, always unavailable. See the header note: F3.3.3 is
     * not built, so the builder emits no reflective statements section at all.
     * Showing the row with an explicit state is what stops a missing AC1
     * section from looking like a section the learner simply never filled in.
     */
    row(
      "reflective",
      "Reflective statements",
      PACK_SECTION_STATUS.UNAVAILABLE,
      "Not available yet — this section is not part of the pack",
    ),
  ];
}

/** True when at least one section carries content worth exporting. */
export function hasExportableContent(rows) {
  return rows.some((r) => r.status === PACK_SECTION_STATUS.READY);
}
