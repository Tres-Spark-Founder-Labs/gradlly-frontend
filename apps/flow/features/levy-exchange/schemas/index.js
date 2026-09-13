import { z } from "zod";

import {
  ELIGIBILITY_REGIONS,
  ELIGIBILITY_SECTORS,
  EMPLOYEE_COUNT_BANDS,
  RECIPIENT_PROFILE_OPTIONS,
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

/** The four fields matching compares to donor preferences by exact equality. */
export const RECIPIENT_PROFILE_MATCHED_FIELDS = Object.freeze([
  "sector",
  "region",
  "employeeCountBand",
  "programmeType",
]);

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

// Closed lists: see RECIPIENT_PROFILE_OPTIONS for why these are not free text.
export const recipientProfileSchema = z.object({
  sector: z.enum(RECIPIENT_PROFILE_OPTIONS.sector, {
    message: "Choose your sector",
  }),
  region: z.enum(RECIPIENT_PROFILE_OPTIONS.region, {
    message: "Choose your region",
  }),
  employeeCountBand: z.enum(RECIPIENT_PROFILE_OPTIONS.employeeCountBand, {
    message: "Choose your employee count",
  }),
  programmeType: z.enum(RECIPIENT_PROFILE_OPTIONS.programmeType, {
    message: "Choose a programme",
  }),
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

const isOnList = (field, value) =>
  typeof value === "string" && RECIPIENT_PROFILE_OPTIONS[field].includes(value);

/**
 * Stored profile → form values. Every field comes from the API response.
 *
 * A stored matched field that is not on its list — saved before the lists were
 * closed, or by another client, since the PUT validates none of them — comes
 * back as "" rather than being carried into the form. The select cannot show
 * it and saving it again would repeat the silent non-match; see
 * recipientProfileOffListValues, which surfaces it instead.
 */
export function recipientProfileToForm(profile) {
  if (!profile) return recipientProfileDefaults;
  const pick = (field) =>
    isOnList(field, profile[field]) ? profile[field] : "";
  let hasDasAccount = "";
  if (typeof profile.hasDasAccount === "boolean") {
    hasDasAccount = profile.hasDasAccount ? "yes" : "no";
  }
  return {
    sector: pick("sector"),
    region: pick("region"),
    employeeCountBand: pick("employeeCountBand"),
    programmeType: pick("programmeType"),
    transferAmountRequired:
      typeof profile.transferAmountRequired === "string"
        ? profile.transferAmountRequired
        : "",
    hasDasAccount,
    isListed: profile.isListed === true,
  };
}

/**
 * The stored values the form had to drop, keyed by field — each one exactly as
 * the API returned it, so the screen can say which value cannot match.
 */
export function recipientProfileOffListValues(profile) {
  const offList = {};
  if (!profile) return offList;
  for (const field of RECIPIENT_PROFILE_MATCHED_FIELDS) {
    const stored = profile[field];
    if (
      typeof stored === "string" &&
      stored !== "" &&
      !isOnList(field, stored)
    ) {
      offList[field] = stored;
    }
  }
  return offList;
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
