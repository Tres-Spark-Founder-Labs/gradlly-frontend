import { z } from "zod";

import { EPA_OUTCOME_VALUES } from "../constants";

// ─── Shared field helpers ────────────────────────────────────────────────────

// Optional money/percent field. Number inputs yield "" when cleared, which we
// treat as "not provided" and drop from the payload.
const optionalDecimal = ({ min = 0, max, maxDecimals = 2 } = {}) =>
  z
    .union([z.literal(""), z.coerce.number()])
    .refine((v) => v === "" || !Number.isNaN(v), "Enter a valid number")
    .refine((v) => v === "" || v >= min, `Must be ${min} or greater`)
    .refine((v) => v === "" || max === undefined || v <= max, {
      message: max === undefined ? "" : `Must be ${max} or less`,
    })
    .refine(
      (v) => v === "" || Number.isInteger(v * 10 ** maxDecimals),
      `Use at most ${maxDecimals} decimal place(s)`,
    );

// Optional date string in YYYY-MM-DD (the format <input type="date"> emits).
const optionalDate = z
  .union([
    z.literal(""),
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  ])
  .optional();

const requiredDate = z
  .string()
  .min(1, "Date is required")
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date");

const optionalUuid = z
  .union([z.literal(""), z.string().uuid("Enter a valid ID")])
  .optional();

// True when an optional value carries an actual value (not blank/unset).
function isProvided(v) {
  return v !== "" && v !== null && v !== undefined;
}

// ─── Create ──────────────────────────────────────────────────────────────────

export const createEnrolmentSchema = z
  .object({
    apprenticeId: z
      .string()
      .trim()
      .min(1, "Select an apprentice")
      .uuid("Select a valid apprentice"),
    standardId: z
      .string()
      .trim()
      .min(1, "Select a standard")
      .uuid("Select a valid standard"),
    agreedPrice: optionalDecimal({ min: 0, maxDecimals: 2 }),
    plannedStartDate: optionalDate,
    plannedEndDate: optionalDate,
    completionPaymentPercent: optionalDecimal({
      min: 0,
      max: 100,
      maxDecimals: 2,
    }),
  })
  // If both dates are supplied, end must be after start.
  .refine(
    (v) =>
      !isProvided(v.plannedStartDate) ||
      !isProvided(v.plannedEndDate) ||
      v.plannedEndDate > v.plannedStartDate,
    {
      message: "End date must be after the start date",
      path: ["plannedEndDate"],
    },
  );

export const createEnrolmentDefaults = Object.freeze({
  apprenticeId: "",
  standardId: "",
  agreedPrice: "",
  plannedStartDate: "",
  plannedEndDate: "",
  completionPaymentPercent: "",
});

export function toCreateEnrolmentPayload(values) {
  const payload = {
    apprenticeId: values.apprenticeId,
    standardId: values.standardId,
  };
  if (isProvided(values.agreedPrice))
    payload.agreedPrice = Number(values.agreedPrice);
  if (isProvided(values.plannedStartDate))
    payload.plannedStartDate = values.plannedStartDate;
  if (isProvided(values.plannedEndDate))
    payload.plannedEndDate = values.plannedEndDate;
  if (isProvided(values.completionPaymentPercent))
    payload.completionPaymentPercent = Number(values.completionPaymentPercent);
  return payload;
}

// ─── Journey: set EPA date ───────────────────────────────────────────────────

export const journeySchema = z.object({
  epaDate: optionalDate,
  // F2.2.4 AC1 — who is assessing, decided at the same point as when.
  epaOrganisationName: z
    .string()
    .trim()
    .max(255, "Must be 255 characters or fewer")
    .optional()
    .or(z.literal("")),
  epaOrganisationUkprn: z
    .union([
      z.literal(""),
      z.string().regex(/^\d{8}$/, "UKPRN must be exactly 8 digits"),
    ])
    .optional(),
});

export const journeyDefaults = Object.freeze({
  epaDate: "",
  epaOrganisationName: "",
  epaOrganisationUkprn: "",
});

