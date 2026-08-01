"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { toastError, toastSuccess } from "@/hooks/useToast";

import { REPORTING_QUERY_KEYS } from "./keys";
import {
  downloadProviderComparisonCsv,
  exportLevyRoiPdf,
  exportProviderComparisonPdf,
  getEmployerDashboard,
  getLevyRoi,
  getLevyRoiBreakdown,
  getLevyRoiSubscribers,
  getLevyUtilisation,
  setLevyRoiSubscribers,
} from "../services/reporting.service";

export function useEmployerDashboard(options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: REPORTING_QUERY_KEYS.employerDashboard(orgId),
    queryFn: () => getEmployerDashboard(orgId),
    enabled: !!orgId,
    ...options,
  });
}

export function useLevyUtilisation(options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: REPORTING_QUERY_KEYS.levyUtilisation(orgId),
    queryFn: () => getLevyUtilisation(orgId),
    enabled: !!orgId,
    ...options,
  });
}

export function useLevyRoi(options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: REPORTING_QUERY_KEYS.levyRoi(orgId),
    queryFn: () => getLevyRoi(orgId),
    enabled: !!orgId,
    ...options,
  });
}

export function useLevyRoiBreakdown(groupBy, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: REPORTING_QUERY_KEYS.levyRoiBreakdown(orgId, groupBy),
    queryFn: () => getLevyRoiBreakdown(orgId, groupBy),
    enabled: !!orgId && !!groupBy,
    select: (response) => (Array.isArray(response?.data) ? response.data : []),
    ...options,
  });
}

export function useExportLevyRoiPdf() {
  const { orgId } = useAuthUser();

  return useMutation({
    mutationFn: () => exportLevyRoiPdf(orgId),
    onError: (error) => {
      toastError(error.message || "Could not start the export.");
    },
    onSuccess: () => {
      toastSuccess("Preparing your levy ROI report…");
    },
  });
}

/** F1.4.1 AC5 — the monthly report distribution list. */
export function useLevyRoiSubscribers(options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: REPORTING_QUERY_KEYS.levyRoiSubscribers(orgId),
    queryFn: () => getLevyRoiSubscribers(orgId),
    enabled: !!orgId,
    // Owner/admin only on the API; a member opening the page should see the
    // section absent rather than be bounced to the login screen.
    meta: { skipAuthRedirect: true },
    ...options,
  });
}

export function useSetLevyRoiSubscribers() {
  const qc = useQueryClient();
  const { orgId } = useAuthUser();

  return useMutation({
    mutationFn: (userIds) => setLevyRoiSubscribers(orgId, userIds),
    onSuccess: (subscribers) => {
      qc.setQueryData(
        REPORTING_QUERY_KEYS.levyRoiSubscribers(orgId),
        subscribers,
      );
      toastSuccess(
        subscribers.length === 0
          ? "Monthly report delivery turned off."
          : `Monthly report will go to ${subscribers.length} recipient${
              subscribers.length === 1 ? "" : "s"
            }.`,
      );
    },
    onError: (error) => {
      toastError(error.message || "Could not update the recipient list.");
    },
  });
}

/**
 * F1.4.2 AC3 — CSV download.
 *
 * The blob is turned into a download client-side because the response comes
 * back through the authenticated API client rather than a plain link.
 */
export function useDownloadProviderComparisonCsv() {
  const { orgId } = useAuthUser();

  return useMutation({
    mutationFn: () => downloadProviderComparisonCsv(orgId),
    onSuccess: (blob) => {
      const url = URL.createObjectURL(
        blob instanceof Blob ? blob : new Blob([blob], { type: "text/csv" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = `provider-comparison-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      // Released on the next tick; revoking synchronously can cancel the
      // download in some browsers before it starts.
      setTimeout(() => URL.revokeObjectURL(url), 0);
    },
    onError: (error) => {
      toastError(error.message || "Could not download the comparison.");
    },
  });
}

/** F1.4.2 AC3 — queues the comparison PDF. */
export function useExportProviderComparisonPdf() {
  const { orgId } = useAuthUser();

  return useMutation({
    mutationFn: () => exportProviderComparisonPdf(orgId),
    onError: (error) => {
      toastError(error.message || "Could not start the export.");
    },
  });
}
