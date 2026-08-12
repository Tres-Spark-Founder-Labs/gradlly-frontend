import { describe, expect, it } from "vitest";

import {
  KSB_STRENGTH,
  ksbGaps,
  summariseByKind,
  summariseKsbCoverage,
} from "./ksb-summary";

const cell = (code, kind, strength) => ({
  code,
  kind,
  title: `${code} title`,
  strength,
  evidenceCount: strength === KSB_STRENGTH.NONE ? 0 : 1,
});

const cells = [
  cell("K1", "knowledge", KSB_STRENGTH.ADEQUATE),
  cell("K2", "knowledge", KSB_STRENGTH.LOW),
  cell("K3", "knowledge", KSB_STRENGTH.NONE),
  cell("S1", "skill", KSB_STRENGTH.ADEQUATE),
  cell("S2", "skill", KSB_STRENGTH.NONE),
  cell("B1", "behaviour", KSB_STRENGTH.NONE),
];

describe("KSB coverage summary (F3.3.1 / F3.3.2)", () => {
  it("counts evidenced, adequate, low and not-started from real cells", () => {
    const s = summariseKsbCoverage(cells);

    expect(s.total).toBe(6);
    expect(s.evidenced).toBe(3); // K1 + K2 + S1
    expect(s.adequate).toBe(2); // K1, S1
    expect(s.low).toBe(1); // K2
    expect(s.notStarted).toBe(3); // K3, S2, B1
    expect(s.percentEvidenced).toBe(50);
  });

  it("counts low-strength evidence as evidenced, not as missing", () => {
    // "Some evidence, not enough yet" is a different message from "nothing
    // uploaded", and the apprentice acts on them differently.
    const s = summariseKsbCoverage([cell("K1", "knowledge", KSB_STRENGTH.LOW)]);

    expect(s.evidenced).toBe(1);
    expect(s.notStarted).toBe(0);
  });

  describe("an empty portfolio", () => {
    it("reports zeroes rather than a fabricated baseline", () => {
      const s = summariseKsbCoverage([]);

      expect(s.total).toBe(0);
      expect(s.evidenced).toBe(0);
      expect(s.notStarted).toBe(0);
    });

    it("reports an unknown percentage, not 0%", () => {
      // 0% implies a known denominator. With no standard loaded there isn't
      // one, and the screen must say so rather than imply no progress.
      expect(summariseKsbCoverage([]).percentEvidenced).toBeNull();
    });
  });

  describe("per-kind totals", () => {
    it("derives group counts instead of hardcoding them", () => {
      const [knowledge, skills, behaviours] = summariseByKind(cells);

      expect(knowledge).toMatchObject({ total: 3, evidenced: 2 });
      expect(skills).toMatchObject({ total: 2, evidenced: 1 });
      expect(behaviours).toMatchObject({ total: 1, evidenced: 0 });
    });

    it("returns every kind even when a standard has none of it", () => {
      const groups = summariseByKind([cell("K1", "knowledge", "adequate")]);

      expect(groups).toHaveLength(3);
      expect(groups[2]).toMatchObject({ key: "behaviour", total: 0 });
    });
  });

  describe("gaps — the list that was previously invented", () => {
    it("names only KSBs that genuinely have no evidence", () => {
      expect(ksbGaps(cells)).toEqual(["K3", "S2", "B1"]);
    });

    it("returns nothing for a fully evidenced portfolio", () => {
      // The old component hardcoded five gaps, so a learner who had evidenced
      // everything was still told five standards were outstanding.
      const complete = cells.map((c) => ({
        ...c,
        strength: KSB_STRENGTH.ADEQUATE,
      }));

      expect(ksbGaps(complete)).toEqual([]);
    });

    it("returns nothing for an empty heatmap rather than a default list", () => {
      expect(ksbGaps([])).toEqual([]);
    });

    it("can be capped for display without changing the underlying count", () => {
      expect(ksbGaps(cells, 2)).toEqual(["K3", "S2"]);
      expect(ksbGaps(cells)).toHaveLength(3);
    });
  });
});
