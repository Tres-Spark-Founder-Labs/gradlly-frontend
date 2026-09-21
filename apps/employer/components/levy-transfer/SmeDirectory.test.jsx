import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockUseRecipientDirectory = vi.fn();
let vocabularyState;

/**
 * The API's vocabulary shape: closed fields carry permitted values, open
 * fields suggestions. The directory's region filter is built from the first,
 * its sector and programme-type suggestions from the second.
 */
const VOCABULARY = {
  closed: {
    region: ["North West", "West Midlands", "London"],
    employeeCountBand: ["1-9", "10-49", "50-249", "250+"],
  },
  open: {
    sector: ["Construction", "Engineering & Manufacturing"],
    programmeType: ["ST0415 Software Developer"],
  },
};

vi.mock("@/features/levy/queries/levy.query", () => ({
  useRecipientDirectory: (params) => mockUseRecipientDirectory(params),
  useLevyVocabulary: () => vocabularyState,
}));

const { SmeDirectory } = await import("./SmeDirectory");

const sme = (overrides = {}) => ({
  id: "p-1",
  organisationId: "org-sme",
  sector: "Engineering & Manufacturing",
  region: "West Midlands",
  employeeCountBand: "10-49",
  programmeType: "ST0415 Software Developer",
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
  vocabularyState = {
    data: VOCABULARY,
    isLoading: false,
    isError: false,
    error: null,
  };
});

describe("SmeDirectory — F1.1.4 AC2 (search or browse)", () => {
  it("lists recipients with the details a donor needs to choose", () => {
    given({ recipients: [sme()] });
    render(<SmeDirectory />);

    expect(screen.getByText("Engineering & Manufacturing")).toBeVisible();
    expect(screen.getByText(/West Midlands · 10-49/)).toBeVisible();
    expect(screen.getByText("ST0415 Software Developer")).toBeVisible();
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
      target: { value: "ST0415 Software Developer" },
    });

    expect(mockUseRecipientDirectory).toHaveBeenLastCalledWith({
      sector: "Manufacturing",
      region: "West Midlands",
      programmeType: "ST0415 Software Developer",
    });
  });

  /**
   * The directory compares exactly, as matching does, so each filter must be
   * able to hold a value a profile holds. Region is a closed set: a select
   * over the served values, never a text box a donor can type a near-miss
   * into. Sector and programme type are open: free text, with suggestions.
   */
  it("offers region as a select over the served values, with 'any' as the default", () => {
    given({ recipients: [] });
    render(<SmeDirectory />);

    const region = screen.getByLabelText(/region/i);
    expect(region.tagName).toBe("SELECT");
    expect(
      Array.from(region.querySelectorAll("option")).map((o) => o.value),
    ).toEqual(["", "North West", "West Midlands", "London"]);
  });

  it("keeps sector and programme type as free text, with the served suggestions", () => {
    given({ recipients: [] });
    const { container } = render(<SmeDirectory />);

    const sector = screen.getByLabelText(/sector/i);
    expect(sector.tagName).toBe("INPUT");
    const suggested = (input) =>
      Array.from(
        container.querySelectorAll(`#${input.getAttribute("list")} option`),
      ).map((o) => o.value);
    expect(suggested(sector)).toEqual([
      "Construction",
      "Engineering & Manufacturing",
    ]);
    expect(suggested(screen.getByLabelText(/programme type/i))).toEqual([
      "ST0415 Software Developer",
    ]);
    // The old placeholder was not a vocabulary value, and typed as shown it
    // matched nothing once the directory went exact.
    expect(sector).not.toHaveAttribute("placeholder", "e.g. Manufacturing");
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

  it("says why an open-field search can come back empty", () => {
    // Exact comparison is the honest rule, but a donor who typed "retail"
    // against an SME's "Retail" should be told it is exact, not left guessing.
    given({ recipients: [] });
    render(<SmeDirectory />);
    fireEvent.change(screen.getByLabelText(/sector/i), {
      target: { value: "retail" },
    });
    expect(screen.getByText(/match an SME.s wording exactly/i)).toBeVisible();
  });

  it("does not explain exact wording for a region, which can only be a served value", () => {
    given({ recipients: [] });
    render(<SmeDirectory />);
    fireEvent.change(screen.getByLabelText(/region/i), {
      target: { value: "London" },
    });
    expect(screen.queryByText(/match an SME.s wording exactly/i)).toBeNull();
  });

  it("still browses when the vocabulary cannot be loaded, and says region is unavailable", () => {
    // Nothing is written here, so a failed vocabulary must not take the
    // directory down with it; only the region select loses its options.
    vocabularyState = {
      data: undefined,
      isLoading: false,
      isError: true,
      error: { message: "boom" },
    };
    given({ recipients: [sme()] });
    render(<SmeDirectory />);

    expect(screen.getByText("Engineering & Manufacturing")).toBeVisible();
    expect(
      screen.getByText(/region options could not be loaded/i),
    ).toBeVisible();
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
