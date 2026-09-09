import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const commitmentStatus = vi.fn();

vi.mock("@/features/commitments/queries/commitments.query", () => ({
  useEnrolmentCommitmentStatus: (...args) => commitmentStatus(...args),
}));

const { ProfileOverview } = await import("./ProfileOverview");

/**
 * The Overview tab states nothing the API has not told it.
 *
 * ── THE FAULT THESE GUARD ───────────────────────────────────────────────────
 *
 * `normalizeApprentice` hardcoded `commitmentSigned: false`, so every
 * apprentice in the roster displayed "Awaiting signature" in amber with a
 * "Sign commitment statement" button — including ones whose statement was
 * fully signed, and ones with no statement at all.
 *
 * That is a different and worse failure from the placeholders beside it. A
 * placeholder shows nothing useful; this stated something false, and it drove
 * action: an employer chasing a signature that already existed, or trying to
 * sign a statement nobody had drafted.
 *
 * The other three cases here are quieter. A hardcoded "—", the literal string
 * "null" printed beside a real tutor's name, and a funding split asserted on
 * every apprentice regardless of how they are funded.
 */

const apprentice = (over = {}) => ({
  enrolmentId: "enr-1",
  provider: "Northern Futures Training Ltd",
  tutorName: null,
  tutorEmail: null,
  lineManager: null,
  lineManagerEmail: null,
  startDate: "06 Jan 2026",
  expectedEndDate: "06 Jan 2028",
  fundingBand: 18000,
  attendance: null,
  otjActual: null,
  otjExpected: null,
  otjHoursCompleted: null,
  otjHoursRequired: null,
  ...over,
});

const noStatement = {
  status: null,
  statementId: null,
  actionRequired: false,
  isLoading: false,
  isError: false,
};

beforeEach(() => {
  vi.clearAllMocks();
  commitmentStatus.mockReturnValue(noStatement);
});

