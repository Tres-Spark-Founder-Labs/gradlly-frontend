import { describe, expect, it } from "vitest";

import { fmtDate, fmtGBP, fmtSyncedAt } from "./helpers";

describe("fmtGBP — F1.1.1 AC1 (GBP, two decimal places)", () => {
  it("always renders exactly two decimal places", () => {
    expect(fmtGBP(50000)).toBe("£50,000.00");
    expect(fmtGBP(0)).toBe("£0.00");
    expect(fmtGBP(12345.6)).toBe("£12,345.60");
  });

  it("coerces the numeric(14,2) strings the API actually returns", () => {
    // DasDonorLink.lastBalance is numeric(14,2) and serialises as a string.
    // Calling .toLocaleString() on a string returns it untouched, which is how
    // the previous helper silently dropped separators and the currency symbol.
    expect(fmtGBP("12345.67")).toBe("£12,345.67");
    expect(fmtGBP("0.00")).toBe("£0.00");
  });

  it("rounds to the penny rather than exposing float noise", () => {
    expect(fmtGBP(0.1 + 0.2)).toBe("£0.30");
  });

  it("renders an em dash for missing or unparseable values, never £0.00", () => {
    // Showing a confident zero for "unknown" is how people overcommit funds.
    expect(fmtGBP(null)).toBe("—");
    expect(fmtGBP(undefined)).toBe("—");
    expect(fmtGBP("not-a-number")).toBe("—");
    expect(fmtGBP(NaN)).toBe("—");
    expect(fmtGBP(Infinity)).toBe("—");
  });

  it("handles negative balances without mangling the symbol", () => {
    expect(fmtGBP(-250.5)).toContain("250.50");
  });
});

describe("fmtDate — F1.1.2 AC3 (expiry date, not a countdown)", () => {
  it("formats an ISO date as a readable calendar date", () => {
    expect(fmtDate("2026-10-12T00:00:00.000Z")).toBe("12 Oct 2026");
  });

  it("accepts a Date instance as well as a string", () => {
    expect(fmtDate(new Date("2026-01-05T12:00:00.000Z"))).toBe("5 Jan 2026");
  });

  it("degrades to an em dash rather than 'Invalid Date'", () => {
    expect(fmtDate(null)).toBe("—");
    expect(fmtDate("")).toBe("—");
    expect(fmtDate("garbage")).toBe("—");
  });
});

describe("fmtSyncedAt — F1.1.1 AC3 (last-synced timestamp)", () => {
  it("says 'never' when there has been no sync, rather than showing a fake time", () => {
    expect(fmtSyncedAt(null)).toBe("never");
  });

  it("includes both date and time, since sync recency matters to the hour", () => {
    const out = fmtSyncedAt(new Date("2026-07-30T14:32:00.000Z"));
    expect(out).toMatch(/Jul/);
    expect(out).toMatch(/\d{2}:\d{2}/);
  });
});
