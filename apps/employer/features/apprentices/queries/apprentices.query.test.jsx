import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * F1.2.1 AC7 — the roster reaches every apprentice, and says so honestly.
 *
 * The real services, pagination and join run; only the HTTP client and the
 * signed-in user are doubles. The data is shaped to reproduce the live fault:
 * more than 100 of each, with an at-risk apprentice's enrolment on page 2 of
 * the enrolments list. Page 1 alone put that apprentice on screen with no
 * standard, no provider and a green "On track".
 */
const get = vi.fn();
const auth = { orgId: "org-1", isLoading: false };

vi.mock("@/lib/api/client", () => ({
  $apiClient: { get: (...args) => get(...args) },
}));
vi.mock("@/features/auth/hooks/useAuthUser", () => ({
  useAuthUser: () => auth,
}));

const { useApprenticeRoster } = await import("./apprentices.query");

const TOTAL = 150;
const PER_PAGE = 100;

const apprentices = Array.from({ length: TOTAL }, (_, i) => ({
  id: `app-${i}`,
  firstName: "Learner",
  lastName: String(i).padStart(3, "0"),
}));
// Newest first, as the API orders them: app-0's enrolment is the *oldest*, so
// it lands on page 2 of the enrolments list.
const enrolments = Array.from({ length: TOTAL }, (_, k) => {
  const i = TOTAL - 1 - k;
  return {
    id: `enr-${i}`,
    apprenticeId: `app-${i}`,
    status: "active",
    standardDisplayName: "Software Developer (ST0116)",
    providerOrganisationName: "Midlands Technical College",
    otjPaceAlertLevel: i === 0 ? "at_risk" : i === 1 ? null : "on_track",
  };
});

const page = (rows, n) => ({
  data: {
    data: rows.slice((n - 1) * PER_PAGE, n * PER_PAGE),
    meta: {
      total: rows.length,
      page: n,
      perPage: PER_PAGE,
      totalPages: Math.ceil(rows.length / PER_PAGE),
    },
  },
});

function serve() {
  get.mockImplementation((url, options) => {
    if (url.startsWith("/api/v1/apprentices")) {
      const n = Number(new URL(url, "http://x").searchParams.get("page"));
      return Promise.resolve(page(apprentices, n));
    }
    if (url === "/api/v1/enrolments") {
      return Promise.resolve(page(enrolments, options.params.page));
    }
    return Promise.reject(new Error(`unexpected ${url}`));
  });
}

function renderRoster() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return renderHook(() => useApprenticeRoster(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    ),
  });
}

beforeEach(() => {
  get.mockReset();
  auth.isLoading = false;
  auth.orgId = "org-1";
});

describe("useApprenticeRoster", () => {
  it("reads every page of both lists, past the old 100-row cut", async () => {
    serve();
    const { result } = renderRoster();

    await waitFor(() => expect(result.current.roster).toHaveLength(TOTAL));
    expect(result.current.isError).toBe(false);
    // Two pages of each list, at the API's ceiling of 100 a page.
    const perPages = get.mock.calls.map(([url, options]) =>
      url.startsWith("/api/v1/apprentices")
        ? Number(new URL(url, "http://x").searchParams.get("perPage"))
        : options.params.perPage,
    );
    expect(get).toHaveBeenCalledTimes(4);
    expect(new Set(perPages)).toEqual(new Set([100]));
  });

  it("joins an apprentice to an enrolment on page 2, so an at-risk apprentice is not shown green", async () => {
    serve();
    const { result } = renderRoster();

    await waitFor(() => expect(result.current.roster).toHaveLength(TOTAL));
    const atRisk = result.current.roster.find((a) => a.id === "app-0");
    expect(atRisk.status).toBe("at_risk");
    expect(atRisk.standard).toBe("Software Developer (ST0116)");
    expect(atRisk.provider).toBe("Midlands Technical College");
  });

  it("shows a missing pace level as unknown, never as on track", async () => {
    serve();
    const { result } = renderRoster();

    await waitFor(() => expect(result.current.roster).toHaveLength(TOTAL));
    expect(result.current.roster.find((a) => a.id === "app-1").status).toBe(
      "unknown",
    );
  });

  it("reports a failed page as an error, not as a shorter roster", async () => {
    serve();
    const inner = get.getMockImplementation();
    get.mockImplementation((url, options) =>
      url === "/api/v1/enrolments" && options.params.page === 2
        ? Promise.reject(new Error("Service unavailable"))
        : inner(url, options),
    );
    const { result } = renderRoster();

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error.message).toBe("Service unavailable");
  });

  it("is loading, not empty, while /auth/me has not named the organisation", () => {
    auth.isLoading = true;
    auth.orgId = null;
    const { result } = renderRoster();

    expect(result.current.isLoading).toBe(true);
    expect(get).not.toHaveBeenCalled();
  });
});
