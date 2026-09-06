import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const useMessages = vi.fn();
const useSendMessage = vi.fn();
const mutate = vi.fn();

vi.mock("@/features/messaging/queries/messaging.query", () => ({
  useMessages: (...args) => useMessages(...args),
  useSendMessage: (...args) => useSendMessage(...args),
}));

vi.mock("@/features/auth/hooks/useAuthUser", () => ({
  useAuthUser: () => ({ user: { id: "me-1" }, orgId: "org-1" }),
}));

const { ProfileMessages } = await import("./ProfileMessages");

/**
 * The composer must send, or must not exist.
 *
 * ── THE DEFECT THIS REPLACES ────────────────────────────────────────────────
 *
 * `<ProfileMessages />` took no props, seeded two invented messages, and its
 * `send()` pushed the typed text into local React state and made no request.
 * The message appeared in the thread and looked delivered. That is the worst
 * shape this class of defect takes: a silent discard is indistinguishable from
 * a successful send, so the employer has no reason to follow up, and the tutor
 * never hears from them.
 *
 * The tests therefore assert two things a screenshot cannot: that a real
 * mutation is called with the typed body, and that no composer is rendered at
 * all when there is no thread to post to.
 */

const ready = { isLoading: false, isError: false, error: null };

const thread = (over = {}) => ({
  id: "thread-1",
  counterpartyParty: "provider",
  counterpartyUserId: "u-2",
  counterpartyName: "Rowan Bell",
  messageCount: 1,
  unreadCount: 0,
  lastMessageAt: "2026-08-01T09:00:00.000Z",
  lastMessagePreview: "Hello",
  lastMessageSenderUserId: "u-2",
  archivedAt: null,
  ...over,
});

beforeEach(() => {
  vi.clearAllMocks();
  useMessages.mockReturnValue({
    data: { messages: [], meta: null },
    isLoading: false,
    isError: false,
    error: null,
  });
  useSendMessage.mockReturnValue({ mutate, isPending: false });
});

describe("ProfileMessages", () => {
  it("renders the threads the API returned", () => {
    render(
      <ProfileMessages profile={{ messageThreads: [thread()] }} {...ready} />,
    );

    expect(screen.getByText("Rowan Bell")).toBeInTheDocument();
    // Never the seeded conversation.
    expect(screen.queryByText(/Marcus Reid/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Sarah Rahman/)).not.toBeInTheDocument();
  });

  it("renders messages fetched for the selected thread", () => {
    useMessages.mockReturnValue({
      data: {
        messages: [
          {
            id: "m-1",
            threadId: "thread-1",
            senderUserId: "u-2",
            body: "Priya missed Tuesday's session.",
            attachments: [],
            createdAt: "2026-08-01T09:00:00.000Z",
          },
        ],
        meta: null,
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    render(
      <ProfileMessages profile={{ messageThreads: [thread()] }} {...ready} />,
    );

    expect(useMessages).toHaveBeenCalledWith("thread-1");
    expect(
      screen.getByText("Priya missed Tuesday's session."),
    ).toBeInTheDocument();
  });

  it("posts the typed message rather than pushing it into local state", () => {
    render(
      <ProfileMessages profile={{ messageThreads: [thread()] }} {...ready} />,
    );

    fireEvent.change(screen.getByLabelText("Message"), {
      target: { value: "Thanks — I will speak to her today." },
    });
    fireEvent.click(screen.getByLabelText("Send message"));

    expect(useSendMessage).toHaveBeenCalledWith("thread-1");
    expect(mutate).toHaveBeenCalledTimes(1);
    expect(mutate.mock.calls[0][0]).toEqual({
      body: "Thanks — I will speak to her today.",
    });
  });

  it("keeps the text in the box until the server accepts it", () => {
    render(
      <ProfileMessages profile={{ messageThreads: [thread()] }} {...ready} />,
    );

    const input = screen.getByLabelText("Message");
    fireEvent.change(input, { target: { value: "Still unsent" } });
    fireEvent.click(screen.getByLabelText("Send message"));

    // The mutation was called but its onSuccess has not run. Clearing here is
    // exactly how the old version made a discarded message look delivered.
    expect(input).toHaveValue("Still unsent");
  });

  it("sends nothing when the box is empty", () => {
    render(
      <ProfileMessages profile={{ messageThreads: [thread()] }} {...ready} />,
    );

    fireEvent.click(screen.getByLabelText("Send message"));
    expect(mutate).not.toHaveBeenCalled();
  });

  it("shows no composer at all when there is no thread", () => {
    render(<ProfileMessages profile={{ messageThreads: [] }} {...ready} />);

    expect(
      screen.getByText("No conversation about this apprentice yet"),
    ).toBeInTheDocument();
    // A disabled box the reader can still type into is the same trap with
    // extra steps, so there is no box.
    expect(screen.queryByLabelText("Message")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Send message")).not.toBeInTheDocument();
  });

  it("names a removed counterparty rather than hiding the thread", () => {
    render(
      <ProfileMessages
        profile={{ messageThreads: [thread({ counterpartyName: null })] }}
        {...ready}
      />,
    );

    expect(screen.getByText("Unknown participant")).toBeInTheDocument();
  });

  it("reports its own error rather than blanking the drawer", () => {
    render(
      <ProfileMessages
        profile={undefined}
        isLoading={false}
        isError
        error={{ message: "Profile request failed" }}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Profile request failed",
    );
  });
});
