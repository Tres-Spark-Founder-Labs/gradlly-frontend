import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockSummary = vi.fn();
const mockStatements = vi.fn();
const mockSign = vi.fn();
const mockSignedDocument = vi.fn();

vi.mock("@/features/reporting/queries/reporting.query", () => ({
  useLearnerSummary: () => mockSummary(),
}));

vi.mock("../queries/commitments.query", () => ({
  useCommitmentStatements: () => mockStatements(),
  useSignCommitmentStatement: () => mockSign(),
  useSignedDocumentUrl: () => mockSignedDocument(),
}));

/**
 * Stubbed so these tests exercise the signing screen rather than the canvas.
 * `SignatureCapture` has its own suite covering AC3 and the keyboard path.
 */
vi.mock("@/features/esignature/components/SignatureCapture", () => ({
  SignatureCapture: ({ onChange }) => (
    <button type="button" onClick={() => onChange("data:image/png;base64,SIG")}>
      capture signature
    </button>
  ),
}));

const { CommitmentStatementSigning } =
  await import("./CommitmentStatementSigning");

const CONTENT = {
  apprenticeCommitments: "Attend all training days.",
  employerCommitments: "Give you 6 hours a week.",
  weeklyHours: 6,
};

function statement(overrides = {}) {
  return {
    id: "stmt-1",
    status: "awaiting_signatures",
    content: CONTENT,
    signatures: [{ party: "apprentice", status: "pending" }],
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  mockSummary.mockReturnValue({
    data: { activeEnrolmentId: "enr-1" },
    isLoading: false,
  });
  mockStatements.mockReturnValue({ data: [statement()], isLoading: false });
  mockSign.mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
    isError: false,
  });
  mockSignedDocument.mockReturnValue({ data: null, isLoading: false });
});

describe("F3.4.1 — commitment statement signing", () => {
  it("AC1: shows the summary before the full document", () => {
    const { container } = render(<CommitmentStatementSigning />);

    expect(
      screen.getByText(/your commitment statement, in short/i),
    ).toBeTruthy();
    expect(screen.getByText(/what you are agreeing to/i)).toBeTruthy();
    // The summary is on screen; the full document is not rendered until the
    // AC2 toggle is opened. Asserted on the region rather than on wording,
    // because the summary quotes the same fields the full document lists.
    expect(container.querySelector("#full-statement")).toBeNull();
  });

  it("AC2: a View full statement toggle reveals the full document", () => {
    const { container } = render(<CommitmentStatementSigning />);

    const toggle = screen.getByRole("button", { name: /view full statement/i });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(container.querySelector("#full-statement")).toBeNull();

    fireEvent.click(toggle);

    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    const full = container.querySelector("#full-statement");
    expect(full).not.toBeNull();
    // The full document lists every field under its own humanised key, which
    // is what distinguishes it from the curated summary above.
    expect(full.textContent).toMatch(/Apprentice commitments/i);
    expect(full.textContent).toMatch(/Weekly hours/i);
  });

  it("AC4: the sign control is disabled until the confirmation box is ticked", () => {
    render(<CommitmentStatementSigning />);

    const signButton = screen.getByRole("button", { name: /sign statement/i });
    expect(signButton.disabled).toBe(true);
    expect(screen.getByText(/tick the confirmation box/i)).toBeTruthy();
  });

  it("AC4: ticking the box alone is not enough — a signature is still required", () => {
    render(<CommitmentStatementSigning />);

    fireEvent.click(
      screen.getByLabelText(/i confirm i have read and understood/i),
    );

    expect(
      screen.getByRole("button", { name: /sign statement/i }).disabled,
    ).toBe(true);
    expect(screen.getByText(/add your signature/i)).toBeTruthy();
  });

  it("AC4: enabled only once the box is ticked and a signature captured", () => {
    const mutate = vi.fn();
    mockSign.mockReturnValue({ mutate, isPending: false, isError: false });

    render(<CommitmentStatementSigning />);
    fireEvent.click(
      screen.getByLabelText(/i confirm i have read and understood/i),
    );
    fireEvent.click(screen.getByRole("button", { name: /capture signature/i }));

    const signButton = screen.getByRole("button", { name: /sign statement/i });
    expect(signButton.disabled).toBe(false);

    fireEvent.click(signButton);
    expect(mutate).toHaveBeenCalledWith({
      signatureDataUrl: "data:image/png;base64,SIG",
    });
  });

  it("AC5: offers the signed PDF once every party has signed", () => {
    mockStatements.mockReturnValue({
      data: [
        statement({
          status: "signed",
          signatures: [{ party: "apprentice", status: "signed" }],
        }),
      ],
      isLoading: false,
    });
    mockSignedDocument.mockReturnValue({
      data: { url: "https://example.test/signed.pdf" },
      isLoading: false,
    });

    render(<CommitmentStatementSigning />);

    const link = screen.getByRole("link", { name: /download pdf/i });
    expect(link.getAttribute("href")).toBe("https://example.test/signed.pdf");
  });

  it("AC5: does not offer a download before the statement is fully signed", () => {
    render(<CommitmentStatementSigning />);
    expect(screen.queryByRole("link", { name: /download pdf/i })).toBeNull();
  });

  it("does not offer to sign twice", () => {
    mockStatements.mockReturnValue({
      data: [
        statement({ signatures: [{ party: "apprentice", status: "signed" }] }),
      ],
      isLoading: false,
    });

    render(<CommitmentStatementSigning />);

    expect(
      screen.queryByRole("button", { name: /sign statement/i }),
    ).toBeNull();
    expect(screen.getByText(/you signed this/i)).toBeTruthy();
  });

  it("says so plainly when there is no statement yet", () => {
    mockStatements.mockReturnValue({ data: [], isLoading: false });

    render(<CommitmentStatementSigning />);

    expect(screen.getByText(/no commitment statement yet/i)).toBeTruthy();
  });

  it("warns rather than inviting a signature on an empty statement", () => {
    mockStatements.mockReturnValue({
      data: [statement({ content: {} })],
      isLoading: false,
    });

    render(<CommitmentStatementSigning />);

    expect(screen.getByText(/do not sign until it does/i)).toBeTruthy();
  });
});
