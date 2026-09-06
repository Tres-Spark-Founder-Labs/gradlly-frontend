import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("./ChartExportButton", () => ({
  ChartExportButton: () => null,
  useChartPng: () => ({
    ref: { current: null },
    download: vi.fn(),
    busy: false,
  }),
}));

const { MonthlyChart } = await import("./MonthlyChart");

/**
 * Axis labels must not run into each other.
 *
 * ── THE DEFECT ──────────────────────────────────────────────────────────────
 *
 * The labels were `<text>` inside an svg with `preserveAspectRatio="none"`.
 * A month slot is 100/12 = 8.33 user units wide; "Sep" at `fontSize="7"` is
 * roughly 12. Every label was wider than its slot, so at the default width the
 * axis rendered as one unbroken run of characters. Because the whole drawing
 * is stretched to the container, the overlap was proportionally identical at
 * every viewport — it never came right at any size.
 *
 * ── WHY THESE TESTS ASSERT STRUCTURE, NOT PIXELS ────────────────────────────
 *
 * jsdom has no layout engine: `getBoundingClientRect` returns zeros, so a test
 * that measured rendered boxes would pass against any implementation, including
 * the broken one. Measuring nothing and reporting success is worse than not
 * testing.
 *
 * So these assert the property that makes collision impossible rather than
 * sampling one width: each label occupies its own cell of exactly one twelfth
 * of the axis, and clips inside it. Disjoint boxes cannot overlap at any
 * viewport, which is a stronger guarantee than a font size that happens to fit
 * at the width someone tested.
 *
 * The final test does the arithmetic for the narrowest supported viewport,
 * since a cell that is disjoint but too small to show anything is a different
 * failure and worth catching separately.
 */

/** Narrowest viewport the dashboard is expected to work at. */
const NARROWEST_VIEWPORT_PX = 320;
const MONTHS_IN_LEVY_YEAR = 12;

const series = (count, startMonth = 1) =>
  Array.from({ length: count }, (_, i) => ({
    month: `2026-${String(startMonth + i).padStart(2, "0")}`,
    contributions: 1000 + i,
    spend: 500 + i,
  }));

const axisCells = (container) => [
  ...container.querySelectorAll("[data-axis-cell]"),
];

describe("MonthlyChart axis labels", () => {
  it("gives every month its own cell", () => {
    const { container } = render(<MonthlyChart monthlySeries={series(12)} />);
    expect(axisCells(container)).toHaveLength(MONTHS_IN_LEVY_YEAR);
  });

  it("lays out twelve cells even for a part-year", () => {
    // The bars are positioned against a fixed twelve-month axis. If the labels
    // were laid out over rows.length instead, a seven-month series would spread
    // its labels across the full width beneath bars that stop at seven twelfths
    // — every label sitting under the wrong bar.
    const { container } = render(<MonthlyChart monthlySeries={series(7)} />);
    const cells = axisCells(container);

    expect(cells).toHaveLength(MONTHS_IN_LEVY_YEAR);
    expect(cells.slice(0, 7).every((c) => c.textContent.trim() !== "")).toBe(
      true,
    );
    expect(cells.slice(7).every((c) => c.textContent.trim() === "")).toBe(true);
  });

  it("sizes each cell to exactly one twelfth, so the boxes are disjoint", () => {
    const { container } = render(<MonthlyChart monthlySeries={series(12)} />);

    for (const cell of axisCells(container)) {
      // Percentage width, not a pixel width: it stays one twelfth at every
      // viewport rather than being correct only where it was measured.
      expect(cell.style.width).toBe(`${100 / MONTHS_IN_LEVY_YEAR}%`);
    }
  });

  it("clips a label inside its own cell rather than over the next one", () => {
    const { container } = render(<MonthlyChart monthlySeries={series(12)} />);

    for (const cell of axisCells(container)) {
      expect(cell.className).toContain("overflow-hidden");
      expect(cell.className).toContain("whitespace-nowrap");
    }
  });

  it("renders the labels outside the stretched svg", () => {
    const { container } = render(<MonthlyChart monthlySeries={series(12)} />);
    const svg = container.querySelector("svg");

    // The regression: putting them back inside re-introduces the non-uniform
    // scaling that distorted and widened every glyph.
    expect(svg?.querySelectorAll("text")).toHaveLength(0);
    expect(svg?.getAttribute("preserveAspectRatio")).toBe("none");
    expect(axisCells(container).length).toBeGreaterThan(0);
  });

  it("leaves room for a three-letter month at the narrowest viewport", () => {
    const { container } = render(<MonthlyChart monthlySeries={series(12)} />);
    const cells = axisCells(container);
    const labels = cells.map((c) => c.textContent.trim());

    // Read the base size off the component rather than restating it here, so
    // shrinking the font cannot silently move the goalposts of its own test.
    const base = /text-\[(\d+)px\]/.exec(cells[0].className);
    expect(base, "no base font size on the axis cell").not.toBeNull();
    const fontPx = Number(base[1]);

    const cellPx = NARROWEST_VIEWPORT_PX / MONTHS_IN_LEVY_YEAR;
    // Deliberately pessimistic: 0.75em per character is wider than any glyph
    // in "Jan"–"Dec" actually is. Clearing this estimate clears a browser with
    // room to spare, which is the point — a label that only just fits is one
    // rounding away from clipping.
    const widestLabelPx =
      Math.max(...labels.map((l) => l.length)) * fontPx * 0.75;

    expect(labels.every((l) => l.length > 0)).toBe(true);
    expect(widestLabelPx).toBeLessThanOrEqual(cellPx);
  });

  it("still abbreviates the month rather than printing the raw value", () => {
    const { container } = render(<MonthlyChart monthlySeries={series(3)} />);
    const labels = axisCells(container)
      .map((c) => c.textContent.trim())
      .filter(Boolean);

    expect(labels).toEqual(["Jan", "Feb", "Mar"]);
    // "2026-01" would be seven characters and could not fit any cell.
    expect(labels.every((l) => !l.includes("-"))).toBe(true);
  });
});
