import { describe, expect, it } from "vitest";

import { statusMeta } from "@/components/apprentices/helpers";

import {
  API_PACE_LEVEL,
  PACE_STATUS,
  behindPercentLabel,
  isFlagged,
  isCriticallyBehind,
  normalisePaceStatus,
} from "./risk-status";

/**
 * F1.2.4 AC5.
 *
 * The API emits `on_track | at_risk | off_track`. The employer UI was written
 * against `on_track | at_risk | overdue | epa_ready`, which came from the mock
 * fixtures. `off_track` — more than 30% behind, the most serious flag — matched
 * nothing anywhere on the screen.
 */
describe("normalisePaceStatus", () => {
  it("maps off_track to critically_behind", () => {
    // The whole point: without this the worst cases render as "Unknown".
    expect(normalisePaceStatus(API_PACE_LEVEL.OFF_TRACK)).toBe(
      PACE_STATUS.CRITICALLY_BEHIND,
    );
  });

  it("passes at_risk through", () => {
    expect(normalisePaceStatus(API_PACE_LEVEL.AT_RISK)).toBe(
      PACE_STATUS.AT_RISK,
    );
  });

  it("passes on_track through", () => {
    expect(normalisePaceStatus(API_PACE_LEVEL.ON_TRACK)).toBe(
      PACE_STATUS.ON_TRACK,
    );
  });

  it("never reads a missing level as on track", () => {
    // Absent means absent. Above 100 apprentices the roster used to drop the
    // enrolment (and its level) off page 1, and an at-risk apprentice
    // rendered green.
    expect(normalisePaceStatus(null)).toBe(PACE_STATUS.UNKNOWN);
    expect(normalisePaceStatus(undefined)).toBe(PACE_STATUS.UNKNOWN);
  });

  it("does not invent a status for an unrecognised level", () => {
    expect(normalisePaceStatus("something_new")).toBe(PACE_STATUS.UNKNOWN);
  });

  it("does not flag an unknown level either", () => {
    expect(isFlagged(PACE_STATUS.UNKNOWN)).toBe(false);
    expect(isCriticallyBehind(PACE_STATUS.UNKNOWN)).toBe(false);
  });
});

describe("isFlagged / isCriticallyBehind", () => {
  it("counts both at-risk and critically-behind as flagged", () => {
    // The stat card and the alert banner both filtered on at_risk alone, so
    // overdue apprentices appeared in neither.
    expect(isFlagged(PACE_STATUS.AT_RISK)).toBe(true);
    expect(isFlagged(PACE_STATUS.CRITICALLY_BEHIND)).toBe(true);
  });

  it("does not flag on track", () => {
    expect(isFlagged(PACE_STATUS.ON_TRACK)).toBe(false);
  });

  it("distinguishes critically behind from at risk", () => {
    expect(isCriticallyBehind(PACE_STATUS.CRITICALLY_BEHIND)).toBe(true);
    expect(isCriticallyBehind(PACE_STATUS.AT_RISK)).toBe(false);
  });
});

describe("statusMeta after normalisation", () => {
  it("gives critically-behind a red badge, not grey Unknown", () => {
    const meta = statusMeta(normalisePaceStatus(API_PACE_LEVEL.OFF_TRACK));
    expect(meta.label).toBe("Critically behind");
    expect(meta.label).not.toBe("Unknown");
  });

  it("still handles the raw API value if something skips the mapper", () => {
    // Defence in depth: any path that bypasses normalisation degrades to a
    // correct red badge rather than a grey "Unknown".
    expect(statusMeta("off_track").label).toBe("Critically behind");
  });

  it("labels at risk in amber", () => {
    expect(statusMeta(PACE_STATUS.AT_RISK).label).toBe("At risk");
  });

  it("says a missing level is unknown, in grey, never on track", () => {
    const meta = statusMeta(normalisePaceStatus(null));
    expect(meta.label).toBe("Pace unknown");
    expect(meta.color).not.toBe(statusMeta(PACE_STATUS.ON_TRACK).color);
  });
});

describe("behindPercentLabel", () => {
  it("rounds for display", () => {
    expect(behindPercentLabel(32.47)).toBe("32% behind");
  });

  it("accepts the string a numeric column returns", () => {
    // pg returns `numeric` as a string; the label must not print "NaN%".
    expect(behindPercentLabel("41.20")).toBe("41% behind");
  });

  it("returns null when unknown, so nothing renders", () => {
    expect(behindPercentLabel(null)).toBeNull();
    expect(behindPercentLabel(undefined)).toBeNull();
  });

  it("returns null when ahead of pace", () => {
    // A negative "behind" means ahead — "-12% behind" would be nonsense.
    expect(behindPercentLabel(-12)).toBeNull();
    expect(behindPercentLabel(0)).toBeNull();
  });

  it("returns null for an unparseable value", () => {
    expect(behindPercentLabel("not-a-number")).toBeNull();
  });
});
