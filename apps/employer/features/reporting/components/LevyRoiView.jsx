"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { useLevyRoi } from "@/features/reporting/queries/reporting.query";

function formatCurrency(amount, currency = "GBP") {
  if (amount === null || amount === undefined) return "—";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function StatCard({ label, value, hint }) {
  return (
    <Card>
      <CardContent className="py-4">
        <p className="text-xs text-neutral-500">{label}</p>
        <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
        {hint ? (
          <p className="mt-0.5 text-[11px] text-neutral-400">{hint}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

/**
 * F1.4.1 AC3 — a year-on-year delta.
 *
 * Renders nothing at all when there is no prior-year baseline. A "0%" chip
 * against an absent baseline reads as "no change" when it actually means "we
 * have nothing to compare against", and this report is explicitly for board
 * investment decisions.
 */
function DeltaChip({ value, unit = "%" }) {
  if (value === null || value === undefined) return null;
  const positive = value > 0;
  const flat = value === 0;
  const tone = flat
    ? "bg-neutral-100 text-neutral-600"
    : positive
      ? "bg-emerald-50 text-emerald-700"
      : "bg-red-50 text-red-700";
  return (
    <span
      className={`ml-2 rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ${tone}`}
    >
      {positive ? "+" : ""}
      {value}
      {unit}
    </span>
  );
}

export function LevyRoiView() {
  const { data, isLoading } = useLevyRoi();

  if (isLoading) {
    return <p className="text-sm text-neutral-400">Loading levy ROI report…</p>;
  }

  if (!data) {
    return (
      <p className="text-sm text-neutral-500">
        Levy ROI data is not available for your organisation.
      </p>
    );
  }

  const currency = data.currency ?? "GBP";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-neutral-900">Levy ROI</h2>
        <p className="mt-0.5 text-sm text-neutral-500">
          Return on apprenticeship levy investment.
        </p>
      </div>

      {/**
       * F1.4.1 AC1 names six figures. Three of them — completions, EPA pass
       * rate and average cost per completion — were absent from this view
       * entirely, though two were already in the API response.
       */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total levy spend"
          value={formatCurrency(data.totalLevySpendToDate, currency)}
        />
        <StatCard
          label="Available balance"
          value={formatCurrency(data.availableBalance, currency)}
        />
        <StatCard
          label="Utilisation"
          value={
            data.utilisationPercent !== null &&
            data.utilisationPercent !== undefined
              ? `${Math.round(data.utilisationPercent)}%`
              : "—"
          }
        />
        <StatCard
          label="Active apprentices"
          value={data.activeApprenticeCount ?? "—"}
        />
        <StatCard label="Completions" value={data.completionCount ?? "—"} />
        <StatCard
          label="EPA pass rate"
          value={
            data.epaPassRate === null || data.epaPassRate === undefined
              ? "—"
              : `${data.epaPassRate}%`
          }
          // The denominator matters: 100% from two apprentices and 100% from
          // forty are different facts.
          hint={
            data.epaPassRate === null || data.epaPassRate === undefined
              ? "No apprentices assessed yet"
              : `${data.epaAssessedCount} assessed`
          }
        />
        <StatCard
          label="Avg cost per completion"
          value={formatCurrency(data.averageCostPerCompletion, currency)}
        />
        <StatCard
          label="Productivity uplift (est.)"
          value={formatCurrency(data.estimatedProductivityUplift, currency)}
        />
      </div>

      {/* F1.4.1 AC3 — "available where historical data exists". */}
      {data.yearOnYear ? (
        <Card>
          <CardHeader>
            <h3 className="text-sm font-semibold text-neutral-900">
              Year on year
            </h3>
            <p className="mt-0.5 text-xs text-neutral-500">
              {data.yearOnYear.currentPeriod?.label}
              {data.yearOnYear.hasPriorPeriodData
                ? ` vs ${data.yearOnYear.priorPeriod?.label}`
                : ""}
            </p>
          </CardHeader>
          <CardContent>
            {!data.yearOnYear.hasPriorPeriodData ? (
              <p className="text-sm text-neutral-500">
                No prior-year data is recorded for your organisation yet, so
                there is nothing to compare this period against.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-neutral-500">Starts</p>
                  <p className="font-semibold tabular-nums text-neutral-800">
                    {data.yearOnYear.currentPeriod.starts}
                    <span className="text-neutral-400">
                      {" "}
                      vs {data.yearOnYear.priorPeriod.starts}
                    </span>
                    <DeltaChip value={data.yearOnYear.startsChangePercent} />
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Completions</p>
                  <p className="font-semibold tabular-nums text-neutral-800">
                    {data.yearOnYear.currentPeriod.completions}
                    <span className="text-neutral-400">
                      {" "}
                      vs {data.yearOnYear.priorPeriod.completions}
                    </span>
                    <DeltaChip
                      value={data.yearOnYear.completionsChangePercent}
                    />
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Levy spend</p>
                  <p className="font-semibold tabular-nums text-neutral-800">
                    {formatCurrency(
                      data.yearOnYear.currentPeriod.levySpend,
                      currency,
                    )}
                    <span className="text-neutral-400">
                      {" "}
                      vs{" "}
                      {formatCurrency(
                        data.yearOnYear.priorPeriod.levySpend,
                        currency,
                      )}
                    </span>
                    <DeltaChip value={data.yearOnYear.levySpendChangePercent} />
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500">EPA pass rate</p>
                  <p className="font-semibold tabular-nums text-neutral-800">
                    {data.yearOnYear.currentPeriod.epaPassRate === null
                      ? "—"
                      : `${data.yearOnYear.currentPeriod.epaPassRate}%`}
                    <span className="text-neutral-400">
                      {" "}
                      vs{" "}
                      {data.yearOnYear.priorPeriod.epaPassRate === null
                        ? "—"
                        : `${data.yearOnYear.priorPeriod.epaPassRate}%`}
                    </span>
                    {/* Points, not percent: 50% → 75% is +25 points. */}
                    <DeltaChip
                      value={data.yearOnYear.epaPassRatePointChange}
                      unit=" pts"
                    />
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <h3 className="text-sm font-semibold text-neutral-900">Forecast</h3>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs text-neutral-500">Projected monthly spend</p>
            <p className="font-semibold tabular-nums text-neutral-800">
              {formatCurrency(data.forecast?.projectedMonthlySpend, currency)}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">Completion liability</p>
            <p className="font-semibold tabular-nums text-neutral-800">
              {formatCurrency(
                data.forecast?.projectedCompletionLiability,
                currency,
              )}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">Estimated runway</p>
            <p className="font-semibold tabular-nums text-neutral-800">
              {data.forecast?.estimatedRunwayMonths !== null &&
              data.forecast?.estimatedRunwayMonths !== undefined
                ? `${data.forecast.estimatedRunwayMonths} months`
                : "—"}
            </p>
          </div>
        </CardContent>
      </Card>

      {data.monthlyContributions?.length ? (
        <Card>
          <CardHeader>
            <h3 className="text-sm font-semibold text-neutral-900">
              Monthly contributions
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.monthlyContributions.map((row) => (
                <div
                  key={row.month}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="font-mono text-neutral-600">
                    {row.month}
                  </span>
                  <span className="tabular-nums text-neutral-800">
                    {formatCurrency(row.amount, currency)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
