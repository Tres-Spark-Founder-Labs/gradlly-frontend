import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DonorAnalyticsDashboard } from "./DonorAnalyticsDashboard";

/**
 * F4.1.4.
 *
 * These figures are exported into a donor's annual ESG report, so the tests
 * are about the ways the screen could mislead — a null rate rendered as 0%, a
 * fabricated ESG score, a value visible only on hover.
 */
let summaryState;
let breakdownState;

vi.mock("@/features/levy/queries/levy.query", () => ({
  useDonorAnalytics: () => summaryState,
  useDonorAnalyticsBreakdown: () => breakdownState,
}));

const summary = (data = {}) => ({
  data: {
    totalTransferred: 27000,
    smesFunded: 1,
    learnersFunded: 1,
    completedCount: 0,
    completionRate: null,
    epaPassRate: null,
    epaAssessedCount: 0,
    esgImpact: null,
    ...data,
  },
  isLoading: false,
  isError: false,
  error: null,
});

const breakdown = (data = {}) => ({
  data: {
    bySector: [{ label: "Engineering & Manufacturing", amount: 27000 }],
    byRegion: [{ label: "Yorkshire and the Humber", amount: 27000 }],
    byProgrammeType: [{ label: "Software Developer L4", amount: 27000 }],
    ...data,
  },
  isLoading: false,
  isError: false,
  error: null,
});

describe("DonorAnalyticsDashboard (F4.1.4)", () => {
  beforeEach(() => {
    summaryState = summary();
    breakdownState = breakdown();
  });

  it("AC1 — shows the five headline figures", () => {
    render(<DonorAnalyticsDashboard />);

    // £27,000 appears in the tile and in all three breakdowns, which is
    // correct — one transfer, counted once and then classified three ways.
    expect(screen.getAllByText("£27,000").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Transferred to date/i)).toBeVisible();
    expect(screen.getByText(/SMEs funded/i)).toBeVisible();
    expect(screen.getByText(/Learners funded/i)).toBeVisible();
    expect(screen.getByText(/Completion rate/i)).toBeVisible();
    expect(screen.getByText(/EPA pass rate/i)).toBeVisible();
  });

  /**
   * The most important assertion here. A donor who has just started has not
   * had every learner fail, and "0%" would say exactly that in a document
   * going to their stakeholders.
   */
  it("renders a null rate as 'Not yet available', never 0%", () => {
    render(<DonorAnalyticsDashboard />);

    expect(screen.queryByText("0%")).toBeNull();
    expect(screen.getAllByText(/not yet available/i).length).toBeGreaterThan(0);
  });

  it("renders real rates when they exist", () => {
    summaryState = summary({
      completionRate: 33.33,
      epaPassRate: 100,
      epaAssessedCount: 2,
      completedCount: 1,
    });
    render(<DonorAnalyticsDashboard />);

    expect(screen.getByText("33.33%")).toBeVisible();
    expect(screen.getByText("100%")).toBeVisible();
  });

  it("AC3 — states the ESG card is unavailable rather than omitting or faking it", () => {
    render(<DonorAnalyticsDashboard />);

    const status = screen.getByRole("status");
    expect(status).toHaveTextContent(/ESG impact summary/i);
    expect(status).toHaveTextContent(/agreed methodology/i);
  });

  it("AC2 — shows all three breakdowns with directly-labelled amounts", () => {
    render(<DonorAnalyticsDashboard />);

    expect(screen.getByText(/by sector/i)).toBeVisible();
    expect(screen.getByText(/by region/i)).toBeVisible();
    expect(screen.getByText(/by programme/i)).toBeVisible();

    // The value is text on the page, not hover-only — a chart whose numbers
    // are only reachable by pointer is unreadable on touch and to a screen
    // reader.
    expect(screen.getByText("Engineering & Manufacturing")).toBeVisible();
    expect(screen.getAllByText("£27,000").length).toBeGreaterThanOrEqual(3);
  });

  it("gives each bar an accessible label so identity is not colour-alone", () => {
    render(<DonorAnalyticsDashboard />);

    expect(
      screen.getByLabelText(/Engineering & Manufacturing: £27,000/i),
    ).toBeInTheDocument();
  });

  it("shows an empty state per breakdown rather than an empty chart frame", () => {
    breakdownState = breakdown({
      bySector: [],
      byRegion: [],
      byProgrammeType: [],
    });
    render(<DonorAnalyticsDashboard />);

    expect(screen.getAllByText(/no transfers yet/i)).toHaveLength(3);
  });

  it("shows a loading state instead of zeroes while fetching", () => {
    summaryState = { ...summary(), isLoading: true, data: undefined };
    render(<DonorAnalyticsDashboard />);

    expect(screen.getByText(/loading your donor analytics/i)).toBeVisible();
    expect(screen.queryByText("£0")).toBeNull();
  });

  it("surfaces a load failure rather than rendering an empty dashboard", () => {
    summaryState = {
      ...summary(),
      isError: true,
      error: { message: "boom" },
      data: undefined,
    };
    render(<DonorAnalyticsDashboard />);

    expect(
      screen.getByText(/could not load your donor analytics/i),
    ).toBeVisible();
  });

  it("keeps the headline figures when only the breakdown fails", () => {
    breakdownState = { ...breakdown(), isError: true, data: undefined };
    render(<DonorAnalyticsDashboard />);

    // A partial failure should not blank the numbers that did load.
    expect(screen.getAllByText("£27,000").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/could not load the breakdowns/i)).toBeVisible();
  });

  it("sorts nothing itself — it renders the order the API returned", () => {
    breakdownState = breakdown({
      bySector: [
        { label: "Large", amount: 9000 },
        { label: "Small", amount: 1000 },
      ],
    });
    render(<DonorAnalyticsDashboard />);

    const sector = screen.getByText(/by sector/i).closest("section");
    const items = within(sector).getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("Large");
    expect(items[1]).toHaveTextContent("Small");
  });
});
