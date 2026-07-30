"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { toastError, toastSuccess } from "@/hooks/useToast";

import { REPORTING_QUERY_KEYS } from "./keys";
import {
  exportLevyRoiPdf,
  getEmployerDashboard,
  getLevyRoi,
  getLevyRoiBreakdown,
  getLevyUtilisation,
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
