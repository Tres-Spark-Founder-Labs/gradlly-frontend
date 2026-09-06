"use client";

import { CalendarRange } from "lucide-react";
import { useMemo, useState } from "react";

import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

import { MAX_MONTHS, MONTH_CSV_COLUMNS } from "../constants";
import {
  LoadingRow,
  NothingStoredYet,
  SaveStatus,
  errorText,
} from "./form-primitives";
import {
  useReplaceMonthlySeries,
  useStoredMonthly,
} from "../queries/levy-data.query";
import { parseMonthCsv } from "../utils/parse-month-csv";

/** Stored rows → the paste format, so what loads is what can be edited. */
function toCsv(rows) {
  return rows.map((r) => `${r.month},${r.contributions},${r.spend}`).join("\n");
}

/**
 * The monthly contribution and spend series (F1.1.3).
 *
 * ── WHY THIS FORM LOADS BEFORE IT SAVES ─────────────────────────────────────
 *
 * The write is PUT: it replaces the organisation's whole series. Opening a
 * blank box and pasting one corrected month would delete the other eleven, and
 * the request would succeed. So the box opens containing the stored rows, and
 * returns to them after a save.
 *
 * It is pre-populated from GET /das/manual/levy-monthly rather than from
 * /reporting/levy-utilisation, which the chart uses. That endpoint types
 * contributions and spend as numbers and has no currency field at all — save it
 * back unchanged and every month's currency silently becomes the default.
 *
 * ── THE PASTE REJECTS RATHER THAN SALVAGES ──────────────────────────────────
 *
 * A malformed paste imports nothing and names the row and column that failed.
 * Importing the rows that parsed would leave a chart that still looks like a
 * year, in which "spend fell in August" and "August did not import" are the
 * same picture.
 */
export function MonthlySeriesForm() {
  const stored = useStoredMonthly();
  const save = useReplaceMonthlySeries();

  const storedCsv = useMemo(() => toCsv(stored.data ?? []), [stored.data]);

  // `null` means "showing what is stored". Any edit takes over; clearing it
  // after a save re-derives from the refetched rows.
  const [draft, setDraft] = useState(null);
  const [attempted, setAttempted] = useState(false);

  const text = draft ?? storedCsv;
  const dirty = draft !== null;

  const parsed = useMemo(() => parseMonthCsv(text), [text]);

  // The parse error appears only once a save has been attempted, so nobody is
  // scolded halfway through typing a row.
  const parseError = attempted && !parsed.ok ? parsed.error : null;

  const storedCurrency = stored.data?.[0]?.currency;
  const storedCount = stored.data?.length ?? 0;

  const onSubmit = (e) => {
    e.preventDefault();
    setAttempted(true);
    if (!parsed.ok) return;

    // Currency is carried through from the stored rows rather than re-typed.
    // The paste format has three columns; without this the API default would
    // overwrite a non-GBP series on every save.
    const months = parsed.months.map((m) =>
      storedCurrency ? { ...m, currency: storedCurrency } : m,
    );

    save.mutate(months, {
      onSuccess: () => {
        setDraft(null);
        setAttempted(false);
      },
    });
  };

  const nothingStored = stored.isSuccess && storedCount === 0;

  return (
    <Card>
      <CardHeader className="flex items-center gap-3">
        <CalendarRange className="size-5 text-neutral-500" aria-hidden />
        <div>
          <h2 className="text-base font-semibold text-neutral-900">
            Monthly contributions and spend
          </h2>
          <p className="text-sm text-neutral-500">
            Up to {MAX_MONTHS} months. Paste straight from a spreadsheet.
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {stored.isLoading ? (
          <LoadingRow label="Loading the stored months…" />
        ) : null}

        {nothingStored ? (
          <NothingStoredYet>
            No months have been entered yet, so the monthly chart is empty.
          </NothingStoredYet>
        ) : null}

        <form onSubmit={onSubmit} className="space-y-3">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-neutral-800">
              Months
            </span>
            <span className="mb-2 block text-xs text-neutral-500">
              One row per month, in the order{" "}
              {MONTH_CSV_COLUMNS.map((c) => c.label).join(", ")} — for example{" "}
              <code className="rounded bg-neutral-100 px-1 py-0.5">
                {MONTH_CSV_COLUMNS.map((c) => c.example).join(",")}
              </code>
              . Months must run consecutively; enter{" "}
              <code className="rounded bg-neutral-100 px-1 py-0.5">0.00</code>{" "}
              for a month with no contribution rather than leaving it out.
            </span>
            <textarea
              value={text}
              onChange={(e) => setDraft(e.target.value)}
              rows={10}
              spellCheck={false}
              aria-invalid={!!parseError || undefined}
              className={[
                "w-full rounded-lg border px-3 py-2 font-mono text-sm",
                "text-neutral-900 focus:outline-none focus:ring-2",
                parseError
                  ? "border-red-400 focus:ring-red-200"
                  : "border-neutral-300 focus:border-neutral-400 focus:ring-neutral-200",
              ].join(" ")}
              placeholder={"2026-04,4100.00,2750.00\n2026-05,4100.00,3000.00"}
            />
          </label>

          <div className="flex items-center gap-3">
            <Button type="submit" loading={save.isPending}>
              Replace months
            </Button>
            {dirty ? (
              <Button
                type="button"
                variant="outline"
                color="black"
                onClick={() => {
                  setDraft(null);
                  setAttempted(false);
                }}
              >
                Discard changes
              </Button>
            ) : null}
          </div>

          <SaveStatus
            error={
              parseError ??
              (save.isError
                ? errorText(save.error, "The months could not be saved.")
                : null)
            }
            success={
              save.isSuccess && !dirty
                ? `Saved. ${storedCount} month${
                    storedCount === 1 ? "" : "s"
                  } stored — this replaced the whole series.`
                : null
            }
          />

          <p className="text-xs text-neutral-500">
            Saving replaces every stored month, not just the ones you changed.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
