"use client";

import { BellOff, CheckCheck } from "lucide-react";
import { useState } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { cn } from "@/utils/helper";

import { NotificationItem } from "./NotificationItem";
import { NotificationPreferences } from "./NotificationPreferences";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from "../queries/notifications.query";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
];

function NotificationSkeleton() {
  return (
    <div className="divide-y divide-neutral-100">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 px-5 py-4">
          <div className="size-9 shrink-0 animate-pulse rounded-lg bg-neutral-100" />
          <div className="flex-1 space-y-2 py-0.5">
            <div className="h-3.5 w-1/3 animate-pulse rounded bg-neutral-100" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-neutral-100" />
            <div className="h-2.5 w-20 animate-pulse rounded bg-neutral-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * NotificationsPanel
 *
 * Lists the user's notifications with an All/Unread filter, "mark all as read"
 * action, pagination and per-item mark-as-read, then the user's per-type email
 * preferences (F3.4.3: the centre, "with the ability to manage notification
 * preferences"). Used in the Settings → Notifications tab across all portals.
 */
export function NotificationsPanel() {
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const unreadOnly = filter === "unread";
  const { data, isLoading, isFetching } = useNotifications({
    page,
    perPage,
    unreadOnly,
  });

  const notifications = data?.notifications ?? [];
  const meta = data?.meta ?? null;

  const { mutate: markRead, variables: readingId } = useMarkNotificationRead();
  const { mutate: markAllRead, isPending: isMarkingAll } =
    useMarkAllNotificationsRead();

  const hasUnread = notifications.some((n) => !n.readAt);

  const changeFilter = (next) => {
    if (next === filter) return;
    setFilter(next);
    setPage(1);
  };

  const handlePerPageChange = (next) => {
    setPerPage(next);
    setPage(1);
  };

  return (
    <div className="space-y-4">
      {/* ── Header: filter + mark all read ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="tablist"
          aria-label="Notification filter"
          className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-neutral-50 p-1"
        >
          {FILTERS.map((f) => (
            <button
              key={f.value}
              role="tab"
              type="button"
              aria-selected={filter === f.value}
              onClick={() => changeFilter(f.value)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors duration-150",
                filter === f.value
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-800",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => markAllRead()}
          disabled={isMarkingAll || (!hasUnread && filter === "all")}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium",
            "text-primary-700 transition-colors duration-150 hover:bg-primary-50",
            "disabled:pointer-events-none disabled:opacity-40",
          )}
        >
          <CheckCheck className="size-3.5" aria-hidden />
          Mark all as read
        </button>
      </div>

      {/* ── List ── */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        {isLoading ? (
          <NotificationSkeleton />
        ) : notifications.length === 0 ? (
          <EmptyState
            icon={BellOff}
            title={
              unreadOnly ? "No unread notifications" : "You're all caught up"
            }
            description={
              unreadOnly
                ? "You have read everything. New alerts will appear here."
                : "You have no notifications right now. New alerts will appear here."
            }
          />
        ) : (
          <div
            className={cn(
              "divide-y divide-neutral-100",
              isFetching && !isLoading && "opacity-70 transition-opacity",
            )}
          >
            {notifications.map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                onMarkRead={markRead}
                isUpdating={readingId === n.id}
              />
            ))}
          </div>
        )}
      </div>

      {!isLoading && meta ? (
        <Pagination
          meta={meta}
          onPageChange={setPage}
          onPerPageChange={handlePerPageChange}
        />
      ) : null}

      <NotificationPreferences />
    </div>
  );
}
