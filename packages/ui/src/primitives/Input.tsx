import { cn } from "@gradlly/utils";

import type { InputHTMLAttributes } from "react";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800",
        "placeholder:text-slate-400 focus:border-[var(--dashboard-primary)] focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}
