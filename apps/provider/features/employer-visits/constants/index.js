export const EMPLOYER_VISIT_PATHS = Object.freeze({
  BASE: "/api/v1/employer-visits",
  byId: (id) => `/api/v1/employer-visits/${id}`,
  nextVisitSuggestion: "/api/v1/employer-visits/next-visit-suggestion",
});

// ─── Visit type (`EmployerVisitType`) ────────────────────────────────────────
//
// Ofsted distinguishes these. A programme where every "employer engagement"
// was a phone call reads differently in an inspection from one with regular
// on-site visits.
export const EMPLOYER_VISIT_TYPE = Object.freeze({
  ON_SITE: "on_site",
  VIDEO: "video",
  PHONE: "phone",
});

export const EMPLOYER_VISIT_TYPE_LABELS = Object.freeze({
  on_site: "On site",
  video: "Video call",
  phone: "Phone call",
});

export const EMPLOYER_VISIT_TYPE_VALUES = Object.values(EMPLOYER_VISIT_TYPE);

export const EMPLOYER_VISIT_TYPE_OPTIONS = [
  { value: EMPLOYER_VISIT_TYPE.ON_SITE, text: "On site" },
  { value: EMPLOYER_VISIT_TYPE.VIDEO, text: "Video call" },
  { value: EMPLOYER_VISIT_TYPE.PHONE, text: "Phone call" },
];
