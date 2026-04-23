import { cn } from "@gradlly/utils";

type StatusType = "error" | "success" | "info";

interface AuthStatusBannerProps {
  title: string;
  message?: string;
  type?: StatusType;
}

const styles: Record<StatusType, string> = {
  error:
    "border-[var(--color-error)] bg-[var(--color-error-subtle)] text-[var(--color-error-fg)]",
  success:
    "border-[var(--color-success)] bg-[var(--color-success-subtle)] text-[var(--color-success-fg)]",
  info: "border-[var(--color-info)] bg-[var(--color-info-subtle)] text-[var(--color-info-fg)]",
};

const symbols: Record<StatusType, string> = {
  error: "⚠️",
  success: "✅",
  info: "ℹ️",
};

export function AuthStatusBanner({
  title,
  message,
  type = "info",
}: AuthStatusBannerProps) {
  return (
    <div
      className={cn("mb-4 rounded-xl border p-3", styles[type])}
      role="alert"
    >
      <p className="flex items-start gap-2 text-sm font-medium">
        <span aria-hidden="true">{symbols[type]}</span>
        <span>{title}</span>
      </p>
      {message ? <p className="mt-1 text-xs">{message}</p> : null}
    </div>
  );
}
