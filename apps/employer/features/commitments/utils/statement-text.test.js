import { describe, expect, it } from "vitest";

import { humaniseKey, renderStatementText } from "./statement-text";

/**
 * F1.3.2 AC1 — the employer reads the statement before agreeing to be bound
 * by it. The modal previously showed a hardcoded sample naming a fictional
 * employer and apprentice, so what was on screen had no relationship to the
 * document being signed.
 */
describe("humaniseKey", () => {
  it("splits camelCase", () => {
    expect(humaniseKey("otjDeliveryPlan")).toBe("Otj delivery plan");
  });

  it("handles snake_case", () => {
    expect(humaniseKey("employer_responsibilities")).toBe(
      "Employer responsibilities",
    );
  });
});

describe("renderStatementText", () => {
  it("renders each section with a readable heading", () => {
    const text = renderStatementText({
      employerResponsibilities: "Release the apprentice for training days.",
      otjHoursPerWeek: 6,
    });

    expect(text).toContain("Employer responsibilities");
    expect(text).toContain("Release the apprentice for training days.");
    expect(text).toContain("Otj hours per week");
    expect(text).toContain("6");
  });

  it("passes plain string content straight through", () => {
    expect(renderStatementText("Just some prose.")).toBe("Just some prose.");
  });

  it("renders arrays as a list", () => {
    const text = renderStatementText({ duties: ["Attend reviews", "Log OTJ"] });
    expect(text).toContain("• Attend reviews");
    expect(text).toContain("• Log OTJ");
  });

  it("renders nested objects rather than printing [object Object]", () => {
    const text = renderStatementText({
      provider: { name: "Apex College", contact: "tutor@apex.test" },
    });
    expect(text).toContain("Name: Apex College");
    expect(text).not.toContain("[object Object]");
  });

  it("warns rather than showing a blank panel when content is missing", () => {
    // A blank box above a "sign" button reads as a loading glitch, and the
    // employer cannot tell whether they are agreeing to something or nothing.
    const text = renderStatementText(null);
    expect(text).toMatch(/could not be loaded/i);
    expect(text).toMatch(/Do not sign/i);
  });

  it("says so when the statement is genuinely empty", () => {
    expect(renderStatementText({})).toBe("This statement has no content.");
    expect(renderStatementText("   ")).toBe("This statement has no content.");
  });

  it("skips empty fields rather than printing blank headings", () => {
    const text = renderStatementText({
      kept: "value",
      dropped: null,
      alsoDropped: "",
    });
    expect(text).toContain("Kept");
    expect(text).not.toContain("Dropped");
  });
});
