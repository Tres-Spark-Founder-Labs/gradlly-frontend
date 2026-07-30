import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockUseRecipientDirectory = vi.fn();

vi.mock("@/features/levy/queries/levy.query", () => ({
  useRecipientDirectory: (params) => mockUseRecipientDirectory(params),
}));

const { SmeDirectory } = await import("./SmeDirectory");

const sme = (overrides = {}) => ({
  id: "p-1",
  organisationId: "org-sme",
  sector: "Manufacturing",
  region: "West Midlands",
  employeeCountBand: "10-49",
  programmeType: "standards",
  transferAmountRequired: "15000.00",
  hasDasAccount: true,
  isListed: true,
  ...overrides,
});

const given = ({
  recipients = [],
  total,
  isLoading = false,
  isError = false,
}) =>
  mockUseRecipientDirectory.mockReturnValue({
    data: {
      recipients,
      meta: { total: total ?? recipients.length },
    },
    isLoading,
    isError,
  });

beforeEach(() => {
  vi.clearAllMocks();
});

describe("SmeDirectory — F1.1.4 AC2 (search or browse)", () => {
  it("lists recipients with the details a donor needs to choose", () => {
    given({ recipients: [sme()] });
    render(<SmeDirectory />);

    expect(screen.getByText("Manufacturing")).toBeVisible();
    expect(screen.getByText(/West Midlands/)).toBeVisible();
    expect(screen.getByText("standards")).toBeVisible();
    // Amount required is money, so 2dp per the shared formatter.
    expect(screen.getByText("£15,000.00")).toBeVisible();
  });

  it("browses with no filters applied", () => {
    given({ recipients: [sme(), sme({ id: "p-2" })] });
    render(<SmeDirectory />);
    // No filter params sent when every field is blank.
    expect(mockUseRecipientDirectory).toHaveBeenCalledWith({});
    expect(screen.getByText(/2 SMEs available/)).toBeVisible();
  });

  it("sends only the filters that were filled in", () => {
    // Empty strings must be omitted, not sent as `sector=`, which would match
    // nothing rather than being ignored.
    given({ recipients: [] });
    render(<SmeDirectory />);

    fireEvent.change(screen.getByLabelText(/sector/i), {
      target: { value: "Manufacturing" },
    });

    expect(mockUseRecipientDirectory).toHaveBeenLastCalledWith({
      sector: "Manufacturing",
    });
  });

  it("supports all three filter dimensions from the requirement", () => {
    given({ recipients: [] });
    render(<SmeDirectory />);

    fireEvent.change(screen.getByLabelText(/sector/i), {
      target: { value: "Manufacturing" },
    });
    fireEvent.change(screen.getByLabelText(/region/i), {
      target: { value: "West Midlands" },
    });
    fireEvent.change(screen.getByLabelText(/programme type/i), {
      target: { value: "standards" },
    });

    expect(mockUseRecipientDirectory).toHaveBeenLastCalledWith({
      sector: "Manufacturing",
      region: "West Midlands",
      programmeType: "standards",
    });
  });

  it("ignores whitespace-only input", () => {
    given({ recipients: [] });
    render(<SmeDirectory />);
    fireEvent.change(screen.getByLabelText(/sector/i), {
      target: { value: "   " },
    });
    expect(mockUseRecipientDirectory).toHaveBeenLastCalledWith({});
  });

  it("clears filters back to a full browse", () => {
    given({ recipients: [] });
    render(<SmeDirectory />);

    fireEvent.change(screen.getByLabelText(/sector/i), {
      target: { value: "Manufacturing" },
    });
    fireEvent.click(screen.getByRole("button", { name: /clear filters/i }));

    expect(mockUseRecipientDirectory).toHaveBeenLastCalledWith({});
  });
});

describe("SmeDirectory — states", () => {
  it("distinguishes 'no matches' from 'nobody listed yet'", () => {
    // These need different copy: one means widen your search, the other means
    // no SME has opted in at all.
    given({ recipients: [] });
    const { unmount } = render(<SmeDirectory />);
    expect(screen.getByText(/No listed SMEs yet/i)).toBeVisible();
    unmount();

    given({ recipients: [] });
    render(<SmeDirectory />);
    fireEvent.change(screen.getByLabelText(/sector/i), {
      target: { value: "Aerospace" },
    });
    expect(screen.getByText(/No SMEs match those filters/i)).toBeVisible();
  });

  it("shows a loading state", () => {
    given({ recipients: [], isLoading: true });
    render(<SmeDirectory />);
    expect(screen.getByText(/searching/i)).toBeVisible();
  });

  it("surfaces failure rather than an empty directory", () => {
    // An error must not look like "no SMEs available" — that would read as a
    // fact about the market rather than a broken request.
    given({ recipients: [], isError: true });
    render(<SmeDirectory />);
    expect(screen.getByText(/could not be loaded/i)).toBeVisible();
    expect(screen.queryByText(/No listed SMEs yet/i)).toBeNull();
  });

  it("flags SMEs that already hold a DAS account", () => {
    given({ recipients: [sme({ hasDasAccount: true })] });
    render(<SmeDirectory />);
    expect(screen.getByText(/DAS ready/i)).toBeVisible();
  });

  it("omits the DAS badge when the SME has no account", () => {
    given({ recipients: [sme({ hasDasAccount: false })] });
    render(<SmeDirectory />);
    expect(screen.queryByText(/DAS ready/i)).toBeNull();
  });
});
