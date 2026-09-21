import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * F3.4.3 AC4 — the rules the push opt-in keeps.
 *
 * The browser's Push API is a double here; the hook and the two components
 * are real. What is asserted is what the brief constrains: no permission
 * request on mount, a "no" that is not asked again, and a prompt only from
 * the person's own click.
 */
const getPushPublicKey = vi.fn();
const createPushSubscription = vi.fn();
const deletePushSubscription = vi.fn();

vi.mock("../services/notifications.service", () => ({
  getPushPublicKey: () => getPushPublicKey(),
  createPushSubscription: (subscription) =>
    createPushSubscription(subscription),
  deletePushSubscription: (endpoint) => deletePushSubscription(endpoint),
}));
vi.mock("@/hooks/useToast", () => ({
  toastError: vi.fn(),
  toastSuccess: vi.fn(),
}));

const { PushOptInCard } = await import("./PushOptInCard");
const { PushNotificationsToggle } = await import("./PushNotificationsToggle");
const { PUSH_OPT_IN_DISMISSED_KEY } =
  await import("../hooks/usePushNotifications");

const SUBSCRIPTION_JSON = {
  endpoint: "https://push.example.test/abc",
  keys: { p256dh: "p", auth: "a" },
};

let requestPermission;
let pushManager;

/** A browser that supports push, has not been asked, and holds no subscription. */
function installBrowser({ permission = "default", subscription = null } = {}) {
  requestPermission = vi.fn().mockResolvedValue("granted");
  window.Notification = { permission, requestPermission };
  window.PushManager = class PushManager {};
  pushManager = {
    getSubscription: vi.fn().mockResolvedValue(subscription),
    subscribe: vi.fn().mockResolvedValue({
      endpoint: SUBSCRIPTION_JSON.endpoint,
      toJSON: () => SUBSCRIPTION_JSON,
      unsubscribe: vi.fn().mockResolvedValue(true),
    }),
  };
  const registration = { pushManager };
  Object.defineProperty(navigator, "serviceWorker", {
    configurable: true,
    value: {
      getRegistration: vi.fn().mockResolvedValue(registration),
      register: vi.fn().mockResolvedValue(registration),
      ready: Promise.resolve(registration),
    },
  });
}

beforeEach(() => {
  window.localStorage.clear();
  getPushPublicKey.mockResolvedValue({ publicKey: "BPublicKey" });
  createPushSubscription.mockResolvedValue({ id: "sub-1" });
  deletePushSubscription.mockResolvedValue({ removed: true });
  installBrowser();
});

afterEach(() => {
  vi.clearAllMocks();
  delete window.Notification;
  delete window.PushManager;
  delete navigator.serviceWorker;
});

describe("PushOptInCard", () => {
  it("offers reminders without asking the browser for permission", async () => {
    render(<PushOptInCard />);

    expect(
      await screen.findByRole("button", { name: /turn on reminders/i }),
    ).toBeInTheDocument();
    expect(requestPermission).not.toHaveBeenCalled();
    expect(pushManager.subscribe).not.toHaveBeenCalled();
    expect(getPushPublicKey).not.toHaveBeenCalled();
  });

  it("asks only from the click, then subscribes and registers with the API", async () => {
    render(<PushOptInCard />);
    fireEvent.click(
      await screen.findByRole("button", { name: /turn on reminders/i }),
    );

    await waitFor(() =>
      expect(createPushSubscription).toHaveBeenCalledWith(SUBSCRIPTION_JSON),
    );
    expect(getPushPublicKey).toHaveBeenCalledTimes(1);
    expect(requestPermission).toHaveBeenCalledTimes(1);
    expect(pushManager.subscribe).toHaveBeenCalledWith(
      expect.objectContaining({ userVisibleOnly: true }),
    );
    // Opted in: the card has nothing left to offer.
    await waitFor(() =>
      expect(
        screen.queryByRole("button", { name: /turn on reminders/i }),
      ).not.toBeInTheDocument(),
    );
  });

  it("remembers 'not now' and does not show the card again", async () => {
    const first = render(<PushOptInCard />);
    fireEvent.click(await screen.findByRole("button", { name: /not now/i }));

    expect(
      screen.queryByRole("button", { name: /turn on reminders/i }),
    ).not.toBeInTheDocument();
    expect(window.localStorage.getItem(PUSH_OPT_IN_DISMISSED_KEY)).toBe("1");
    first.unmount();

    // A later visit, same browser: nothing offered, nothing asked.
    render(<PushOptInCard />);
    await act(async () => {});
    expect(
      screen.queryByRole("button", { name: /turn on reminders/i }),
    ).not.toBeInTheDocument();
    expect(requestPermission).not.toHaveBeenCalled();
  });

  it("treats a declined browser prompt as final", async () => {
    requestPermission.mockResolvedValue("denied");
    const first = render(<PushOptInCard />);
    fireEvent.click(
      await screen.findByRole("button", { name: /turn on reminders/i }),
    );

    await waitFor(() =>
      expect(
        screen.queryByRole("button", { name: /turn on reminders/i }),
      ).not.toBeInTheDocument(),
    );
    expect(pushManager.subscribe).not.toHaveBeenCalled();
    expect(createPushSubscription).not.toHaveBeenCalled();
    first.unmount();

    // The browser now reports the decision; the app never re-prompts.
    installBrowser({ permission: "denied" });
    render(<PushOptInCard />);
    await act(async () => {});
    expect(
      screen.queryByRole("button", { name: /turn on reminders/i }),
    ).not.toBeInTheDocument();
    expect(requestPermission).not.toHaveBeenCalled();
  });

  it("renders nothing when the browser has no Push API", async () => {
    delete window.PushManager;
    const { container } = render(<PushOptInCard />);
    await act(async () => {});
    expect(container).toBeEmptyDOMElement();
    expect(requestPermission).not.toHaveBeenCalled();
  });
});

describe("PushNotificationsToggle", () => {
  it("shows the device as opted in and switches it off through the API first", async () => {
    const unsubscribe = vi.fn().mockResolvedValue(true);
    installBrowser({
      subscription: { endpoint: SUBSCRIPTION_JSON.endpoint, unsubscribe },
    });
    render(<PushNotificationsToggle />);

    const toggle = await screen.findByRole("switch");
    await waitFor(() => expect(toggle).toHaveAttribute("aria-checked", "true"));
    fireEvent.click(toggle);

    await waitFor(() =>
      expect(deletePushSubscription).toHaveBeenCalledWith(
        SUBSCRIPTION_JSON.endpoint,
      ),
    );
    expect(unsubscribe).toHaveBeenCalledTimes(1);
    await waitFor(() =>
      expect(toggle).toHaveAttribute("aria-checked", "false"),
    );
    expect(requestPermission).not.toHaveBeenCalled();
  });

  it("explains a browser-level block instead of retrying it", async () => {
    installBrowser({ permission: "denied" });
    render(<PushNotificationsToggle />);

    await screen.findByText(/blocked for this site/i);
    expect(screen.getByRole("switch")).toBeDisabled();
    fireEvent.click(screen.getByRole("switch"));
    expect(requestPermission).not.toHaveBeenCalled();
  });

  it("says push is not set up when the API serves no public key", async () => {
    getPushPublicKey.mockResolvedValue({ publicKey: null });
    render(<PushNotificationsToggle />);

    const toggle = await screen.findByRole("switch");
    await waitFor(() => expect(toggle).toBeEnabled());
    fireEvent.click(toggle);

    await screen.findByText(/not set up on this server/i);
    expect(requestPermission).not.toHaveBeenCalled();
    expect(toggle).toBeDisabled();
  });
});
