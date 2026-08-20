import { describe, expect, it } from "vitest";

import {
  PACK_SECTION_STATUS,
  buildPackPreview,
  hasExportableContent,
} from "./epa-pack-preview";

/**
 * F3.3.4 — EPA Evidence Pack Export.
 *
 * AC1 lists what the pack compiles; AC4 requires a preview before generating.
 * These pin the part of AC1 that is currently unmet — reflective statements —
 * so that when F3.3.3 lands, the test that has to change says exactly what to
 * change.
 */
describe("F3.3.4 — pack preview", () => {
  const full = {
    evidenceCount: 12,
    ksbCoveredCount: 18,
    ksbTotalCount: 30,
    reviewCount: 4,
    otjHours: 240,
    hasCommitmentStatement: true,
  };

  it("AC4: lists every section the pack compiles, before anything is generated", () => {
    const rows = buildPackPreview(full);
    expect(rows.map((r) => r.key)).toEqual([
      "evidence",
      "ksb",
      "reviews",
      "otj",
      "commitment",
      "reflective",
    ]);
  });

  it("AC1: reports counts for the sections that have content", () => {
    const rows = buildPackPreview(full);
    const byKey = Object.fromEntries(rows.map((r) => [r.key, r]));

    expect(byKey.evidence.status).toBe(PACK_SECTION_STATUS.READY);
    expect(byKey.evidence.detail).toBe("12 items");
    expect(byKey.ksb.detail).toBe("18 of 30 covered");
    expect(byKey.otj.detail).toBe("240 hours logged");
    expect(byKey.commitment.detail).toBe("Included");
  });

  /**
   * The heart of item 12: F3.3.3 Reflective Statement Tool is not built, and
   * `epa-pack-builder.service.ts` has no reflective handling, so the section is
   * absent from the ZIP rather than present and empty.
   */
  it("AC1: shows reflective statements as unavailable rather than omitting the row", () => {
    const rows = buildPackPreview(full);
    const reflective = rows.find((r) => r.key === "reflective");

    expect(reflective).toBeDefined();
    expect(reflective.status).toBe(PACK_SECTION_STATUS.UNAVAILABLE);
    expect(reflective.detail).toMatch(/not part of the pack/i);
  });

  it("AC1: reflective statements stay unavailable even on a complete portfolio", () => {
    // Nothing the apprentice does can fill this section while F3.3.3 is unbuilt,
    // so the row must not imply it is their omission to fix.
    const rows = buildPackPreview({ ...full, evidenceCount: 500 });
    expect(rows.find((r) => r.key === "reflective").status).toBe(
      PACK_SECTION_STATUS.UNAVAILABLE,
    );
  });

  it("distinguishes an empty section from one it could not check", () => {
    const rows = buildPackPreview({
      ...full,
      evidenceCount: 0,
      reviewCount: null,
    });
    const byKey = Object.fromEntries(rows.map((r) => [r.key, r]));

    // "No items yet" is the learner's position; "Could not check" is ours.
    // Collapsing them would tell someone their portfolio is empty when in fact
    // the request failed.
    expect(byKey.evidence.status).toBe(PACK_SECTION_STATUS.EMPTY);
    expect(byKey.evidence.detail).toBe("No items yet");
    expect(byKey.reviews.status).toBe(PACK_SECTION_STATUS.UNAVAILABLE);
    expect(byKey.reviews.detail).toBe("Could not check");
  });

  it("singularises a count of one", () => {
    const rows = buildPackPreview({ ...full, reviewCount: 1 });
    expect(rows.find((r) => r.key === "reviews").detail).toBe("1 review");
  });

  it("marks an unsigned commitment statement as not yet included", () => {
    const rows = buildPackPreview({ ...full, hasCommitmentStatement: false });
    const commitment = rows.find((r) => r.key === "commitment");
    expect(commitment.status).toBe(PACK_SECTION_STATUS.EMPTY);
    expect(commitment.detail).toBe("Not signed yet");
  });

  it("AC4: an entirely empty portfolio still previews without throwing", () => {
    const rows = buildPackPreview({});
    expect(rows).toHaveLength(6);
    expect(hasExportableContent(rows)).toBe(false);
  });

  it("reports exportable content when any section is ready", () => {
    expect(hasExportableContent(buildPackPreview(full))).toBe(true);
  });
});
