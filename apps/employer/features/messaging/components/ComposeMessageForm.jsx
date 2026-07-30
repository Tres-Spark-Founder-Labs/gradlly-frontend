"use client";

import { Paperclip, Send, X } from "lucide-react";
import { useRef, useState } from "react";

import {
  useSendMessage,
  useUploadMessageAttachment,
} from "../queries/messaging.query";

export function ComposeMessageForm({
  threadId,
  apprenticeId,
  enrolmentId,
  disabled,
}) {
  const [body, setBody] = useState("");
  const [pendingFile, setPendingFile] = useState(null);
  const fileInputRef = useRef(null);

  const sendMessage = useSendMessage(threadId);
  const uploadAttachment = useUploadMessageAttachment();

  const busy = sendMessage.isPending || uploadAttachment.isPending;
  const canSend = !disabled && !busy && (body.trim() || pendingFile);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSend) return;

    let attachments;
    if (pendingFile) {
      const attachment = await uploadAttachment.mutateAsync({
        file: pendingFile,
        apprenticeId,
        enrolmentId,
      });
      attachments = [attachment];
    }

    await sendMessage.mutateAsync({ body: body.trim() || " ", attachments });
    setBody("");
    setPendingFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2 border-t border-neutral-100 p-3"
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => setPendingFile(e.target.files?.[0] ?? null)}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled || busy}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 disabled:opacity-40"
        aria-label="Attach a file"
      >
        <Paperclip size={16} />
      </button>

      <div className="min-w-0 flex-1">
        {pendingFile && (
          <div className="mb-1.5 flex items-center gap-1.5 rounded-lg bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600">
            <span className="truncate">{pendingFile.name}</span>
            <button
              type="button"
              onClick={() => setPendingFile(null)}
              className="shrink-0 text-neutral-400 hover:text-neutral-700"
              aria-label="Remove attachment"
            >
              <X size={12} />
            </button>
          </div>
        )}
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={disabled}
          rows={1}
          placeholder={
            disabled ? "This thread is archived" : "Write a message…"
          }
          className="w-full resize-none rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none disabled:bg-neutral-50"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!canSend}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white transition-opacity hover:opacity-90 disabled:opacity-30"
        aria-label="Send message"
      >
        <Send size={15} />
      </button>
    </form>
  );
}
