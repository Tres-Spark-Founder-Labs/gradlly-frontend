"use client";

import { useId, useState, type InputHTMLAttributes } from "react";

import { AuthInputGroup } from "./AuthInputGroup";

interface PasswordFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string;
  error?: string | undefined;
}

export function PasswordField({
  label = "Password",
  error,
  id,
  ...props
}: PasswordFieldProps) {
  const generatedId = useId();
  const inputId = id ?? `password-${generatedId}`;
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <AuthInputGroup
        id={inputId}
        label={label}
        error={error}
        type={visible ? "text" : "password"}
        className="pr-10"
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        className="absolute top-8 right-3 rounded-md p-1 text-xs text-[var(--color-text-tertiary)] transition hover:text-[var(--color-text-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--portal-accent)]"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
}
