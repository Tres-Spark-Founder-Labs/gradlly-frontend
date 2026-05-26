"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { InputField } from "@/components/form/InputField";
import Button from "@/components/ui/Button";
import { PORTAL } from "@/config/portal.config";
import { useCooldownTimer } from "@/features/auth/hooks/useCooldownTimer";
import { useForgotPassword } from "@/features/auth/queries/auth.query";
import {
  forgotPasswordDefaults,
  forgotPasswordSchema,
} from "@/features/auth/schemas";
import { applyServerErrors } from "@/lib/errors";
import { formatCountdown } from "@/utils/helper";

/**
 * Email form for initiating a password reset.
 *
 * - Enforces a 5-minute cooldown between requests via localStorage so the
 *   counter survives page reloads.
 * - Calls onSuccess(email) when the API returns OK so the parent view can
 *   transition to the success state.
 */
export function ForgotPasswordForm({ onSuccess }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: forgotPasswordDefaults,
    mode: "onBlur",
  });

  const { mutateAsync, isPending, error: serverError } = useForgotPassword();
  const {
    secondsLeft,
    canAct: canSend,
    isReady,
    triggerCooldown,
  } = useCooldownTimer(PORTAL.forgotPassword);

  const isFormDisabled = isSubmitting || isPending;

  const onSubmit = async (values) => {
    try {
      await mutateAsync(values);
      triggerCooldown();
      onSuccess(values.email);
    } catch (error) {
      applyServerErrors(error, setError);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <ServerErrorAlert showFieldList error={serverError} />

      <fieldset disabled={isFormDisabled} className="contents space-y-4">
        <InputField
          required
          name="email"
          label="Email address"
          type="email"
          placeholder="you@yourorganisation.com"
          autoComplete="email"
          register={register}
          error={errors.email?.message}
        />
        {!isReady ? (
          <div className="h-10 w-full rounded-lg bg-neutral-100 animate-pulse" />
        ) : canSend ? (
          <Button
            type="submit"
            loading={isFormDisabled}
            disabled={isFormDisabled}
            fullWidth
          >
            Send reset link
          </Button>
        ) : (
          <div className="rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-center text-sm">
            <p className="text-amber-700">
              Next request available in{" "}
              <span className="font-semibold tabular-nums text-amber-900">
                {formatCountdown(secondsLeft)}
              </span>
            </p>
          </div>
        )}
      </fieldset>

      <p className="text-center text-sm text-gray-500 pt-2 pb-4">
        Remembered your password?{" "}
        <Link href="/login" className="text-primary-700 font-semibold">
          Back to login
        </Link>
      </p>
    </form>
  );
}
