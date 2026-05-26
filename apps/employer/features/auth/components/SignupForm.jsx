"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { CheckboxField } from "@/components/form/CheckboxField";
import { InputField } from "@/components/form/InputField";
import Button from "@/components/ui/Button";
import { applyServerErrors } from "@/lib/errors";

import { useSignup } from "../queries/auth.query";
import { signupDefaults, signupSchema } from "../schemas";

export function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: signupDefaults,
    mode: "onBlur",
  });

  const { mutateAsync, isPending, error } = useSignup();
  const disabled = isSubmitting || isPending;

  const onSubmit = async (values) => {
    try {
      const { acceptTerms: _omit, ...payload } = values;
      await mutateAsync(payload);
    } catch (error) {
      applyServerErrors(error, setError);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <ServerErrorAlert showFieldList error={error} />

      <fieldset disabled={disabled} className="contents space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <InputField
            name="firstName"
            label="First Name"
            required
            placeholder="John"
            register={register}
            error={errors.firstName?.message}
          />
          <InputField
            name="lastName"
            label="Last Name"
            required
            placeholder="Doe"
            register={register}
            error={errors.lastName?.message}
          />
        </div>

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

        <InputField
          required
          name="password"
          label="Password"
          type="password"
          placeholder="Min. 8 characters"
          autoComplete="new-password"
          register={register}
          error={errors.password?.message}
        />

        <CheckboxField
          required
          description="By creating an account you agree to our Terms of Service and Privacy Policy."
          name="acceptTerms"
          label="Terms and Conditions"
          register={register}
          error={errors.acceptTerms?.message}
        />

        <div>
          <Button
            loading={disabled}
            disabled={disabled}
            fullWidth
            type="submit"
          >
            Create Account
          </Button>
          <p className="text-center text-sm text-gray-500 pt-2 pb-4">
            Already have an account?{" "}
            <Link href="/login" className="text-primary-700 font-semibold">
              Log in
            </Link>
          </p>
        </div>
      </fieldset>
    </form>
  );
}
