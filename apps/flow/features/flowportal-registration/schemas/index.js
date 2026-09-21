import { z } from "zod";

// Per-step payload schemas — one per RegistrationWizardStep. Each maps 1:1 to
// the PUT :step body documented in the Flow spec.

export const companyVerificationSchema = z.object({
  companiesHouseNumber: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9]{8}$/, "Enter a valid 8-character company number"),
});

export const payeReferenceSchema = z.object({
  payeReference: z
    .string()
    .trim()
    .regex(/^\d{3}\/[A-Za-z]{2}\d{5}$/, "Format: 123/AB45678"),
});

export const dasAccountSchema = z
  .object({
    hasDasAccount: z.boolean(),
    dasAccountCreated: z.boolean().optional(),
    dasReference: z.string().trim().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.hasDasAccount && !val.dasReference) {
      ctx.addIssue({
        code: "custom",
        path: ["dasReference"],
        message: "Enter your DAS reference",
      });
    }
  });

export const bankDetailsSchema = z.object({
  accountName: z.string().trim().min(1, "Enter the account name"),
  sortCode: z
    .string()
    .trim()
    .regex(/^\d{2}-\d{2}-\d{2}$/, "Format: 12-34-56"),
  accountNumber: z
    .string()
    .trim()
    .regex(/^\d{8}$/, "Enter an 8-digit account number"),
});

export const consentSchema = z.object({
  levyTransferConsent: z
    .boolean()
    .refine((v) => v === true, "You must consent to the levy transfer"),
  dataProcessingConsent: z
    .boolean()
    .refine((v) => v === true, "You must consent to data processing"),
  signatoryName: z.string().trim().min(1, "Enter the signatory's name"),
  contactEmail: z
    .string()
    .trim()
    .email("Enter a valid email")
    .optional()
    .or(z.literal("")),
});

export const STEP_SCHEMAS = Object.freeze({
  company_verification: companyVerificationSchema,
  paye_reference: payeReferenceSchema,
  das_account: dasAccountSchema,
  bank_details: bankDetailsSchema,
  consent: consentSchema,
});

export const STEP_DEFAULTS = Object.freeze({
  company_verification: { companiesHouseNumber: "" },
  paye_reference: { payeReference: "" },
  das_account: { hasDasAccount: false, dasReference: "" },
  bank_details: { accountName: "", sortCode: "", accountNumber: "" },
  consent: {
    levyTransferConsent: false,
    dataProcessingConsent: false,
    signatoryName: "",
    contactEmail: "",
  },
});

// ─── Prefill from the URL ─────────────────────────────────────────────────────

/**
 * The session's sector and region, read from the link that brought this person
 * here (/register?sector=…&region=…, set by the eligibility checker).
 *
 * ── PREFILL IS LENIENT; THE WRITE IS STRICT ─────────────────────────────────
 *
 * Two different kinds of value reach POST /flowportal-registration/sessions:
 *
 *   typed or picked   Validated strictly. The API rejects a region outside
 *                     the vocabulary by name (CreateRegistrationSessionDto),
 *                     and that does not change.
 *   from a URL        A prefill hint. A link can be old — bookmarked before
 *                     the checker moved to the vocabulary, so still carrying
 *                     `region=north_west` — and nobody chose that value today.
 *                     Used when it is valid, dropped when it is not, and the
 *                     person chooses for themselves later. Never an error page
 *                     because a URL is old.
 *
 * This function is the lenient side, and the only one: it filters the hint
 * before the write, so the API's strict rule never sees a stale value.
 *
 * Region is closed, so a hint counts only if it is one of the vocabulary's
 * permitted values — `vocabulary` is the GET /levy-exchange/vocabulary
 * response; without it no region hint can be checked, and none is sent.
 * Sector is open, so any non-blank hint is valid; the API normalises it.
 *
 * Old slugs are not translated to vocabulary values. A slug-to-value map
 * would be a second vocabulary, which is what the single one exists to end.
 */
export function registrationPrefill(searchParams, vocabulary) {
  const hint = (name) => {
    const value = searchParams?.get?.(name);
    return typeof value === "string" && value.trim() !== "" ? value : null;
  };
  const permittedRegions = Array.isArray(vocabulary?.closed?.region)
    ? vocabulary.closed.region
    : [];

  const sector = hint("sector");
  const region = hint("region");
  return {
    ...(sector ? { sector } : {}),
    ...(region && permittedRegions.includes(region) ? { region } : {}),
  };
}
