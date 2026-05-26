"use client";

import { AlertCircle, Check, Minus } from "lucide-react";
import { useState, forwardRef } from "react";

import { cn } from "@/utils/helper";

// ─── CheckboxField ────────────────────────────────────────────────────────────
export const CheckboxField = forwardRef(function CheckboxField(
  {
    label,
    name,
    description,
    error,
    required = false,
    disabled = false,
    indeterminate = false,
    // Controlled usage: pass both checked + onChange
    // Uncontrolled / register usage: pass register only
    checked,
    onChange,
    color = "#1e6b3a",
    register,
    ...rest
  },
  ref,
) {
  const isControlled = checked !== undefined;

  // Drives the custom visual in uncontrolled (register) mode
  const [internalChecked, setInternalChecked] = useState(false);

  const registration =
    register?.(name, {
      required: required ? `${label ?? "This field"} is required` : false,
    }) ?? {};

  // Merge: update internal visual state + forward to rHF + forward to caller
  const handleChange = (e) => {
    if (!isControlled) setInternalChecked(e.target.checked);
    registration.onChange?.(e);
    onChange?.(e);
  };

  const visualChecked = isControlled ? checked : internalChecked;
  const isFilled = visualChecked || indeterminate;

  const describedBy = [description && `${name}-desc`, error && `${name}-error`]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="w-full">
      <div className="flex items-start gap-3">
        <div className="relative shrink-0 mt-0.5">
          <input
            // forward ref to rHF without overriding registration.ref
            ref={(el) => {
              registration.ref?.(el);
              if (typeof ref === "function") ref(el);
              else if (ref) ref.current = el;
            }}
            id={name}
            type="checkbox"
            name={registration.name ?? name}
            checked={isControlled ? checked : undefined}
            disabled={disabled}
            aria-invalid={error ? "true" : "false"}
            aria-required={required}
            aria-describedby={describedBy || undefined}
            onChange={handleChange}
            onBlur={registration.onBlur}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer disabled:cursor-not-allowed"
            {...rest}
          />

          <div
            aria-hidden="true"
            style={
              isFilled && !error
                ? { background: color, borderColor: color }
                : undefined
            }
            className={cn(
              "w-5 h-5 rounded border-[1.5px] flex items-center justify-center",
              "transition-all duration-150 pointer-events-none",
              error
                ? isFilled
                  ? "bg-red-500 border-red-500"
                  : "border-red-400"
                : !isFilled && "border-gray-300",
              disabled && "opacity-50",
            )}
          >
            {indeterminate ? (
              <Minus className="w-3 h-3 text-white" strokeWidth={3} />
            ) : visualChecked ? (
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
            ) : null}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <label
            htmlFor={name}
            className={cn(
              "text-sm font-medium select-none leading-tight",
              disabled
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-800 cursor-pointer",
            )}
          >
            {label}
            {required && (
              <span className="ml-0.5 text-red-500" aria-hidden="true">
                *
              </span>
            )}
          </label>

          {description && (
            <p
              id={`${name}-desc`}
              className="mt-0.5 text-xs text-gray-500 leading-relaxed"
            >
              {description}
            </p>
          )}
        </div>
      </div>

      {error && (
        <p
          id={`${name}-error`}
          role="alert"
          className="mt-1 pl-8 flex items-start gap-1 text-xs font-normal text-red-600"
        >
          <AlertCircle className="w-3 h-3 shrink-0" aria-hidden="true" />
          <span className="leading-none">{error}</span>
        </p>
      )}
    </div>
  );
});
CheckboxField.displayName = "CheckboxField";
