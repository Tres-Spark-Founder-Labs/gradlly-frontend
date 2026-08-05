// @ts-check
"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import {
  APPRENTICE_PORTAL_TYPE,
  APPRENTICE_ROLE,
  INVITATION_PATHS,
  INVITATION_ROLES,
} from "../constants";

// Translates a UI role into the backend payload role + optional portal override.
// "apprentice" is UI-only: it becomes role="member" routed to the apprentice portal.
function resolveInviteRole(uiRole) {
  if (uiRole === APPRENTICE_ROLE) {
    return {
      role: INVITATION_ROLES.MEMBER,
      portalOverride: APPRENTICE_PORTAL_TYPE,
    };
  }
  return { role: uiRole, portalOverride: null };
}

// The active organisation is sent globally via the X-Organisation-Id cookie/
// header (see lib/api/client). The only header these calls ever set explicitly
// is the per-request portal override used to route an apprentice invite to the
// apprentice portal — a genuine override of the always-sent X-Portal-Type.
function portalOverrideHeaders(portalOverride) {
  return portalOverride
    ? { "x-portal-type-override": portalOverride }
    : undefined;
}

export async function sendInvitation({ email, role }) {
  const { role: payloadRole, portalOverride } = resolveInviteRole(role);
  try {
    const result = await $apiClient.post(
      INVITATION_PATHS.BASE,
      { email, role: payloadRole },
      { headers: portalOverrideHeaders(portalOverride) },
    );
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function listInvitations({ page = 1, perPage = 20 } = {}) {
  try {
    const result = await $apiClient.get(INVITATION_PATHS.BASE, {
      params: { page, perPage },
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

// Resend keeps the original invitation intact on the backend (it already stores
// the role and portal type). We forward the apprentice portal override only when
// the caller knows this invite was apprentice-routed, so behaviour is preserved.
export async function resendInvitation({ id, portalOverride = null }) {
  try {
    const result = await $apiClient.post(
      INVITATION_PATHS.resend(id),
      {},
      { headers: portalOverrideHeaders(portalOverride) },
    );
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function revokeInvitation({ id }) {
  try {
    await $apiClient.delete(INVITATION_PATHS.revoke(id));
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function acceptInvitation({ token }) {
  try {
    const result = await $apiClient.post(INVITATION_PATHS.ACCEPT, { token });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
