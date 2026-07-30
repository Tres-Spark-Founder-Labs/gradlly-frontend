"use client";

import { Download, Eye } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { cn, formatDateTime } from "@/utils/helper";

import { MESSAGE_THREAD_PARTY_LABELS } from "../constants";
import { ComposeMessageForm } from "./ComposeMessageForm";
import { useMarkThreadRead, useMessages } from "../queries/messaging.query";

function Bubble({ message, isOwn }) {
  return (
    <div className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm",
          isOwn
            ? "bg-primary-600 text-white"
            : "bg-neutral-100 text-neutral-800",
        )}
      >
        <p className="whitespace-pre-wrap break-words">{message.body}</p>
        {(message.attachments ?? []).map((a) => (
          <a
            key={a.storageKey}
            href={a.downloadUrl ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "mt-1.5 flex items-center gap-1.5 text-xs underline",
              isOwn ? "text-white/90" : "text-primary-700",
            )}
          >
            <Download size={12} /> {a.filename}
          </a>
        ))}
        <p
          className={cn(
            "mt-1 text-[10px]",
            isOwn ? "text-white/60" : "text-neutral-400",
          )}
        >
          {formatDateTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}

export function MessageThreadView({ thread }) {
  const { user } = useAuthUser();
  const { data, isLoading } = useMessages(thread?.id, {
    enabled: !!thread?.id,
  });
  const markRead = useMarkThreadRead();
  const messages = data?.messages ?? [];

  useEffect(() => {
    if (thread?.id && thread.unreadCount > 0) {
      markRead.mutate(thread.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thread?.id]);

  if (!thread) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-sm text-neutral-400">
        Select a conversation to view messages.
      </div>
    );
  }

  const partyLabel =
    MESSAGE_THREAD_PARTY_LABELS[thread.counterpartyParty] ??
    thread.counterpartyParty;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-neutral-800">{partyLabel}</p>
          {thread.archivedAt && (
            <p className="mt-0.5 text-xs text-neutral-400">
              This programme has completed — this thread is read-only.
            </p>
          )}
        </div>
        <Link
          href={`/learners/${thread.enrolmentId}`}
          className="flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        >
          <Eye className="size-3.5" aria-hidden />
          Apprentice
        </Link>
      </div>

      <div className="flex-1 space-y-2.5 overflow-y-auto p-4">
        {isLoading && (
          <p className="text-sm text-neutral-400">Loading messages…</p>
        )}
        {!isLoading && messages.length === 0 && (
          <p className="text-sm text-neutral-400">
            No messages yet — say hello.
          </p>
        )}
        {[...messages].reverse().map((m) => (
          <Bubble key={m.id} message={m} isOwn={m.senderUserId === user?.id} />
        ))}
      </div>

      <ComposeMessageForm
        threadId={thread.id}
        apprenticeId={thread.apprenticeId}
        enrolmentId={thread.enrolmentId}
        disabled={!!thread.archivedAt}
      />
    </div>
  );
}
