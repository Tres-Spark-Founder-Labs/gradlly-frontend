import { describe, expect, it } from "vitest";

import { buildPlainSummary, detectLegalisticFields } from "./plain-summary";

/**
 * F3.4.1 AC1 — "Plain-English commitment statement summary is shown before the
 * full document."
 *
 * The summary is a selection over the structured fields the API already
 * returns, so these tests pin two things: that the right fields are selected in
 * the right order, and that legalistic content is flagged rather than passed
 * off as simplified.
 */
describe("F3.4.1 AC1 — plain-English summary", () => {
  const content = {
    trainingPlanSummary: "You will train as a data technician over 18 months.",
    apprenticeCommitments: "Attend all training days. Log your hours weekly.",
    employerCommitments: "Give you 6 hours a week for off-the-job training.",
    providerCommitments: "Provide a tutor and review your progress.",
    weeklyHours: 6,
    additionalTerms: "Travel costs are covered.",
  };

  it("AC1: puts what the apprentice is agreeing to first", () => {
    const { sections } = buildPlainSummary(content);
    expect(sections[0].key).toBe("apprenticeCommitments");
    expect(sections[0].heading).toBe("What you are agreeing to");
  });

  it("AC1: surfaces weekly off-the-job hours as a checkable fact", () => {
    const { facts } = buildPlainSummary(content);
    expect(facts).toContainEqual({
      label: "Off-the-job training",
      value: "6 hours a week",
    });
  });

  it("AC1: omits fields the statement does not have rather than inventing them", () => {
    const { sections } = buildPlainSummary({
      apprenticeCommitments: "Attend all training days.",
    });
    expect(sections).toHaveLength(1);
    expect(sections.map((s) => s.key)).toEqual(["apprenticeCommitments"]);
  });

  it("AC1: reports an empty statement instead of rendering a blank summary", () => {
    expect(buildPlainSummary({}).isEmpty).toBe(true);
    expect(buildPlainSummary(null).isEmpty).toBe(true);
  });

  it("AC1: does not claim a zero-hour statement has hours", () => {
    const { facts } = buildPlainSummary({ ...content, weeklyHours: 0 });
    expect(facts).toHaveLength(0);
  });

  describe("legalistic content is flagged, not disguised", () => {
    it("AC1: flags legal drafting so it is not presented as plain English", () => {
      const flagged = detectLegalisticFields({
        apprenticeCommitments:
          "The Apprentice shall be deemed to have accepted the aforementioned terms notwithstanding any prior agreement.",
      });
      expect(flagged).toContain("apprenticeCommitments");
    });

    it("AC1: flags very long sentences, the other mark of drafting-for-lawyers", () => {
      const longSentence = `The apprentice ${"and the employer ".repeat(20)} agree.`;
      expect(
        detectLegalisticFields({ employerCommitments: longSentence }),
      ).toContain("employerCommitments");
    });

    it("AC1: leaves ordinary language unflagged", () => {
      expect(detectLegalisticFields(content)).toEqual([]);
    });
  });
});
