"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

const TERMINAL = new Set(["completed", "failed", "cancelled"]);

/**
 * Polling budget.
 *
 * The API throttles at 100 requests per minute per client. A flat 2s poll is
 * 30 of those on its own, and two exports plus ordinary page traffic tipped it
 * into `429 ThrottlerException` — at which point the poll fails, the job never
 * reads as complete, and the button sits on "Preparing…" while the PDF waits
 * ready on the server.
 *
 * Backing off keeps a quick first answer (most jobs finish in seconds) while
 * costing far less on the long tail: ~10 requests in the first minute rather
 * than 30.
 */
const INITIAL_INTERVAL_MS = 1500;
const MAX_INTERVAL_MS = 10_000;
const BACKOFF_FACTOR = 1.6;

/**
 * And a hard stop. Previously a job that never reached a terminal state — a
 * stopped worker, a lost message — polled forever at a fixed interval,
 * consuming the throttle budget indefinitely and never telling the user
 * anything. Giving up and saying so is the honest outcome.
 */
const MAX_POLL_MS = 3 * 60_000;

export async function getPdfJob(jobId) {
  try {
    const result = await $apiClient.get(`/api/v1/pdf/jobs/${jobId}`);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/**
 * Poll GET /api/v1/pdf/jobs/:id until the job reaches a terminal state, then
 * invoke onComplete once.
 *
 * onComplete receives `null` if the job never settles within MAX_POLL_MS, so
 * callers can treat "gave up" the same as "failed" — both mean there is no
 * document to open.
 */
export function usePdfJobPoll({
  jobId,
  enabled = true,
  intervalMs = INITIAL_INTERVAL_MS,
  onComplete,
}) {
  const completedRef = useRef(false);
  const startedAtRef = useRef(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Re-arm for the next job. Without this the ref latches true after the
  // first export and every later one hangs on "Preparing…" forever, because
  // onComplete never runs to clear the caller's job id.
  useEffect(() => {
    completedRef.current = false;
    startedAtRef.current = jobId ? Date.now() : null;
  }, [jobId]);

  const query = useQuery({
    queryKey: ["pdf-job", jobId],
    queryFn: () => getPdfJob(jobId),
    enabled: enabled && !!jobId,
    // A 429 means we are polling too hard; retrying immediately makes it
    // worse. Let the interval handle the next attempt.
    retry: false,
    refetchInterval: (q) => {
      const status = q.state.data?.status;
      if (status && TERMINAL.has(status)) return false;

      const startedAt = startedAtRef.current;
      if (startedAt && Date.now() - startedAt > MAX_POLL_MS) return false;

      // dataUpdateCount grows with each completed fetch, so it doubles as the
      // attempt counter without needing state of our own.
      const attempts = q.state.dataUpdateCount + q.state.errorUpdateCount;
      return Math.min(
        Math.round(intervalMs * BACKOFF_FACTOR ** attempts),
        MAX_INTERVAL_MS,
      );
    },
  });

  useEffect(() => {
    if (completedRef.current) return;

    const status = query.data?.status;
    if (status && TERMINAL.has(status)) {
      completedRef.current = true;
      onCompleteRef.current?.(query.data);
    }
  }, [query.data]);

  // Separate effect for the give-up path: there is no new data to react to,
  // so it has to be driven by the clock rather than by the query result.
  useEffect(() => {
    if (!jobId || !enabled) return undefined;

    const timer = setTimeout(() => {
      if (completedRef.current) return;
      completedRef.current = true;
      onCompleteRef.current?.(null);
    }, MAX_POLL_MS);

    return () => clearTimeout(timer);
  }, [jobId, enabled]);

  return {
    status: query.data?.status ?? null,
    error: query.error,
    poll: query.refetch,
    isPolling: query.isFetching,
  };
}
