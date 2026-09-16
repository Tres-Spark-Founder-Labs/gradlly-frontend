import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * ProfileDocuments resolves private S3 keys through a react-query mutation, so
 * without this it needs a QueryClientProvider it has no reason to know about.
 * Mocked rather than provided: what these tests care about is that the button
 * asks for a download URL for the right key, not how the request is made.
 */
const download = vi.fn();
let downloadingKey = null;

vi.mock("@/features/storage/queries/storage.query", () => ({
  useDownloadObject: () => ({ download, downloadingKey, isDownloading: false }),
}));

/**
 * Three tabs fetch for themselves: the Timeline (the journey endpoint), a
 * review's record, and the OTJ chart (the lifetime weekly endpoint). None of
 * that is in the profile aggregate. Each hook is mocked as state a test sets,
 * so a tab can be shown the exact shape the API returns.
 */
const idle = { data: null, isLoading: false, isError: false, error: null };
let journeyState = idle;
let recordState = idle;
let weeklyState = idle;

vi.mock("@/features/enrolments/queries/enrolments.query", () => ({
  useEnrolmentJourney: () => journeyState,
}));
vi.mock("@/features/reviews/queries/reviews.query", () => ({
  useReviewRecord: () => recordState,
}));
vi.mock("@/features/learners/queries/learners.query", () => ({
  useLearnerOtjWeekly: () => weeklyState,
}));

beforeEach(() => {
  vi.clearAllMocks();
  downloadingKey = null;
  journeyState = idle;
  recordState = idle;
  weeklyState = idle;
});

import { ProfileActivity } from "./ProfileActivity";
import { ProfileDocuments } from "./ProfileDocuments";
import { ProfileMilestones } from "./ProfileMilestones";
import { ProfileOtjChart } from "./ProfileOtjChart";
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

/**
 * F1.2.2 AC2, the other tab. Milestones come from the journey endpoint — the
 * same query the Timeline uses — with the API's statuses. The derived list
 * (programme dates plus reviews) is gone: two tabs in one drawer disagreeing
 * about the same programme is worse than either alone.
 */
describe("ProfileMilestones", () => {
  const journey = {
    enrolmentId: "enr-1",
    milestones: [
      {
        code: "programme_start",
        title: "Programme start",
        description: "Enrolment confirmed by the provider.",
        date: "2026-01-06",
        status: "complete",
      },
      {
        code: "review_1",
        title: "First progress review",
        description: null,
        date: "2026-04-06",
        status: "overdue",
      },
      {
        code: "epa",
        title: "End-point assessment",
        description: null,
        date: null,
        status: "upcoming",
      },
    ],
    gatewayChecklist: [],
    gatewayCompletionPercent: 0,
    gatewayReady: false,
  };

  it("renders the milestones the journey returned, with the API's statuses", () => {
    journeyState = { ...ready, data: journey };
    render(<ProfileMilestones enrolmentId="enr-1" />);

    expect(screen.getByText("Programme start")).toBeInTheDocument();
    expect(
      screen.getByText("Enrolment confirmed by the provider."),
    ).toBeInTheDocument();
    expect(screen.getByText("Complete")).toBeInTheDocument();
    // The API said overdue; no date here was read to decide it.
    expect(screen.getByText("Overdue")).toBeInTheDocument();
  });

  it("shows an undated milestone as not recorded rather than inferring a date", () => {
    journeyState = { ...ready, data: journey };
    render(<ProfileMilestones enrolmentId="enr-1" />);

    expect(screen.getByText("End-point assessment")).toBeInTheDocument();
    expect(screen.getByText("Date not recorded")).toBeInTheDocument();
  });

  it("says so when the journey returns nothing, instead of deriving a list", () => {
    journeyState = {
      ...ready,
      data: { enrolmentId: "enr-1", milestones: [], gatewayChecklist: [] },
    };
    render(<ProfileMilestones enrolmentId="enr-1" />);

    expect(
      screen.getByText("No programme milestones on the API"),
    ).toBeInTheDocument();
    // The derived version's labels never appear.
    expect(screen.queryByText("Planned end")).not.toBeInTheDocument();
    expect(screen.queryByText("Date passed")).not.toBeInTheDocument();
  });

  it("does not render the fixture ladder", () => {
    journeyState = { ...ready, data: journey };
    render(<ProfileMilestones enrolmentId="enr-1" />);

    expect(screen.queryByText(/6-month review/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Gateway/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Mock EPA/i)).not.toBeInTheDocument();
  });
});

