import { describe, expect, it } from "vitest";

import {
  describeFrequency,
  formatNextDigest,
  nextDigestDate,
} from "./digest-schedule";

/**
 * F1.2.3 AC6/AC7.
 *
 * The drawer previously printed a hardcoded "Monday 07 Apr 2025 · 08:00 GMT"
 * regardless of the setting or the date, so these cover the calculation that
 * replaced it.
 */
describe("nextDigestDate", () => {
  // 2026-08-03 is a Monday.
  const mondayEarly = new Date("2026-08-03T06:00:00Z"); // before 08:00 UK
  const mondayLate = new Date("2026-08-03T12:00:00Z"); // after 08:00 UK
  const wednesday = new Date("2026-08-05T12:00:00Z");

  const dayOf = (date) => date?.getDate() ?? null;

  it("returns null when the digest is off", () => {
    expect(nextDigestDate("off", wednesday)).toBeNull();
  });

  it("daily before send time is today", () => {
    expect(dayOf(nextDigestDate("daily", mondayEarly))).toBe(3);
  });

  it("daily after send time is tomorrow", () => {
    // Otherwise the drawer promises a digest that has already gone out.
    expect(dayOf(nextDigestDate("daily", mondayLate))).toBe(4);
  });

  it("weekly on Monday before send time is today", () => {
    expect(dayOf(nextDigestDate("weekly", mondayEarly))).toBe(3);
  });

  it("weekly on Monday after send time is next Monday, not today", () => {
    expect(dayOf(nextDigestDate("weekly", mondayLate))).toBe(10);
  });

  it("weekly midweek is the coming Monday", () => {
    // Wednesday 5 August -> Monday 10 August.
    expect(dayOf(nextDigestDate("weekly", wednesday))).toBe(10);
  });

  it("weekly on Sunday is the very next day", () => {
    // Guards the modulo: Sunday is index 0, and (1 - 0 + 7) % 7 must be 1.
    const sunday = new Date("2026-08-02T12:00:00Z");
    expect(dayOf(nextDigestDate("weekly", sunday))).toBe(3);
  });
});

describe("formatNextDigest", () => {
  it("names the weekday and the send time", () => {
    const result = formatNextDigest("weekly", new Date("2026-08-05T12:00:00Z"));
    expect(result).toContain("Monday");
    expect(result).toContain("10 Aug 2026");
    expect(result).toContain("08:00");
  });

  it("returns null when off, so the panel can be hidden", () => {
    expect(formatNextDigest("off", new Date())).toBeNull();
  });
});

describe("describeFrequency", () => {
  it("describes daily as every morning, matching the cron", () => {
    // The cron is `0 8 * * *` — every day. The old copy said "every weekday",
    // which the schedule never did.
    expect(describeFrequency("daily")).toMatch(/every morning/i);
    expect(describeFrequency("daily")).not.toMatch(/weekday/i);
  });

  it("describes weekly as Monday", () => {
    expect(describeFrequency("weekly")).toMatch(/Monday/);
  });

  it("warns that off means no reminders", () => {
    expect(describeFrequency("off")).toMatch(/not receive/i);
  });
});
