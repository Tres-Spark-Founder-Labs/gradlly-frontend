"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { InputField } from "@/components/form/InputField";
import Button from "@/components/ui/Button";
import { useLogin } from "@/features/auth/queries/auth.query";
import { loginDefaults, loginSchema } from "@/features/auth/schemas";
import { applyServerErrors } from "@/lib/errors";

import { MfaChallengeForm } from "./MfaChallengeForm";

export function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  // Invited users must sign in to the account that was invited, so creating a
  // new account here would break the flow. Hide the sign-up link in that case.
  const hideSignup = Boolean(
    redirect && redirect.includes("/accept-invitation"),
  );

  const [challengeToken, setChallengeToken] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: loginDefaults,
    mode: "onBlur",
  });

  const {
    mutateAsync,
    isPending,
    error: serverError,
  } = useLogin({ redirectTo: redirect });
  const disabled = isSubmitting || isPending;

  const onSubmit = async (values) => {
    try {
      const result = await mutateAsync(values);
      if (result?.mfaRequired) {
        setChallengeToken(result.challengeToken);
      }
    } catch (error) {
      applyServerErrors(error, setError);
    }
  };

  if (challengeToken) {
    return (
      <MfaChallengeForm
        challengeToken={challengeToken}
        redirectTo={redirect}
        onBack={() => setChallengeToken(null)}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <ServerErrorAlert showFieldList error={serverError} />

      <fieldset disabled={disabled} className="contents space-y-4">
        <InputField
          required
          name="email"
          label="Email"
          type="email"
          placeholder="you@yourorganisation.com"
          autoComplete="email"
          register={register}
          error={errors.email?.message}
        />

        <div className="space-y-1">
          <InputField
            required
            name="password"
            label="Password"
            type="password"
            placeholder="Your password"
            autoComplete="current-password"
            register={register}
            error={errors.password?.message}
          />
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-xs text-primary-700 font-medium hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button type="submit" loading={disabled} disabled={disabled} fullWidth>
          Log in
        </Button>
      </fieldset>

      {hideSignup ? (
        <p className="text-center text-sm text-gray-500 pt-2 pb-4">
          Sign in to accept your invitation.
        </p>
      ) : (
        <p className="text-center text-sm text-gray-500 pt-2 pb-4">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary-700 font-semibold">
            Sign up
          </Link>
        </p>
      )}
    </form>
  );
}
