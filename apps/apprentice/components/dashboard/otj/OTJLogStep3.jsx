import { CheckCircle } from "lucide-react";

const SUMMARY_ROWS = (form) => [
  { label: "Activity", value: form.title },
  { label: "Category", value: form.category },
  { label: "Date", value: form.date },
  { label: "Hours", value: `${form.hours}h`, accent: true },
];

export function OTJLogStep3({ form, ksbs }) {
  return (
    <div className="flex flex-col items-center text-center py-2 gap-5">
      <div
        className="w-16 h-16 rounded-full bg-success-100 flex items-center justify-center"
        style={{ animation: "slide-up 320ms var(--ease-out) both" }}
      >
        <CheckCircle size={32} className="text-success-600" strokeWidth={1.5} />
      </div>

      <div>
        <h3 className="text-base font-semibold text-neutral-900">
          Nice work, Jamie!
        </h3>
        <p className="text-sm text-neutral-500 mt-1 max-w-xs mx-auto">
          Session submitted and pending approval from your training provider.
        </p>
      </div>

      <div
        className="w-full rounded-xl bg-neutral-50 border border-neutral-100 p-4 text-left space-y-3"
        style={{ animation: "slide-up 320ms var(--ease-out) 80ms both" }}
      >
        {SUMMARY_ROWS(form).map(({ label, value, accent }) => (
          <div key={label} className="flex items-start justify-between gap-4">
            <span className="text-xs text-neutral-400 shrink-0">{label}</span>
            <span
              className={
                accent
                  ? "text-xs font-bold text-primary-700"
                  : "text-xs font-medium text-neutral-700 text-right"
              }
            >
              {value}
            </span>
          </div>
        ))}

        {ksbs.length > 0 && (
          <div className="flex items-start justify-between gap-4">
            <span className="text-xs text-neutral-400 shrink-0">KSBs</span>
            <div className="flex flex-wrap gap-1 justify-end">
              {ksbs.map((k) => (
                <span
                  key={k}
                  className="text-xs bg-primary-50 text-primary-700 border border-primary-100 px-1.5 py-0.5 rounded"
                >
                  {k}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
