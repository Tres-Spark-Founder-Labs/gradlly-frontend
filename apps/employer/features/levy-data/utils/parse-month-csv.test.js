import { describe, expect, it } from "vitest";

import { parseMonthCsv } from "./parse-month-csv";

/**
 * The paste either imports whole or fails by name.
 *
 * Every rejection test here asserts the message names the ROW and the COLUMN,
 * because "invalid input" sends someone hunting through twelve rows of figures,
 * and the whole point of rejecting rather than salvaging is that the operator
 * can fix it.
 */
describe("parseMonthCsv", () => {
  const ok = (text) => {
    const result = parseMonthCsv(text);
    if (!result.ok) throw new Error(`expected success, got: ${result.error}`);
    return result.months;
  };
  const err = (text) => {
    const result = parseMonthCsv(text);
    if (result.ok) throw new Error("expected failure, got success");
    return result.error;
  };

  describe("accepts", () => {
    it("comma-separated rows", () => {
      const months = ok("2026-04,4100.00,2750.00\n2026-05,4100.00,3000.00");
      expect(months).toHaveLength(2);
      expect(months[0]).toEqual({
        month: "2026-04",
        contributions: "4100.00",
        spend: "2750.00",
      });
    });

    it("tab-separated rows, which is what a spreadsheet paste produces", () => {
      expect(ok("2026-04\t4100.00\t2750.00")).toHaveLength(1);
    });

    it("a header row, dropped rather than reported as a bad month", () => {
      expect(
        ok("Month,Contributions,Spend\n2026-04,4100.00,2750.00"),
      ).toHaveLength(1);
    });

    it("a part-year, because a levy year in progress is legitimate", () => {
      expect(ok("2026-04,1.00,1.00\n2026-05,1.00,1.00")).toHaveLength(2);
    });

    it("rows out of order, returning them sorted", () => {
      const months = ok("2026-05,1.00,1.00\n2026-04,1.00,1.00");
      expect(months.map((m) => m.month)).toEqual(["2026-04", "2026-05"]);
    });

    it("a run crossing a year boundary", () => {
      expect(ok("2026-12,1.00,1.00\n2027-01,1.00,1.00")).toHaveLength(2);
    });

    it("a zero month, which is how an operator records no contribution", () => {
      expect(ok("2026-04,0.00,0.00")).toHaveLength(1);
    });
  });

  describe("rejects, naming the row and column", () => {
    it("a malformed month", () => {
      expect(err("2026-04,1.00,1.00\nApril,1.00,1.00")).toMatch(
        /Row 2, Month: "April" is not a month/,
      );
    });

    it("a month number that does not exist", () => {
      expect(err("2026-13,1.00,1.00")).toMatch(/Row 1, Month/);
    });

    it("a contributions value that is not a number", () => {
      expect(err("2026-04,n/a,1.00")).toMatch(/Row 1, Contributions/);
    });

    it("a currency symbol, and says to remove it", () => {
      const message = err("2026-04,£4100.00,1.00");
      expect(message).toMatch(/Row 1, Contributions/);
      expect(message).toMatch(/Remove any £ sign or thousands separator/);
    });

    it("a thousands separator", () => {
      expect(err("2026-04,4100.00,2,750.00")).toMatch(/Row 1/);
    });

    it("too few values on a row", () => {
      expect(err("2026-04,4100.00")).toMatch(
        /Row 1 has 2 values, expected 3: Month, Contributions, Spend/,
      );
    });

    it("more than twelve rows", () => {
      const rows = Array.from(
        { length: 13 },
        (_, i) => `2026-${String(i + 1).padStart(2, "0")},1.00,1.00`,
      ).join("\n");
      expect(err(rows)).toMatch(
        /13 rows pasted, but a levy year is at most 12/,
      );
    });

    it("a repeated month, naming both rows", () => {
      expect(err("2026-04,1.00,1.00\n2026-04,2.00,2.00")).toMatch(
        /Rows 1 and 2 are both 2026-04/,
      );
    });

    it("an interior gap, and says to enter zero instead", () => {
      const message = err("2026-04,1.00,1.00\n2026-06,1.00,1.00");
      expect(message).toMatch(/1 month is missing between 2026-04 and 2026-06/);
      expect(message).toMatch(/Enter 0\.00/);
    });

    it("counts several missing months correctly", () => {
      expect(err("2026-01,1.00,1.00\n2026-05,1.00,1.00")).toMatch(
        /3 months are missing/,
      );
    });

    it("a gap across a year boundary as one month, not thirteen", () => {
      expect(err("2026-12,1.00,1.00\n2027-02,1.00,1.00")).toMatch(
        /1 month is missing between 2026-12 and 2027-02/,
      );
    });

    it("an empty paste", () => {
      expect(err("   ")).toMatch(/Nothing to import/);
    });
  });

  it("never returns a partial set", () => {
    // The property that matters: eleven good rows and one bad row import
    // nothing at all, rather than eleven.
    const rows = [
      "2026-01,1.00,1.00",
      "2026-02,1.00,1.00",
      "2026-03,NOPE,1.00",
      "2026-04,1.00,1.00",
    ].join("\n");

    const result = parseMonthCsv(rows);
    expect(result.ok).toBe(false);
    expect(result.months).toBeUndefined();
  });
});
