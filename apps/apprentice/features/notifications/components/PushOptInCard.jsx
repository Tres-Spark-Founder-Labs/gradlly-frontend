"use client";

import { BellRing } from "lucide-react";

import Button from "@/components/ui/Button";

import { usePushNotifications } from "../hooks/usePushNotifications";

/**
 * F3.4.3 AC4 — the moment to ask.
 *
 * Shown by the quick-log sheet after a session has just been logged, and
 * nowhere on page load. A person who has just done the thing the nudge is
 * for understands what "a reminder if you go a week without logging" means;
 * a permission prompt on first paint is a question with no context, and most
 * people answer it "no" for good.
 *
 * The browser prompt is behind the button. "Not now" is remembered for this
 * browser, so the card is not shown again; the switch in Settings stays. The
 * hook decides whether the card may appear at all: it is nothing when push is
 * unsupported here, blocked in the browser, already on, or already declined.
 */
export function PushOptInCard() {
  const { canOffer, busy, subscribe, dismissOptIn } = usePushNotifications();
  if (!canOffer) return null;

  return (
    <div className="mt-4 rounded-xl border border-primary-100 bg-primary-50 px-4 py-3 text-left">
      <div className="flex items-start gap-2.5">
        <BellRing
          className="mt-0.5 size-4 shrink-0 text-primary-700"
          aria-hidden
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-neutral-900">
            Want a nudge if a week goes by?
          </p>
          <p className="mt-0.5 text-xs text-neutral-600">
            We can send this device a reminder when you have not logged any
            off-the-job hours for seven days. You can switch it off any time in
            Settings.
          </p>
          <div className="mt-2.5 flex gap-2">
            <Button
              type="button"
              color="green"
              size="sm"
              loading={busy}
              onClick={() => void subscribe()}
            >
              Turn on reminders
            </Button>
            <Button
              type="button"
              variant="outline"
              color="black"
              size="sm"
              disabled={busy}
              onClick={dismissOptIn}
            >
              Not now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
