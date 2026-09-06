"use client";

import { Loader2, Send } from "lucide-react";
import { useState } from "react";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import {
  useMessages,
  useSendMessage,
} from "@/features/messaging/queries/messaging.query";
import { formatDateTime } from "@/utils/helper";

import { ProfileTabState } from "./ProfileTabState";
import { T } from "./tokens";

/**
 * The conversation about this apprentice (F2.2.4 AC5).
 *
 * ── WHAT WAS HERE BEFORE ────────────────────────────────────────────────────
 *
 * `<ProfileMessages />` took no props, seeded two invented messages from
 * "Marcus Reid" and "Sarah Rahman", and its `send()` pushed the typed text into
 * local React state and nothing else. No request was made. The message appeared
 * in the thread, looked sent, and vanished on the next render — the worst shape
 * this defect can take, because the sender has every reason to believe it
 * arrived.
 *
 * ── NO THREAD MEANS NO COMPOSER ─────────────────────────────────────────────
 *
 * Messages are posted to `POST /messaging/threads/:threadId/messages`, so
 * without a thread id there is nowhere to send. Rather than showing a composer
 * that would discard input, the tab says no conversation exists and where one
 * gets started. A disabled box the reader can still type into is the same trap
 * with extra steps.
 */

function Bubble({ message, isOwn }) {
  return (
    <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
      <div
        className="max-w-[80%] rounded-2xl px-3.5 py-2.5"
        style={{
          backgroundColor: isOwn ? T.blue : T.card,
          color: isOwn ? "#fff" : T.ink,
        }}
      >
        <p className="text-xs whitespace-pre-wrap break-words">
          {message.body}
        </p>
      </div>
      <p className="text-[10px] mt-0.5 px-1" style={{ color: T.muted }}>
        {formatDateTime(message.createdAt)}
      </p>
    </div>
  );
}

function Conversation({ threadId }) {
  const { user } = useAuthUser();
  const { data, isLoading, isError, error } = useMessages(threadId);
  const send = useSendMessage(threadId);
  const [text, setText] = useState("");

  const messages = data?.messages ?? [];

  const submit = (e) => {
    e?.preventDefault();
    const body = text.trim();
    if (!body || send.isPending) return;
    // Cleared only once the server has accepted it. Clearing optimistically is
    // how the old version made a discarded message look delivered.
    send.mutate({ body }, { onSuccess: () => setText("") });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex-1 space-y-3 max-h-72 overflow-y-auto py-1">
        {isLoading ? (
          <p
            className="flex items-center justify-center gap-2 text-xs py-6"
            style={{ color: T.muted }}
          >
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
            Loading messages…
          </p>
        ) : null}

        {isError ? (
          <p
            role="alert"
            className="text-xs py-6 text-center"
            style={{ color: T.red }}
          >
            {error?.message || "The messages could not be loaded."}
          </p>
        ) : null}

        {!isLoading && !isError && messages.length === 0 ? (
          <p className="text-xs text-center py-6" style={{ color: T.muted }}>
            This conversation has no messages yet.
          </p>
        ) : null}

        {messages.map((m) => (
          <Bubble key={m.id} message={m} isOwn={m.senderUserId === user?.id} />
        ))}
      </div>

      <form
        onSubmit={submit}
        className="flex items-center gap-2 pt-2"
        style={{ borderTop: `1px solid ${T.border}` }}
      >
        <input
          type="text"
          aria-label="Message"
          placeholder="Write a message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={send.isPending}
          className="flex-1 px-3 py-2 rounded-xl text-xs border focus:outline-none disabled:opacity-60"
          style={{
            backgroundColor: T.card,
            borderColor: T.border,
            color: T.ink,
          }}
        />
        <button
          type="submit"
          aria-label="Send message"
          disabled={!text.trim() || send.isPending}
          className="flex h-8 w-8 items-center justify-center rounded-xl hover:opacity-80 transition-opacity disabled:opacity-40"
          style={{ backgroundColor: T.blue, color: "#fff" }}
        >
          {send.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
          ) : (
            <Send className="h-3.5 w-3.5" aria-hidden />
          )}
        </button>
      </form>
    </div>
  );
}

export function ProfileMessages({
  profile,
  isLoading,
  isError,
  error,
  unavailable,
}) {
  const threads = Array.isArray(profile?.messageThreads)
    ? profile.messageThreads
    : [];
  const [selectedId, setSelectedId] = useState(null);

  // With one thread there is no choice to make; with several the reader picks.
  const activeId = selectedId ?? (threads.length === 1 ? threads[0].id : null);

  return (
    <ProfileTabState
      unavailable={unavailable}
      isLoading={isLoading}
      isError={isError}
      error={error}
      isEmpty={!isLoading && !isError && threads.length === 0}
      emptyTitle="No conversation about this apprentice yet"
      emptyDetail="Threads are started from the Messages section. There is nowhere to post a message here until one exists."
    >
      <div className="flex flex-col gap-3">
        {threads.length > 1 ? (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold" style={{ color: T.subtle }}>
              Conversation:
            </span>
            {threads.map((t) => {
              const isActive = t.id === activeId;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedId(t.id)}
                  aria-pressed={isActive}
                  className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: isActive ? T.blue : T.card,
                    color: isActive ? "#fff" : T.subtle,
                    border: `1px solid ${isActive ? T.blue : T.border}`,
                  }}
                >
                  {/* Null when the counterparty's user record was removed. The
                      thread still exists and is still readable, so it is named
                      as unknown rather than hidden. */}
                  {t.counterpartyName ?? "Unknown participant"}
                  {t.unreadCount > 0 ? ` · ${t.unreadCount} unread` : ""}
                </button>
              );
            })}
          </div>
        ) : null}

        {threads.length === 1 ? (
          <p className="text-xs" style={{ color: T.subtle }}>
            With{" "}
            <span style={{ color: T.ink, fontWeight: 600 }}>
              {threads[0].counterpartyName ?? "Unknown participant"}
            </span>
            {threads[0].unreadCount > 0
              ? ` · ${threads[0].unreadCount} unread`
              : ""}
          </p>
        ) : null}

        {activeId ? (
          <Conversation threadId={activeId} />
        ) : (
          <p className="text-xs text-center py-6" style={{ color: T.muted }}>
            Choose a conversation to read it.
          </p>
        )}
      </div>
    </ProfileTabState>
  );
}
