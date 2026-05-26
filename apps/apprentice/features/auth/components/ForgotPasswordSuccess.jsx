"use client";

import { Mail, RefreshCw } from "lucide-react";
import Link from "next/link";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import Button from "@/components/ui/Button";
import { PORTAL } from "@/config/portal.config";
import { useCooldownTimer } from "@/features/auth/hooks/useCooldownTimer";
import { useForgotPassword } from "@/features/auth/queries/auth.query";
import { formatCountdown, maskEmail } from "@/utils/helper";

/**
 * Post-submission success state for the forgot-password flow.
 *
 * Shares the same localStorage timer as ForgotPasswordForm so the countdown
 * is continuous whether the user is on the form or success view.
 */
export function ForgotPasswordSuccess({ email }) {
  const {
    mutateAsync: resend,
    isPending: isResending,
    error: resendError,
  } = useForgotPassword();

  const {
    secondsLeft,
    canAct: canSend,
    isReady,
    triggerCooldown,
  } = useCooldownTimer(PORTAL.forgotPassword);

  const handleResend = async () => {
    try {
      await resend({ email });
      triggerCooldown();
    } catch {
      null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary-50">
          <Mail aria-hidden="true" className="size-7 text-primary-600" />
        </div>

        <div className="space-y-1.5">
          <p className="text-sm font-medium text-neutral-800">
            Reset link sent to{" "}
            <span className="font-semibold text-neutral-900">
              {maskEmail(email)}
            </span>
          </p>
          <p className="text-sm text-neutral-500">
            Click the link in your inbox to set a new password. It expires in 1
            hour.
          </p>
        </div>
      </div>

      <ServerErrorAlert error={resendError} />

      <div className="border-t border-neutral-100 pt-5 text-center">
        <p className="mb-3 text-sm text-neutral-500">Didn&apos;t receive it?</p>

        {!isReady ? (
          <div className="h-9 w-52 mx-auto rounded-lg bg-neutral-100 animate-pulse" />
        ) : canSend ? (
          <Button
            type="button"
            color="green"
            variant="outline"
            size="sm"
            loading={isResending}
            disabled={isResending || !email}
            onClick={handleResend}
            startIcon={<RefreshCw className="size-3.5" />}
          >
            Resend reset link
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

      <p className="text-center text-sm text-gray-500 pt-2 pb-4">
        <Link href="/login" className="font-semibold text-primary-700">
          Back to login
        </Link>
      </p>
    </div>
  );
}
