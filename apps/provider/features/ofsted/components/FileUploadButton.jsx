"use client";

import { Check, Loader2, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";

import {
  STORAGE_CATEGORY,
  uploadFileForKey,
} from "@/features/storage/services/storage.service";
import { toastError } from "@/hooks/useToast";
import { normalizeApiClientError } from "@/lib/errors";
import { cn } from "@/utils/helper";

/**
 * Uploads a file to storage and returns its S3 key via onUploaded. Generic over
 * category (defaults to attachment). Self-contained — shows its own spinner and
 * the chosen filename once uploaded.
 *
 * @param {(key: string) => void} onUploaded
 * @param {string}  [category]  STORAGE_CATEGORY value
 * @param {string}  [accept]    input accept attribute
 * @param {string}  [label]
 * @param {boolean} [uploaded]  reflects an already-set key (shows the tick)
 */
export function FileUploadButton({
  onUploaded,
  category = STORAGE_CATEGORY.ATTACHMENT,
  accept = "application/pdf,image/*",
  label = "Upload file",
  uploaded = false,
  disabled = false,
  className,
}) {
  const fileRef = useRef(null);
  const [name, setName] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    setName(file.name);
    try {
      setIsUploading(true);
      const key = await uploadFileForKey({ file, category });
      onUploaded?.(key);
    } catch (err) {
      toastError(normalizeApiClientError(err).message);
      setName(null);
    } finally {
      setIsUploading(false);
    }
  };

  const done = uploaded || (!!name && !isUploading);

  return (
    <>
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={disabled || isUploading}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50",
          done && "border-emerald-200 text-emerald-700",
          className,
        )}
      >
        {isUploading ? (
          <Loader2 className="size-3.5 animate-spin" aria-hidden />
        ) : done ? (
          <Check className="size-3.5" aria-hidden />
        ) : (
          <UploadCloud className="size-3.5" aria-hidden />
        )}
        {isUploading ? "Uploading…" : done ? name || "Uploaded" : label}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept={accept}
        aria-label={label}
        tabIndex={-1}
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </>
  );
}
