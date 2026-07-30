"use client";

import { Download } from "lucide-react";
import { useEffect } from "react";

import { useApprenticeRoster } from "@/features/apprentices/queries/apprentices.query";
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
  const { roster } = useApprenticeRoster();
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

  const apprentice = roster.find((a) => a.id === thread.apprenticeId);
  const partyLabel =
    MESSAGE_THREAD_PARTY_LABELS[thread.counterpartyParty] ??
    thread.counterpartyParty;

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-neutral-100 px-4 py-3">
        <p className="text-sm font-semibold text-neutral-800">
          {apprentice?.name || "Apprentice"}
        </p>
        <p className="mt-0.5 text-xs text-neutral-400">
          {thread.archivedAt
            ? `${partyLabel} · This programme has completed — read only.`
            : partyLabel}
        </p>
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
