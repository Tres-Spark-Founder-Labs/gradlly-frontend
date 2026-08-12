import { describe, expect, it } from "vitest";

import {
  buildWeeklyHours,
  peakWeeklyMinutes,
  startOfWeek,
} from "./weekly-hours";

// A Wednesday, so week-boundary maths is not accidentally trivial.
const NOW = new Date("2026-08-12T09:00:00.000Z");

const entry = (date, minutes, status = "approved") => ({
  date,
  minutes,
  status,
});

describe("weekly OTJ hours (F3.1.2 AC4)", () => {
  it("starts weeks on Monday", () => {
    // 2026-08-12 is a Wednesday; its week starts Monday the 10th.
    expect(startOfWeek(NOW).toISOString().slice(0, 10)).toBe("2026-08-10");
  });

  it("puts Sunday in the week that began the Monday before", () => {
    // The classic off-by-one: JS treats Sunday as day 0, so a naive
    // implementation rolls Sunday forward into the next week.
    const sunday = new Date("2026-08-16T12:00:00.000Z");
    expect(startOfWeek(sunday).toISOString().slice(0, 10)).toBe("2026-08-10");
  });

  it("returns exactly 8 buckets, oldest first", () => {
    const weeks = buildWeeklyHours([], { now: NOW });

    expect(weeks).toHaveLength(8);
    expect(weeks[0].weekStart).toBe("2026-06-22");
    expect(weeks[7].weekStart).toBe("2026-08-10");
  });

  it("renders a quiet week as a real zero rather than omitting it", () => {
    // A missing week would close the gap in the chart and hide the fact that
    // nothing was logged — the opposite of what the learner needs to see.
    const weeks = buildWeeklyHours([entry("2026-08-11", 120)], { now: NOW });

    expect(weeks).toHaveLength(8);
    expect(weeks.filter((w) => w.approvedMinutes === 0)).toHaveLength(7);
  });

  it("sums multiple entries within the same week", () => {
    const weeks = buildWeeklyHours(
      [entry("2026-08-10", 60), entry("2026-08-12", 90)],
      { now: NOW },
    );

    expect(weeks.at(-1).approvedMinutes).toBe(150);
  });

  describe("client decision D2 — approved and pending are never merged", () => {
    it("keeps them in separate fields", () => {
      const weeks = buildWeeklyHours(
        [entry("2026-08-11", 120), entry("2026-08-11", 60, "pending")],
        { now: NOW },
      );

      const current = weeks.at(-1);
      expect(current.approvedMinutes).toBe(120);
      expect(current.pendingMinutes).toBe(60);
      // No combined total is offered at all — there is nothing to misread.
      expect(current).not.toHaveProperty("totalMinutes");
    });

    it("does not count a rejected entry as either", () => {
      const weeks = buildWeeklyHours([entry("2026-08-11", 120, "rejected")], {
        now: NOW,
      });

      expect(weeks.at(-1).approvedMinutes).toBe(0);
      expect(weeks.at(-1).pendingMinutes).toBe(0);
    });

    it("does not count a draft the learner never submitted", () => {
      const weeks = buildWeeklyHours([entry("2026-08-11", 120, "draft")], {
        now: NOW,
      });

      expect(weeks.at(-1).approvedMinutes).toBe(0);
      expect(weeks.at(-1).pendingMinutes).toBe(0);
    });
  });

  it("ignores entries outside the window instead of clamping them in", () => {
    const weeks = buildWeeklyHours([entry("2020-01-01", 600)], { now: NOW });

    expect(weeks.every((w) => w.approvedMinutes === 0)).toBe(true);
  });

  it("survives malformed entries without throwing", () => {
    const weeks = buildWeeklyHours(
      [{ minutes: 60 }, entry("not-a-date", 60), entry("2026-08-11", null)],
      { now: NOW },
    );

    expect(weeks).toHaveLength(8);
    expect(weeks.at(-1).approvedMinutes).toBe(0);
  });

  it("keeps the chart scale sane when nothing has been logged", () => {
    // Without a floor the bars would divide by zero and render as NaN width.
    expect(peakWeeklyMinutes(buildWeeklyHours([], { now: NOW }))).toBe(60);
  });
});
