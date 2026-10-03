/**
 * What a people picker says when it has nothing to offer.
 *
 * A blank dropdown is the worst of the possible answers: it looks broken and
 * tells the user nothing about what to do next. Each state here names a reason
 * and, where there is one, the action that fixes it.
 *
 * @param {boolean} loading          options are still being fetched
 * @param {string|null} enrolmentId  null when the form has no enrolment yet
 * @param {Array} options            what came back
 * @param {string} ready             prompt when there is something to choose
 * @param {string} empty             reason + next action when there is not
 */
export function participantPlaceholder(
  loading,
  enrolmentId,
  options,
  ready,
  empty,
) {
  if (!enrolmentId) return "Choose a learner first";
  if (loading) return "Loading people on this enrolment…";
  return options.length > 0 ? ready : empty;
}