/**
 * F1.2.2 AC2. The timeline is the journey endpoint's, statuses included.
 * Task 2.1's constructed chronology — programme dates plus reviews — is gone,
 * and when the endpoint returns nothing the tab says so rather than rebuilding
 * it: a constructed timeline that looks real is the fabrication class this
 * folder exists to keep out.
 */
describe("ProfileTimeline", () => {
  const journey = {
    enrolmentId: "enr-1",
    milestones: [
      {
        code: "programme_start",
        title: "Programme start",
        description: "Enrolment confirmed by the provider.",
        date: "2026-03-02",
        status: "complete",
      },
      {
        code: "review_1",
        title: "First progress review",
        description: null,
        date: "2026-09-01",
        status: "overdue",
      },
      {
        code: "epa",
        title: "End-point assessment",
        description: null,
        date: null,
        status: "upcoming",
      },
    ],
    gatewayChecklist: [
      {
        code: "reviews",
        title: "12-weekly reviews up to date",
        description: "Every scheduled review held.",
        status: "in_progress",
      },
    ],
    gatewayCompletionPercent: 25,
    gatewayReady: false,
  };

  it("plots the milestones the journey endpoint returned, with the API's statuses", () => {
    journeyState = { ...ready, data: journey };
    render(<ProfileTimeline enrolmentId="enr-1" />);

    expect(screen.getByText("Programme start")).toBeInTheDocument();
    expect(screen.getByText("First progress review")).toBeInTheDocument();
    // The API said overdue. Nothing here inferred it from the date.
    expect(screen.getByText("Overdue")).toBeInTheDocument();
  });

  it("lists an undated milestone separately rather than placing it", () => {
    journeyState = { ...ready, data: journey };
    render(<ProfileTimeline enrolmentId="enr-1" />);

    expect(screen.getByText("Not yet dated")).toBeInTheDocument();
    expect(screen.getByText("End-point assessment")).toBeInTheDocument();
    expect(screen.getAllByText("Date not recorded")).toHaveLength(1);
  });

  it("shows the gateway checklist with the API's own percentage", () => {
    journeyState = { ...ready, data: journey };
    render(<ProfileTimeline enrolmentId="enr-1" />);

    expect(screen.getByText("Gateway checklist")).toBeInTheDocument();
    expect(
      screen.getByText("12-weekly reviews up to date"),
    ).toBeInTheDocument();
    expect(screen.getByText("25% complete")).toBeInTheDocument();
    expect(screen.getByText("In progress")).toBeInTheDocument();
  });

  it("says so when the journey returns nothing, instead of constructing a timeline", () => {
    journeyState = {
      ...ready,
      data: { enrolmentId: "enr-1", milestones: [], gatewayChecklist: [] },
    };
    render(<ProfileTimeline enrolmentId="enr-1" />);

    expect(
      screen.getByText("No programme journey on the API"),
    ).toBeInTheDocument();
    // The constructed version's labels never appear.
    expect(screen.queryByText("Review 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Planned end")).not.toBeInTheDocument();
  });

  it("reports its own error rather than blanking", () => {
    journeyState = {
      data: null,
      isLoading: false,
      isError: true,
      error: { message: "journey unavailable" },
    };
    render(<ProfileTimeline enrolmentId="enr-1" />);

    expect(screen.getByText(/journey unavailable/)).toBeInTheDocument();
  });

  it("does not render the fixture notes", () => {
    journeyState = { ...ready, data: journey };
    render(<ProfileTimeline enrolmentId="enr-1" />);

    expect(screen.queryByText(/OTJ on pace/)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Commitment statement signed/),
    ).not.toBeInTheDocument();
  });
});

