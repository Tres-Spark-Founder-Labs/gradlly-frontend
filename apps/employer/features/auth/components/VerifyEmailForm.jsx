"use client";

import { Loader2, Mail, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import Button from "@/components/ui/Button";
import { PORTAL } from "@/config/portal.config";
import { useCooldownTimer } from "@/features/auth/hooks/useCooldownTimer";
import {
  useResendVerification,
  useVerifyEmail,
} from "@/features/auth/queries/auth.query";
import { formatCountdown, maskEmail } from "@/utils/helper";

export function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email") ?? "";

  const {
    mutate: verify,
    isPending: isVerifying,
    error: verifyError,
  } = useVerifyEmail();

  const {
    mutateAsync: resend,
    isPending: isResending,
    error: resendError,
  } = useResendVerification();

  const {
    secondsLeft,
    canAct: canResend,
    isReady,
    triggerCooldown,
  } = useCooldownTimer(PORTAL.emailVerification);

  // Fire once on mount — guard prevents double-invoke in React strict mode
  const didVerify = useRef(false);
  useEffect(() => {
    if (token && !didVerify.current) {
      didVerify.current = true;
      verify({ token });
    }
  }, [token, verify]);

  const handleResend = async () => {
    try {
      await resend({ email });
      triggerCooldown();
    } catch {
      null;
    }
  };

  // ── Token mode: user arrived via the email link ───────────────────────────
  if (token) {
    return (
      <div className="space-y-6">
        {isVerifying && (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary-50">
              <Loader2 className="size-6 animate-spin text-primary-600" />
            </div>
            <p className="text-sm text-neutral-500">
              Verifying your email address…
            </p>
          </div>
        )}

        {verifyError && (
          <>
            <ServerErrorAlert error={verifyError} />
            {email ? (
              <ResendSection
                email={email}
                canResend={canResend}
                isReady={isReady}
                isResending={isResending}
                secondsLeft={secondsLeft}
                onResend={handleResend}
                resendError={resendError}
              />
            ) : (
              <p className="text-center text-sm text-neutral-500">
                The link may have expired.{" "}
                <Link href="/login" className="font-semibold text-primary-700">
                  Go to login
                </Link>
              </p>
            )}
          </>
        )}
      </div>
    );
  }

  // ── No-token mode: post-signup, waiting for user to click email link ──────
  return (
    <div className="space-y-6">
      {email && (
        <div className="flex items-center gap-3 rounded-xl border border-primary-100 bg-primary-50 px-4 py-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-100">
            <Mail aria-hidden="true" className="size-4 text-primary-700" />
          </div>
          <p className="text-sm text-neutral-700">
            Link sent to{" "}
            <span className="font-semibold text-neutral-900">
              {maskEmail(email)}
            </span>
          </p>
        </div>
      )}

      <ServerErrorAlert error={resendError} />

      <ResendSection
        email={email}
        canResend={canResend}
        isReady={isReady}
        isResending={isResending}
        secondsLeft={secondsLeft}
        onResend={handleResend}
      />
    </div>
  );
}

function ResendSection({
  email,
  canResend,
  isReady,
  isResending,
  secondsLeft,
  onResend,
}) {
  return (
    <div className="border-t border-neutral-100 pt-5 text-center">
      <p className="mb-3 text-sm text-neutral-500">
        Didn&apos;t receive the email?
      </p>

      {!isReady ? (
        <div className="h-9 w-52 mx-auto rounded-lg bg-neutral-100 animate-pulse" />
      ) : canResend ? (
        <Button
          type="button"
          color="green"
          variant="outline"
          size="sm"
          loading={isResending}
          disabled={isResending || !email}
          onClick={onResend}
          startIcon={<RefreshCw className="size-3.5" />}
        >
          Resend verification email
        </Button>
      ) : (
        <p className="text-sm text-neutral-400">
          Resend available in{" "}
          <span className="font-semibold tabular-nums text-primary-700">
            {formatCountdown(secondsLeft)}
          </span>
        </p>
      )}
    </div>
  );
}
