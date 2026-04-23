"use client";

import {
  AuthCard,
  AuthDivider,
  AuthFooter,
  AuthFormSection,
  AuthHeader,
  AuthInputGroup,
  AuthLegalText,
  AuthProviderButton,
  AuthStatusBanner,
  PasswordField,
} from "@gradlly/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { apprenticeAuthContent } from "./login-content";

const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  rememberMe: z.boolean(),
});

type LoginSchema = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async () => {
    setFormError(null);
    await new Promise((resolve) => {
      setTimeout(resolve, 450);
    });
    setFormError(
      "We could not sign you in right now. Please check your details and try again.",
    );
  };

  return (
    <AuthCard>
      <AuthHeader
        title="Sign in"
        subtitle="Securely access your learning dashboard."
        icon={apprenticeAuthContent.accentIcon}
      />
      {formError ? (
        <AuthStatusBanner
          type="error"
          title="Sign in failed"
          message={formError}
        />
      ) : null}
      <AuthFormSection onSubmit={handleSubmit(onSubmit)}>
        <AuthProviderButton providerLabel="Continue with GOV.UK One Login" />
        <AuthDivider />
        <AuthInputGroup
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <PasswordField
          id="password"
          label="Password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <label className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-[var(--color-border)] text-[var(--portal-accent)] focus:ring-[var(--portal-accent)]"
            {...register("rememberMe")}
          />
          Keep me signed in
        </label>
        <div className="flex items-center justify-between gap-3 text-sm">
          <Link
            href="#"
            className="text-[var(--portal-accent)] underline-offset-2 hover:underline"
          >
            Forgot password?
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-[var(--portal-accent)] px-4 py-2 font-medium text-[var(--portal-accent-fg)] transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--portal-accent)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </AuthFormSection>
      <AuthFooter>
        <p>{apprenticeAuthContent.supportText}</p>
      </AuthFooter>
      <AuthLegalText>{apprenticeAuthContent.legalText}</AuthLegalText>
    </AuthCard>
  );
}
