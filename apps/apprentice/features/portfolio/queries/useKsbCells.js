// @ts-check
"use client";

import { useLearnerSummary } from "@/features/reporting/queries/reporting.query";

import { useKsbHeatmap } from "./portfolio.query";

/**
 * The learner's own KSB cells, from `GET /portfolio/ksb-heatmap`.
 *
 * One hook rather than three copies of "get the summary, read the enrolment id,
 * fetch the heatmap". Every consumer of KSB data goes through here, which is
 * what makes it possible to say with confidence that no screen is still reading
 * the deleted `KSB_DATA` constant.
 *
 * The enrolment id is never supplied by the caller — it comes from the learner
 * summary, per client decision D3.
 */
export function useKsbCells() {
  const summary = useLearnerSummary();
  const heatmap = useKsbHeatmap(summary.data?.activeEnrolmentId);

  return {
    cells: heatmap.data?.cells ?? [],
    isLoading: summary.isLoading || heatmap.isLoading,
    isError: summary.isError || heatmap.isError,
    error: summary.error ?? heatmap.error ?? null,
    refetch: heatmap.refetch,
  };
}
