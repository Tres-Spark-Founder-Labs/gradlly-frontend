"use client";

import { CheckCircle2, Clock, RotateCcw } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { useLevyVocabulary } from "@/features/levy-exchange/queries/levy-exchange.query";
import { ERROR_CODES } from "@/lib/errors";
import { formatDateTime } from "@/utils/helper";

import { RegistrationStepForm } from "./RegistrationStepForm";
import { WizardStepper } from "./WizardStepper";
import {
  REGISTRATION_RESUME_TOKEN_KEY,
  REGISTRATION_STATUS,
  WIZARD_STEPS,
} from "../constants";
import {
  useCompleteRegistration,
  useCreateRegistrationSession,
  useRegistrationSession,
} from "../queries/registration.query";
import { registrationPrefill } from "../schemas";

function readStoredToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REGISTRATION_RESUME_TOKEN_KEY);
}

function storeToken(token) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(REGISTRATION_RESUME_TOKEN_KEY, token);
  else window.localStorage.removeItem(REGISTRATION_RESUME_TOKEN_KEY);
}

export function RegistrationWizard() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState(readStoredToken);

  const createSession = useCreateRegistrationSession({
    onSuccess: (data) => {
      if (data?.resumeToken) {
        storeToken(data.resumeToken);
        setToken(data.resumeToken);
      }
    },
  });

  const handleReset = useCallback(() => {
    storeToken(null);
    setToken(null);
  }, []);

  // A bad/expired token (404/410) drops the stale token so the user can start
  // fresh. Resetting from the query's onError keeps setState out of an effect.
  const { data: session, isLoading } = useRegistrationSession(token, {
    onError: (err) => {
      if (err?.code === ERROR_CODES.NOT_FOUND) handleReset();
    },
  });

  const complete = useCompleteRegistration(token);

  // The vocabulary decides whether a region hint in the URL is still valid.
  // Public, so it loads before sign-in like the eligibility checker's.
  const vocabularyQuery = useLevyVocabulary();

  // A region hint can only be checked once the vocabulary has answered, so
  // Start waits for that — and only when there is a region hint to check. If
  // the vocabulary fails, isLoading ends and the hint is simply dropped:
  // nothing about an old URL may stop this person starting.
  const checkingRegionHint =
    Boolean(searchParams.get("region")) && vocabularyQuery.isLoading;

  const handleStart = useCallback(() => {
    // Seed sector/region from the eligibility check when arriving via its CTA
    // — as prefill, filtered leniently; see registrationPrefill for why the
    // URL is treated differently from a value the person picked.
    createSession.mutate(
      registrationPrefill(searchParams, vocabularyQuery.data),
    );
  }, [createSession, searchParams, vocabularyQuery.data]);

  // ── No session yet: start screen ────────────────────────────────────────────
  if (!token) {
    return (
      <StartScreen
        onStart={handleStart}
        loading={createSession.isPending || checkingRegionHint}
        error={createSession.error}
      />
    );
  }

  if (isLoading && !session) {
    return <p className="text-sm text-neutral-400">Loading your session…</p>;
  }

  // ── Completed ────────────────────────────────────────────────────────────────
  if (session?.status === REGISTRATION_STATUS.COMPLETED) {
    return <CompletedScreen session={session} onReset={handleReset} />;
  }

  // ── Expired ──────────────────────────────────────────────────────────────────
  if (session?.status === REGISTRATION_STATUS.EXPIRED) {
    return (
      <StartScreen
        onStart={handleStart}
        loading={createSession.isPending || checkingRegionHint}
        error={createSession.error}
        expired
      />
    );
  }

  const currentStep = session?.currentStep ?? WIZARD_STEPS[0];
  const currentIndex = WIZARD_STEPS.indexOf(currentStep);
  const allStepsSaved = currentIndex >= WIZARD_STEPS.length - 1;
  // "consent" is the last step; once it's saved the server keeps currentStep at
  // consent but a completedAt appears — until then we still show the step form.

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Onboarding</p>
        <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-neutral-900">
          ESFA employer registration
        </h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-neutral-500">
          <Clock className="size-3.5" aria-hidden />
          Resume any time — expires{" "}
          {session?.expiresAt
            ? formatDateTime(session.expiresAt)
            : "in 30 days"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <WizardStepper currentStep={currentStep} />
        </CardHeader>
        <CardContent className="space-y-6 pt-2">
          <RegistrationStepForm
            key={currentStep}
            token={token}
            step={currentStep}
            stepPayload={session?.stepPayload}
          />

          {allStepsSaved ? (
            <div className="border-t border-neutral-100 pt-5">
              <p className="mb-3 text-sm text-neutral-600">
                All steps saved. Submit to finish and we’ll set up your
                organisation.
              </p>
              {complete.error ? (
                <p className="mb-3 text-sm text-danger-600" role="alert">
                  {complete.error.message}
                </p>
              ) : null}
              <Button
                color="green"
                loading={complete.isPending}
                onClick={() => complete.mutate({})}
                startIcon={<CheckCircle2 className="size-4" />}
              >
                Complete registration
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <button
        type="button"
        onClick={handleReset}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400 transition-colors hover:text-neutral-600"
      >
        <RotateCcw className="size-3" aria-hidden />
        Start over
      </button>
    </div>
  );
}

function StartScreen({ onStart, loading, error, expired = false }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Onboarding</p>
        <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-neutral-900">
          ESFA employer registration
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          A short 5-step setup for your Digital Apprenticeship Service account.
          You can pause and resume from this device any time.
        </p>
      </div>
      <Card>
        <CardContent className="space-y-4 pt-6">
          <p className="text-sm text-neutral-600">
            {expired
              ? "Your previous session expired. Start a new one to continue — it only takes a few minutes."
              : "No account needed to start — we’ll create your organisation once you finish."}
          </p>
          {error ? (
            <p className="text-sm text-danger-600" role="alert">
              {error.message}
            </p>
          ) : null}
          <Button color="green" loading={loading} onClick={onStart}>
            Start registration
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function CompletedScreen({ session, onReset }) {
  return (
    <Card>
      <CardContent className="space-y-4 py-10 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-green-50 text-green-600">
          <CheckCircle2 className="size-6" aria-hidden />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">
            Registration submitted
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Your organisation is being set up
            {session?.completedAt
              ? ` (submitted ${formatDateTime(session.completedAt)})`
              : ""}
            . We’ve emailed a confirmation — once your account is ready, sign in
            to your FlowPortal dashboard.
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <Button href="/login" color="green">
            Go to sign in
          </Button>
          <Button variant="neutral" color="black" onClick={onReset}>
            Start another
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
