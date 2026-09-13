// ─── Paths ────────────────────────────────────────────────────────────────────
//
// Two audiences share this feature, and the split is by endpoint, not by module:
//
//   eligibility check   PUBLIC, pre-account (the /eligibility funnel)
//   recipient side      the signed-in SME: its recipient profile, a match
//                       search, and the applications it has sent to donors
//
// The donor side — donor links, transfer preferences, surplus, the recipient
// directory, and PATCH /match-applications/:id — belongs to the employer
// portal. That PATCH in particular is not for this app: the service refuses
// any caller who is not the application's donor
// (levy-match-application.service.ts, updateStatus).
//
// This file previously said all match endpoints belonged to the employer
// portal. True for the donor half, wrong for the recipient half: it left
// GET/PUT /recipient-profile with no caller anywhere, and F4.2.3 AC2 measures
// matching from "an SME completing their profile".
export const LEVY_EXCHANGE_PATHS = Object.freeze({
  ELIGIBILITY_CHECK: "/api/v1/levy-exchange/eligibility/check",
  RECIPIENT_PROFILE: "/api/v1/levy-exchange/recipient-profile",
  MATCH_SEARCH: "/api/v1/levy-exchange/matches/search",
  MATCH_APPLICATIONS: "/api/v1/levy-exchange/match-applications",
});

export const EMPLOYEE_COUNT_BANDS = Object.freeze([
  { value: "1_9", text: "1–9 employees" },
  { value: "10_49", text: "10–49 employees" },
  { value: "50_249", text: "50–249 employees" },
  { value: "250_plus", text: "250+ employees" },
]);

export const ELIGIBILITY_SECTORS = Object.freeze([
  { value: "construction", text: "Construction" },
  { value: "healthcare", text: "Healthcare" },
  { value: "manufacturing", text: "Manufacturing" },
  { value: "retail", text: "Retail" },
  { value: "technology", text: "Technology" },
]);

export const ELIGIBILITY_REGIONS = Object.freeze([
  { value: "north_west", text: "North West" },
  { value: "london", text: "London" },
  { value: "south_east", text: "South East" },
  { value: "midlands", text: "Midlands" },
  { value: "scotland", text: "Scotland" },
]);

// LevyEligibilityStatus
export const ELIGIBILITY_STATUS = Object.freeze({
  ELIGIBLE: "eligible",
  NOT_ELIGIBLE: "not_eligible",
  CHECK_WITH_ADVISOR: "check_with_advisor",
});

// ─── Recipient profile: suggestions, not a vocabulary ─────────────────────────
//
// sector, region, employeeCountBand and programmeType are free strings on the
// server (UpsertRecipientProfileDto: IsString + MaxLength, no enum), and
// matching compares them to a donor's preference arrays by EXACT,
// case-sensitive equality (levy-matching.service.ts, passesPreferenceFilters).
//
// So the value that matters is whatever donors actually entered. The employer
// app's TransferPreferences.jsx takes donor preferences as free text and
// offers suggestion chips; these lists are those chips, character for
// character, so an SME who picks "North West" meets a donor who picked
// "North West". Change one list and not the other and the two sides silently
// stop matching. They are offered through a <datalist>, so the field stays
// free text exactly as the API allows.
//
// These are deliberately NOT the eligibility lists above. Those are slugs
// ("north_west", "10_49") and would never equal a donor's "North West".
export const RECIPIENT_PROFILE_SUGGESTIONS = Object.freeze({
  sector: Object.freeze([
    "Engineering & Manufacturing",
    "Health & Social Care",
    "Digital & Technology",
    "Construction",
    "Financial Services",
  ]),
  region: Object.freeze([
    "London",
    "North West",
    "Yorkshire and the Humber",
    "West Midlands",
    "South East",
  ]),
  employeeCountBand: Object.freeze(["1-9", "10-49", "50-249", "250+"]),
  programmeType: Object.freeze([
    "ST0145 Engineering Technician",
    "ST0415 Software Developer",
    "ST0215 Senior Healthcare Support Worker",
  ]),
});

// Column limits from UpsertRecipientProfileDto (MaxLength).
export const RECIPIENT_PROFILE_MAX_LENGTH = Object.freeze({
  sector: 100,
  region: 100,
  employeeCountBand: 50,
  programmeType: 100,
});

// ─── Match applications (LevyMatchApplicationStatus) ──────────────────────────
//
// `withdrawn` is in the enum but no route sets it — PATCH accepts only
// confirmed | rejected, and only from the donor. It is labelled here so that
// if it ever arrives it renders as itself rather than as an unknown string.
export const MATCH_APPLICATION_STATUS = Object.freeze({
  PENDING: "pending",
  CONFIRMED: "confirmed",
  REJECTED: "rejected",
  WITHDRAWN: "withdrawn",
});

export const MATCH_APPLICATION_STATUS_META = Object.freeze({
  pending: { label: "Pending donor review", color: "amber" },
  confirmed: { label: "Confirmed", color: "green" },
  rejected: { label: "Rejected", color: "red" },
  withdrawn: { label: "Withdrawn", color: "gray" },
});

// An SME may already have an application in flight with a donor. The API does
// not refuse a second one (its documented "duplicate pending" 400 is not
// implemented in the service), so the screen stops offering "Apply" instead.
export const OPEN_APPLICATION_STATUSES = Object.freeze([
  MATCH_APPLICATION_STATUS.PENDING,
  MATCH_APPLICATION_STATUS.CONFIRMED,
]);

// perPage is capped at 100 by PaginationQueryDto.
export const MATCH_APPLICATIONS_PAGE_SIZE = 100;

/**
 * Formats a decimal-as-string GBP amount ("15000.00") for display WITHOUT
 * turning it into a Number. Money arrives as a string because the column is
 * numeric(14,2); parsing it to a float to add thousands separators is how
 * float drift gets reintroduced, so the grouping is done on the digits.
 *
 * Returns null for a missing value, so callers render nothing rather than a
 * placeholder amount. A string that is not a plain decimal is returned as-is:
 * it is still what the API sent, and hiding it would be worse than showing it
 * unformatted.
 */
export function formatGbpDecimal(value) {
  if (typeof value !== "string") return null;
  const match = /^(\d+)(?:\.(\d+))?$/.exec(value.trim());
  if (!match) return value;
  const [, whole, fraction] = match;
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return fraction === undefined ? `£${grouped}` : `£${grouped}.${fraction}`;
}

/**
 * An ISO timestamp from the API as a UK date, or null. Null — never a guessed
 * date — for a missing or unparseable value, so callers render nothing.
 */
export function formatIsoDate(iso) {
  if (typeof iso !== "string" || iso === "") return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
