"use client";

import { Mail } from "lucide-react";

import { cn } from "@/utils/helper";

import {
  useNotificationPreferences,
  useUpdateNotificationPreferences,
} from "../queries/notifications.query";

const EMAIL = "email";

/**
 * F3.4.3 AC3 — per-type email preferences, on or off.
 *
 * Everything shown comes from GET /notifications/preferences: the types,
 * their labels, and which of them can be switched. The API marks a pair
 * `configurable` only when switching it changes what is sent — email, for a
 * type the platform actually emails — so a type that is never emailed has no
 * switch here, rather than a switch that does nothing.
 *
 * The preference is the person's, not the organisation's: it follows them
 * into every organisation they belong to, and the copy says so.
 *
 * Switching is optimistic: the switch moves at once, the API decides, and a
 * refused change moves it back with the reason. The check that honours it
 * runs when an email would be sent, not when this page is read.
 */
export function NotificationPreferences() {
  const { data, isLoading, isError, error, refetch } =
    useNotificationPreferences();
  const update = useUpdateNotificationPreferences();

  const types = Array.isArray(data?.types) ? data.types : [];
  const rows = types
    .map((entry) => ({
      type: entry?.type,
      label: entry?.label,
      email: (Array.isArray(entry?.channels) ? entry.channels : []).find(
        (channel) => channel?.channel === EMAIL,
      ),
    }))
    .filter(
      (row) =>
        typeof row.type === "string" &&
        typeof row.label === "string" &&
        row.email?.configurable === true,
    );

  const pendingType =
    update.isPending && Array.isArray(update.variables)
      ? update.variables[0]?.type
      : undefined;

  return (
    <section
      aria-labelledby="notification-preferences-heading"
      className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
    >
      <header className="border-b border-neutral-100 px-5 py-4">
        <h2
          id="notification-preferences-heading"
          className="flex items-center gap-2 text-sm font-semibold text-neutral-900"
        >
          <Mail className="size-4 text-neutral-400" aria-hidden />
          Email notifications
        </h2>
        <p className="mt-1 text-xs text-neutral-500">
          Choose which notifications also reach you by email. Everything still
          appears here in the notification centre. These settings are yours, so
          they apply in every organisation you belong to.
        </p>
      </header>

      {isLoading ? (
        <p className="px-5 py-4 text-sm text-neutral-500">
          Loading your preferences…
        </p>
      ) : isError ? (
        <div className="space-y-2 px-5 py-4">
          <p className="text-sm text-danger-600" role="alert">
            {error?.message ?? "Your preferences could not be loaded."}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-xs font-medium text-primary-700 hover:underline"
          >
            Try again
          </button>
        </div>
      ) : rows.length === 0 ? (
        <p className="px-5 py-4 text-sm text-neutral-500">
          There are no email notifications to choose from.
        </p>
      ) : (
        <ul className="divide-y divide-neutral-100">
          {rows.map((row) => {
            const on = row.email.enabled === true;
            const busy = pendingType === row.type;
            return (
              <li
                key={row.type}
                className="flex items-center justify-between gap-4 px-5 py-3"
              >
                <span
                  id={`notification-pref-${row.type}`}
                  className="text-sm text-neutral-800"
                >
                  {row.label}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={on}
                  aria-labelledby={`notification-pref-${row.type}`}
                  disabled={busy}
                  onClick={() =>
                    update.mutate([
                      { channel: EMAIL, type: row.type, enabled: !on },
                    ])
                  }
                  className={cn(
                    "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-150",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
                    "disabled:cursor-wait disabled:opacity-60",
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
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
