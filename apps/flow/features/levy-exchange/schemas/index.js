import { z } from "zod";

import {
  ELIGIBILITY_REGIONS,
  ELIGIBILITY_SECTORS,
  EMPLOYEE_COUNT_BANDS,
  RECIPIENT_PROFILE_MAX_LENGTH,
} from "../constants";

const values = (options) => options.map((o) => o.value);

export const levyEligibilitySchema = z.object({
  employeeCountBand: z.enum(values(EMPLOYEE_COUNT_BANDS), {
    message: "Select your employee count",
  }),
  sector: z.enum(values(ELIGIBILITY_SECTORS), {
    message: "Select your sector",
  }),
  region: z.enum(values(ELIGIBILITY_REGIONS), {
    message: "Select your region",
  }),
  hasDasAccount: z.boolean(),
});

export const levyEligibilityDefaults = {
  employeeCountBand: "10_49",
  sector: "construction",
  region: "north_west",
  hasDasAccount: false,
};

// ─── Recipient profile (UpsertRecipientProfileDto) ────────────────────────────

const requiredText = (message, max) =>
  z
    .string()
    .trim()
    .min(1, message)
    .max(max, `Keep this under ${max} characters`);

/**
 * transferAmountRequired stays a STRING end to end.
 *
 * The DTO types it IsNumberString and the column is numeric(14,2), so the API
 * expects a decimal-as-string. It is validated here by pattern — at most 12
 * whole digits and 2 decimal places, which is what numeric(14,2) holds — and
 * never passed through Number(), which is how float drift on money gets in.
 * The "above zero" check is a string test for a non-zero digit, for the same
 * reason.
 *
 * Zero is refused even though IsNumberString accepts it: the matching service
 * caps each donor's offer at the amount required and drops any candidate whose
 * transferable amount is zero, so a £0 profile could only ever reach the
 * waiting pool.
 */
const AMOUNT_PATTERN = /^\d{1,12}(\.\d{1,2})?$/;

export const recipientProfileSchema = z.object({
  sector: requiredText(
    "Enter your sector",
    RECIPIENT_PROFILE_MAX_LENGTH.sector,
  ),
  region: requiredText(
    "Enter your region",
    RECIPIENT_PROFILE_MAX_LENGTH.region,
  ),
  employeeCountBand: requiredText(
    "Enter your employee count band",
    RECIPIENT_PROFILE_MAX_LENGTH.employeeCountBand,
  ),
  programmeType: requiredText(
    "Enter the programme type",
    RECIPIENT_PROFILE_MAX_LENGTH.programmeType,
  ),
  transferAmountRequired: z
    .string()
    .trim()
    .regex(AMOUNT_PATTERN, "Enter an amount in pounds, e.g. 15000 or 15000.50")
    .refine((value) => /[1-9]/.test(value), "Enter an amount above £0"),
  // A required boolean on the DTO, captured as an explicit Yes / No so a new
  // profile never records "No" just because nobody answered the question.
  hasDasAccount: z.enum(["yes", "no"], {
    message: "Tell us whether you already have a DAS account",
  }),
  isListed: z.boolean(),
});

export const recipientProfileDefaults = {
  sector: "",
  region: "",
  employeeCountBand: "",
  programmeType: "",
  transferAmountRequired: "",
  hasDasAccount: "",
  isListed: false,
};

/** Stored profile → form values. Every field comes from the API response. */
export function recipientProfileToForm(profile) {
  if (!profile) return recipientProfileDefaults;
  const text = (value) => (typeof value === "string" ? value : "");
  let hasDasAccount = "";
  if (typeof profile.hasDasAccount === "boolean") {
    hasDasAccount = profile.hasDasAccount ? "yes" : "no";
  }
  return {
    sector: text(profile.sector),
    region: text(profile.region),
    employeeCountBand: text(profile.employeeCountBand),
    programmeType: text(profile.programmeType),
    transferAmountRequired: text(profile.transferAmountRequired),
    hasDasAccount,
    isListed: profile.isListed === true,
  };
}

/** Validated form values → UpsertRecipientProfileDto. */
export function recipientProfileToPayload(form) {
  return {
    sector: form.sector,
    region: form.region,
    employeeCountBand: form.employeeCountBand,
    programmeType: form.programmeType,
    transferAmountRequired: form.transferAmountRequired,
    hasDasAccount: form.hasDasAccount === "yes",
    // Always sent explicitly. The service keeps the stored value when this is
    // omitted — right for other callers, but it would make the checkbox here
    // a no-op.
    isListed: form.isListed,
  };
}
