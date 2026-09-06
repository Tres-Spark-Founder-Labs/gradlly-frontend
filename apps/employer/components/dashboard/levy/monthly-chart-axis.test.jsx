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
 * A short series must occupy a short part of the axis.
 *
 * The chart previously sized its slots as `100 / rows.length`, so seven months
 * and twelve months produced identical geometry — same bar width, same spacing,
 * axis full. An employer seven months into a levy year saw a chart that looked
 * like a complete year, and read a seven-month trend as a twelve-month one.
 *
 * These tests assert the geometry rather than a snapshot, because the property
 * that matters is arithmetic: the bars for N months must cover N twelfths of
 * the width, not all of it.
 */
describe("MonthlyChart — a part-year renders as a part-year", () => {
  const series = (count) =>
    Array.from({ length: count }, (_, i) => ({
      month: `2026-${String(i + 1).padStart(2, "0")}`,
      contributions: 1000,
      spend: 500,
    }));

  const barXs = (container) =>
    [...container.querySelectorAll("rect[width]")]
      .map((r) => Number(r.getAttribute("x")))
      .filter((x) => Number.isFinite(x))
      .sort((a, b) => a - b);

  it("plots twelve months across the full width", () => {
    const { container } = render(<MonthlyChart monthlySeries={series(12)} />);
    const xs = barXs(container);

    // Last pair starts in the twelfth slot: 11 * (100/12) = 91.67.
    expect(Math.max(...xs)).toBeGreaterThan(88);
  });

  it("leaves the rest of the year empty for a seven-month series", () => {
    const { container } = render(<MonthlyChart monthlySeries={series(7)} />);
    const xs = barXs(container);

    // Seven of twelve slots: the last bar starts near 6 * (100/12) = 50,
    // and nothing is drawn beyond roughly 58.
    expect(Math.max(...xs)).toBeLessThan(60);
  });

  it("gives the same bar width whether the series is short or full", () => {
    const width = (count) => {
      const { container } = render(
        <MonthlyChart monthlySeries={series(count)} />,
      );
      const rect = container.querySelector("rect[width]");
      return Number(rect?.getAttribute("width"));
    };

    // The regression this guards: widening the bars to fill the axis is the
    // same misrepresentation as spreading them.
    expect(width(7)).toBeCloseTo(width(12), 5);
  });

  it("says how much of the year is recorded, for a screen reader", () => {
    const { container } = render(<MonthlyChart monthlySeries={series(7)} />);
    // The label lives on the <figure> wrapping the svg.
    const figure = container.querySelector("figure[aria-label]");

    expect(figure?.getAttribute("aria-label")).toMatch(
      /7 of 12 months recorded/,
    );
  });
});
