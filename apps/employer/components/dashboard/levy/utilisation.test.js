import { describe, expect, it } from "vitest";

import { segmentTotals } from "./LevyUtilisation";
import { prepareMonthlySeries, shortMonth } from "./MonthlyChart";
import { projectHorizonSpend } from "./YearEndForecast";

describe("segmentTotals — F1.1.3 AC1 (three segments)", () => {
  const segments = {
    used: 120000,
    expiringWithin90Days: 45000,
    available: 80000,
    currency: "GBP",
  };

  it("treats the three DAS segments as disjoint parts of the pot", () => {
    const t = segmentTotals(segments);
    expect(t.used).toBe(120000);
    expect(t.expiring).toBe(45000);
    expect(t.available).toBe(80000);
    expect(t.total).toBe(245000);
  });

  it("computes used share against the summed total", () => {
    expect(segmentTotals(segments).usedPct).toBe(49); // 120000 / 245000
  });

  it("returns null when segments are absent, so the card can say so", () => {
    // Distinct from all-zero: absent data must not render as a real 0% chart.
    expect(segmentTotals(undefined)).toBeNull();
    expect(segmentTotals(null)).toBeNull();
  });

  it("returns null rather than NaN when a segment is unparseable", () => {
    expect(
      segmentTotals({ used: "x", expiringWithin90Days: 1, available: 2 }),
    ).toBeNull();
  });

  it("does not divide by zero for an employer with an empty pot", () => {
    const t = segmentTotals({
      used: 0,
      expiringWithin90Days: 0,
      available: 0,
    });
    expect(t.usedPct).toBe(0);
    expect(Number.isFinite(t.usedPct)).toBe(true);
  });

  it("accepts numeric strings, since money crosses the wire as strings", () => {
    const t = segmentTotals({
      used: "100.50",
      expiringWithin90Days: "0",
      available: "99.50",
    });
    expect(t.total).toBeCloseTo(200, 2);
  });
});

describe("prepareMonthlySeries — F1.1.3 AC2 (12-month series)", () => {
  const point = (month, contributions, spend) => ({
    month,
    contributions,
    spend,
  });

  it("sorts oldest-first so the chart reads left to right", () => {
    const { rows } = prepareMonthlySeries([
      point("2026-03", 3, 3),
      point("2026-01", 1, 1),
      point("2026-02", 2, 2),
    ]);
    expect(rows.map((r) => r.month)).toEqual(["2026-01", "2026-02", "2026-03"]);
  });

  it("keeps only the most recent 12 months", () => {
    const many = Array.from({ length: 18 }, (_, i) =>
      point(`2025-${String(i + 1).padStart(2, "0")}`, i, i),
    );
    const { rows } = prepareMonthlySeries(many);
    expect(rows).toHaveLength(12);
    // Trimmed from the start, keeping the newest.
    expect(rows.at(-1).month).toBe("2025-18");
  });

  it("scales to the tallest bar across BOTH series", () => {
    // A max taken from contributions alone would clip a bigger spend bar.
    const { max } = prepareMonthlySeries([point("2026-01", 100, 900)]);
    expect(max).toBe(900);
  });

  it("never yields a zero max, which would divide by zero", () => {
    expect(prepareMonthlySeries([point("2026-01", 0, 0)]).max).toBe(1);
    expect(prepareMonthlySeries([]).max).toBe(1);
  });

  it("drops malformed points instead of rendering NaN bars", () => {
    const { rows } = prepareMonthlySeries([
      null,
      { month: 42 },
      point("2026-01", "abc", 5),
    ]);
    expect(rows).toHaveLength(1);
    expect(rows[0].contributions).toBe(0);
    expect(rows[0].spend).toBe(5);
  });

  it("handles a missing series", () => {
    expect(prepareMonthlySeries(undefined).rows).toEqual([]);
  });
});

describe("shortMonth", () => {
  it("renders a YYYY-MM key as a month abbreviation", () => {
    expect(shortMonth("2026-01")).toMatch(/^Jan/);
  });

  it("passes through anything that is not YYYY-MM", () => {
    expect(shortMonth("whenever")).toBe("whenever");
    expect(shortMonth(undefined)).toBe("");
  });
});

describe("projectHorizonSpend — F1.1.3 AC3 (forecast)", () => {
  it("multiplies the monthly run rate by the API's own horizon", () => {
    // Not hardcoded to 12: if the backend changes the horizon, the card must
    // follow rather than silently misreport the period.
    expect(
      projectHorizonSpend({ projectedMonthlySpend: 1000, horizonMonths: 12 }),
    ).toBe(12000);
    expect(
      projectHorizonSpend({ projectedMonthlySpend: 1000, horizonMonths: 6 }),
    ).toBe(6000);
  });

  it("returns null when there is no forecast, so the card degrades honestly", () => {
    expect(projectHorizonSpend(undefined)).toBeNull();
    expect(projectHorizonSpend(null)).toBeNull();
  });

  it("returns null rather than NaN on unparseable figures", () => {
    expect(
      projectHorizonSpend({ projectedMonthlySpend: "x", horizonMonths: 12 }),
    ).toBeNull();
    expect(projectHorizonSpend({ projectedMonthlySpend: 100 })).toBeNull();
  });

  it("handles a zero run rate without collapsing to null", () => {
    // Zero spend is a real state (no active programmes), unlike "unknown".
    expect(
      projectHorizonSpend({ projectedMonthlySpend: 0, horizonMonths: 12 }),
    ).toBe(0);
  });
});