/**
 * F1.2.2 AC4. The record — outcome, agreed actions, SMART goals — was served
 * by GET /reviews/:id/record all along and the tab never asked for it.
 */
describe("ProfileReviews — the record", () => {
  const profile = {
    reviews: [
      {
        id: "rev-1",
        status: "completed",
        scheduledAt: "2026-02-11T10:00:00.000Z",
        isOverdue: false,
        tutorSigned: true,
        apprenticeSigned: true,
      },
    ],
  };

  it("opens the record on request and shows what it carries", () => {
    recordState = {
      ...ready,
      data: {
        reviewId: "rev-1",
        submittedAt: "2026-02-12T09:00:00.000Z",
        payload: {
          progressSummary: "Ahead on the portfolio, behind on maths.",
          actionsAgreed: "Book functional skills support.",
          smartGoals: [
            {
              objective: "Pass functional skills maths",
              measurable: "Mock exam score above 70%",
              achievable: "Two sessions a week",
              relevant: "Gateway requirement",
              timeBound: "By the end of June",
            },
          ],
          previousGoalProgress: [
            {
              objective: "Complete module 3",
              outcome: "partially_achieved",
              notes: "Two of three units",
            },
          ],
          wellbeing: { score: 7 },
          employerComments: "Happy with progress.",
        },
      },
    };
    render(<ProfileReviews profile={profile} {...ready} />);

    // Nothing from the record is on screen until it is asked for.
    expect(screen.queryByText("Progress summary")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("View record"));

    expect(
      screen.getByText("Ahead on the portfolio, behind on maths."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Book functional skills support."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Pass functional skills maths"),
    ).toBeInTheDocument();
    expect(screen.getByText("Partially achieved")).toBeInTheDocument();
    expect(screen.getByText("7 / 10")).toBeInTheDocument();
    expect(screen.getByText("Happy with progress.")).toBeInTheDocument();
  });

  it("says a review has no record yet on a 404, rather than inventing one", () => {
    recordState = {
      data: null,
      isLoading: false,
      isError: true,
      error: { status: 404, message: "Not found" },
    };
    render(<ProfileReviews profile={profile} {...ready} />);
    fireEvent.click(screen.getByText("View record"));

    expect(
      screen.getByText("No record has been written for this review yet."),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Progressing well/)).not.toBeInTheDocument();
  });

  it("names what is missing when the record carries nothing", () => {
    recordState = {
      ...ready,
      data: { reviewId: "rev-1", submittedAt: null, payload: {} },
    };
    render(<ProfileReviews profile={profile} {...ready} />);
    fireEvent.click(screen.getByText("View record"));

    expect(
      screen.getByText("The record carries no summary, actions or goals."),
    ).toBeInTheDocument();
  });
});

/**
 * F1.2.2 AC3. A bar per ISO week from the lifetime endpoint, approved and
 * pending as separate segments — the apprentice portal's conventions.
 */
