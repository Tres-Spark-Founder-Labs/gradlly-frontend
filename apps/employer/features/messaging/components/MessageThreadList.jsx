"use client";

import { MessageCircle } from "lucide-react";
import { useMemo } from "react";

import { useApprenticeRoster } from "@/features/apprentices/queries/apprentices.query";
import { cn } from "@/utils/helper";

import { MESSAGE_THREAD_PARTY_LABELS } from "../constants";
import { useMessageThreads } from "../queries/messaging.query";

/**
 * Unlike the apprentice/provider apps (at most one thread per counterparty
 * role), an employer manager can have a conversation open for every
 * apprentice they manage. `useMessageThreads({})` is called with no
 * enrolmentId/apprenticeId filter — the backend already scopes the result to
 * threads this user participates in (or, for owner/admin, every thread in the
 * org — see messaging-access.service.ts's isAdmin bypass), so no separate
 * enrolment-picker step is needed before threads become visible.
 */
export function MessageThreadList({ activeThreadId, onSelectThread }) {
  const { data: threads = [], isLoading } = useMessageThreads({});
  const { roster } = useApprenticeRoster();

  const nameByApprenticeId = useMemo(() => {
    const map = {};
    for (const a of roster) map[a.id] = a;
    return map;
  }, [roster]);

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
        No conversations yet. Threads appear here once an apprentice you manage
        opens their messages.
      </p>
    );
  }

  return (
    <div className="divide-y divide-neutral-100">
      {ordered.map((thread) => {
        const isActive = thread.id === activeThreadId;
        const apprentice = nameByApprenticeId[thread.apprenticeId];
        const partyLabel =
          MESSAGE_THREAD_PARTY_LABELS[thread.counterpartyParty] ??
          thread.counterpartyParty;

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
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                isActive
                  ? "bg-primary-600 text-white"
                  : "bg-neutral-100 text-neutral-500",
              )}
              style={
                !isActive && apprentice
                  ? {
                      backgroundColor: `${apprentice.avatarColor}1a`,
                      color: apprentice.avatarColor,
                    }
                  : undefined
              }
            >
              {apprentice ? apprentice.initials : <MessageCircle size={16} />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-neutral-800">
                {apprentice?.name || "Apprentice"}
              </p>
              <p className="truncate text-xs text-neutral-400">
                {thread.archivedAt ? `${partyLabel} · Archived` : partyLabel}
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
