import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProfileActivity } from "./ProfileActivity";
import { ProfileDocuments } from "./ProfileDocuments";
import { ProfileMilestones } from "./ProfileMilestones";
import { ProfileReviews } from "./ProfileReviews";
import { ProfileTimeline } from "./ProfileTimeline";

/**
 * Every tab renders what the API returned, and nothing else.
 *
 * ── WHAT THESE GUARD ────────────────────────────────────────────────────────
 *
 * All six tabs used to render fixtures. Reviews showed one invented review
 * signed by "Marcus Reid" and "David Osei" for every apprentice in the roster;
 * Timeline showed a fixed six-milestone ladder dated March 2024 to January
 * 2026; Documents fell back to two invented files whenever `a.documents` was
 * absent, which was always.
 *
 * A fixture is invisible in a screenshot and invisible in a passing test that
 * only asserts "something rendered" — it looks exactly like working software.
 * So each test below feeds a distinctive value through the real API shape and
 * asserts that value reaches the screen, then asserts the old fixture text is
 * absent. Both halves matter: the first proves the wiring, the second proves
 * the fixture is not sitting underneath it as a fallback.
 */

const ready = { isLoading: false, isError: false, error: null };

describe("ProfileReviews", () => {
  const profile = {
    reviews: [
      {
        id: "rev-1",
        status: "completed",
        scheduledAt: "2026-02-11T10:00:00.000Z",
        isOverdue: false,
        tutorSigned: true,
        apprenticeSigned: false,
      },
    ],
  };

  it("renders the review the API returned", () => {
    render(<ProfileReviews profile={profile} {...ready} />);

    expect(screen.getByText("Review 1")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
    // Signature state replaced the invented outcome prose, and is the half an
    // employer actually chases.
    expect(screen.getByText(/Tutor signed/)).toBeInTheDocument();
    expect(screen.getByText(/Apprentice not signed/)).toBeInTheDocument();
  });

  it("does not render the fixture review", () => {
    render(<ProfileReviews profile={profile} {...ready} />);

    expect(screen.queryByText(/Marcus Reid/)).not.toBeInTheDocument();
    expect(screen.queryByText(/David Osei/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Progressing well/)).not.toBeInTheDocument();
  });

  it("names what is missing when there are none", () => {
    render(<ProfileReviews profile={{ reviews: [] }} {...ready} />);

    // Not "no data" — this says who has not done what.
    expect(screen.getByText("No reviews scheduled")).toBeInTheDocument();
    expect(
      screen.getByText(/provider has not scheduled a progress review/i),
    ).toBeInTheDocument();
  });

  it("reports its own error rather than blanking", () => {
    render(
      <ProfileReviews
        profile={undefined}
        isLoading={false}
        isError
        error={{ message: "Request failed" }}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Request failed");
  });
});

describe("ProfileMilestones", () => {
  const profile = {
    programme: {
      standardTitle: "Software Developer Level 4",
      plannedStartDate: "2026-01-06",
      plannedEndDate: null,
      epaDate: "2027-06-01",
      epaOrganisationName: "Assessment Board Ltd",
      epaOrganisationUkprn: "10009999",
    },
    reviews: [],
    breakInLearning: { active: false, recentInterventions: [] },
  };

  it("renders programme dates from the API", () => {
    render(<ProfileMilestones profile={profile} {...ready} />);

    expect(screen.getByText("Programme start")).toBeInTheDocument();
    expect(screen.getByText("Software Developer Level 4")).toBeInTheDocument();
    expect(
      screen.getByText("Assessment Board Ltd (10009999)"),
    ).toBeInTheDocument();
  });

  it("shows an unknown date as unknown rather than inferring one", () => {
    render(<ProfileMilestones profile={profile} {...ready} />);

    // plannedEndDate is null. The old drawer would have placed it between the
    // start and the EPA; this says it is not recorded.
    expect(screen.getByText("Planned end")).toBeInTheDocument();
    expect(screen.getByText("Date not recorded")).toBeInTheDocument();
    expect(screen.getByText("Not recorded")).toBeInTheDocument();
  });

  it("does not call a passed planned date complete", () => {
    render(
      <ProfileMilestones
        profile={{
          ...profile,
          programme: { ...profile.programme, plannedEndDate: "2020-01-01" },
        }}
        {...ready}
      />,
    );

    // A planned end in the past with nothing confirming it is the case an
    // employer needs to see. "Complete" would hide it.
    //
    // Two of them: the start date is also behind us. That is the point — a
    // date being in the past says nothing about whether the event happened.
    expect(screen.getAllByText("Date passed")).toHaveLength(2);
    expect(screen.queryByText("Complete")).not.toBeInTheDocument();
  });

  it("does not render the fixture ladder", () => {
    render(<ProfileMilestones profile={profile} {...ready} />);

    expect(screen.queryByText(/6-month review/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Gateway/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Mock EPA/i)).not.toBeInTheDocument();
  });
});

describe("ProfileTimeline", () => {
  const profile = {
    programme: {
      standardTitle: "Data Analyst Level 4",
      plannedStartDate: "2026-03-02",
      plannedEndDate: null,
      epaDate: null,
      epaOrganisationName: null,
      epaOrganisationUkprn: null,
    },
    reviews: [
      {
        id: "rev-9",
        status: "scheduled",
        scheduledAt: "2026-09-01T09:00:00.000Z",
        isOverdue: false,
        tutorSigned: false,
        apprenticeSigned: false,
      },
    ],
    breakInLearning: { active: false, recentInterventions: [] },
  };

  it("plots the dates the API returned", () => {
    render(<ProfileTimeline profile={profile} {...ready} />);

    expect(screen.getByText("Programme start")).toBeInTheDocument();
    expect(screen.getByText("Review 1")).toBeInTheDocument();
  });

  it("separates undated milestones instead of placing them", () => {
    render(<ProfileTimeline profile={profile} {...ready} />);

    expect(screen.getByText("Not yet scheduled")).toBeInTheDocument();
    // Both plannedEndDate and epaDate are null here.
    expect(screen.getAllByText("Date not recorded")).toHaveLength(2);
  });

  it("does not render the fixture notes", () => {
    render(<ProfileTimeline profile={profile} {...ready} />);

    expect(screen.queryByText(/OTJ on pace/)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Commitment statement signed/),
    ).not.toBeInTheDocument();
  });
});

describe("ProfileActivity", () => {
  const profile = {
    otj: {
      totalCount: 2,
      truncated: false,
      recentEntries: [
        {
          id: "otj-1",
          loggedDate: "2026-08-14",
          minutes: 90,
          status: "approved",
          activityName: "Shadowing the platform team",
          flaggedAt: null,
          flagNote: null,
        },
      ],
    },
    breakInLearning: {
      active: false,
      recentInterventions: [
        {
          id: "int-1",
          enrolmentId: "enr-1",
          actionType: "call",
          notes: "Discussed the missed session",
          createdByUserId: "u-1",
          createdAt: "2026-08-20T11:00:00.000Z",
        },
      ],
    },
  };

  it("renders off-the-job sessions and interventions from the API", () => {
    render(<ProfileActivity profile={profile} {...ready} />);

    expect(screen.getByText("Shadowing the platform team")).toBeInTheDocument();
    expect(screen.getByText(/1h 30m/)).toBeInTheDocument();
    expect(screen.getByText("Call logged")).toBeInTheDocument();
    expect(
      screen.getByText("Discussed the missed session"),
    ).toBeInTheDocument();
  });

  it("says how much of the log is on screen when it is capped", () => {
    render(
      <ProfileActivity
        profile={{
          ...profile,
          otj: { ...profile.otj, totalCount: 812, truncated: true },
        }}
        {...ready}
      />,
    );

    // Showing 1 of 812 without saying so understates what the apprentice did.
    expect(
      screen.getByText(/Showing the 1 most recent of 812/),
    ).toBeInTheDocument();
  });

  it("distinguishes no activity from a tab that was never wired", () => {
    render(
      <ProfileActivity
        profile={{
          otj: { totalCount: 0, truncated: false, recentEntries: [] },
          breakInLearning: { active: false, recentInterventions: [] },
        }}
        {...ready}
      />,
    );

    // This tab rendered an empty list for everyone while recentActivity was
    // hardcoded to []. Now the emptiness is a statement about the learner.
    expect(screen.getByText("No activity recorded")).toBeInTheDocument();
    expect(
      screen.getByText(/No off-the-job sessions have been logged/i),
    ).toBeInTheDocument();
  });
});

describe("ProfileDocuments", () => {
  const profile = {
    documents: [
      {
        id: "doc-1",
        type: "commitment",
        title: "Commitment statement for Priya Shah",
        documentAt: "2026-01-06T00:00:00.000Z",
        storageKey: "s3://bucket/doc-1.pdf",
        externalUrl: null,
      },
      {
        id: "doc-2",
        type: "evidence",
        title: "Portfolio link",
        documentAt: "2026-05-02T00:00:00.000Z",
        storageKey: null,
        externalUrl: "https://example.org/portfolio",
      },
    ],
  };

  it("renders the documents the API returned", () => {
    render(<ProfileDocuments profile={profile} {...ready} />);

    expect(
      screen.getByText("Commitment statement for Priya Shah"),
    ).toBeInTheDocument();
    expect(screen.getByText("Portfolio link")).toBeInTheDocument();
  });

  it("links only the document that has a real URL", () => {
    render(<ProfileDocuments profile={profile} {...ready} />);

    // A storageKey is not a URL, and this app has no presigned-download
    // endpoint — so the stored file gets a statement, not a dead button.
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", "https://example.org/portfolio");
    expect(screen.getByText("Held on the provider record")).toBeInTheDocument();
  });

  it("does not fall back to the fixture documents", () => {
    render(<ProfileDocuments profile={{ documents: [] }} {...ready} />);

    expect(screen.queryByText(/CS-001/)).not.toBeInTheDocument();
    expect(screen.queryByText(/6-month review record/)).not.toBeInTheDocument();
    expect(
      screen.getByText("No documents on this enrolment"),
    ).toBeInTheDocument();
  });
});

describe("every profile tab, without an enrolment", () => {
  const tabs = [
    ["ProfileTimeline", ProfileTimeline],
    ["ProfileMilestones", ProfileMilestones],
    ["ProfileReviews", ProfileReviews],
    ["ProfileActivity", ProfileActivity],
    ["ProfileDocuments", ProfileDocuments],
  ];

  it.each(tabs)(
    "%s says the profile was never requested, not that it is empty",
    (_name, Tab) => {
      render(<Tab profile={undefined} unavailable {...ready} />);

      // "No reviews scheduled" would be an assertion about the apprentice that
      // the app cannot support when it never made the request.
      expect(
        screen.getByText("Not available for this apprentice"),
      ).toBeInTheDocument();
    },
  );

  it.each(tabs)("%s shows a loading state of its own", (_name, Tab) => {
    render(<Tab profile={undefined} isLoading isError={false} error={null} />);
    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });

  it.each(tabs)("%s shows an error state of its own", (_name, Tab) => {
    render(
      <Tab
        profile={undefined}
        isLoading={false}
        isError
        error={{ message: "Boom" }}
      />,
    );
    // One failing section must not blank the drawer, so the failure is
    // reported inside the tab the reader is looking at.
    expect(screen.getByRole("alert")).toHaveTextContent("Boom");
  });
});
