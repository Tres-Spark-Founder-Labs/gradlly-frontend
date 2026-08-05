// @ts-check
"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { INVITATION_PATHS } from "../constants";

export async function acceptInvitation({ token }) {
  try {
    const result = await $apiClient.post(INVITATION_PATHS.ACCEPT, { token });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
