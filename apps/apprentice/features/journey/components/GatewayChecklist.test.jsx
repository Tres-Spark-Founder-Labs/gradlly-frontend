import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CRITERION_STATUS } from "../constants";
import { GatewayChecklist } from "./GatewayChecklist";

const criterion = (over = {}) => ({
  code: "otj_on_track",
  title: "OTJ hours on track",
  description: "Approved off-the-job hours are within 15% of required pace.",
  status: CRITERION_STATUS.NOT_STARTED,
  ...over,
});

describe("GatewayChecklist (F3.2.2)", () => {
  it("AC1 — lists every criterion it is given", () => {
    render(
      <GatewayChecklist
        items={[
          criterion({ code: "a", title: "OTJ hours on track" }),
          criterion({ code: "b", title: "Commitment statement signed" }),
          criterion({ code: "c", title: "Reviews up to date" }),
          criterion({ code: "d", title: "EPA date confirmed" }),
        ]}
      />,
    );

    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(screen.getByText("EPA date confirmed")).toBeInTheDocument();
  });

  it.each([
    [CRITERION_STATUS.COMPLETE, "Complete"],
    [CRITERION_STATUS.IN_PROGRESS, "In progress"],
    [CRITERION_STATUS.NOT_STARTED, "Not started"],
  ])("AC2 — marks a %s criterion as '%s'", (status, label) => {
    render(<GatewayChecklist items={[criterion({ status })]} />);

    expect(screen.getByText(label)).toBeInTheDocument();
  });

  describe("AC3 — a blocked criterion names its blocker", () => {
    const blockedSet = [
      criterion({
        code: "portfolio_uploaded",
        title: "Portfolio evidence uploaded",
        status: CRITERION_STATUS.NOT_STARTED,
      }),
      criterion({
        code: "portfolio_reviewed",
        title: "Portfolio reviewed and signed off",
        status: CRITERION_STATUS.BLOCKED,
        blockedBy: ["portfolio_uploaded"],
      }),
    ];

    it("says what it is waiting on, by title not by code", () => {
      render(<GatewayChecklist items={blockedSet} />);

      const blocked = screen
        .getByText("Portfolio reviewed and signed off")
        .closest("li");

      // The apprentice must see the human title. A raw code like
      // "portfolio_uploaded" is not actionable information.
      expect(within(blocked).getByText(/Waiting on:/)).toBeInTheDocument();
      expect(
        within(blocked).getByText(/Portfolio evidence uploaded/),
      ).toBeInTheDocument();
    });

    it("marks it blocked rather than merely not started", () => {
      render(<GatewayChecklist items={blockedSet} />);

      expect(screen.getByText("Blocked")).toBeInTheDocument();
    });
  });

  describe("AC4 — completion percentage as a progress bar", () => {
    it("exposes the percentage to assistive technology, not just visually", () => {
      render(<GatewayChecklist items={[criterion()]} completionPercent={75} />);

      const bar = screen.getByRole("progressbar");
      expect(bar).toHaveAttribute("aria-valuenow", "75");
      expect(bar).toHaveAttribute("aria-valuemin", "0");
      expect(bar).toHaveAttribute("aria-valuemax", "100");
      expect(screen.getByText("75%")).toBeInTheDocument();
    });
  });

  describe("AC5 — the Gateway Ready badge", () => {
    it("is absent while any criterion is outstanding", () => {
      render(
        <GatewayChecklist
          items={[criterion()]}
          completionPercent={75}
          ready={false}
        />,
      );

      expect(screen.queryByText("Gateway Ready")).not.toBeInTheDocument();
    });

    it("appears when readiness is reached, with the recorded date", () => {
      render(
        <GatewayChecklist
          items={[criterion({ status: CRITERION_STATUS.COMPLETE })]}
          completionPercent={100}
          ready
          readyAt="2026-08-01T10:00:00.000Z"
        />,
      );

      expect(screen.getByText("Gateway Ready")).toBeInTheDocument();
      // Client decision Q3 — readiness is a recorded moment, so the date it
      // happened is shown rather than implied.
      expect(screen.getByText(/1 Aug 2026|Aug 2026|2026/)).toBeInTheDocument();
    });
  });

  it("renders an honest empty state rather than sample criteria", () => {
    render(<GatewayChecklist items={[]} />);

    expect(screen.getByText(/will appear here/i)).toBeInTheDocument();
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });
});
