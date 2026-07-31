/**
 * Enrolment submission (F1.2.5).
 *
 * Enrolling an apprentice is five API calls, not one. The drawer previously
 * made two — create apprentice, create enrolment — and reported success. That
 * left a DRAFT enrolment with no provider, no line manager, and no invitation
 * sent, while telling the employer "Enrolment submitted. Commitment statement
 * generated within 24 hours." Nothing generated anything: activation is what
 * sends the apprentice their magic link (AC3), notifies the provider (AC4) and
 * starts the pipeline (AC5), and it was never called.
 *
 * The sequence is ordered by dependency:
 *
 *   1. apprentice          — the enrolment needs an apprenticeId
 *   2. enrolment (draft)   — everything below needs an enrolmentId
 *   3. organisation links  — the provider must be attached before activation,
 *                            or there is nobody to notify
 *   4. participants        — the line manager, who receives F1.2.4's at-risk
 *                            alerts
 *   5. activate            — sends the invitation and the provider notice
 *
 * Steps 1 and 2 are fatal: without them there is no enrolment at all. Steps
 * 3-5 are reported as warnings rather than thrown, because by then the records
 * exist and rolling them back would lose the employer's typing. The caller is
 * told exactly what did not happen instead of being shown a green tick over a
 * half-finished enrolment.
 */

export const ENROL_REQUIRED_FIELDS = Object.freeze([
  "firstName",
  "lastName",
  "email",
  "standard",
  "provider",
  "manager",
  "startDate",
]);

const FIELD_LABELS = Object.freeze({
  firstName: "First name",
  lastName: "Last name",
  email: "Email address",
  standard: "Apprenticeship standard",
  provider: "Training provider",
  manager: "Line manager",
  startDate: "Start date",
});

/**
 * Which fields are missing.
 *
 * `employeeId` and `jobTitle` are offered but not required: AC1 lists them
 * among the fields an employer can enter, and an employer that does not use
 * payroll references should not be blocked from enrolling anyone.
 */
export function missingEnrolFields(form = {}) {
  return ENROL_REQUIRED_FIELDS.filter(
    (field) => !String(form[field] ?? "").trim(),
  ).map((field) => ({ field, label: FIELD_LABELS[field] }));
}

export function isEnrolFormComplete(form) {
  return missingEnrolFields(form).length === 0;
}

/** Trimmed, or undefined so optional fields are omitted rather than sent as "". */
function optional(value) {
  const trimmed = String(value ?? "").trim();
  return trimmed === "" ? undefined : trimmed;
}

export function buildApprenticePayload(form) {
  return {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    email: form.email.trim(),
    employeeId: optional(form.employeeId),
    jobTitle: optional(form.jobTitle),
  };
}

export function buildEnrolmentPayload(form, apprenticeId) {
  return {
    apprenticeId,
    standardId: form.standard,
    ...(optional(form.startDate) && { plannedStartDate: form.startDate }),
  };
}

/**
 * Runs the sequence. Dependencies are injected so this can be tested without
 * a network or a React tree.
 *
 * Returns `{ apprenticeId, enrolmentId, activated, warnings }`. Throws only
 * when there is no enrolment to speak of.
 */
export async function runEnrolment(deps, form, { orgId } = {}) {
  const warnings = [];

  const apprentice = await deps.createApprentice({
    orgId,
    body: buildApprenticePayload(form),
  });
  const apprenticeId = apprentice?.id;
  if (!apprenticeId) {
    throw new Error("The apprentice was created but the API returned no id.");
  }

  const enrolment = await deps.createEnrolment({
    orgId,
    body: buildEnrolmentPayload(form, apprenticeId),
  });
  const enrolmentId = enrolment?.id;
  if (!enrolmentId) {
    throw new Error("The enrolment was created but the API returned no id.");
  }

  // The employer link is set explicitly rather than assumed: the enrolment's
  // owning organisation and its employer organisation are separate columns,
  // and the row-level security policies that let an employer read OTJ logs and
  // reviews key off `employerOrganisationId`, not the owner.
  let providerLinked = false;
  try {
    await deps.linkOrganisations({
      orgId,
      id: enrolmentId,
      body: {
        employerOrganisationId: orgId,
        providerOrganisationId: form.provider,
      },
    });
    providerLinked = true;
  } catch (error) {
    warnings.push({
      step: "links",
      message: `The training provider could not be attached (${messageOf(error)}). They will not be notified until it is.`,
    });
  }

  try {
    await deps.setParticipants({
      orgId,
      id: enrolmentId,
      body: { employerManagerUserId: form.manager },
    });
  } catch (error) {
    warnings.push({
      step: "manager",
      message: `The line manager could not be attached (${messageOf(error)}). They will not receive OTJ approvals or at-risk alerts.`,
    });
  }

  let activated = false;
  try {
    await deps.activate({ orgId, id: enrolmentId });
    activated = true;
  } catch (error) {
    warnings.push({
      step: "activate",
      message: `The enrolment was saved as a draft but could not be activated (${messageOf(error)}). The apprentice has not been invited${providerLinked ? " and the provider has not been notified" : ""}.`,
    });
  }

  return { apprenticeId, enrolmentId, activated, warnings };
}

function messageOf(error) {
  return error?.message || "unknown error";
}

/** One line summarising the outcome, honest about partial success. */
export function summariseEnrolment(result) {
  if (!result) return "";
  if (result.activated && result.warnings.length === 0) {
    return "Apprentice enrolled. We have emailed them an invitation and notified the provider.";
  }
  if (result.activated) {
    return "Apprentice enrolled and invited, but some details need attention.";
  }
  return "Apprentice saved as a draft enrolment. It has not been activated.";
}
