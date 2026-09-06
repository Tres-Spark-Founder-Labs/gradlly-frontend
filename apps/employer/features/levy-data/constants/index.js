/**
 * Manual levy data entry (F1.1.1, F1.1.2, F1.1.3, F1.1.5, F4.1.1).
 *
 * For deployments with no ESFA connection. The figures an operator types here
 * are what the levy dashboard, the expiry banners and the funding reports
 * render — the same endpoints as before, different source.
 */
export const LEVY_DATA_PATHS = Object.freeze({
  BALANCE: "/api/v1/das/manual/levy-balance",
  MONTHLY: "/api/v1/das/manual/levy-monthly",
  TRANCHES: "/api/v1/das/manual/levy-tranches",
  FUNDING_PAYMENTS: "/api/v1/das/manual/funding-payments",
  ILR_RECEIPT: "/api/v1/das/manual/ilr-receipt",
  DONOR_LINK: "/api/v1/das/manual/donor-link",
  DONOR_LINKS: "/api/v1/das/manual/donor-links",
  /**
   * Reads that return the STORED rows, for pre-populating the forms.
   *
   * Deliberately not the dashboard's own endpoints. Those are shaped for
   * display — /reporting/levy-utilisation types money as numbers and carries
   * no currency at all — and every write here is replace-all. Loading a lossy
   * view and saving it unchanged would overwrite the real rows while looking
   * like a successful no-op. The balance form is the exception: it reads
   * /das/levy-balance, whose round trip is clean.
   */
  READ_BALANCE: "/api/v1/das/levy-balance",
  READ_MONTHLY: "/api/v1/das/manual/levy-monthly",
  READ_TRANCHES: "/api/v1/das/manual/levy-tranches",
  READ_FUNDING_PAYMENTS: "/api/v1/das/manual/funding-payments",
});

/**
 * The columns a pasted month row must have, in order.
 *
 * Named here because the parser reports failures by column name, and "column 2"
 * means nothing to someone looking at a spreadsheet.
 */
export const MONTH_CSV_COLUMNS = Object.freeze([
  { key: "month", label: "Month", example: "2026-04" },
  { key: "contributions", label: "Contributions", example: "4100.00" },
  { key: "spend", label: "Spend", example: "2750.00" },
]);

/** At most a levy year. Fewer is legitimate — a year in progress. */
export const MAX_MONTHS = 12;
