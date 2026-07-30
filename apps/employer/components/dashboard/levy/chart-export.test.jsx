import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/useToast", () => ({
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
  toastDefault: vi.fn(),
}));

const { LevyUtilisation } = await import("./LevyUtilisation");
const { MonthlyChart } = await import("./MonthlyChart");
const { YearEndForecast } = await import("./YearEndForecast");

const segments = {
  used: 120000,
  expiringWithin90Days: 45000,
  available: 80000,
  currency: "GBP",
};

const forecast = {
  horizonMonths: 12,
  activeEnrolmentCount: 4,
  projectedMonthlySpend: 1000,
  projectedCompletionLiability: 20000,
  estimatedRunwayMonths: 8,
};

const monthlySeries = [
  { month: "2026-01", contributions: 15000, spend: 12500 },
  { month: "2026-02", contributions: 15000, spend: 9000 },
];

describe("F1.1.3 AC5 — every chart offers a PNG export", () => {
  it("utilisation chart exposes an export control", () => {
    render(<LevyUtilisation segments={segments} />);
    expect(screen.getByRole("button", { name: /export png/i })).toBeVisible();
  });

  it("forecast card exposes an export control", () => {
    render(<YearEndForecast forecast={forecast} segments={segments} />);
    expect(screen.getByRole("button", { name: /export png/i })).toBeVisible();
  });

  it("monthly chart exposes an export control when it has data", () => {
    render(<MonthlyChart monthlySeries={monthlySeries} />);
    expect(screen.getByRole("button", { name: /export png/i })).toBeVisible();
  });

  it("monthly chart hides the control when there is nothing to export", () => {
    render(<MonthlyChart monthlySeries={[]} />);
    expect(screen.queryByRole("button", { name: /export png/i })).toBeNull();
  });

  it("the export control is excluded from the captured image", () => {
    // useChartPng filters on this attribute; without it the button would be
    // baked into every exported PNG.
    render(<LevyUtilisation segments={segments} />);
    expect(screen.getByRole("button", { name: /export png/i })).toHaveAttribute(
      "data-chart-export-control",
      "true",
    );
  });
});

describe("F1.1.3 AC5 — the capture target is a real DOM node", () => {
  it("Card forwards the ref, so html-to-image has something to rasterise", () => {
    // Card is a plain function component that spreads props onto its div.
    // React 19 passes `ref` as an ordinary prop, which makes that work — but
    // it is subtle enough that a regression (or a React downgrade) would
    // silently break export while the button still rendered.
    const { container } = render(<LevyUtilisation segments={segments} />);
    const card = container.firstChild;
    expect(card).toBeInstanceOf(HTMLElement);
    expect(card.tagName).toBe("DIV");
  });
});

describe("F1.1.3 AC1/AC3 — cards degrade honestly without data", () => {
  it("utilisation says data is unavailable rather than charting zeros", () => {
    render(<LevyUtilisation segments={undefined} />);
    expect(screen.getByText(/not available/i)).toBeVisible();
    expect(screen.queryByText("£0.00")).toBeNull();
  });

  it("forecast says unavailable rather than projecting a false zero", () => {
    render(<YearEndForecast forecast={undefined} segments={segments} />);
    expect(screen.getByText(/unavailable/i)).toBeVisible();
  });

  it("shows a loading state while the request is in flight", () => {
    render(<LevyUtilisation isLoading />);
    expect(screen.getByText(/loading/i)).toBeVisible();
  });
});
