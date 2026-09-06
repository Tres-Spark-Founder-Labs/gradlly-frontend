import { REVIEW_STATUS, REVIEW_STATUS_LABELS } from "../constants";

/**
 * The programme's milestones, built from what the API actually reports.
 *
 * ── WHAT THIS REPLACES ──────────────────────────────────────────────────────
 *
 * The drawer used to render a fixed six-milestone ladder — enrolment, 6-month
 * review, 12-month review, gateway, mock EPA, EPA — with hardcoded dates and
 * hardcoded statuses, identical for every apprentice. It showed "01 Mar 2024"
 * and "6-month review completed. Progressing well." for a learner enrolled last
 * week. Nothing on it was true and nothing on it could become true.
 *
 * ── THE STATUSES, AND WHY THERE ARE FIVE ────────────────────────────────────
 *
 * Only reviews carry a state on the API. Programme start, planned end and EPA
 * are *planned dates* with no completion record attached, so a planned end date
 * in the past does not mean the programme ended — it means the date passed and
 * nothing has confirmed what happened. Collapsing that into "complete" is the
 * inference that makes a drawer lie: it hides the exact case an employer needs
 * to chase.
 *
 *   complete   the API says so (a completed review)
 *   overdue    the API says so (review.isOverdue)
 *   scheduled  a real date, still ahead
 *   passed     a real date, now behind, with nothing confirming the event
 *   unknown    no date recorded — shown as missing, never inferred
 *
 * `date` is null for `unknown`. Callers render DATE_NOT_RECORDED rather than
 * computing a plausible one from the dates either side of it.
 */

/** @param {string|null|undefined} iso */
function isPast(iso) {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  return Number.isFinite(t) && t < Date.now();
}

/** A planned date with no completion record: passed, scheduled, or unknown. */
function plannedStatus(iso) {
  if (!iso) return "unknown";
  return isPast(iso) ? "passed" : "scheduled";
}

function reviewStatus(review) {
  if (review.status === REVIEW_STATUS.COMPLETED) return "complete";
  if (review.status === REVIEW_STATUS.CANCELLED) return "cancelled";
  if (review.isOverdue) return "overdue";
  return review.scheduledAt && isPast(review.scheduledAt)
    ? "passed"
    : "scheduled";
}

/**
 * @param {object|null|undefined} profile a LearnerProfileResponseDto
 * @returns {{key: string, label: string, date: string|null, status: string,
 *   detail: string|null}[]}
 */
export function buildProgrammeMilestones(profile) {
  if (!profile) return [];

  const programme = profile.programme ?? {};
  const reviews = Array.isArray(profile.reviews) ? profile.reviews : [];
  const bil = profile.breakInLearning ?? {};

  const milestones = [
    {
      key: "programme-start",
      label: "Programme start",
      date: programme.plannedStartDate ?? null,
      status: plannedStatus(programme.plannedStartDate),
      detail: programme.standardTitle ?? null,
    },
  ];

  // Reviews in the order the API scheduled them. They are numbered rather than
  // named "6-month" / "12-month": the API does not say which is which, and
  // guessing from the gap since the start date invents a fact.
  reviews
    .slice()
    .sort((a, b) => String(a.scheduledAt).localeCompare(String(b.scheduledAt)))
    .forEach((review, i) => {
      const signatures = [];
      if (review.tutorSigned) signatures.push("tutor signed");
      if (review.apprenticeSigned) signatures.push("apprentice signed");

      milestones.push({
        key: `review-${review.id}`,
        label: `Review ${i + 1}`,
        date: review.scheduledAt ?? null,
        status: reviewStatus(review),
        detail: signatures.length
          ? `${REVIEW_STATUS_LABELS[review.status] ?? review.status} · ${signatures.join(", ")}`
          : (REVIEW_STATUS_LABELS[review.status] ?? review.status),
      });
    });

  // Only while a break is actually open. A closed break is history the API does
  // not return, so there is nothing to place on the timeline.
  if (bil.active) {
    milestones.push({
      key: "break-in-learning",
      label: "Break in learning",
      // The break's own start is not in the response; the return date is.
      date: bil.expectedReturnDate ?? null,
      status: bil.expectedReturnDate ? "scheduled" : "unknown",
      detail: bil.expectedReturnDate
        ? `Expected back${bil.reason ? ` · ${bil.reason}` : ""}`
        : (bil.reason ?? "No expected return date recorded"),
    });
  }

  milestones.push(
    {
      key: "planned-end",
      label: "Planned end",
      date: programme.plannedEndDate ?? null,
      status: plannedStatus(programme.plannedEndDate),
      detail: null,
    },
    {
      key: "epa",
      label: "End-point assessment",
      date: programme.epaDate ?? null,
      status: plannedStatus(programme.epaDate),
      detail: programme.epaOrganisationName
        ? `${programme.epaOrganisationName}${
            programme.epaOrganisationUkprn
              ? ` (${programme.epaOrganisationUkprn})`
              : ""
          }`
        : "No EPA organisation appointed yet",
    },
  );

  return milestones;
}

/**
 * Everything that has actually happened on this enrolment, newest first.
 *
 * Built from the two things the API records with a timestamp: off-the-job
 * sessions and provider interventions. `recentActivity` used to be hardcoded to
 * `[]` in normalizeApprentice, so the tab rendered an empty list and looked like
 * a learner who had done nothing.
 */
export function buildRecentActivity(profile) {
  if (!profile) return [];

  const entries = Array.isArray(profile.otj?.recentEntries)
    ? profile.otj.recentEntries
    : [];
  const interventions = Array.isArray(
    profile.breakInLearning?.recentInterventions,
  )
    ? profile.breakInLearning.recentInterventions
    : [];

  const items = [
    ...entries.map((e) => ({
      key: `otj-${e.id}`,
      kind: "otj",
      at: e.loggedDate,
      minutes: e.minutes,
      status: e.status,
      title: e.activityName,
      flaggedAt: e.flaggedAt ?? null,
      flagNote: e.flagNote ?? null,
    })),
    ...interventions.map((i) => ({
      key: `intervention-${i.id}`,
      kind: "intervention",
      at: i.createdAt,
      actionType: i.actionType,
      notes: i.notes ?? null,
    })),
  ];

  // Undated items would sort unpredictably and imply a position they do not
  // have, so they sink to the bottom rather than being dropped or guessed at.
  return items.sort((a, b) => {
    if (!a.at) return 1;
    if (!b.at) return -1;
    return String(b.at).localeCompare(String(a.at));
  });
}
