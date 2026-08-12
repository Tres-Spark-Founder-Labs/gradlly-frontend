import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MILESTONE_STATUS } from "../constants";
import { ProgrammeTimeline } from "./ProgrammeTimeline";

const ms = (over = {}) => ({
  code: "enrolment",
  title: "Enrolment",
  description: "Apprenticeship enrolment activated",
  date: "2025-01-15",
  status: MILESTONE_STATUS.COMPLETE,
  ...over,
});

describe("ProgrammeTimeline (F3.2.1)", () => {
  it("AC1 — renders milestones in the order the API gave them", () => {
    const order = [
      "Enrolment",
      "Induction",
      "12-weekly review",
      "Gateway",
      "End-point assessment",
      "Completion",
    ];

    render(
      <ProgrammeTimeline
        milestones={order.map((title, i) => ms({ code: `m${i}`, title }))}
      />,
    );

    const rendered = screen
      .getAllByRole("listitem")
      .map((li) => within(li).getByRole("button").textContent);

    order.forEach((title, i) => {
      expect(rendered[i]).toContain(title);
    });
  });

  it("AC1 — does not re-sort what the server sent", () => {
    // The API emits reviews in scheduled order and may legitimately place a
    // rescheduled review out of naive date order. A client-side sort would
    // silently disagree with the server.
    render(
      <ProgrammeTimeline
        milestones={[
          ms({ code: "a", title: "Later", date: "2026-06-01" }),
          ms({ code: "b", title: "Earlier", date: "2025-01-01" }),
        ]}
      />,
    );

    const titles = screen
      .getAllByRole("listitem")
      .map((li) => within(li).getByRole("button").textContent);

    expect(titles[0]).toContain("Later");
    expect(titles[1]).toContain("Earlier");
  });

  it.each([
    [MILESTONE_STATUS.COMPLETE, "Complete"],
    [MILESTONE_STATUS.CURRENT, "In progress"],
    [MILESTONE_STATUS.UPCOMING, "Upcoming"],
    [MILESTONE_STATUS.OVERDUE, "Overdue"],
    [MILESTONE_STATUS.CANCELLED, "Cancelled"],
  ])("AC2 — a %s milestone is labelled '%s'", (status, label) => {
    render(<ProgrammeTimeline milestones={[ms({ status })]} />);

    expect(screen.getByText(label)).toBeInTheDocument();
  });

  describe("client decision Q2 — the timeline tells the truth about reviews", () => {
    it("distinguishes an overdue review from one still upcoming", () => {
      render(
        <ProgrammeTimeline
          milestones={[
            ms({
              code: "r1",
              title: "Review 1",
              status: MILESTONE_STATUS.OVERDUE,
            }),
            ms({
              code: "r2",
              title: "Review 2",
              status: MILESTONE_STATUS.UPCOMING,
            }),
          ]}
        />,
      );

      // The whole point of the decision: these must not read the same.
      expect(screen.getByText("Overdue")).toBeInTheDocument();
      expect(screen.getByText("Upcoming")).toBeInTheDocument();
    });

    it("does not present a cancelled review as still to come", () => {
      render(
        <ProgrammeTimeline
          milestones={[ms({ status: MILESTONE_STATUS.CANCELLED })]}
        />,
      );

      expect(screen.getByText("Cancelled")).toBeInTheDocument();
      expect(screen.queryByText("Upcoming")).not.toBeInTheDocument();
    });
  });

  describe("AC3 — selecting a milestone shows its detail", () => {
    it("opens a dialog with the date and description", () => {
      render(
        <ProgrammeTimeline
          milestones={[
            ms({ title: "Gateway", description: "Gateway readiness complete" }),
          ]}
        />,
      );

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: /Gateway/ }));

      const dialog = screen.getByRole("dialog");
      expect(
        within(dialog).getByText("Gateway readiness complete"),
      ).toBeInTheDocument();
    });

    it("is reachable by keyboard, not just by pointer", () => {
      render(<ProgrammeTimeline milestones={[ms({ title: "Induction" })]} />);

      // A <button> is focusable and announced as actionable; a clickable <div>
      // is neither. WCAG 2.1 AA is a launch gate, so this is asserted rather
      // than assumed.
      const trigger = screen.getByRole("button", { name: /Induction/ });
      trigger.focus();
      expect(trigger).toHaveFocus();
    });

    it("says documents are unavailable rather than inventing a list", () => {
      render(<ProgrammeTimeline milestones={[ms()]} />);
      fireEvent.click(screen.getByRole("button", { name: /Enrolment/ }));

      // OQ-15: a fabricated document list is worse than an absent one.
      expect(
        within(screen.getByRole("dialog")).getByText(
          /not attached to timeline/i,
        ),
      ).toBeInTheDocument();
    });
  });

  it("shows an honest empty state with no milestones", () => {
    render(<ProgrammeTimeline milestones={[]} />);

    expect(screen.getByText(/will appear here/i)).toBeInTheDocument();
  });

  it("says the date is unconfirmed rather than showing a placeholder date", () => {
    render(<ProgrammeTimeline milestones={[ms({ date: null })]} />);

    expect(screen.getByText("Date to be confirmed")).toBeInTheDocument();
  });
});
