"use client";

import { BellRing } from "lucide-react";

import { cn } from "@/utils/helper";

import { usePushNotifications } from "../hooks/usePushNotifications";

const COPY = {
  unsupported: "This browser does not support push notifications.",
  unavailable: "Push notifications are not set up on this server yet.",
  denied:
    "Notifications are blocked for this site in your browser settings. Allow them there to switch this on.",
  subscribed: "This device gets a reminder if you go a week without logging.",
  unsubscribed:
    "Get a reminder on this device if you go a week without logging off-the-job hours.",
  loading: "Checking this device…",
};

/**
 * F3.4.3 AC4 — the switch in Settings for push on this device.
 *
 * Per device, because a subscription is a browser's: turning it on here does
 * not reach a phone, and the copy says "this device" for that reason. Turning
 * it on asks the browser's permission from this click — never earlier — and a
 * browser-level "blocked" is explained rather than retried, since the browser
 * would refuse silently.
 */
export function PushNotificationsToggle() {
  const { status, busy, subscribe, unsubscribe } = usePushNotifications();
  const on = status === "subscribed";
  const switchable = status === "subscribed" || status === "unsubscribed";

  return (
    <section
      aria-labelledby="push-notifications-heading"
      className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
    >
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <div className="min-w-0">
          <h2
            id="push-notifications-heading"
            className="flex items-center gap-2 text-sm font-semibold text-neutral-900"
          >
            <BellRing className="size-4 text-neutral-400" aria-hidden />
            Push notifications on this device
          </h2>
          <p className="mt-1 text-xs text-neutral-500">{COPY[status]}</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={on}
          aria-labelledby="push-notifications-heading"
          disabled={busy || !switchable}
          onClick={() => void (on ? unsubscribe() : subscribe())}
          className={cn(
            "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-150",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            on ? "bg-primary-600" : "bg-neutral-300",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "inline-block size-4 rounded-full bg-white shadow transition-transform duration-150",
              on ? "translate-x-4" : "translate-x-0.5",
            )}
          />
        </button>
      </div>
    </section>
  );
}
