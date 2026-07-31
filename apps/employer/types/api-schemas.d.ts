/**
 * Friendly aliases over the generated OpenAPI schemas.
 *
 * `api.d.ts` is generated from the API's own OpenAPI document and must never
 * be edited by hand — regenerate it with `npm run api:types`. This file is the
 * stable surface the application imports, so a rename in the API surfaces as
 * one error here rather than dozens across the codebase.
 *
 * Why this exists at all: every response shape in this app was previously an
 * assumption. The levy tile read `levy.balance` while the API returned
 * `totalBalance`, so every field resolved to `undefined`, hit its `?? 0`
 * fallback, and rendered a confident £0.00 for every employer. Nothing could
 * have caught that — there was no description of the response to check against.
 * Now there is.
 */
import type { components } from "./api";

export type Schemas = components["schemas"];

// ─── Levy ───────────────────────────────────────────────────────────────────
export type DasLevyBalance = Schemas["DasLevyBalanceResponseDto"];
export type LevyUtilisation = Schemas["LevyUtilisationResponseDto"];
export type EmployerDashboard = Schemas["EmployerDashboardResponseDto"];

// ─── Apprentices and enrolments ─────────────────────────────────────────────
export type Apprentice = Schemas["ApprenticeResponseDto"];
export type Enrolment = Schemas["EnrolmentResponseDto"];
export type LinkedProvider = Schemas["LinkedProviderResponseDto"];
export type ParticipantUserOption = Schemas["ParticipantUserOptionDto"];

// ─── OTJ ────────────────────────────────────────────────────────────────────
export type OtjLogEntry = Schemas["OtjLogEntryResponseDto"];
export type BulkOtjActionResult = Schemas["BulkOtjActionResponseDto"];
export type DigestPreference = Schemas["DigestPreferenceResponseDto"];
