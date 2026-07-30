"use client";

import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";

import {
  STORAGE_CATEGORY,
  uploadFile,
  uploadFileForKey,
} from "@/features/storage/services/storage.service";
import { toastError } from "@/hooks/useToast";
import { ERROR_CODES } from "@/lib/errors";

/**
 * useUploadFile
 *
 * Wraps the presign → S3 PUT flow as a mutation. Returns the durable public URL
 * on success; callers decide what to do with it (e.g. PATCH the user or org).
 *
 * The cross-origin S3 PUT uses `fetch`, which cannot report upload progress, so
 * the avatar shows an indeterminate spinner rather than a percentage.
 *
 * @param {{ category?: string, onUploaded?: (url: string) => void,
 *           silent?: boolean }} [options]
 *   - silent: suppress the default error toast (caller surfaces errors itself).
 */
export function useUploadFile({
  category = STORAGE_CATEGORY.GENERAL,
  onUploaded,
  silent = false,
} = {}) {
  const mutation = useMutation({
    mutationFn: ({ file, signal }) => uploadFile({ file, category, signal }),
    onSuccess: (url) => onUploaded?.(url),
    onError: (error) => {
      // Validation errors (bad type/size) are always worth showing; other
      // errors respect the `silent` flag so callers can chain their own UX.
      if (!silent || error.code === ERROR_CODES.VALIDATION) {
        toastError(error.message);
      }
    },
  });

  const upload = useCallback(
    (file, opts) => mutation.mutateAsync({ file, ...opts }),
    [mutation],
  );

  return {
    upload,
    isUploading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}

/**
 * Same presign → S3 PUT flow as {@link useUploadFile}, but resolves the
 * org-scoped storage *key* rather than a public URL — for APIs that expect a
 * key (e-signature records, KSB evidence, message attachments).
 *
 * @param {{ category?: string, learnerId?: string, onUploaded?: (key: string) => void,
 *           silent?: boolean }} [options]
 */
export function useUploadFileForKey({
  category = STORAGE_CATEGORY.GENERAL,
  learnerId,
  onUploaded,
  silent = false,
} = {}) {
  const mutation = useMutation({
    mutationFn: ({ file, signal }) =>
      uploadFileForKey({ file, category, learnerId, signal }),
    onSuccess: (key) => onUploaded?.(key),
    onError: (error) => {
      if (!silent || error.code === ERROR_CODES.VALIDATION) {
        toastError(error.message);
      }
    },
  });

  const upload = useCallback(
    (file, opts) => mutation.mutateAsync({ file, ...opts }),
    [mutation],
  );

  return {
    upload,
    isUploading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}
