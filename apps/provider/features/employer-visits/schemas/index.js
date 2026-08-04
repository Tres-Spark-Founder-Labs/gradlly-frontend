import { z } from "zod";

import { EMPLOYER_VISIT_TYPE_VALUES } from "../constants";

const dateString = z
  .string()
  .min(1, "Date is required")
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date");

const optionalDate = z
  .union([
    z.literal(""),
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  ])
  .optional();

// Mirrors CreateEmployerVisitDto.
export const employerVisitSchema = z.object({
  employerOrganisationId: z.string().uuid("Select an employer"),
  visitedOn: dateString,
  visitType: z.enum(EMPLOYER_VISIT_TYPE_VALUES, {
    message: "Select a visit type",
  }),
  attendees: z
    .string()
    .trim()
    .min(2, "Say who was there")
    .max(1000, "Must be 1000 characters or fewer"),
  discussionPoints: z
    .string()
    .trim()
    .min(2, "Say what was discussed")
    .max(5000, "Must be 5000 characters or fewer"),
  actionPoints: z
    .string()
    .trim()
    .max(5000, "Must be 5000 characters or fewer")
    .optional()
    .or(z.literal("")),
  nextVisitDate: optionalDate,
  enrolmentIds: z.array(z.string().uuid()).optional(),
});

export const employerVisitDefaults = Object.freeze({
  employerOrganisationId: "",
  visitedOn: "",
  visitType: "",
  attendees: "",
  discussionPoints: "",
  actionPoints: "",
  nextVisitDate: "",
  enrolmentIds: [],
});

export function toEmployerVisitPayload(values) {
  const payload = {
    employerOrganisationId: values.employerOrganisationId,
    visitedOn: values.visitedOn,
    visitType: values.visitType,
    attendees: values.attendees.trim(),
    discussionPoints: values.discussionPoints.trim(),
  };

  const actionPoints = values.actionPoints?.trim();
  if (actionPoints) payload.actionPoints = actionPoints;

  // Omitted when blank. The backend treats a missing next-visit date as
  // honestly unknown rather than defaulting one, and a guessed date on an
  // Ofsted evidence record is worse than a gap.
  if (values.nextVisitDate) payload.nextVisitDate = values.nextVisitDate;

  if (values.enrolmentIds?.length) payload.enrolmentIds = values.enrolmentIds;

  return payload;
}
