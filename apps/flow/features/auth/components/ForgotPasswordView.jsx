"use client";

import { useState } from "react";

import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { ForgotPasswordSuccess } from "./ForgotPasswordSuccess";

/**
 * Client wrapper that owns the form → success state transition.
 * Kept separate from page.jsx so the server component can still export metadata.
 */
export function ForgotPasswordView() {
  const [submittedEmail, setSubmittedEmail] = useState(null);

  if (submittedEmail) {
    return (
      <>
        <div className="mb-6 sm:mb-8">
          <p className="mb-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#2d7a50]">
            Account recovery
          </p>
          <h1 className="mb-2 text-2xl sm:text-3xl font-bold tracking-tight text-[#111827] leading-tight">
            Check your inbox
          </h1>
          <p className="text-sm sm:text-base leading-relaxed text-[#6b7280]">
            We&apos;ve sent a password reset link to your email address.
          </p>
        </div>

        <ForgotPasswordSuccess email={submittedEmail} />
      </>
    );
  }

  return (
    <>
      <div className="mb-6 sm:mb-8">
        <p className="mb-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#2d7a50]">
          Account recovery
        </p>
        <h1 className="mb-2 text-2xl sm:text-3xl font-bold tracking-tight text-[#111827] leading-tight">
          Forgot your password?
        </h1>
        <p className="text-sm sm:text-base leading-relaxed text-[#6b7280]">
          Enter your email and we&apos;ll send you a link to reset your
          password.
        </p>
      </div>

      <ForgotPasswordForm onSuccess={setSubmittedEmail} />
    </>
  );
}
