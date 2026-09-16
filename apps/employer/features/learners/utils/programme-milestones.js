/**
 * Recent activity for the learner profile drawer.
 *
 * This module used to build the programme's milestones too — from planned
 * dates, reviews and any open break — because the profile aggregate carried
 * none. Both tabs that show the programme now read
 * `GET /enrolments/:id/journey`, which carries the milestones with their own
 * statuses, so the constructed builder is gone rather than left as a fallback
 * that looks like the real thing. What remains is the one derivation the
 * aggregate genuinely supports: an ordering of the events it timestamps.
 */

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
