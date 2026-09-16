"use client";

import { PenTool, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  STORAGE_CATEGORY,
  uploadFileForKey,
} from "@/features/storage/services/storage.service";
import { normalizeApiClientError } from "@/lib/errors";

const ACCEPTED = "image/png,image/jpeg,image/webp";

/**
 * The one signature capture in this app: choose a signature image, upload it
 * for a storage key, hand the key to the caller's sign call.
 *
 * Extracted from the commitment-statement modal so that levy transfers sign
 * through the same experience — F1.3.2 for commitments, F4.2.4 AC3 for
 * transfers — rather than a second, different flow. What differs per caller
 * is the wording and the endpoint, so those are props; the upload, the busy
 * state and the error surface are not.
 *
 * @param {object}   props
 * @param {boolean}  props.open
 * @param {Function} props.onClose
 * @param {string}   props.title
 * @param {string}   [props.description]
 * @param {import("react").ReactNode} [props.note] a line under the picker:
 *                                     signing order, who may sign
 * @param {Function} props.onSign      async (signatureImageKey) => result —
 *                                     the caller's POST /sign
 * @param {Function} [props.onSigned]  called with onSign's result
 * @param {boolean}  [props.isPending] the caller's mutation state
 * @param {object}   [props.error]     the caller's mutation error
 */
export function SignatureImageModal({
  open,
  onClose,
  title,
  description = "Upload a signature image (PNG, JPG or WEBP). It is attached to the signed PDF.",
  note,
  onSign,
  onSigned,
  isPending = false,
  error = null,
}) {
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const busy = isUploading || isPending;

  // Reset local state on close so the next open starts clean (no setState-in-
  // effect; clearing on the way out is enough since the modal is reused).
  const handleClose = () => {
    if (busy) return;
    setFile(null);
    setUploadError(null);
    if (fileRef.current) fileRef.current.value = "";
    onClose();
  };

  const handleSign = async () => {
    setUploadError(null);
    if (!file) {
      setUploadError(
        normalizeApiClientError({
          message: "Select a signature image to continue.",
          status: 400,
        }),
      );
      return;
    }

    try {
      setIsUploading(true);
      const signatureImageKey = await uploadFileForKey({
        file,
        category: STORAGE_CATEGORY.SIGNATURE,
      });
      setIsUploading(false);

      const result = await onSign(signatureImageKey);
      onSigned?.(result);
      handleClose();
    } catch (err) {
      setIsUploading(false);
      setUploadError(normalizeApiClientError(err));
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      busy={busy}
      size="md"
      icon={<PenTool className="size-4.5" strokeWidth={1.85} aria-hidden />}
      title={title}
      description={description}
      footer={
        <Button
          type="button"
          color="green"
          size="sm"
          loading={busy}
          disabled={busy || !file}
          onClick={handleSign}
          startIcon={<PenTool className="size-4" />}
        >
          {isUploading ? "Uploading…" : "Sign"}
        </Button>
      }
    >
      <div className="space-y-4">
        <ServerErrorAlert error={uploadError || error} />

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 px-4 py-8 text-center transition-colors hover:border-primary-300 hover:bg-primary-50/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <UploadCloud className="size-6 text-neutral-400" aria-hidden />
          {file ? (
            <span className="text-sm font-medium text-neutral-700">
              {file.name}
            </span>
          ) : (
            <>
              <span className="text-sm font-medium text-neutral-700">
                Click to choose a signature image
              </span>
              <span className="text-xs text-neutral-400">
                PNG, JPG or WEBP · up to 25 MB
              </span>
            </>
          )}
        </button>

        <input
          ref={fileRef}
          type="file"
          accept={ACCEPTED}
          className="sr-only"
          onChange={(e) => {
            setUploadError(null);
            setFile(e.target.files?.[0] ?? null);
          }}
        />

        {note ? (
          <p className="rounded-lg bg-neutral-50 px-3 py-2 text-xs text-neutral-500">
            {note}
          </p>
        ) : null}
      </div>
    </Modal>
  );
}
