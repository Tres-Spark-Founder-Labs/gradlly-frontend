import { MAX_MONTHS, MONTH_CSV_COLUMNS } from "../constants";

/**
 * Parses a pasted month series.
 *
 * ── IT REJECTS, IT DOES NOT SALVAGE ─────────────────────────────────────────
 *
 * A paste either parses completely or fails with the row and column named.
 * Importing the rows that parsed and skipping the rest is the dangerous
 * option: a twelve-month series that quietly became nine still draws a chart,
 * the chart still looks like a year, and nobody can see the difference between
 * "spend fell in August" and "August did not import". That is how a wrong
 * number reaches a board.
 *
 * ── THE GAP RULE ────────────────────────────────────────────────────────────
 *
 * Months must be contiguous. A gap at either end is a levy year in progress or
 * one joined part-way through, both real. A gap in the middle is a dropped row:
 * a month where nothing was contributed is `0.00`, which is typeable and
 * distinguishable from absent. The API enforces the same rule; this catches it
 * before a round trip and points at the paste rather than at a field.
 */

const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;
const MONEY = /^\d{1,12}(\.\d{1,2})?$/;

/** `2026-04` → a comparable integer, so December to January is a gap of one. */
function ordinal(month) {
  const [year, m] = month.split("-").map(Number);
  return year * 12 + (m - 1);
}

/**
 * @returns {{ ok: true, months: Array<{month: string, contributions: string, spend: string}> }
 *   | { ok: false, error: string }}
 */
export function parseMonthCsv(text) {
  const raw = String(text ?? "").trim();
  if (!raw) {
    return { ok: false, error: "Nothing to import — paste some rows first." };
  }

  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  // A header row is common when pasting from a spreadsheet; drop it rather
  // than reporting "row 1, Month: expected YYYY-MM, got Month".
  if (
    lines.length > 0 &&
    /month/i.test(lines[0]) &&
    !MONTH.test(lines[0].split(/[,\t]/)[0]?.trim())
  ) {
    lines.shift();
  }

  if (lines.length === 0) {
    return { ok: false, error: "Nothing to import — paste some rows first." };
  }

  if (lines.length > MAX_MONTHS) {
    return {
      ok: false,
      error: `${lines.length} rows pasted, but a levy year is at most ${MAX_MONTHS} months. Remove the extra rows.`,
    };
  }

  const months = [];

  for (let i = 0; i < lines.length; i += 1) {
    // Row numbers are what the operator sees in their spreadsheet, so they
    // count from 1 and ignore the header that was just dropped.
    const rowNumber = i + 1;
    const cells = lines[i].split(/[,\t]/).map((c) => c.trim());

    if (cells.length !== MONTH_CSV_COLUMNS.length) {
      return {
        ok: false,
        error:
          `Row ${rowNumber} has ${cells.length} value${cells.length === 1 ? "" : "s"}, ` +
          `expected ${MONTH_CSV_COLUMNS.length}: ` +
          `${MONTH_CSV_COLUMNS.map((c) => c.label).join(", ")}.`,
      };
    }

    const [month, contributions, spend] = cells;

    if (!MONTH.test(month)) {
      return {
        ok: false,
        error: `Row ${rowNumber}, Month: "${month}" is not a month. Use YYYY-MM, for example 2026-04.`,
      };
    }
    if (!MONEY.test(contributions)) {
      return {
        ok: false,
        error:
          `Row ${rowNumber}, Contributions: "${contributions}" is not an amount. ` +
          `Use digits with up to two decimal places, for example 4100.00. ` +
          `Remove any £ sign or thousands separator.`,
      };
    }
    if (!MONEY.test(spend)) {
      return {
        ok: false,
        error:
          `Row ${rowNumber}, Spend: "${spend}" is not an amount. ` +
          `Use digits with up to two decimal places, for example 2750.00. ` +
          `Remove any £ sign or thousands separator.`,
      };
    }

    months.push({ month, contributions, spend });
  }

  const seen = new Map();
  for (let i = 0; i < months.length; i += 1) {
    const first = seen.get(months[i].month);
    if (first !== undefined) {
      return {
        ok: false,
        error: `Rows ${first + 1} and ${i + 1} are both ${months[i].month}. Each month may appear once.`,
      };
    }
    seen.set(months[i].month, i);
  }

  const sorted = [...months].sort(
    (a, b) => ordinal(a.month) - ordinal(b.month),
  );
  for (let i = 1; i < sorted.length; i += 1) {
    const gap = ordinal(sorted[i].month) - ordinal(sorted[i - 1].month);
    if (gap !== 1) {
      const missing = gap - 1;
      return {
        ok: false,
        error:
          `${missing} month${missing === 1 ? " is" : "s are"} missing between ` +
          `${sorted[i - 1].month} and ${sorted[i].month}. ` +
          `Enter 0.00 for a month with no contribution rather than leaving it out.`,
      };
    }
  }

  return { ok: true, months: sorted };
}