describe("ProfileOtjChart", () => {
  const weekly = {
    enrolmentId: "enr-1",
    programmeStart: "2026-08-24",
    truncated: false,
    weeks: [
      { weekStart: "2026-08-24", approvedMinutes: 120, pendingMinutes: 0 },
      { weekStart: "2026-08-31", approvedMinutes: 0, pendingMinutes: 0 },
      { weekStart: "2026-09-07", approvedMinutes: 15, pendingMinutes: 45 },
    ],
  };

  it("draws every week the endpoint returned, approved and pending apart", () => {
    weeklyState = { ...ready, data: weekly };
    render(<ProfileOtjChart enrolmentId="enr-1" />);

    expect(screen.getByText("Weekly off-the-job hours")).toBeInTheDocument();
    // 135 approved minutes across the three weeks; pending is not in it.
    expect(screen.getByText("2.3 h approved over 3 weeks")).toBeInTheDocument();
    expect(screen.getByText("Approved")).toBeInTheDocument();
    expect(screen.getByText("Awaiting approval")).toBeInTheDocument();
    // The empty week is a bar, not a gap.
    expect(
      screen.getByText(
        "Week beginning 2026-08-31: 0 h approved, 0 h awaiting approval",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Week beginning 2026-09-07: 0.3 h approved, 0.8 h awaiting approval",
      ),
    ).toBeInTheDocument();
  });

  it("says why there is nothing to chart", () => {
    weeklyState = { ...ready, data: { ...weekly, weeks: [] } };
    render(<ProfileOtjChart enrolmentId="enr-1" />);

    expect(screen.getByText("No weeks to chart")).toBeInTheDocument();
  });

  it("says when the oldest weeks were dropped", () => {
    weeklyState = { ...ready, data: { ...weekly, truncated: true } };
    render(<ProfileOtjChart enrolmentId="enr-1" />);

    expect(screen.getByText(/oldest weeks are not shown/)).toBeInTheDocument();
  });

  it("reports its own error rather than blanking", () => {
    weeklyState = {
      data: null,
      isLoading: false,
      isError: true,
      error: { message: "weekly unavailable" },
    };
    render(<ProfileOtjChart enrolmentId="enr-1" />);

    expect(screen.getByText(/weekly unavailable/)).toBeInTheDocument();
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

  it("links the document that has a real URL directly", () => {
    render(<ProfileDocuments profile={profile} {...ready} />);

    // externalUrl rows are already openable, so they are not routed through
    // the presigner — there is no key to exchange and the call would fail.
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", "https://example.org/portfolio");
  });

  it("exchanges a storage key for a download URL", () => {
    render(<ProfileDocuments profile={profile} {...ready} />);

    // The earlier version rendered "Held on the provider record" here, on the
    // belief that no presigned-download endpoint existed. It did —
    // POST /storage/download-url — and the provider app had been using it all
    // along. F1.2.2 AC5 asks for a library, and a list you cannot open
    // anything from is a list.
    fireEvent.click(
      screen.getByLabelText("Download Commitment statement for Priya Shah"),
    );

    expect(download).toHaveBeenCalledTimes(1);
    expect(download).toHaveBeenCalledWith("s3://bucket/doc-1.pdf");
    expect(
      screen.queryByText("Held on the provider record"),
    ).not.toBeInTheDocument();
  });

  it("offers nothing to press when a row has neither key nor URL", () => {
    render(
      <ProfileDocuments
        profile={{
          documents: [
            {
              id: "doc-3",
              type: "review",
              title: "Review record with no file",
              documentAt: "2026-03-01T00:00:00.000Z",
              storageKey: null,
              externalUrl: null,
            },
          ],
        }}
        {...ready}
      />,
    );

    // Naming the gap, rather than a control that cannot work — which is the
    // fault the earlier version was avoiding, correctly, with the wrong remedy.
    expect(screen.getByText("No file attached")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
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

  /*
   * The Timeline's own state is its own request's — the journey endpoint,
   * not the profile — so its mock is put in the same state as the props the
   * other tabs read. The property under test is unchanged: each tab reports
   * the state of whatever it depends on, inside itself.
   */
  it.each(tabs)("%s shows a loading state of its own", (_name, Tab) => {
    journeyState = { ...idle, isLoading: true };
    render(<Tab profile={undefined} isLoading isError={false} error={null} />);
    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });

  it.each(tabs)("%s shows an error state of its own", (_name, Tab) => {
    journeyState = {
      data: null,
      isLoading: false,
      isError: true,
      error: { message: "Boom" },
    };
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
