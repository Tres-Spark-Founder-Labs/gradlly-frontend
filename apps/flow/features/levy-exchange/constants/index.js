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

// ─── Recipient profile options ────────────────────────────────────────────────
//
// THE VALUES MUST STAY BYTE-IDENTICAL to `SUGGESTED` in
// apps/employer/components/levy-transfer/TransferPreferences.jsx.
//
// Matching is exact equality. levy-matching.service.ts keeps a donor only if
// `preferredValues.includes(actualValue)` for every field that donor filters
// on — case-, punctuation- and whitespace-sensitive. "North-West" is not
// "North West". A value that equals none of a donor's preferences cannot match
// that donor, and when no donor matches, the SME goes into a waiting pool that
// nothing reads, so nobody is ever told.
//
// ── WHY TWO OF THESE VALIDATE AND TWO DO NOT ─────────────────────────────────
//
// A field is closed only where the real-world set is closed:
//
//   region             CLOSED — the twelve UK regions, all of them
//   employeeCountBand  CLOSED — four bands that cover every size
//   sector             OPEN   — no list of sectors is complete
//   programmeType      OPEN   — there are several hundred standards
//
// That difference is why region and employee count are selects validated
// against these lists (RECIPIENT_PROFILE_CLOSED_FIELDS), and sector and
// programme type are free text. Their lists are the donor side's demo chips,
// offered as suggestions; closing a field against five sectors or three
// standards would not make those a vocabulary. It would stop an SME in retail
// saying so, and leave a donor who typed "Retail" able to match no one. Both
// sides are free text on those two fields, so parties who type the same value
// still meet.
//
// The apps share no code, so this is a copy, not an import. Change both files
// in the same commit. The field names differ between them:
//   sectors → sector   regions → region
//   sizeBands → employeeCountBand   programmeTypes → programmeType
//
// The real fix is a shared vocabulary enforced by the API on both sides; the
// PUT validates none of these fields today.
export const RECIPIENT_PROFILE_OPTIONS = Object.freeze({
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
    "North East",
    "East Midlands",
    "East of England",
    "South West",
    "Wales",
    "Scotland",
    "Northern Ireland",
  ]),
  employeeCountBand: Object.freeze(["1-9", "10-49", "50-249", "250+"]),
  programmeType: Object.freeze([
    "ST0145 Engineering Technician",
    "ST0415 Software Developer",
    "ST0215 Senior Healthcare Support Worker",
  ]),
});

/** The fields validated against RECIPIENT_PROFILE_OPTIONS — see above. */
export const RECIPIENT_PROFILE_CLOSED_FIELDS = Object.freeze([
  "region",
  "employeeCountBand",
]);

// MaxLength on UpsertRecipientProfileDto, for the two free-text fields.
export const RECIPIENT_PROFILE_TEXT_MAX_LENGTH = Object.freeze({
  sector: 100,
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
