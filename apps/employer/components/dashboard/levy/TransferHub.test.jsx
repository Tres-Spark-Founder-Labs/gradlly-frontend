import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockUseLevyTransfers = vi.fn();

vi.mock("@/features/levy/queries/levy.query", () => ({
  useLevyTransfers: () => mockUseLevyTransfers(),
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const { TransferHub, normaliseStage } = await import("./TransferHub");

const givenTransfers = (transfers) =>
  mockUseLevyTransfers.mockReturnValue({
    data: { transfers, meta: { total: transfers.length } },
  });

const transfer = (overrides = {}) => ({
  id: "t-1",
  status: "pending_esfa",
  amount: "5000.00",
  recipientOrgName: "Acme Engineering",
  ...overrides,
});

const surplus = {
  maxTransferable: 25000,
  alreadyTransferred: 5000,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("TransferHub — regression: runtime crash", () => {
  it("renders when the transfers query is still loading", () => {
    // The crash was `transfers.map is not a function`: the dashboard passed
    // useLevyMatchApplications()'s result, which is { applications, meta } —
    // an object, not an array. Guard against any non-array shape.
    mockUseLevyTransfers.mockReturnValue({ data: undefined });
    expect(() => render(<TransferHub levy={surplus} />)).not.toThrow();
    expect(screen.getByText(/no active transfers/i)).toBeVisible();
  });

  it("renders when the query returns an object without a transfers array", () => {
    mockUseLevyTransfers.mockReturnValue({ data: { meta: {} } });
    expect(() => render(<TransferHub levy={surplus} />)).not.toThrow();
  });

  it("renders a real transfer list", () => {
    givenTransfers([transfer()]);
    render(<TransferHub levy={surplus} />);
    expect(screen.getByText("Acme Engineering")).toBeVisible();
  });
});

describe("TransferHub — F1.1.4 AC1 (50% cap comes from the server)", () => {
  it("shows the server-computed transferable balance", () => {
    // Previously computed in the browser as `monthly * 12 * 0.5` from a field
    // the API does not return, so it always rendered £0 — and would have
    // drifted from the backend's SURPLUS_CAP_RATIO even with real data.
    givenTransfers([]);
    render(<TransferHub levy={surplus} />);
    expect(screen.getByText("£25,000.00")).toBeVisible();
  });

  it("reports used and remaining against that cap", () => {
    givenTransfers([]);
    render(<TransferHub levy={surplus} />);
    expect(screen.getByText(/Used: £5,000.00/)).toBeVisible();
    expect(screen.getByText(/Remaining: £20,000.00/)).toBeVisible();
  });

  it("never shows negative remaining if transfers exceed the cap", () => {
    givenTransfers([]);
    render(
      <TransferHub
        levy={{ maxTransferable: 1000, alreadyTransferred: 4000 }}
      />,
    );
    expect(screen.getByText(/Remaining: £0.00/)).toBeVisible();
  });
});

describe("normaliseStage — F1.1.4 AC4 (pipeline stages)", () => {
  // Tested directly rather than through the DOM: PipelineLabel always renders
  // all four stage names (the active one is conveyed by colour), so asserting
  // on visible text would pass for every status and prove nothing.
  it.each([
    ["draft", "Initiated"],
    ["pending_signatures", "Initiated"],
    ["pending_esfa", "Pending ESFA"],
    ["confirmed", "Confirmed"],
    ["active", "Active"],
  ])("maps %s to %s", (status, expected) => {
    // The old map keyed on "pending", which LevyTransferStatus has never
    // contained, so every real transfer fell through to the raw status string
    // and the pipeline never advanced past the first dot.
    expect(normaliseStage(status)).toBe(expected);
  });

  it("is case-insensitive", () => {
    expect(normaliseStage("PENDING_ESFA")).toBe("Pending ESFA");
  });

  it("falls back to Initiated for unknown or missing statuses", () => {
    // Must return a stage that exists in STAGES, otherwise indexOf returns -1
    // and the pipeline renders as entirely inactive.
    expect(normaliseStage("something_new")).toBe("Initiated");
    expect(normaliseStage(undefined)).toBe("Initiated");
    expect(normaliseStage(null)).toBe("Initiated");
  });
});

describe("TransferHub — navigation", () => {
  it("sends 'New transfer' to the transfer hub, not billing", () => {
    givenTransfers([]);
    render(<TransferHub levy={surplus} />);
    const link = screen
      .getAllByRole("link")
      .find((a) => /new transfer/i.test(a.textContent));
    expect(link).toHaveAttribute("href", "/levy-transfer");
  });
});
