import { z } from "zod";

import { RECIPIENT_PROFILE_TEXT_MAX_LENGTH } from "../constants";

/**
 * Schemas are built from the vocabulary the API serves, not from a list held
 * here. `vocabulary` is the GET /levy-exchange/vocabulary response:
 * `{ closed: { region, employeeCountBand }, open: { sector, programmeType } }`.
 *
 * A closed field is checked against `closed[field]` so the form says which
 * values are allowed before the API has to; an open field is length-checked
 * only, because any value is accepted there.
 */
const list = (value) => (Array.isArray(value) ? value : []);

const oneOf = (values, message) =>
  z.string().refine((value) => values.includes(value), { message });

export function buildLevyEligibilitySchema(vocabulary) {
  return z.object({
    employeeCountBand: oneOf(
      list(vocabulary?.closed?.employeeCountBand),
      "Select your employee count",
    ),
    sector: z
      .string()
      .trim()
      .min(1, "Enter your sector")
      .max(
        RECIPIENT_PROFILE_TEXT_MAX_LENGTH.sector,
        `Keep this under ${RECIPIENT_PROFILE_TEXT_MAX_LENGTH.sector} characters`,
      ),
    region: oneOf(list(vocabulary?.closed?.region), "Select your region"),
    hasDasAccount: z.boolean(),
  });
}

/**
 * Nothing is pre-selected. The old defaults were three vocabulary values held
 * in this app — a fourth copy of the list, and a pre-ticked answer to a
 * question nobody had answered.
 */
export const levyEligibilityDefaults = {
  employeeCountBand: "",
  sector: "",
  region: "",
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

/**
 * Region and employee count are the vocabulary's closed fields and are checked
 * against it; sector and programme type are open and are not. The API applies
 * the same split on write — see the note in ../constants.
 */
export function buildRecipientProfileSchema(vocabulary) {
  return z.object({
    sector: requiredText(
      "Enter your sector",
      RECIPIENT_PROFILE_TEXT_MAX_LENGTH.sector,
    ),
    region: oneOf(list(vocabulary?.closed?.region), "Choose your region"),
    employeeCountBand: oneOf(
      list(vocabulary?.closed?.employeeCountBand),
      "Choose your employee count",
    ),
    programmeType: requiredText(
      "Enter the programme type",
      RECIPIENT_PROFILE_TEXT_MAX_LENGTH.programmeType,
    ),
    transferAmountRequired: z
      .string()
      .trim()
      .regex(
        AMOUNT_PATTERN,
        "Enter an amount in pounds, e.g. 15000 or 15000.50",
      )
      .refine((value) => /[1-9]/.test(value), "Enter an amount above £0"),
    // A required boolean on the DTO, captured as an explicit Yes / No so a new
    // profile never records "No" just because nobody answered the question.
    hasDasAccount: z.enum(["yes", "no"], {
      message: "Tell us whether you already have a DAS account",
    }),
    isListed: z.boolean(),
  });
}

export const recipientProfileDefaults = {
  sector: "",
  region: "",
  employeeCountBand: "",
  programmeType: "",
  transferAmountRequired: "",
  hasDasAccount: "",
  isListed: false,
};

const isOnList = (vocabulary, field, value) =>
  typeof value === "string" &&
  list(vocabulary?.closed?.[field]).includes(value);

const text = (value) => (typeof value === "string" ? value : "");

/**
 * Stored profile → form values. Every field comes from the API response.
 *
 * A closed field whose stored value is not in the vocabulary — written before
 * the PUT validated these fields — comes back as "" rather than being carried
 * into the form. The select cannot show it, and saving it again would now be
 * refused; recipientProfileOffListValues surfaces it instead. The two open
 * fields carry whatever was stored.
 */
export function recipientProfileToForm(profile, vocabulary) {
  if (!profile) return recipientProfileDefaults;
  const closed = (field) =>
    isOnList(vocabulary, field, profile[field]) ? profile[field] : "";
  let hasDasAccount = "";
  if (typeof profile.hasDasAccount === "boolean") {
    hasDasAccount = profile.hasDasAccount ? "yes" : "no";
  }
  return {
    sector: text(profile.sector),
    region: closed("region"),
    employeeCountBand: closed("employeeCountBand"),
    programmeType: text(profile.programmeType),
    transferAmountRequired: text(profile.transferAmountRequired),
    hasDasAccount,
    isListed: profile.isListed === true,
  };
}

/**
 * The stored values a closed field had to drop, keyed by field — each exactly
 * as the API returned it, so the screen can say which value cannot match.
 */
export function recipientProfileOffListValues(profile, vocabulary) {
  const offList = {};
  if (!profile) return offList;
  for (const field of Object.keys(vocabulary?.closed ?? {})) {
    const stored = profile[field];
    if (
      typeof stored === "string" &&
      stored !== "" &&
      !isOnList(vocabulary, field, stored)
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
