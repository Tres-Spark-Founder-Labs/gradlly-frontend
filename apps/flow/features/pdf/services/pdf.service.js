// @ts-check
"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

const PDF_PATHS = Object.freeze({
  job: (id) => `/api/v1/pdf/jobs/${id}`,
});

// PdfJobStatus
export const PDF_JOB_STATUS = Object.freeze({
  QUEUED: "queued",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
});

export const PDF_JOB_TERMINAL = new Set([
  PDF_JOB_STATUS.COMPLETED,
  PDF_JOB_STATUS.FAILED,
]);

export async function getPdfJob(id) {
  try {
    const result = await $apiClient.get(PDF_PATHS.job(id));
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
