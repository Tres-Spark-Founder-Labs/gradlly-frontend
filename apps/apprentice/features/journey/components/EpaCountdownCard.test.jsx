import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { EPA_BAND, EPA_DATE_UNSET_MESSAGE } from "../constants";
import { EpaCountdownCard } from "./EpaCountdownCard";

/**
 * F3.2.3 — EPA countdown.
 *
 * These assert what the apprentice is *shown*. The band arithmetic is not
 * retested here — it lives in the API (`src/enrolments/epa-countdown.spec.ts`)
 * with both sides of every boundary pinned. What matters on this side is that
 * the component renders whatever band it is given and never invents one, so a
 * server-side band change cannot be silently ignored by the client.
 */
describe("EpaCountdownCard (F3.2.3)", () => {
  it("AC1 — shows the days remaining as the dominant number", () => {
    render(
      <EpaCountdownCard
        band={EPA_BAND.GREEN}
        daysToEpa={142}
        epaDate="2026-12-31"
      />,
    );

    expect(screen.getByText("142")).toBeInTheDocument();
    expect(screen.getByText("days to go")).toBeInTheDocument();
  });

  it("AC1 — uses the singular on the last day but one", () => {
    render(<EpaCountdownCard band={EPA_BAND.RED} daysToEpa={1} />);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("day to go")).toBeInTheDocument();
    expect(screen.queryByText("days to go")).not.toBeInTheDocument();
  });

  describe("AC2 — the colour band is taken from the server, never re-derived", () => {
    // Same day count, three different bands. If the component computed the
    // band itself from `daysToEpa`, these could not all pass — which is the
    // point: the rule must exist in exactly one place.
    it.each([
      [EPA_BAND.GREEN, "text-success-700"],
      [EPA_BAND.AMBER, "text-warning-700"],
      [EPA_BAND.RED, "text-error-700"],
    ])("renders %s with its own tone", (band, expectedClass) => {
      const { container } = render(
        <EpaCountdownCard band={band} daysToEpa={45} />,
      );

      expect(container.querySelector(`.${expectedClass}`)).not.toBeNull();
    });
  });

  it("AC3 — shows the exact placeholder copy when no EPA date is set", () => {
    render(<EpaCountdownCard band={EPA_BAND.UNSET} daysToEpa={null} />);

    expect(screen.getByText(EPA_DATE_UNSET_MESSAGE)).toBeInTheDocument();
  });

  it("AC3 — shows no number at all when the date is unset", () => {
    const { container } = render(
      <EpaCountdownCard band={EPA_BAND.UNSET} daysToEpa={null} />,
    );

    // A "0" here would read as "your EPA is today", which is the opposite of
    // "not yet confirmed".
    expect(container.textContent).not.toMatch(/\b\d+\b/);
  });

  it("AC4 — the countdown links to the gateway readiness checklist", () => {
    render(<EpaCountdownCard band={EPA_BAND.AMBER} daysToEpa={60} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/journey#gateway");
  });

  describe("edge cases agreed with the client (Q4a, Q4b)", () => {
    it("reads 'Today' on the day of the EPA rather than counting zero", () => {
      render(<EpaCountdownCard band={EPA_BAND.RED} daysToEpa={0} />);

      expect(screen.getByText("Today")).toBeInTheDocument();
      expect(screen.queryByText("0")).not.toBeInTheDocument();
    });

    it("says the date passed rather than counting backwards", () => {
      render(<EpaCountdownCard band={EPA_BAND.OVERDUE} daysToEpa={-12} />);

      expect(screen.getByText("Date passed")).toBeInTheDocument();
      expect(screen.queryByText("-12")).not.toBeInTheDocument();
      expect(screen.getByText(/speak to your tutor/i)).toBeInTheDocument();
    });
  });
});
