"use client";

import { MessageCircle } from "lucide-react";

import { useLearnerSummary } from "@/features/reporting/queries/reporting.query";
import { cn } from "@/utils/helper";

import { MESSAGE_THREAD_PARTY_LABELS } from "../constants";
import { useMessageThreads } from "../queries/messaging.query";

export function MessageThreadList({ activeThreadId, onSelectThread }) {
  const { data: summary } = useLearnerSummary();
  const enrolmentId = summary?.activeEnrolmentId ?? null;
  const { data: threads = [], isLoading } = useMessageThreads(
    { enrolmentId },
    { enabled: !!enrolmentId },
  );

  if (!enrolmentId) {
    return (
      <p className="p-4 text-sm text-neutral-400">
        You need an active programme to message your tutor or line manager.
      </p>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-2 p-4">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="h-16 animate-pulse rounded-xl bg-neutral-100"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="divide-y divide-neutral-100">
      {threads.map((thread) => {
        const isActive = thread.id === activeThreadId;
        return (
          <button
            key={thread.id}
            type="button"
            onClick={() => onSelectThread(thread)}
            className={cn(
              "flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors",
              isActive ? "bg-primary-50" : "hover:bg-neutral-50",
            )}
          >
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                isActive
                  ? "bg-primary-600 text-white"
                  : "bg-neutral-100 text-neutral-500",
              )}
            >
              <MessageCircle size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-neutral-800">
                {MESSAGE_THREAD_PARTY_LABELS[thread.counterpartyParty] ??
                  thread.counterpartyParty}
              </p>
              <p className="truncate text-xs text-neutral-400">
                {thread.archivedAt ? "Archived · read only" : "Active"}
              </p>
            </div>
            {thread.unreadCount > 0 && (
              <span className="shrink-0 rounded-full bg-danger-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                {thread.unreadCount > 99 ? "99+" : thread.unreadCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
