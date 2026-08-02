"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

const TERMINAL = new Set(["completed", "failed", "cancelled"]);

export async function getPdfJob(jobId) {
  try {
    const result = await $apiClient.get(`/api/v1/pdf/jobs/${jobId}`);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/**
 * Poll GET /api/v1/pdf/jobs/:id until status is terminal, then invoke onComplete once.
 */
export function usePdfJobPoll({
  jobId,
  enabled = true,
  intervalMs = 2000,
  onComplete,
}) {
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Re-arm for the next job. Without this the ref latches true after the
  // first export and every later one hangs on "Preparing…" forever, because
  // onComplete never runs to clear the caller's job id.
  useEffect(() => {
    completedRef.current = false;
  }, [jobId]);

  const query = useQuery({
    queryKey: ["pdf-job", jobId],
    queryFn: () => getPdfJob(jobId),
    enabled: enabled && !!jobId,
    refetchInterval: (q) => {
      const status = q.state.data?.status;
      if (status && TERMINAL.has(status)) return false;
      return intervalMs;
    },
  });

  useEffect(() => {
    const status = query.data?.status;
    if (!status || !TERMINAL.has(status) || completedRef.current) return;
    completedRef.current = true;
    onCompleteRef.current?.(query.data);
  }, [query.data]);

  return {
    status: query.data?.status ?? null,
    error: query.error,
    poll: query.refetch,
    isPolling: query.isFetching,
  };
}
