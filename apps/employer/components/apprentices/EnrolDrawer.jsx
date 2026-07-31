"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Modal } from "@/components/ui/Modal";
import { APPRENTICE_QUERY_KEYS } from "@/features/apprentices/queries/keys";
import { createApprentice } from "@/features/apprentices/services/apprentices.service";
import {
  missingEnrolFields,
  runEnrolment,
  summariseEnrolment,
} from "@/features/apprentices/utils/enrol-flow";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { ENROLMENT_QUERY_KEYS } from "@/features/enrolments/queries/keys";
import {
  activateEnrolment,
  createEnrolment,
  updateEnrolmentOrganisationLinks,
  updateEnrolmentParticipants,
} from "@/features/enrolments/services/enrolments.service";
import { toastError, toastSuccess } from "@/hooks/useToast";

import { EnrolStep1 } from "./EnrolStep1";
import { EnrolStep2 } from "./EnrolStep2";
import { EnrolStep3 } from "./EnrolStep3";
import { StepIndicator } from "./StepIndicator";
import { T } from "./tokens";

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  employeeId: "",
  dob: "",
  nino: "",
  jobTitle: "",
  // Holds a user id now, not a typed name — the API stores
  // `employerManagerUserId` and the typed name had nowhere to go.
  manager: "",
  // No default. This was a hardcoded standard UUID, so an employer who never
  // touched the dropdown enrolled their apprentice on someone else's
  // apprenticeship standard.
  standard: "",
  provider: "",
  startDate: "",
  cohort: "",
};

/**
 * Reports what actually happened rather than a fixed message.
 *
 * The previous panel always said "Commitment statement generated within 24
 * hours", which nothing in the system does, on top of an enrolment that had
 * not been activated.
 */
function EnrolOutcome({ result }) {
  const clean = result.activated && result.warnings.length === 0;

  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <div
        className="h-16 w-16 rounded-full flex items-center justify-center text-3xl"
        style={{ backgroundColor: clean ? T.greenLight : T.amberLight }}
      >
        {clean ? "✓" : "!"}
      </div>
      <p
        className="text-lg font-bold"
        style={{ color: clean ? T.green : T.amber }}
      >
        {clean ? "Apprentice enrolled" : "Enrolled with issues"}
      </p>
      <p className="text-sm max-w-xs" style={{ color: T.subtle }}>
        {summariseEnrolment(result)}
      </p>
      {result.warnings.length > 0 && (
        <ul className="text-xs text-left space-y-1.5 max-w-sm">
          {result.warnings.map((warning) => (
            <li key={warning.step} style={{ color: T.subtle }}>
              • {warning.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function EnrolDrawer({ open, onClose }) {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [outcome, setOutcome] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);

  const qc = useQueryClient();
  const { orgId } = useAuthUser();

  const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleClose = () => {
    onClose();
    setStep(1);
    setDone(false);
    setOutcome(null);
    setForm(INITIAL_FORM);
  };

  /**
   * F1.2.5 — the full sequence, not just the first two calls.
   *
   * See `enrol-flow.js` for why this is five requests and which failures are
   * fatal. The previous version created an apprentice and a draft enrolment
   * and announced success, leaving the provider unlinked, the manager unset
   * and no invitation sent.
   */
  const submit = useMutation({
    mutationFn: () =>
      runEnrolment(
        {
          createApprentice,
          createEnrolment,
          linkOrganisations: updateEnrolmentOrganisationLinks,
          setParticipants: updateEnrolmentParticipants,
          activate: activateEnrolment,
        },
        form,
        { orgId },
      ),
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: APPRENTICE_QUERY_KEYS.list(orgId) });
      qc.invalidateQueries({ queryKey: ENROLMENT_QUERY_KEYS.list(orgId) });

      // Warnings are surfaced individually and the drawer stays open, because
      // each one names something the employer needs to go and fix.
      if (result.warnings.length > 0) {
        result.warnings.forEach((warning) => toastError(warning.message));
      } else {
        toastSuccess(summariseEnrolment(result));
      }

      setOutcome(result);
      setDone(true);
      if (result.warnings.length === 0) {
        setTimeout(handleClose, 2500);
      }
    },
    onError: (error) => {
      toastError(error.message || "Failed to submit enrolment.");
    },
  });

  const missing = missingEnrolFields(form);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="md"
      title="Enrol apprentice"
      description="Add a new learner to your apprenticeship programme"
      footer={
        !done && (
          <>
            <button
              type="button"
              onClick={() => (step > 1 ? setStep((s) => s - 1) : handleClose())}
              className="px-4 py-2 rounded-xl text-sm font-semibold border hover:opacity-75 transition-opacity"
              style={{ borderColor: T.border, color: T.subtle }}
            >
              {step > 1 ? "← Back" : "Cancel"}
            </button>
            {/* Submission is blocked until the required fields are present.
                Previously the button was always enabled and the missing
                provider and line manager simply went unsent. */}
            <button
              type="button"
              onClick={() =>
                step < 3 ? setStep((s) => s + 1) : submit.mutate()
              }
              disabled={submit.isPending || (step === 3 && missing.length > 0)}
              title={
                step === 3 && missing.length > 0
                  ? `Still needed: ${missing.map((m) => m.label).join(", ")}`
                  : undefined
              }
              className="px-5 py-2 rounded-xl text-sm font-bold hover:opacity-80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: step === 3 ? T.green : T.blue,
                color: "#fff",
              }}
            >
              {submit.isPending
                ? "Enrolling…"
                : step === 3
                  ? "Submit enrolment"
                  : "Next →"}
            </button>
          </>
        )
      }
    >
      {done && outcome ? (
        <EnrolOutcome result={outcome} />
      ) : (
        <div className="space-y-5">
          <StepIndicator current={step} total={3} />
          {step === 1 && <EnrolStep1 data={form} onChange={setField} />}
          {step === 2 && <EnrolStep2 data={form} onChange={setField} />}
          {step === 3 && <EnrolStep3 data={form} missing={missing} />}
        </div>
      )}
    </Modal>
  );
}
