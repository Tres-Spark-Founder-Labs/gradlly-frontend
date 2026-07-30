import { describe, expect, it } from "vitest";

import {
  deriveFilterOptions,
  matchesAdvancedFilters,
  monthKey,
  nextSortState,
  sortRoster,
  escapeCsvValue,
  filterRoster,
  matchesRosterFilter,
  matchesRosterSearch,
  toRosterCsv,
} from "./roster-export";

const apprentice = (overrides = {}) => ({
  id: "a-1",
  name: "Priya Sharma",
  employeeId: "EMP-04821",
  standard: "Software Developer (L4)",
  provider: "Midlands Technical College",
  status: "on_track",
  epaDate: "12 Oct 2026",
  epaDaysLeft: 200,
  otjActual: 62,
  lastActivity: "28 Jul 2026",
  startDate: "01 Sep 2025",
  ...overrides,
});

describe("matchesRosterFilter — F1.2.1 AC4 (status pills)", () => {
  it("passes everything when no filter or 'all'", () => {
    expect(matchesRosterFilter(apprentice(), "all")).toBe(true);
    expect(matchesRosterFilter(apprentice(), undefined)).toBe(true);
  });

  it("matches on status", () => {
    expect(
      matchesRosterFilter(apprentice({ status: "at_risk" }), "at_risk"),
    ).toBe(true);
    expect(
      matchesRosterFilter(apprentice({ status: "on_track" }), "at_risk"),
    ).toBe(false);
  });

  it("treats epa_imminent as a derived view, not a stored status", () => {
    // No apprentice has status "epa_imminent"; it means EPA within 90 days.
    expect(
      matchesRosterFilter(apprentice({ epaDaysLeft: 40 }), "epa_imminent"),
    ).toBe(true);
    expect(
      matchesRosterFilter(apprentice({ epaDaysLeft: 200 }), "epa_imminent"),
    ).toBe(false);
  });

  it("excludes rows with an unknown EPA date from epa_imminent", () => {
    // null must not be treated as "0 days away" and shown as urgent.
    expect(
      matchesRosterFilter(apprentice({ epaDaysLeft: null }), "epa_imminent"),
    ).toBe(false);
  });
});

describe("matchesRosterSearch — F1.2.1 AC5", () => {
  it("matches on name", () => {
    expect(matchesRosterSearch(apprentice(), "priya")).toBe(true);
  });

  it("matches on employee ID, which the placeholder has always promised", () => {
    expect(matchesRosterSearch(apprentice(), "emp-048")).toBe(true);
  });

  it("matches standard and provider", () => {
    expect(matchesRosterSearch(apprentice(), "midlands")).toBe(true);
    expect(matchesRosterSearch(apprentice(), "software")).toBe(true);
  });

  it("is case-insensitive and ignores surrounding whitespace", () => {
    expect(matchesRosterSearch(apprentice(), "  PRIYA  ")).toBe(true);
  });

  it("passes everything on an empty query", () => {
    expect(matchesRosterSearch(apprentice(), "")).toBe(true);
    expect(matchesRosterSearch(apprentice(), undefined)).toBe(true);
  });

  it("does not throw when a field is missing", () => {
    expect(matchesRosterSearch({ name: null, employeeId: null }, "x")).toBe(
      false,
    );
  });
});

describe("filterRoster — status and search combined", () => {
  it("applies both, which the dashboard previously did not", () => {
    // The pills were applied inside the table and the search in the page, so
    // the exported set could differ from the visible one.
    const roster = [
      apprentice({ id: "1", name: "Priya", status: "at_risk" }),
      apprentice({ id: "2", name: "Priya", status: "on_track" }),
      apprentice({ id: "3", name: "Tom", status: "at_risk" }),
    ];
    const result = filterRoster(roster, { filter: "at_risk", search: "priya" });
    expect(result.map((r) => r.id)).toEqual(["1"]);
  });

  it("handles a missing roster", () => {
    expect(filterRoster(undefined, {})).toEqual([]);
  });
});

