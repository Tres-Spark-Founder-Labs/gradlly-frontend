import { cn } from "@gradlly/utils";

import type { FormHTMLAttributes, PropsWithChildren } from "react";

interface AuthFormSectionProps
  extends
    PropsWithChildren,
    Omit<FormHTMLAttributes<HTMLFormElement>, "children"> {
  className?: string;
}

export function AuthFormSection({
  className,
  children,
  ...props
}: AuthFormSectionProps) {
  return (
    <form className={cn("space-y-4", className)} noValidate {...props}>
      {children}
    </form>
  );
}
