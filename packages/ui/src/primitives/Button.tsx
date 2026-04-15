import { cn } from "@gradlly/utils";

import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps
  extends PropsWithChildren, ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--dashboard-primary)] text-white hover:bg-[var(--dashboard-accent)]",
  secondary:
    "bg-[var(--dashboard-secondary)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-hover)]",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
};

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dashboard-primary)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
