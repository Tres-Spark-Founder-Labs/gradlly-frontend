import { describe, expect, it } from "vitest";

import { assessRisk } from "./ExpiryAlert";

const MS_PER_DAY = 86_400_000;

/** An ISO date `days` from now (negative = already past). */
const inDays = (days) => new Date(Date.now() + days * MS_PER_DAY).toISOString();

/** A tranche shaped like LevyExpiryCalendarTrancheDto (amount is a string). */
const tranche = (amount, days) => ({
  trancheId: `t-${amount}-${days}`,
  donorLinkId: "link-1",
  donorLinkLabel: null,
  amount: String(amount),
  expiresOn: inDays(days),
});

/** The endpoint returns months, each holding tranches. */
const calendar = (...tranches) => [
  { month: "2026-09", totalAmount: "0.00", tranches },
];

describe("assessRisk — F1.1.2 thresholds", () => {
  it("returns null when there is no calendar data", () => {
    expect(assessRisk([])).toBeNull();
    expect(assessRisk(undefined)).toBeNull();
    expect(assessRisk(null)).toBeNull();
  });

  it("returns null when nothing expires inside the 90-day window", () => {
    expect(assessRisk(calendar(tranche("5000.00", 120)))).toBeNull();
  });

  it("AC1: raises amber when a tranche expires within 90 days", () => {
    const risk = assessRisk(calendar(tranche("5000.00", 60)));
    expect(risk).not.toBeNull();
    expect(risk.urgent).toBe(false);
    expect(risk.amount).toBe(5000);
  });

  it("AC2: raises red when a tranche expires within 30 days", () => {
    const risk = assessRisk(calendar(tranche("5000.00", 10)));
    expect(risk.urgent).toBe(true);
  });

  it("treats the 90-day bound as inclusive", () => {
    expect(assessRisk(calendar(tranche("100.00", 90))).urgent).toBe(false);
  });

  it("treats the 30-day bound as inclusive", () => {
    expect(assessRisk(calendar(tranche("100.00", 30))).urgent).toBe(true);
  });

  it("escalates to red even when most funds sit in the amber window", () => {
    const risk = assessRisk(
      calendar(tranche("100.00", 10), tranche("900.00", 60)),
    );
    expect(risk.urgent).toBe(true);
    // Reports only the red tranche: blending in the 90-day total would
    // understate what actually needs action this month.
    expect(risk.amount).toBe(100);
  });
});

describe("assessRisk — what counts as 'at risk'", () => {
  it("excludes tranches that have already lapsed", () => {
    // Expired money is gone, not at risk; counting it overstates what the
    // employer can still act on.
    const risk = assessRisk(
      calendar(tranche("777.00", -5), tranche("200.00", 45)),
    );
    expect(risk.amount).toBe(200);
  });

  it("returns null when every tranche has already lapsed", () => {
    expect(assessRisk(calendar(tranche("777.00", -5)))).toBeNull();
  });

  it("AC3: sums every at-risk tranche to the penny", () => {
    const risk = assessRisk(
      calendar(tranche("100.50", 5), tranche("200.25", 20)),
    );
    expect(risk.amount).toBeCloseTo(300.75, 2);
    expect(risk.trancheCount).toBe(2);
  });

  it("AC3: reports the earliest deadline, not an arbitrary one", () => {
    const risk = assessRisk(
      calendar(tranche("100.00", 25), tranche("100.00", 5)),
    );
    expect(risk.days).toBe(5);
    // The reported date must belong to the most urgent tranche.
    const reportedDays = Math.ceil(
      (new Date(risk.expiresOn).getTime() - Date.now()) / MS_PER_DAY,
    );
    expect(reportedDays).toBe(5);
  });

  it("flattens tranches across multiple months", () => {
    const multiMonth = [
      { month: "2026-09", totalAmount: "0", tranches: [tranche("100.00", 10)] },
      { month: "2026-10", totalAmount: "0", tranches: [tranche("50.00", 20)] },
    ];
    expect(assessRisk(multiMonth).amount).toBe(150);
  });

  it("survives malformed rows instead of rendering NaN", () => {
    const messy = [
      { month: "2026-09", totalAmount: "0", tranches: null },
      { month: "2026-10" },
      {
        month: "2026-11",
        tranches: [
          { amount: "abc", expiresOn: inDays(5) },
          { amount: "100.00", expiresOn: null },
          tranche("42.00", 5),
        ],
      },
    ];
    const risk = assessRisk(messy);
    expect(risk.amount).toBe(42);
    expect(Number.isFinite(risk.amount)).toBe(true);
  });
});
