"use client";

import { useCallback, useEffect, useState } from "react";

import { toastError } from "@/hooks/useToast";

import {
  createPushSubscription,
  deletePushSubscription,
  getPushPublicKey,
} from "../services/notifications.service";

/**
 * Remembers that this person said "not now" to the opt-in, so they are not
 * asked again. Per browser, which is the right scope: a permission is a
 * browser's, and a laptop's answer says nothing about a phone's.
 */
export const PUSH_OPT_IN_DISMISSED_KEY = "gradlly_push_opt_in_dismissed";

const SERVICE_WORKER_URL = "/sw.js";

function readDismissed() {
  try {
    return window.localStorage.getItem(PUSH_OPT_IN_DISMISSED_KEY) === "1";
  } catch {
    return false;
  }
}

function writeDismissed() {
  try {
    window.localStorage.setItem(PUSH_OPT_IN_DISMISSED_KEY, "1");
  } catch {
    // Private mode or blocked storage: the worst case is asking once more.
  }
}

/** The Push API wants the VAPID key as bytes, not the base64url the API serves. */
function base64UrlToUint8Array(value) {
  const padded = value + "=".repeat((4 - (value.length % 4)) % 4);
  const raw = window.atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

function isSupported() {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

/**
 * What the browser already knows, and nothing more: no registration, no
 * permission request. Pure of React state so the mount effect can apply the
 * result in a promise callback rather than setting state synchronously.
 */
async function readBrowserState() {
  if (!isSupported()) return { status: "unsupported", dismissed: false };
  const dismissed = readDismissed();
  if (Notification.permission === "denied")
    return { status: "denied", dismissed };
  try {
    const registration =
      await navigator.serviceWorker.getRegistration(SERVICE_WORKER_URL);
    const subscription = await registration?.pushManager.getSubscription();
    return { status: subscription ? "subscribed" : "unsubscribed", dismissed };
  } catch {
    return { status: "unsubscribed", dismissed };
  }
}

/**
 * F3.4.3 AC4 — web push for this browser.
 *
 * ── THE RULES THIS HOOK KEEPS ───────────────────────────────────────────────
 *
 *   1. It never asks for permission on its own. `subscribe()` is the only
 *      path to `Notification.requestPermission()`, and it runs only from a
 *      click — the opt-in card after a first successful log, or the switch
 *      in settings. Nothing here runs on mount except reading what the
 *      browser already knows.
 *   2. A "no" is final until the person changes it. `denied` in the browser
 *      is never re-prompted (the browser would refuse anyway, silently), and
 *      "not now" on the opt-in card is remembered per browser
 *      (`PUSH_OPT_IN_DISMISSED_KEY`) so the card is not shown again. The
 *      switch in settings remains: changing one's mind is the person's, not
 *      the app's, to initiate.
 *   3. Nothing is subscribed against a server that cannot send: the VAPID
 *      public key is fetched first, and null means push is unavailable here.
 *
 * `status` is what the UI renders from:
 *   unsupported   this browser has no Push API
 *   unavailable   the server has no VAPID keys
 *   denied        the browser has blocked notifications for this site
 *   subscribed    this browser is opted in
 *   unsubscribed  supported and allowed (or not yet asked), not opted in
 *   loading       not known yet
 */
export function usePushNotifications() {
  const [{ status, dismissed }, setBrowserState] = useState({
    status: "loading",
    dismissed: false,
  });
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    setBrowserState(await readBrowserState());
  }, []);

  // Read-only: what the browser already knows. No permission request here.
  // State is set in the promise callback, once the answer is in — never
  // synchronously in the effect body.
  useEffect(() => {
    let cancelled = false;
    readBrowserState().then((next) => {
      if (!cancelled) setBrowserState(next);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const subscribe = useCallback(async () => {
    if (!isSupported()) return false;
    setBusy(true);
    try {
      const { publicKey } = (await getPushPublicKey()) ?? {};
      if (typeof publicKey !== "string" || publicKey === "") {
        setBrowserState((prev) => ({ ...prev, status: "unavailable" }));
        return false;
      }

      // The one place permission is asked. Always from a click.
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        writeDismissed();
        setBrowserState({
          status: permission === "denied" ? "denied" : "unsubscribed",
          dismissed: true,
        });
        return false;
      }

      const registration =
        await navigator.serviceWorker.register(SERVICE_WORKER_URL);
      await navigator.serviceWorker.ready;
      const subscription =
        (await registration.pushManager.getSubscription()) ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: base64UrlToUint8Array(publicKey),
        }));

      await createPushSubscription(subscription.toJSON());
      setBrowserState((prev) => ({ ...prev, status: "subscribed" }));
      return true;
    } catch (error) {
      toastError(error?.message ?? "Notifications could not be switched on.");
      await refresh();
      return false;
    } finally {
      setBusy(false);
    }
  }, [refresh]);

  const unsubscribe = useCallback(async () => {
    if (!isSupported()) return;
    setBusy(true);
    try {
      const registration =
        await navigator.serviceWorker.getRegistration(SERVICE_WORKER_URL);
      const subscription = await registration?.pushManager.getSubscription();
      if (subscription) {
        // The server first, so a failure there leaves the browser and the
        // server agreeing; then the browser.
        await deletePushSubscription(subscription.endpoint);
        await subscription.unsubscribe();
      }
      setBrowserState((prev) => ({ ...prev, status: "unsubscribed" }));
    } catch (error) {
      toastError(error?.message ?? "Notifications could not be switched off.");
      await refresh();
    } finally {
      setBusy(false);
    }
  }, [refresh]);

  /** "Not now" on the opt-in card: remembered, never asked again by the app. */
  const dismissOptIn = useCallback(() => {
    writeDismissed();
    setBrowserState((prev) => ({ ...prev, dismissed: true }));
  }, []);

  return {
    status,
    busy,
    /** True when the opt-in card may be shown: supported, not asked, not declined. */
    canOffer: status === "unsubscribed" && !dismissed,
    subscribe,
    unsubscribe,
    dismissOptIn,
  };
}