describe("deriveFilterOptions — F1.2.1 AC4", () => {
  const roster = [
    apprentice({
      id: "1",
      provider: "Midlands Technical College",
      standard: "Software Developer (L4)",
      epaDateIso: "2026-10-12",
      startDateIso: "2025-09-01",
    }),
    apprentice({
      id: "2",
      provider: "Northern Skills Academy",
      standard: "Software Developer (L4)",
      epaDateIso: "2026-10-30",
      startDateIso: "2025-01-15",
    }),
  ];

  it("derives options from the data, never from a hardcoded list", () => {
    const options = deriveFilterOptions(roster);
    expect(options.providers).toEqual([
      "Midlands Technical College",
      "Northern Skills Academy",
    ]);
  });

  it("de-duplicates repeated values", () => {
    // Both apprentices share a standard; the dropdown must show it once.
    expect(deriveFilterOptions(roster).standards).toEqual([
      "Software Developer (L4)",
    ]);
  });

  it("groups EPA dates into months, collapsing days", () => {
    const { epaMonths } = deriveFilterOptions(roster);
    expect(epaMonths).toHaveLength(1);
    expect(epaMonths[0].value).toBe("2026-10");
    expect(epaMonths[0].label).toMatch(/2026/);
  });

  it("sorts cohorts chronologically, not alphabetically", () => {
    // "2025-01" must precede "2025-09"; label sorting would put Jan after Sep.
    expect(deriveFilterOptions(roster).cohorts.map((c) => c.value)).toEqual([
      "2025-01",
      "2025-09",
    ]);
  });

  it("excludes em-dash placeholders and missing values", () => {
    const options = deriveFilterOptions([
      apprentice({ provider: "—", standard: null, epaDateIso: null }),
    ]);
    expect(options.providers).toEqual([]);
    expect(options.standards).toEqual([]);
    expect(options.epaMonths).toEqual([]);
  });

  it("handles an empty roster", () => {
    const options = deriveFilterOptions([]);
    expect(options).toEqual({
      providers: [],
      standards: [],
      epaMonths: [],
      cohorts: [],
    });
  });
});

describe("matchesAdvancedFilters — F1.2.1 AC4", () => {
  const a = apprentice({
    provider: "Midlands Technical College",
    standard: "Software Developer (L4)",
    epaDateIso: "2026-10-12",
    startDateIso: "2025-09-01",
  });

  it("passes when no advanced filter is set", () => {
    expect(matchesAdvancedFilters(a, {})).toBe(true);
    expect(matchesAdvancedFilters(a, undefined)).toBe(true);
  });

  it("filters by provider and standard", () => {
    expect(
      matchesAdvancedFilters(a, { provider: "Midlands Technical College" }),
    ).toBe(true);
    expect(matchesAdvancedFilters(a, { provider: "Someone Else" })).toBe(false);
    expect(
      matchesAdvancedFilters(a, { standard: "Software Developer (L4)" }),
    ).toBe(true);
  });

  it("filters by EPA month and cohort month", () => {
    expect(matchesAdvancedFilters(a, { epaMonth: "2026-10" })).toBe(true);
    expect(matchesAdvancedFilters(a, { epaMonth: "2026-11" })).toBe(false);
    expect(matchesAdvancedFilters(a, { cohort: "2025-09" })).toBe(true);
  });

  it("combines filters as AND", () => {
    expect(
      matchesAdvancedFilters(a, {
        provider: "Midlands Technical College",
        epaMonth: "2026-11",
      }),
    ).toBe(false);
  });

  it("excludes rows with no date when a date filter is active", () => {
    const undated = apprentice({ epaDateIso: null });
    expect(matchesAdvancedFilters(undated, { epaMonth: "2026-10" })).toBe(
      false,
    );
  });
});

describe("monthKey", () => {
  it("returns a sortable YYYY-MM key", () => {
    expect(monthKey("2026-10-12")).toBe("2026-10");
  });

  it("returns null for missing or unparseable dates", () => {
    expect(monthKey(null)).toBeNull();
    expect(monthKey("not a date")).toBeNull();
  });
});

describe("sortRoster — F1.2.1 AC1 (sortable table)", () => {
  const roster = [
    apprentice({
      id: "b",
      name: "Bella",
      otjActual: 40,
      epaDateIso: "2026-12-01",
    }),
    apprentice({
      id: "a",
      name: "Aaron",
      otjActual: 90,
      epaDateIso: "2026-01-15",
    }),
    apprentice({
      id: "c",
      name: "Chris",
      otjActual: 65,
      epaDateIso: "2026-06-30",
    }),
  ];

  it("sorts text ascending and descending", () => {
    expect(sortRoster(roster, { sortBy: "name" }).map((r) => r.id)).toEqual([
      "a",
      "b",
      "c",
    ]);
    expect(
      sortRoster(roster, { sortBy: "name", sortOrder: "desc" }).map(
        (r) => r.id,
      ),
    ).toEqual(["c", "b", "a"]);
  });

  it("sorts numbers numerically, not as strings", () => {
    // String comparison would order 100 before 40.
    const nums = [
      apprentice({ id: "x", otjActual: 100 }),
      apprentice({ id: "y", otjActual: 40 }),
    ];
    expect(sortRoster(nums, { sortBy: "otjActual" }).map((r) => r.id)).toEqual([
      "y",
      "x",
    ]);
  });

  it("sorts dates chronologically using the raw ISO value", () => {
    // The display string is "12 Oct 2026"; sorting that as text is meaningless.
    expect(sortRoster(roster, { sortBy: "epaDate" }).map((r) => r.id)).toEqual([
      "a",
      "c",
      "b",
    ]);
  });

  it("keeps blanks last in both directions", () => {
    // OTJ, attendance and last activity are unpopulated for employers today,
    // so a naive sort would fill the first screen with empty rows.
    const mixed = [
      apprentice({ id: "empty", otjActual: null }),
      apprentice({ id: "low", otjActual: 10 }),
      apprentice({ id: "high", otjActual: 90 }),
    ];
    expect(sortRoster(mixed, { sortBy: "otjActual" }).map((r) => r.id)).toEqual(
      ["low", "high", "empty"],
    );
    expect(
      sortRoster(mixed, { sortBy: "otjActual", sortOrder: "desc" }).map(
        (r) => r.id,
      ),
    ).toEqual(["high", "low", "empty"]);
  });

  it("treats the em-dash placeholder as blank", () => {
    const mixed = [
      apprentice({ id: "dash", provider: "—" }),
      apprentice({ id: "real", provider: "Alpha College" }),
    ];
    expect(sortRoster(mixed, { sortBy: "provider" }).map((r) => r.id)).toEqual([
      "real",
      "dash",
    ]);
  });

  it("returns the list unchanged for an unknown or absent sort key", () => {
    expect(sortRoster(roster, { sortBy: null }).map((r) => r.id)).toEqual([
      "b",
      "a",
      "c",
    ]);
    expect(sortRoster(roster, { sortBy: "nonsense" }).map((r) => r.id)).toEqual(
      ["b", "a", "c"],
    );
  });

  it("does not mutate the input array", () => {
    const original = [...roster];
    sortRoster(roster, { sortBy: "name" });
    expect(roster).toEqual(original);
  });

  it("handles an empty or missing roster", () => {
    expect(sortRoster([], { sortBy: "name" })).toEqual([]);
    expect(sortRoster(undefined, { sortBy: "name" })).toEqual([]);
  });
});

