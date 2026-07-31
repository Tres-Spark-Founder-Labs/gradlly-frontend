import { describe, expect, it } from "vitest";

import {
  PARTY_STATUS,
  actionSummary,
  cleanBoardFilters,
  deriveBoardFilterOptions,
  partyStatusMeta,
  statementStatusLabel,
} from "./board";

/** F1.3.1 AC2 — "Signed (green) / Pending (amber) / Not sent (grey)". */
describe("partyStatusMeta", () => {
  it("labels the three states", () => {
    expect(partyStatusMeta(PARTY_STATUS.SIGNED).label).toBe("Signed");
    expect(partyStatusMeta(PARTY_STATUS.PENDING).label).toBe("Pending");
    expect(partyStatusMeta(PARTY_STATUS.NOT_SENT).label).toBe("Not sent");
  });

  it("gives each state a distinct colour", () => {
    const signed = partyStatusMeta(PARTY_STATUS.SIGNED).color;
    const pending = partyStatusMeta(PARTY_STATUS.PENDING).color;
    const notSent = partyStatusMeta(PARTY_STATUS.NOT_SENT).color;

    expect(new Set([signed, pending, notSent]).size).toBe(3);
  });

  it("falls back to the grey treatment for an unknown state", () => {
    // Not an "Unknown" badge. A new API state degrading to a confident-looking
    // grey "Not sent" is safer than the grey "Unknown" that hid every
    // critically-behind apprentice in F1.2.4.
    expect(partyStatusMeta("something_new").label).toBe("Not sent");
    expect(partyStatusMeta(undefined).label).toBe("Not sent");
  });
});

describe("statementStatusLabel", () => {
  it("humanises the enum", () => {
    expect(statementStatusLabel("awaiting_signatures")).toBe(
      "Awaiting signatures",
    );
    expect(statementStatusLabel("signed")).toBe("Signed");
  });

  it("passes an unknown value through rather than hiding it", () => {
    expect(statementStatusLabel("brand_new")).toBe("brand_new");
  });

  it("renders a dash when absent", () => {
    expect(statementStatusLabel(null)).toBe("—");
  });
});

/** AC4 — filter by status, provider and standard. */
describe("deriveBoardFilterOptions", () => {
  const rows = [
    {
      providerOrganisationId: "p2",
      providerName: "Zenith Training",
      standardId: "s1",
      standardName: "Software Developer",
      statementStatus: "signed",
    },
    {
      providerOrganisationId: "p1",
      providerName: "Apex College",
      standardId: "s1",
      standardName: "Software Developer",
      statementStatus: "awaiting_signatures",
    },
    {
      providerOrganisationId: "p1",
      providerName: "Apex College",
      standardId: "s2",
      standardName: "Data Analyst",
      statementStatus: "signed",
    },
  ];

  it("offers each provider once, alphabetically", () => {
    expect(deriveBoardFilterOptions(rows).providers).toEqual([
      { value: "p1", label: "Apex College" },
      { value: "p2", label: "Zenith Training" },
    ]);
  });

  it("offers each standard once", () => {
    const { standards } = deriveBoardFilterOptions(rows);
    expect(standards.map((s) => s.value)).toEqual(["s2", "s1"]);
  });

  it("derives statuses from the rows on screen", () => {
    // Options can only offer values that exist in the data — the apprentice
    // roster previously shipped hardcoded options that matched nothing.
    const { statuses } = deriveBoardFilterOptions(rows);
    expect(statuses.map((s) => s.value)).toEqual([
      "awaiting_signatures",
      "signed",
    ]);
    expect(statuses[0].label).toBe("Awaiting signatures");
  });

  it("handles an empty board", () => {
    expect(deriveBoardFilterOptions([])).toEqual({
      providers: [],
      standards: [],
      statuses: [],
    });
  });

  it("ignores rows with no provider linked", () => {
    const options = deriveBoardFilterOptions([
      { providerOrganisationId: null, providerName: null },
    ]);
    expect(options.providers).toEqual([]);
  });
});

describe("cleanBoardFilters", () => {
  it("drops empty values", () => {
    // An empty string would be sent as `?status=` and filter everything out.
    expect(
      cleanBoardFilters({ status: "", providerOrganisationId: "p1" }),
    ).toEqual({ providerOrganisationId: "p1" });
  });

  it("drops null, undefined and false", () => {
    expect(
      cleanBoardFilters({
        status: null,
        standardId: undefined,
        actionRequiredOnly: false,
      }),
    ).toEqual({});
  });

  it("keeps a true flag", () => {
    expect(cleanBoardFilters({ actionRequiredOnly: true })).toEqual({
      actionRequiredOnly: true,
    });
  });
});

/** AC5 — the count, in words. */
describe("actionSummary", () => {
  it("is singular at one", () => {
    expect(actionSummary(1)).toBe("1 statement needs your signature.");
  });

  it("is plural above one", () => {
    expect(actionSummary(3)).toBe("3 statements need your signature.");
  });

  it("says so when there is nothing waiting", () => {
    expect(actionSummary(0)).toMatch(/Nothing/);
    expect(actionSummary(undefined)).toMatch(/Nothing/);
  });
});