export function toJourneyPayload(values) {
  // Every field is optional and the endpoint patches only what it is sent, so
  // a blank is "leave it alone" rather than "clear it". Clearing is not
  // exposed — an EPAO that has been appointed does not get un-appointed by
  // emptying a text box.
  const payload = {};
  if (isProvided(values.epaDate)) payload.epaDate = values.epaDate;
  if (isProvided(values.epaOrganisationName))
    payload.epaOrganisationName = values.epaOrganisationName.trim();
  if (isProvided(values.epaOrganisationUkprn))
    payload.epaOrganisationUkprn = values.epaOrganisationUkprn;
  return payload;
}

// ─── Break in learning (F2.2.4 AC6) ──────────────────────────────────────────

export const breakInLearningSchema = z.object({
  reason: z.string().trim().min(1, "Select a reason"),
  startedOn: optionalDate,
  expectedReturnDate: optionalDate,
});

export const breakInLearningDefaults = Object.freeze({
  reason: "",
  startedOn: "",
  expectedReturnDate: "",
});

export function toBreakInLearningPayload(values) {
  const payload = { reason: values.reason.trim() };
  if (isProvided(values.startedOn)) payload.startedOn = values.startedOn;
  // Deliberately omitted when blank. A guessed return date on a funding record
  // is worse than an honest gap — the backend says the same in its DTO.
  if (isProvided(values.expectedReturnDate))
    payload.expectedReturnDate = values.expectedReturnDate;
  return payload;
}

export const endBreakInLearningSchema = z.object({
  actualReturnDate: optionalDate,
});

export const endBreakInLearningDefaults = Object.freeze({
  actualReturnDate: "",
});

export function toEndBreakInLearningPayload(values) {
  return isProvided(values.actualReturnDate)
    ? { actualReturnDate: values.actualReturnDate }
    : {};
}

// ─── Record EPA outcome ──────────────────────────────────────────────────────

export const epaOutcomeSchema = z.object({
  outcome: z.enum(EPA_OUTCOME_VALUES, { message: "Select an outcome" }),
  assessedOn: requiredDate,
});

export const epaOutcomeDefaults = Object.freeze({
  outcome: "",
  assessedOn: "",
});

// ─── Participants ─────────────────────────────────────────────────────────────

export const participantsSchema = z.object({
  apprenticeUserId: optionalUuid,
  tutorUserId: optionalUuid,
  employerManagerUserId: optionalUuid,
});

export function participantsDefaultsFromRow(enrolment) {
  return {
    apprenticeUserId: enrolment?.apprenticeUserId ?? "",
    tutorUserId: enrolment?.tutorUserId ?? "",
    employerManagerUserId: enrolment?.employerManagerUserId ?? "",
  };
}

// Only send fields that carry a value (all participant fields are optional).
export function toParticipantsPayload(values) {
  const payload = {};
  if (isProvided(values.apprenticeUserId))
    payload.apprenticeUserId = values.apprenticeUserId;
  if (isProvided(values.tutorUserId)) payload.tutorUserId = values.tutorUserId;
  if (isProvided(values.employerManagerUserId))
    payload.employerManagerUserId = values.employerManagerUserId;
  return payload;
}

// ─── Organisation links (employer only on provider portal) ─────────────────────

export const employerOrganisationLinkSchema = z.object({
  employerOrganisationId: optionalUuid,
});

export function employerOrganisationLinkDefaultsFromRow(enrolment) {
  return {
    employerOrganisationId: enrolment?.employerOrganisationId ?? "",
  };
}

export function toEmployerOrganisationLinkPayload(values) {
  return {
    employerOrganisationId: isProvided(values.employerOrganisationId)
      ? values.employerOrganisationId
      : null,
  };
}

// Legacy shape retained for API typings; provider portal UI only edits employer links.
export const organisationLinksSchema = employerOrganisationLinkSchema;

export function organisationLinksDefaultsFromRow(enrolment) {
  return employerOrganisationLinkDefaultsFromRow(enrolment);
}

export function toOrganisationLinksPayload(values) {
  return toEmployerOrganisationLinkPayload(values);
}
