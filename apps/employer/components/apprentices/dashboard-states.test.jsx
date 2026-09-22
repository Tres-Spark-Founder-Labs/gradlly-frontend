import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render as rtlRender, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * F1.2.1 — what the roster screen says when it does not have the roster.
 *
 * The dashboard used to check only `isLoading`, so a failed request fell
 * through to the full screen with an empty list: "0 active apprentices" and
 * an empty table. That is a statement about the employer's apprentices, and
 * it was false. A failure is shown as a failure.
 */
const roster = vi.fn();

vi.mock("@/features/apprentices/queries/apprentices.query", () => ({
  useApprenticeRoster: () => roster(),
  useExportRosterPdf: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));
vi.mock("@/hooks/usePdfJobPoll", () => ({ usePdfJobPoll: () => ({}) }));

const { ApprenticesDashboard } = await import("./ApprenticesDashboard");

const state = (over = {}) => ({
  roster: [],
  isLoading: false,
  isError: false,
  error: null,
  refetch: vi.fn(),
  isRefetching: false,
  ...over,
});

/** The screen's other children read their own queries; give them a client. */
const render = (ui) =>
  rtlRender(
    <QueryClientProvider
      client={
        new QueryClient({
          defaultOptions: { queries: { retry: false, enabled: false } },
        })
      }
    >
      {ui}
    </QueryClientProvider>,
  );

beforeEach(() => roster.mockReset());

describe("ApprenticesDashboard — failed and pending reads", () => {
  it("shows the failure, and no stat cards or table, when the roster request fails", () => {
    const refetch = vi.fn();
    roster.mockReturnValue(
      state({
        isError: true,
        error: new Error("Service unavailable"),
        refetch,
      }),
    );

    render(<ApprenticesDashboard />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Your apprentices could not be loaded.",
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Service unavailable");
    expect(screen.queryByText("Active apprentices")).not.toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("shows loading, not an empty roster, while the read is pending", () => {
    roster.mockReturnValue(state({ isLoading: true }));

    render(<ApprenticesDashboard />);

    expect(screen.getByText("Loading apprentices…")).toBeInTheDocument();
    expect(screen.queryByText("Active apprentices")).not.toBeInTheDocument();
  });

  it("renders the roster, with a missing pace level badged as unknown", () => {
    roster.mockReturnValue(
      state({
        roster: [
          {
            id: "a-1",
            name: "Priya Sharma",
            initials: "PS",
            avatarColor: "#3b5fe0",
            standard: "Software Developer (ST0116)",
            provider: "Midlands Technical College",
            status: "unknown",
            epaDate: "—",
            epaDaysLeft: null,
            otjActual: null,
            attendance: null,
            lastActivity: null,
          },
        ],
      }),
    );

    render(<ApprenticesDashboard />);

    expect(screen.getByText("Priya Sharma")).toBeInTheDocument();
    expect(screen.getByText("Pace unknown")).toBeInTheDocument();
    expect(screen.getByText("1 with pace unknown")).toBeInTheDocument();
  });
});
