"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { InputField } from "@/components/form/InputField";
import Button from "@/components/ui/Button";
import { useLogin } from "@/features/auth/queries/auth.query";
import { loginDefaults, loginSchema } from "@/features/auth/schemas";
import { applyServerErrors } from "@/lib/errors";

export function LoginForm() {
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

  const { mutateAsync, isPending, error: serverError } = useLogin();
  const disabled = isSubmitting || isPending;

  const onSubmit = async (values) => {
    try {
      await mutateAsync(values);
    } catch (error) {
      applyServerErrors(error, setError);
    }
  };

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

      <p className="text-center text-sm text-gray-500 pt-2 pb-4">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-primary-700 font-semibold">
          Sign up
        </Link>
      </p>
    </form>
  );
}
