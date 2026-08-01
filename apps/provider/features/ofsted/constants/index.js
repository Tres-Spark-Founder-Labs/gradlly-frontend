export const OFSTED_PATHS = Object.freeze({
  eifCriteria: "/api/v1/ofsted/eif-criteria",
  eifScores: "/api/v1/ofsted/eif-scores",
  // F2.1.1 AC5 — twelve-month trend from the nightly snapshot.
  eifScoreTrend: "/api/v1/ofsted/eif-scores/trend",

  qipActions: "/api/v1/qip-actions",
  qipActionById: (id) => `/api/v1/qip-actions/${id}`,
  qipSummary: "/api/v1/qip-actions/summary",
  // F2.1.2 AC5 — the plan as an inspection document.
  qipExport: "/api/v1/qip-actions/export",
  // F2.1.2 — progress only; cannot reach the plan's content.
  qipActionProgress: (id) => `/api/v1/qip-actions/${id}/progress`,

  safeguardingChecklist: "/api/v1/ofsted/safeguarding-checklist",
  safeguardingItem: (slug) => `/api/v1/ofsted/safeguarding-checklist/${slug}`,

  programmeDocuments: (programmeId) =>
    `/api/v1/programmes/${programmeId}/documents`,

  evidencePacks: "/api/v1/ofsted/evidence-packs",
  evidencePackById: (id) => `/api/v1/ofsted/evidence-packs/${id}`,
});

// ─── RAG ─────────────────────────────────────────────────────────────────────
export const EIF_RAG = Object.freeze({
  RED: "red",
  AMBER: "amber",
  GREEN: "green",
});

// ─── EIF criterion slugs (display fallback; source from API) ─────────────────
export const EIF_CRITERION_LABELS = Object.freeze({
  curriculum_intent: "Curriculum intent",
  curriculum_implementation: "Curriculum implementation",
  curriculum_impact: "Curriculum impact",
  behaviour_attitudes: "Behaviour and attitudes",
  personal_development: "Personal development",
  leadership_management: "Leadership and management",
  safeguarding: "Safeguarding",
});

// ─── QIP action status ───────────────────────────────────────────────────────
export const QIP_STATUS = Object.freeze({
  NOT_STARTED: "not_started",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
});

export const QIP_STATUS_LABELS = Object.freeze({
  not_started: "Not started",
  in_progress: "In progress",
  completed: "Completed",
});

export const QIP_STATUS_OPTIONS = [
  { value: QIP_STATUS.NOT_STARTED, text: "Not started" },
  { value: QIP_STATUS.IN_PROGRESS, text: "In progress" },
  { value: QIP_STATUS.COMPLETED, text: "Completed" },
];

export const QIP_STATUS_FILTER_OPTIONS = [
  { value: "", text: "All statuses" },
  ...QIP_STATUS_OPTIONS,
];

export const QIP_STATUS_VALUES = Object.values(QIP_STATUS);

// ─── Programme document types ────────────────────────────────────────────────
export const PROGRAMME_DOC_TYPE = Object.freeze({
  CURRICULUM_MAP: "curriculum_map",
  ASSESSMENT_STRATEGY: "assessment_strategy",
  INDUSTRY_ENGAGEMENT: "industry_engagement",
});

export const PROGRAMME_DOC_TYPE_LABELS = Object.freeze({
  curriculum_map: "Curriculum map",
  assessment_strategy: "Assessment strategy",
  industry_engagement: "Industry engagement",
});

// All three required for full curriculum-intent coverage.
export const PROGRAMME_DOC_TYPES = Object.values(PROGRAMME_DOC_TYPE);

// ─── Evidence pack job status ────────────────────────────────────────────────
export const EVIDENCE_PACK_STATUS = Object.freeze({
  QUEUED: "queued",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
});

export const EVIDENCE_PACK_TERMINAL = new Set([
  EVIDENCE_PACK_STATUS.COMPLETED,
  EVIDENCE_PACK_STATUS.FAILED,
]);

// ─── RAG helpers ─────────────────────────────────────────────────────────────
export function ragFromPercent(percent) {
  if (percent === null || percent === undefined) return EIF_RAG.RED;
  if (percent >= 80) return EIF_RAG.GREEN;
  if (percent >= 60) return EIF_RAG.AMBER;
  return EIF_RAG.RED;
}
