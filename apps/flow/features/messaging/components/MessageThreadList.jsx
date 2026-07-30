"use client";

import { Eye, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { cn } from "@/utils/helper";

import { MESSAGE_THREAD_PARTY_LABELS } from "../constants";
import { useMessageThreads } from "../queries/messaging.query";

/**
 * FlowPortal orgs manage multiple funded apprentices, so — like the employer
 * app — this is a flat list of every thread the user can see, not a fixed
 * two-party list. `useMessageThreads({})` (no enrolmentId/apprenticeId
 * filter) already scopes results server-side to threads this user
 * participates in (or every org thread for owner/admin — see
 * messaging-access.service.ts's isAdmin bypass).
 *
 * FlowPortal has no apprentice-name lookup anywhere yet (its own
 * CommitmentStatementsTable shows the raw enrolmentId for the same reason),
 * so this list follows that same established convention rather than
 * inventing a new roster feature — the "View apprentice" link reuses the
 * existing `/learners/[enrolmentId]` route for identification.
 */
export function MessageThreadList({ activeThreadId, onSelectThread }) {
  const { data: threads = [], isLoading } = useMessageThreads({});

  // Most recently created conversation first.
  const ordered = useMemo(() => [...threads].reverse(), [threads]);

  if (isLoading) {
    return (
      <div className="space-y-2 p-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-16 animate-pulse rounded-xl bg-neutral-100"
          />
        ))}
      </div>
    );
  }

  if (ordered.length === 0) {
    return (
      <p className="p-4 text-sm text-neutral-400">
        No conversations yet. Threads appear here once an apprentice opens their
        messages.
      </p>
    );
  }

  return (
    <div className="divide-y divide-neutral-100">
      {ordered.map((thread) => {
        const isActive = thread.id === activeThreadId;
        const partyLabel =
          MESSAGE_THREAD_PARTY_LABELS[thread.counterpartyParty] ??
          thread.counterpartyParty;

        return (
          <div
            key={thread.id}
            className={cn(
              "flex w-full items-center gap-3 px-4 py-3.5 transition-colors",
              isActive ? "bg-primary-50" : "hover:bg-neutral-50",
            )}
          >
            <button
              type="button"
              onClick={() => onSelectThread(thread)}
              className="flex min-w-0 flex-1 items-center gap-3 text-left"
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
                  {partyLabel}
                </p>
                <p className="truncate font-mono text-xs text-neutral-400">
                  {thread.enrolmentId}
                </p>
              </div>
              {thread.unreadCount > 0 && (
                <span className="shrink-0 rounded-full bg-danger-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                  {thread.unreadCount > 99 ? "99+" : thread.unreadCount}
                </span>
              )}
            </button>
            <Link
              href={`/learners/${thread.enrolmentId}`}
              title="View apprentice"
              className="shrink-0 rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
            >
              <Eye className="size-3.5" aria-hidden />
            </Link>
          </div>
        );
      })}
    </div>
  );
}
