"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { AUTH_QUERY_KEYS } from "@/features/auth/queries/keys";
import { createOrganization } from "@/features/organization/services/organizations.service";
import { toastError, toastSuccess } from "@/hooks/useToast";
import { ERROR_CODES } from "@/lib/errors";

export function useCreateOrganization() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createOrganization,
    onSuccess: (data) => {
      toastSuccess(data?.message || "Organisation created successfully.");
      qc.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.me() });
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) {
        toastError(error.message);
      }
    },
  });
}
