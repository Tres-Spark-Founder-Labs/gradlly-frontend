"use client";

import { Bell, CheckCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/utils/helper";

// ─── Placeholder data ─────────────────────────────────────────────────────────

const PLACEHOLDER_NOTIFICATIONS = [
  {
    id: 1,
    title: "Assignment feedback received",
    desc: "Your tutor left feedback on your Unit 3 submission.",
    time: "30m ago",
    unread: true,
  },
  {
    id: 2,
    title: "Review meeting scheduled",
    desc: "Your 12-weekly progress review is booked for Friday at 10am.",
    time: "2h ago",
    unread: true,
  },
  {
    id: 3,
    title: "New course material available",
    desc: "Unit 5: Workplace Communication has been published.",
    time: "1d ago",
    unread: false,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function HeaderNotifications() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(PLACEHOLDER_NOTIFICATIONS);
  const [pulsed, setPulsed] = useState(true);
  const ref = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const t = setTimeout(() => setPulsed(false), 2500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));

  const markRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );

  return (
    <div ref={ref} className="relative">
      {/* Bell button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications${unreadCount ? ` (${unreadCount} unread)` : ""}`}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={cn(
          "relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          "border border-neutral-200 bg-white text-neutral-500 transition-colors duration-150",
          "hover:border-green-300 hover:bg-green-50 hover:text-green-700",
          "focus-visible:outline-2 focus-visible:outline-primary-700 focus-visible:outline-offset-2",
          open && "border-green-300 bg-green-50 text-green-700",
        )}
      >
        <Bell aria-hidden className="h-4.5 w-4.5" strokeWidth={1.75} />
        {unreadCount > 0 && (
          <span
            aria-hidden
            className={cn(
              "absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger-500 ring-2 ring-white",
              pulsed && "animate-[fade-in_400ms_ease-out_forwards]",
            )}
          />
        )}
      </button>

      {/* Panel
                Mobile fix: max-w-[calc(100vw-1rem)] prevents the panel from
                overflowing the viewport on screens narrower than the panel width.
                right-0 aligns the panel's right edge with the button's right edge.
            */}
      {open && (
        <div
          role="dialog"
          aria-label="Notifications"
          className={cn(
            "absolute right-0 top-full z-50 mt-2",
            "w-80 max-w-[calc(100vw-1rem)]",
            "overflow-hidden rounded-xl border border-neutral-200 bg-white",
            "shadow-[0_8px_32px_rgba(0,0,0,0.08)]",
            "animate-[slide-up_150ms_cubic-bezier(0.16,1,0.3,1)_forwards]",
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-neutral-900">
                Notifications
              </h2>
              {unreadCount > 0 && (
                <span className="rounded-full bg-danger-500 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-white">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={markAllRead}
              aria-label="Mark all as read"
              className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 focus-visible:outline-2 focus-visible:outline-primary-700 focus-visible:outline-offset-2"
            >
              <CheckCheck aria-hidden className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* List */}
          <div className="max-h-72 divide-y divide-neutral-50 overflow-y-auto">
            {notifications.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => markRead(n.id)}
                className={cn(
                  "flex w-full gap-3 px-4 py-3.5 text-left transition-colors duration-100 hover:bg-neutral-50",
                  "focus-visible:outline-2 focus-visible:outline-primary-700 focus-visible:-outline-offset-2",
                  n.unread && "bg-primary-50/40",
                )}
              >
                <div className="mt-2 shrink-0">
                  <span
                    aria-hidden
                    className={cn(
                      "block h-1.5 w-1.5 rounded-full",
                      n.unread ? "bg-primary-500" : "bg-transparent",
                    )}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-neutral-900">
                    {n.title}
                  </p>
                  <p className="mt-0.5 text-xs leading-snug text-neutral-500">
                    {n.desc}
                  </p>
                  <p className="mt-1.5 text-[11px] tabular-nums text-neutral-400">
                    {n.time}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t border-neutral-100 bg-neutral-50/50 px-4 py-2.5">
            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="block w-full text-center text-xs font-semibold text-primary-700 transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-primary-700 focus-visible:outline-offset-2"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
