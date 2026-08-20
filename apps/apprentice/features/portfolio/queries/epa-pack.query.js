"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { createEpaPackJob, getEpaPackJob } from "../services/epa-pack.service";

export const EPA_PACK_KEYS = {
  job: (id) => ["portfolio", "epa-pack-job", id],
};

/** Terminal states — polling stops here. */
const TERMINAL = new Set(["completed", "failed"]);

/**
 * Polls a queued pack build until it finishes.
 *
 * Two seconds is a deliberate compromise: F3.3.4 AC3 allows up to 60 seconds,
 * so a slower interval would add most of a poll period to the apparent wait on
 * a fast build, and a faster one would spend most of its requests on a job that
 * has not moved.
 */
const POLL_MS = 2000;

export function useEpaPackJob(jobId) {
  return useQuery({
    queryKey: EPA_PACK_KEYS.job(jobId),
    queryFn: () => getEpaPackJob(jobId),
    enabled: Boolean(jobId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status && TERMINAL.has(status) ? false : POLL_MS;
    },
  });
}

/**
 * F3.3.4 — "with a single tap".
 *
 * One hook owns the whole export: queue the build, hold the job id, and expose
 * the polled job. The screen therefore has one action rather than a wizard.
 */
export function useEpaPackExport(enrolmentId) {
  const [jobId, setJobId] = useState(null);
  const qc = useQueryClient();

  const start = useMutation({
    mutationFn: () => createEpaPackJob(enrolmentId),
    onSuccess: (job) => {
      const id = job?.jobId ?? job?.id ?? null;
      setJobId(id);
      if (id) qc.invalidateQueries({ queryKey: EPA_PACK_KEYS.job(id) });
    },
  });

  const job = useEpaPackJob(jobId);
  const status = job.data?.status ?? (start.isPending ? "queued" : null);

  return {
    start,
    job,
    jobId,
    status,
    isBuilding:
      start.isPending ||
      (Boolean(jobId) && !TERMINAL.has(job.data?.status ?? "")),
    downloadUrl: job.data?.downloadUrl ?? null,
    manifest: job.data?.manifest ?? null,
    errorMessage: job.data?.errorMessage ?? start.error?.message ?? null,
  };
}
