import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockUseLevyExpiryCalendar = vi.fn();

vi.mock("@/features/levy/queries/levy.query", () => ({
  useLevyExpiryCalendar: () => mockUseLevyExpiryCalendar(),
}));

// next/link renders a plain anchor here so we can assert on href.
// Navigation is suppressed because jsdom cannot navigate and logs a noisy
// "not implemented" error — but any onClick the component passes is still
// invoked, so a regression that re-attached dismissal to the link would fail.
vi.mock("next/link", () => ({
  default: ({ href, children, onClick, ...rest }) => (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </a>
  ),
}));

const { ExpiryAlert } = await import("./ExpiryAlert");

const MS_PER_DAY = 86_400_000;
const inDays = (d) => new Date(Date.now() + d * MS_PER_DAY).toISOString();

const givenTranches = (...tranches) =>
  mockUseLevyExpiryCalendar.mockReturnValue({
    data: [{ month: "2026-09", totalAmount: "0.00", tranches }],
  });

const tranche = (amount, days) => ({
  trancheId: `t-${amount}`,
  donorLinkId: "l-1",
  donorLinkLabel: null,
  amount: String(amount),
  expiresOn: inDays(days),
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ExpiryAlert — visibility (F1.1.2 AC1/AC2)", () => {
  it("renders nothing when no funds are at risk", () => {
    givenTranches(tranche("5000.00", 120));
    const { container } = render(<ExpiryAlert />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when the calendar is empty", () => {
    mockUseLevyExpiryCalendar.mockReturnValue({ data: [] });
    const { container } = render(<ExpiryAlert />);
    expect(container).toBeEmptyDOMElement();
  });

  it("AC1: warns when funds expire inside 90 days", () => {
    givenTranches(tranche("5000.00", 60));
    render(<ExpiryAlert />);
    expect(screen.getByRole("alert")).toHaveTextContent(/Warning/);
  });

  it("AC2: escalates to urgent inside 30 days", () => {
    givenTranches(tranche("5000.00", 10));
    render(<ExpiryAlert />);
    expect(screen.getByRole("alert")).toHaveTextContent(/Urgent/);
  });

  it("regression: appears at all when data is present", () => {
    // The previous implementation read a field the API never returns, fell
    // back to 91 days, and was hidden by its own `days > 90` guard — so it
    // could never render for any employer. This is that guard's test.
    givenTranches(tranche("1.00", 1));
    render(<ExpiryAlert />);
    expect(screen.queryByRole("alert")).not.toBeNull();
  });
});

describe("ExpiryAlert — content (F1.1.2 AC3)", () => {
  it("shows the exact amount at risk to the penny", () => {
    givenTranches(tranche("5000.00", 45));
    render(<ExpiryAlert />);
    expect(screen.getByRole("alert")).toHaveTextContent("£5,000.00");
  });

  it("shows an expiry date, not only a countdown", () => {
    givenTranches(tranche("5000.00", 45));
    render(<ExpiryAlert />);
    // e.g. "expires on 13 Sept 2026" — a real date, per AC3.
    // Month abbreviations vary with the ICU data Node ships ("Sep" vs "Sept"),
    // so match a run of letters rather than pinning an exact length.
    expect(screen.getByRole("alert")).toHaveTextContent(
      /expires on \d{1,2} [A-Za-z]{3,} \d{4}/,
    );
  });

  it("sums multiple at-risk tranches and discloses the count", () => {
    givenTranches(tranche("100.50", 5), tranche("200.25", 20));
    render(<ExpiryAlert />);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("£300.75");
    expect(alert).toHaveTextContent(/2 tranches/);
  });
});

describe("ExpiryAlert — call to action (F1.1.2 AC4)", () => {
  it("links to the Levy Transfer Hub in one click", () => {
    // Previously pointed at /billing, an unbuilt placeholder route.
    givenTranches(tranche("5000.00", 10));
    render(<ExpiryAlert />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/levy-transfer");
  });
});

describe("ExpiryAlert — dismissal (F1.1.2 AC5)", () => {
  it("hides once dismissed", () => {
    givenTranches(tranche("5000.00", 10));
    render(<ExpiryAlert />);
    fireEvent.click(screen.getByRole("button", { name: /dismiss/i }));
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("stays dismissed for the rest of the session", () => {
    givenTranches(tranche("5000.00", 10));
    const first = render(<ExpiryAlert />);
    fireEvent.click(screen.getByRole("button", { name: /dismiss/i }));
    first.unmount();

    render(<ExpiryAlert />);
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("returns in a fresh session", () => {
    // sessionStorage is cleared by the browser at session end; emulate that.
    givenTranches(tranche("5000.00", 10));
    const first = render(<ExpiryAlert />);
    fireEvent.click(screen.getByRole("button", { name: /dismiss/i }));
    first.unmount();

    window.sessionStorage.clear();
    render(<ExpiryAlert />);
    expect(screen.queryByRole("alert")).not.toBeNull();
  });

  it("navigating to the transfer hub does not suppress the warning", () => {
    // Clicking through to act on the alert should not also dismiss it.
    givenTranches(tranche("5000.00", 10));
    render(<ExpiryAlert />);
    fireEvent.click(screen.getByRole("link"));
    expect(window.sessionStorage.getItem("levy_expiry_alert_v1")).toBeNull();
  });
});
