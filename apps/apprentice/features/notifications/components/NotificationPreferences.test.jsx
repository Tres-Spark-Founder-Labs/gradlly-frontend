import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * F3.4.3 AC3 — per-type email preferences, on or off.
 *
 * The real query hooks run against a real QueryClient; only the API calls
 * are doubles. That way the optimistic switch and its rollback are tested as
 * a person sees them — the switch moves, and moves back if the API refuses —
 * not as a mock's call log.
 */
const getPreferences = vi.fn();
const updatePreferences = vi.fn();
const toastError = vi.fn();

vi.mock("../services/notifications.service", () => ({
  getNotificationPreferences: () => getPreferences(),
  updateNotificationPreferences: (preferences) =>
    updatePreferences(preferences),
  listNotifications: vi.fn(),
  markAllNotificationsRead: vi.fn(),
  markNotificationRead: vi.fn(),
}));
vi.mock("@/features/auth/hooks/useAuthUser", () => ({
  useAuthUser: () => ({ user: { id: "user-1" }, orgId: "org-1" }),
}));
vi.mock("@/hooks/useToast", () => ({
  toastError: (message) => toastError(message),
  toastSuccess: vi.fn(),
}));

const { NotificationPreferences } = await import("./NotificationPreferences");

/** The API's shape: every channel of every type, each marked configurable. */
const channels = (emailOn, emailConfigurable) => [
  { channel: "in_app", enabled: true, configurable: false },
  { channel: "email", enabled: emailOn, configurable: emailConfigurable },
  { channel: "digest", enabled: true, configurable: false },
];
const MATRIX = {
  types: [
    {
      type: "review",
      label: "Review reminders",
      channels: channels(true, true),
    },
    { type: "message", label: "New messages", channels: channels(false, true) },
    {
      type: "milestone_completed",
      label: "Milestones completed",
      channels: channels(true, false),
    },
  ],
};

function renderSection() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <NotificationPreferences />
    </QueryClientProvider>,
  );
}

const reviewSwitch = () =>
  screen.getByRole("switch", { name: "Review reminders" });

beforeEach(() => {
  vi.clearAllMocks();
  getPreferences.mockResolvedValue(structuredClone(MATRIX));
});

describe("NotificationPreferences — F3.4.3 AC3", () => {
  it("offers a switch for each type the API says can be switched, labelled by the API", async () => {
    renderSection();

    expect(await screen.findByText("Review reminders")).toBeVisible();
    expect(reviewSwitch()).toHaveAttribute("aria-checked", "true");
    expect(
      screen.getByRole("switch", { name: "New messages" }),
    ).toHaveAttribute("aria-checked", "false");
    // Declared but never emailed: a switch here would do nothing.
    expect(screen.queryByText("Milestones completed")).toBeNull();
  });

  it("sends the one change — email, for that type — when a switch is flipped", async () => {
    updatePreferences.mockResolvedValue(structuredClone(MATRIX));
    renderSection();
    await screen.findByText("Review reminders");

    fireEvent.click(reviewSwitch());

    await waitFor(() =>
      expect(updatePreferences).toHaveBeenCalledWith([
        { channel: "email", type: "review", enabled: false },
      ]),
    );
  });

  it("moves the switch at once, and moves it back with the reason when the API refuses", async () => {
    let refuse;
    updatePreferences.mockImplementation(
      () =>
        new Promise((_resolve, reject) => {
          refuse = () => reject(new Error("Could not save that just now"));
        }),
    );
    renderSection();
    await screen.findByText("Review reminders");

    fireEvent.click(reviewSwitch());

    // Optimistic: flipped before the API has answered.
    await waitFor(() =>
      expect(reviewSwitch()).toHaveAttribute("aria-checked", "false"),
    );

    refuse();

    // Rolled back to what the API last said, with the reason.
    await waitFor(() =>
      expect(reviewSwitch()).toHaveAttribute("aria-checked", "true"),
    );
    expect(toastError).toHaveBeenCalledWith("Could not save that just now");
  });

  it("keeps what the API answered after a successful change", async () => {
    const saved = structuredClone(MATRIX);
    saved.types[0].channels[1].enabled = false;
    updatePreferences.mockResolvedValue(saved);
    renderSection();
    await screen.findByText("Review reminders");

    fireEvent.click(reviewSwitch());

    await waitFor(() =>
      expect(reviewSwitch()).toHaveAttribute("aria-checked", "false"),
    );
    expect(toastError).not.toHaveBeenCalled();
  });

  it("says so, rather than showing nothing, when the preferences cannot load", async () => {
    getPreferences.mockRejectedValue(new Error("Service unavailable"));
    renderSection();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Service unavailable",
    );
  });
});
