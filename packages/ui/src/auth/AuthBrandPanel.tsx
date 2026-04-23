import { cn } from "@gradlly/utils";

interface AuthBrandPanelProps {
  portalName: string;
  headline: string;
  description: string;
  bullets?: string[];
  accentLabel?: string;
  className?: string;
  "data-testid"?: string;
}

export function AuthBrandPanel({
  portalName,
  headline,
  description,
  bullets = [],
  accentLabel,
  className,
  "data-testid": dataTestId,
}: AuthBrandPanelProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-col justify-between rounded-2xl border border-[var(--color-border)] bg-[linear-gradient(145deg,var(--portal-header-bg),var(--portal-sidebar-bg))] p-8 text-[var(--color-text-inverse)] shadow-xl shadow-slate-900/25",
        className,
      )}
      data-testid={dataTestId}
    >
      <div className="space-y-5">
        <p className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          {portalName}
        </p>
        <h1 className="text-3xl font-semibold text-white">{headline}</h1>
        <p className="text-sm text-slate-100">{description}</p>
        {bullets.length > 0 ? (
          <ul
            className="space-y-2"
            aria-label={`${portalName} value highlights`}
          >
            {bullets.map((bullet) => (
              <li
                key={bullet}
                className="flex items-start gap-2 text-sm text-slate-100"
              >
                <span
                  className="mt-0.5 block h-2 w-2 shrink-0 rounded-full bg-white"
                  aria-hidden="true"
                />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      {accentLabel ? (
        <p className="rounded-xl bg-white/10 p-3 text-xs text-slate-100">
          {accentLabel}
        </p>
      ) : null}
    </div>
  );
}
