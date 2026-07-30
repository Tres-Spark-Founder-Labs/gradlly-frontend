export const LEVY_PATHS = Object.freeze({
  SURPLUS: "/api/v1/levy-exchange/surplus",
  SURPLUS_RECOMPUTE: "/api/v1/levy-exchange/surplus/recompute",
  EXPIRY_CALENDAR: "/api/v1/levy-exchange/surplus/expiry-calendar",
  DONOR_LINKS: "/api/v1/levy-exchange/donor-links",
  donorLink: (id) => `/api/v1/levy-exchange/donor-links/${id}`,
  donorSync: (id) => `/api/v1/levy-exchange/donor-links/${id}/sync`,
  TRANSFER_PREFERENCES: "/api/v1/levy-exchange/transfer-preferences",
  MATCH_APPLICATIONS: "/api/v1/levy-exchange/match-applications",
  matchApplication: (id) => `/api/v1/levy-exchange/match-applications/${id}`,
  MATCHES_SEARCH: "/api/v1/levy-exchange/matches/search",
  TRANSFERS: "/api/v1/levy-exchange/transfers",
  transfer: (id) => `/api/v1/levy-exchange/transfers/${id}`,
  transferSign: (id) => `/api/v1/levy-exchange/transfers/${id}/sign`,
  transferSubmit: (id) => `/api/v1/levy-exchange/transfers/${id}/submit`,
  transferDocument: (id) => `/api/v1/levy-exchange/transfers/${id}/document`,
});

export const DONOR_LINK_STATUSES = Object.freeze({
  PENDING_CONSENT: "pending_consent",
  ACTIVE: "active",
  ERROR: "error",
  REVOKED: "revoked",
});

export const MATCH_APPLICATION_STATUSES = Object.freeze({
  PENDING: "pending",
  CONFIRMED: "confirmed",
  REJECTED: "rejected",
});

export const TRANSFER_ROLE = Object.freeze({
  DONOR: "donor",
  RECIPIENT: "recipient",
});

export const TRANSFER_STATUSES = Object.freeze({
  DRAFT: "draft",
  PENDING_SIGNATURES: "pending_signatures",
  PENDING_ESFA: "pending_esfa",
  CONFIRMED: "confirmed",
  ACTIVE: "active",
  FAILED: "failed",
});

export const TRANSFER_PARTY = Object.freeze({
  DONOR: "donor",
  RECIPIENT: "recipient",
});