describe("ProfileOverview — commitment status", () => {
  it("asks the board about this enrolment", () => {
    render(<ProfileOverview a={apprentice()} profile={undefined} />);
    expect(commitmentStatus).toHaveBeenCalledWith("enr-1");
  });

  it("says signed when the employer has signed", () => {
    commitmentStatus.mockReturnValue({ ...noStatement, status: "signed" });
    render(<ProfileOverview a={apprentice()} profile={undefined} />);

    expect(screen.getByText("Signed")).toBeInTheDocument();
    expect(
      screen.queryByText(/Awaiting your signature/),
    ).not.toBeInTheDocument();
    // The regression that mattered: a signed statement offering a sign button.
    expect(
      screen.queryByText("Sign commitment statement"),
    ).not.toBeInTheDocument();
  });

  it("asks for a signature when the employer is the one being waited on", () => {
    commitmentStatus.mockReturnValue({
      ...noStatement,
      status: "pending",
      actionRequired: true,
    });
    render(<ProfileOverview a={apprentice()} profile={undefined} />);

    expect(screen.getByText("Awaiting your signature")).toBeInTheDocument();
    expect(screen.getByText("Sign commitment statement")).toBeInTheDocument();
  });

  it("does not claim the employer's turn while another party has to sign first", () => {
    // Pending but not yet actionable. Signing is sequential —
    // employerCanSignNow() requires every lower signOrder to be signed, and the
    // API rejects an out-of-turn attempt. Gating on the status alone offered a
    // button the server would refuse and told the employer the ball was in
    // their court when it was not.
    commitmentStatus.mockReturnValue({
      ...noStatement,
      status: "pending",
      actionRequired: false,
    });
    render(<ProfileOverview a={apprentice()} profile={undefined} />);

    expect(screen.getByText("Waiting on other parties")).toBeInTheDocument();
    expect(
      screen.queryByText("Awaiting your signature"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Sign commitment statement"),
    ).not.toBeInTheDocument();
  });

  it("does not blame the employer for a statement nobody has sent", () => {
    commitmentStatus.mockReturnValue({ ...noStatement, status: "not_sent" });
    render(<ProfileOverview a={apprentice()} profile={undefined} />);

    expect(screen.getByText("Not yet sent for signature")).toBeInTheDocument();
    expect(
      screen.queryByText("Sign commitment statement"),
    ).not.toBeInTheDocument();
  });

  it("shows nothing at all when the board has no row", () => {
    render(<ProfileOverview a={apprentice()} profile={undefined} />);

    // "No statement exists" and "a statement exists and is unsigned" are
    // different facts, and a missing row cannot tell them apart. The old code
    // resolved that ambiguity by asserting the worse one, every time.
    expect(screen.queryByText("Commitment")).not.toBeInTheDocument();
    expect(screen.queryByText(/Awaiting/)).not.toBeInTheDocument();
    expect(screen.queryByText("Signed")).not.toBeInTheDocument();
  });
});

describe("ProfileOverview — absent values", () => {
  it("never prints the string 'null' beside a tutor's name", () => {
    render(
      <ProfileOverview
        a={apprentice({ tutorName: "Rowan Bell" })}
        profile={{ tutor: { userId: "u-2", name: "Rowan Bell" } }}
      />,
    );

    expect(screen.getByText("Rowan Bell")).toBeInTheDocument();
    // `${a.tutorName} · ${a.tutorEmail}` rendered "Rowan Bell · null", because
    // tutorEmail is hardcoded null and template literals have no null handling.
    expect(screen.queryByText(/null/)).not.toBeInTheDocument();
    expect(screen.queryByText(/·\s*$/)).not.toBeInTheDocument();
  });

  it("prefers the profile aggregate's tutor over the roster row", () => {
    render(
      <ProfileOverview
        a={apprentice({ tutorName: "Stale Name" })}
        profile={{ tutor: { userId: "u-2", name: "Rowan Bell" } }}
      />,
    );
    expect(screen.getByText("Rowan Bell")).toBeInTheDocument();
  });

  it("names a missing tutor rather than showing a dash", () => {
    render(<ProfileOverview a={apprentice()} profile={{ tutor: null }} />);

    // This rendered `a.providerContact.name`, a hardcoded "—" that reads as a
    // value rather than as a gap.
    expect(screen.getByText("No tutor assigned")).toBeInTheDocument();
  });

  it("states the agreed price without asserting how it is funded", () => {
    render(<ProfileOverview a={apprentice()} profile={undefined} />);

    expect(screen.getByText("£18,000")).toBeInTheDocument();
    // Nothing in the enrolment response describes the levy split.
    expect(screen.queryByText(/100% levy/)).not.toBeInTheDocument();
  });

  it("treats a missing price as missing, not as a £0 band", () => {
    render(
      <ProfileOverview
        a={apprentice({ fundingBand: 0 })}
        profile={undefined}
      />,
    );

    expect(screen.getByText("No agreed price recorded")).toBeInTheDocument();
    expect(screen.queryByText("£0")).not.toBeInTheDocument();
  });

  it("never warns about attendance nobody measured", () => {
    render(<ProfileOverview a={apprentice()} profile={undefined} />);

    // `const attWarn = a.attendance < 85` — null < 85 coerces to 0 < 85 and is
    // true, so this badge rendered for every apprentice in the roster, always.
    // The null was incidental; the badge was the fault.
    expect(screen.queryByText(/Below 85% threshold/)).not.toBeInTheDocument();
    expect(
      screen.getByText("Attendance is not recorded for this apprentice."),
    ).toBeInTheDocument();
  });

  it("still warns when attendance is real and below the threshold", () => {
    render(
      <ProfileOverview
        a={apprentice({ attendance: 72 })}
        profile={undefined}
      />,
    );

    // The guard must not have removed the warning for the case it was for.
    expect(screen.getByText("72%")).toBeInTheDocument();
    expect(screen.getByText("Below 85% threshold")).toBeInTheDocument();
  });

  it("does not warn when attendance is real and above the threshold", () => {
    render(
      <ProfileOverview
        a={apprentice({ attendance: 94 })}
        profile={undefined}
      />,
    );

    expect(screen.getByText("94%")).toBeInTheDocument();
    expect(screen.queryByText(/Below 85% threshold/)).not.toBeInTheDocument();
  });

  it("prints no 'null' figures in the OTJ block", () => {
    const { container } = render(
      <ProfileOverview a={apprentice()} profile={undefined} />,
    );

    // "{a.otjActual}%", "{a.otjExpected}%" and "{a.otjHoursCompleted} hrs
    // completed of {a.otjHoursRequired} hrs required" all printed the literal
    // string "null" on screen.
    expect(container.textContent).not.toMatch(/null/);
    expect(
      screen.getByText(/No off-the-job progress has been calculated/),
    ).toBeInTheDocument();
  });

  it("renders the OTJ percentage the aggregate actually carries", () => {
    render(
      <ProfileOverview
        a={apprentice({ otjBehindPercent: 12 })}
        profile={{ otj: { otjPercent: 38.4, totalCount: 9, truncated: false } }}
      />,
    );

    expect(screen.getByText("38%")).toBeInTheDocument();
    expect(screen.getByText("Actual progress")).toBeInTheDocument();
    // Real, from the enrolment rather than a second guess at "expected".
    expect(screen.getByText("12%")).toBeInTheDocument();
    expect(screen.getByText("Behind")).toBeInTheDocument();
    expect(screen.getByText("9")).toBeInTheDocument();
    expect(screen.getByText("Sessions logged")).toBeInTheDocument();
  });

  it("names the OTJ figures the API does not report", () => {
    render(
      <ProfileOverview
        a={apprentice()}
        profile={{ otj: { otjPercent: 38.4, totalCount: 9, truncated: false } }}
      />,
    );

    // "Expected by now" and the hours pair are not in the aggregate. Named
    // rather than replaced with an invented figure.
    expect(
      screen.getByText(/Target percentage and logged hours are not reported/),
    ).toBeInTheDocument();
    expect(screen.queryByText("Expected by now")).not.toBeInTheDocument();
  });

  it("quotes no weekly pace", () => {
    render(
      <ProfileOverview
        a={apprentice({ otjActual: 30, otjExpected: 50 })}
        profile={undefined}
      />,
    );

    // "Current pace: 8 hrs/week · Required pace: 12 hrs/week" was shown to
    // every apprentice who was behind. No endpoint reports a weekly pace.
    expect(screen.queryByText(/hrs\/week/)).not.toBeInTheDocument();
  });
});
