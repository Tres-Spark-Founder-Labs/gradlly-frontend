"use client";

import { Paperclip, X } from "lucide-react";

import { STORAGE_CATEGORY } from "@/features/storage/services/storage.service";

import { FileUploadButton } from "./FileUploadButton";

/** Storage keys are full paths; only the filename is meaningful to a reader. */
function fileName(key) {
  const parts = String(key).split("/");
  return parts[parts.length - 1] || key;
}

/**
 * F2.1.2 AC6 — "supporting evidence documents", plural.
 *
 * The backing column is `evidenceAttachmentKeys jsonb` (an array) and always
 * was; the earlier upload control replaced the array on every upload, so a
 * second document silently discarded the first. Uploading appends here, and
 * each attachment can be removed individually.
 */
export function EvidenceAttachments({
  keys = [],
  onChange,
  disabled = false,
  label = "Upload evidence",
}) {
  const add = (key) => {
    // Re-uploading the same file should not list it twice.
    if (keys.includes(key)) return;
    onChange([...keys, key]);
  };
  const remove = (key) => onChange(keys.filter((k) => k !== key));

  return (
    <div className="space-y-2">
      <FileUploadButton
        category={STORAGE_CATEGORY.ATTACHMENT}
        label={label}
        disabled={disabled}
        onUploaded={add}
      />

      {keys.length > 0 ? (
        <ul className="space-y-1">
          {keys.map((key) => (
            <li
              key={key}
              className="flex items-center gap-2 rounded-lg bg-neutral-50 px-2.5 py-1.5"
            >
              <Paperclip className="size-3.5 shrink-0 text-neutral-400" />
              <span
                className="min-w-0 flex-1 truncate text-xs text-neutral-600"
                title={key}
              >
                {fileName(key)}
              </span>
              <button
                type="button"
                onClick={() => remove(key)}
                disabled={disabled}
                aria-label={`Remove ${fileName(key)}`}
                className="rounded p-0.5 text-neutral-400 transition-colors hover:bg-neutral-200 hover:text-neutral-700 disabled:opacity-50"
              >
                <X className="size-3.5" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
