"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { InputField } from "@/components/form/InputField";
import Button from "@/components/ui/Button";
import { useVerifyMfaChallenge } from "@/features/auth/queries/auth.query";
import {
  mfaCodeDefaults,
  mfaCodeSchema,
  mfaRecoveryCodeDefaults,
  mfaRecoveryCodeSchema,
} from "@/features/auth/schemas";
import { applyServerErrors } from "@/lib/errors";

/**
 * Login step 2, shown after useLogin() resolves with { mfaRequired: true }.
 * Toggles between a 6-digit authenticator code and a one-time recovery code.
 */
export function MfaChallengeForm({ challengeToken, redirectTo, onBack }) {
  const [useRecoveryCode, setUseRecoveryCode] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(
      useRecoveryCode ? mfaRecoveryCodeSchema : mfaCodeSchema,
    ),
    defaultValues: useRecoveryCode ? mfaRecoveryCodeDefaults : mfaCodeDefaults,
    mode: "onSubmit",
  });

  const {
    mutateAsync,
    isPending,
    error: serverError,
  } = useVerifyMfaChallenge({ redirectTo });
  const disabled = isSubmitting || isPending;

  const onSubmit = async (values) => {
    try {
      await mutateAsync({ challengeToken, ...values });
    } catch (error) {
      applyServerErrors(error, setError);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <ServerErrorAlert error={serverError} />

      <p className="text-sm text-gray-500">
        {useRecoveryCode
          ? "Enter one of the recovery codes you saved when you set up MFA."
          : "Enter the 6-digit code from your authenticator app."}
      </p>

      <fieldset disabled={disabled} className="contents space-y-4">
        {useRecoveryCode ? (
          <InputField
            required
            name="recoveryCode"
            label="Recovery code"
            type="text"
            autoComplete="one-time-code"
            register={register}
            error={errors.recoveryCode?.message}
          />
        ) : (
          <InputField
            required
            name="code"
            label="Authenticator code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="123456"
            register={register}
            error={errors.code?.message}
          />
        )}

        <Button type="submit" loading={disabled} disabled={disabled} fullWidth>
          Verify and log in
        </Button>
      </fieldset>

      <div className="flex items-center justify-between pt-2 pb-4 text-sm">
        <button
          type="button"
          onClick={onBack}
          className="text-gray-500 hover:underline"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => setUseRecoveryCode((v) => !v)}
          className="text-primary-700 font-semibold hover:underline"
        >
          {useRecoveryCode ? "Use authenticator code" : "Use a recovery code"}
        </button>
      </div>
    </form>
  );
}
