"use client";

import { Download } from "lucide-react";
import { useEffect, useMemo } from "react";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { cn, formatDateTime } from "@/utils/helper";

import { ComposeMessageForm } from "./ComposeMessageForm";
import {
  useMarkThreadRead,
  useMessages,
  useMessageThreads,
} from "../queries/messaging.query";

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

/**
 * Inline tutor⇄apprentice conversation for one enrolment, embedded in the
 * learner profile. Providers are only ever the "tutor" party — the
 * employer_manager thread (also auto-provisioned server-side) belongs to the
 * employer portal, not shown here.
 */
export function LearnerMessageThread({ enrolmentId }) {
  const { user } = useAuthUser();
  const { data: threads = [], isLoading: threadsLoading } = useMessageThreads(
    { enrolmentId },
    { enabled: !!enrolmentId },
  );
  const thread = useMemo(
    () => threads.find((t) => t.counterpartyParty === "tutor") ?? null,
    [threads],
  );

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

  if (threadsLoading) {
    return <p className="text-sm text-neutral-400">Loading conversation…</p>;
  }

  if (!thread) {
    return (
      <p className="text-sm text-neutral-400">
        No conversation yet — participant links (tutor/apprentice) may not be
        set on this enrolment yet.
      </p>
    );
  }

  return (
    <div
      className="flex flex-col rounded-xl border border-neutral-100"
      style={{ height: 420 }}
    >
      {thread.archivedAt && (
        <p className="border-b border-neutral-100 bg-neutral-50 px-3 py-2 text-xs text-neutral-500">
          This programme has completed — this thread is read-only.
        </p>
      )}
      <div className="flex-1 space-y-2.5 overflow-y-auto p-3.5">
        {isLoading && (
          <p className="text-sm text-neutral-400">Loading messages…</p>
        )}
        {!isLoading && messages.length === 0 && (
          <p className="text-sm text-neutral-400">No messages yet.</p>
        )}
        {[...messages].reverse().map((m) => (
          <Bubble key={m.id} message={m} isOwn={m.senderUserId === user?.id} />
        ))}
      </div>
      <ComposeMessageForm
        threadId={thread.id}
        apprenticeId={thread.apprenticeId}
        enrolmentId={enrolmentId}
        disabled={!!thread.archivedAt}
      />
    </div>
  );
}