describe("nextSortState — header click behaviour", () => {
  it("starts a new column ascending", () => {
    expect(
      nextSortState({ sortBy: "name", sortOrder: "desc" }, "epaDate"),
    ).toEqual({
      sortBy: "epaDate",
      sortOrder: "asc",
    });
  });

  it("toggles direction on the same column", () => {
    expect(nextSortState({ sortBy: "name", sortOrder: "asc" }, "name")).toEqual(
      {
        sortBy: "name",
        sortOrder: "desc",
      },
    );
    expect(
      nextSortState({ sortBy: "name", sortOrder: "desc" }, "name"),
    ).toEqual({
      sortBy: "name",
      sortOrder: "asc",
    });
  });

  it("handles no current sort", () => {
    expect(nextSortState(undefined, "name")).toEqual({
      sortBy: "name",
      sortOrder: "asc",
    });
  });
});

describe("escapeCsvValue — injection and quoting", () => {
  it("neutralises formula-injection prefixes", () => {
    // Employee IDs are free text typed by the employer, so a value starting
    // with = + - or @ would execute on open in Excel or Sheets.
    expect(escapeCsvValue("=1+1")).toBe("'=1+1");
    expect(escapeCsvValue("+44 7700 900123")).toBe("'+44 7700 900123");
    expect(escapeCsvValue("-5")).toBe("'-5");
    expect(escapeCsvValue("@SUM(A1)")).toBe("'@SUM(A1)");
  });

  it("quotes and doubles embedded quotes", () => {
    expect(escapeCsvValue('He said "hi"')).toBe('"He said ""hi"""');
  });

  it("quotes values containing commas or newlines", () => {
    expect(escapeCsvValue("Smith, John")).toBe('"Smith, John"');
    expect(escapeCsvValue("line1\nline2")).toBe('"line1\nline2"');
  });

  it("renders null and undefined as empty, not as the words", () => {
    expect(escapeCsvValue(null)).toBe("");
    expect(escapeCsvValue(undefined)).toBe("");
  });

  it("leaves ordinary values untouched", () => {
    expect(escapeCsvValue("Priya Sharma")).toBe("Priya Sharma");
    expect(escapeCsvValue(62)).toBe("62");
  });
});

describe("toRosterCsv — F1.2.1 AC6", () => {
  it("writes a header row matching the on-screen columns", () => {
    const [header] = toRosterCsv([]).split("\r\n");
    expect(header).toBe(
      "Name,Employee ID,Standard,Provider,OTJ progress %,EPA date,Status,Last activity,Start date",
    );
  });

  it("writes one row per apprentice", () => {
    const csv = toRosterCsv([apprentice(), apprentice({ id: "a-2" })]);
    expect(csv.split("\r\n")).toHaveLength(3); // header + 2
  });

  it("includes the real values", () => {
    const csv = toRosterCsv([apprentice()]);
    expect(csv).toContain("Priya Sharma");
    expect(csv).toContain("EMP-04821");
    expect(csv).toContain("Midlands Technical College");
  });

  it("leaves unavailable metrics blank rather than writing 'null'", () => {
    // OTJ progress and last activity are null until the employer can read OTJ
    // entries; the file must not claim they are the string "null".
    const csv = toRosterCsv([
      apprentice({ otjActual: null, lastActivity: null }),
    ]);
    expect(csv).not.toContain("null");
  });

  it("produces only a header when there are no rows", () => {
    expect(toRosterCsv([]).split("\r\n")).toHaveLength(1);
  });
});
