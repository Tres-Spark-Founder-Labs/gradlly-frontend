"use client";

import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useState, forwardRef } from "react";

import { cn } from "@/utils/helper";

// ─── InputField ───────────────────────────────────────────────────────────────
export const InputField = forwardRef(function InputField(
  {
    label,
    name,
    type = "text",
    placeholder,
    autoComplete,
    error,
    required = false,
    disabled = false,
    register,
    ...rest
  },
  ref,
) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  const registration =
    register?.(name, {
      required: required ? `${label ?? "This field"} is required` : false,
    }) ?? {};

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          {label}
          {required && (
            <span className="ml-0.5 text-red-500" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div className="relative">
        <input
          ref={ref}
          id={name}
          type={inputType}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={error ? "true" : "false"}
          aria-required={required}
          aria-describedby={error ? `${name}-error` : undefined}
          placeholder={placeholder}
          className={cn(
            "w-full text-sm rounded-lg px-3.5 py-2.5 border transition-colors duration-150",
            "bg-white text-gray-900 placeholder:text-gray-400",
            "focus:outline-none hover:border-neutral-300",
            error
              ? "border-red-400 focus:border-red-500"
              : "border-gray-200 focus:border-blue-400",
            disabled && "bg-gray-50 text-gray-400 cursor-not-allowed",
            type === "password" && "pr-10",
          )}
          {...registration}
          {...rest}
        />

        {type === "password" && !disabled && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((p) => !p)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Eye className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      {error && (
        <p
          id={`${name}-error`}
          role="alert"
          className="mt-1 flex items-start gap-1 text-xs font-normal text-red-600"
        >
          <AlertCircle className="w-3 h-3 shrink-0" aria-hidden="true" />
          <span className="leading-none">{error}</span>
        </p>
      )}
    </div>
  );
});
InputField.displayName = "InputField";
