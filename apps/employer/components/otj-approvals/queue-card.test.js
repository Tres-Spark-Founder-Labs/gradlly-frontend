import { describe, expect, it } from "vitest";

import {
  apprenticeInitials,
  displayApprentice,
  formatCategory,
  formatSubmitted,
  isAwaitingDecision,
} from "./OTJQueueCard";

/**
 * F1.2.3 AC1 — the queue lists apprentice name, activity description,
 * category, hours, submission date and evidence.
 *
 * Four of those were wrong or absent: the name was a truncated UUID, the
 * category was never rendered, the description showed only the optional note,
 * and the date shown was when the learning happened rather than when it was
 * submitted.
 */
describe("displayApprentice", () => {
  it("shows the apprentice's name", () => {
    expect(
      displayApprentice({ apprenticeName: "Alex Okafor", apprenticeId: "x" }),
    ).toBe("Alex Okafor");
  });

  it("falls back to the id when no name was loaded", () => {
    // Degrades to the previous behaviour rather than rendering blank.
    const result = displayApprentice({
      apprenticeName: null,
      apprenticeId: "1b4e28ba-2fa1-4d2b-883f-000000000001",
    });
    expect(result).toBe("1b4e28ba…000000000001");
  });

  it("treats a whitespace-only name as absent", () => {
    const result = displayApprentice({
      apprenticeName: "   ",
      apprenticeId: "1b4e28ba-2fa1-4d2b-883f-000000000001",
    });
    expect(result).toBe("1b4e28ba…000000000001");
  });
});

describe("apprenticeInitials", () => {
  it("uses first and last initials", () => {
    expect(apprenticeInitials({ apprenticeName: "Alex Okafor" })).toBe("AO");
  });

  it("handles a single name", () => {
    expect(apprenticeInitials({ apprenticeName: "Alex" })).toBe("AL");
  });

  it("handles middle names by taking the outermost initials", () => {
    expect(apprenticeInitials({ apprenticeName: "Alex Jamie Okafor" })).toBe(
      "AO",
    );
  });

  it("falls back to the id when there is no name", () => {
    expect(
      apprenticeInitials({
        apprenticeName: null,
        apprenticeId: "1b4e28ba-2fa1-4d2b-883f-000000000001",
      }),
    ).toBe("1B");
  });
});

describe("formatSubmitted", () => {
  it("formats the submission timestamp", () => {
    expect(formatSubmitted({ submittedAt: "2026-08-03T09:15:00Z" })).toBe(
      "03 Aug 2026",
    );
  });

  it("returns null for a draft that was never submitted", () => {
    // The card hides the line rather than printing "Invalid Date".
    expect(formatSubmitted({ submittedAt: null })).toBeNull();
  });

  it("returns null for an unparseable value", () => {
    expect(formatSubmitted({ submittedAt: "not-a-date" })).toBeNull();
  });
});

describe("formatCategory", () => {
  it("turns the enum into readable text", () => {
    expect(formatCategory("taught_learning")).toBe("Taught learning");
  });

  it("handles a single word", () => {
    expect(formatCategory("workplace")).toBe("Workplace");
  });

  it("returns an empty string when absent, so nothing renders", () => {
    expect(formatCategory("")).toBe("");
    expect(formatCategory(undefined)).toBe("");
  });
});

/**
 * The Approved and Rejected tabs showed Approve and Reject on entries that
 * had already been actioned, because the card never looked at the entry's
 * status. Approving an approved entry is a second write against a row the
 * API has closed, not a no-op.
 */
describe("isAwaitingDecision", () => {
  it("is true only for a submitted entry", () => {
    expect(isAwaitingDecision({ status: "submitted" })).toBe(true);
  });

  it("is false once a decision has been made", () => {
    expect(isAwaitingDecision({ status: "approved" })).toBe(false);
    expect(isAwaitingDecision({ status: "rejected" })).toBe(false);
  });

  it("is false for a draft, which has not been sent for approval", () => {
    expect(isAwaitingDecision({ status: "draft" })).toBe(false);
  });

  it("fails closed on a missing or unrecognised status", () => {
    // Hiding a button costs an operator a tab switch; showing one costs a
    // duplicate decision, so the unknown case must not be actionable.
    expect(isAwaitingDecision({})).toBe(false);
    expect(isAwaitingDecision({ status: "withdrawn" })).toBe(false);
    expect(isAwaitingDecision(null)).toBe(false);
    expect(isAwaitingDecision(undefined)).toBe(false);
  });
});
