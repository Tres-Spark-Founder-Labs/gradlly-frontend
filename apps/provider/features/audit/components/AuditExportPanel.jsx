"use client";

import { AlertCircle, Shield } from "lucide-react";
import { useState } from "react";

import { InputField } from "@/components/form/InputField";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { toastSuccess } from "@/hooks/useToast";
import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

/** Every entry in scope, unpaged — or an error. See AuditExportService.exportAll. */
const COMPLETE_EXPORT_PATH = "/api/v1/audit/export/all";

/** A picked day's first and last millisecond, in the viewer's own time zone. */
function dayBoundary(value, end) {
  if (!value) return undefined;
  const [y, m, d] = value.split("-").map(Number);
  return end
    ? new Date(y, m - 1, d, 23, 59, 59, 999).toISOString()
    : new Date(y, m - 1, d, 0, 0, 0, 0).toISOString();
}

/**
 * The provider's audit log export, for compliance review (NFR audit logging:
 * every mutation, immutable, seven years).
 *
 * ── WHAT THIS USED TO DO ────────────────────────────────────────────────────
 *
 * It called the paginated `/audit/export` with no page parameters, received
 * the default twenty rows, and saved them as "the audit log" — a file that
 * said nothing about the rest, handed to an inspector as if it were complete.
 *
 * ── WHAT IT DOES NOW ────────────────────────────────────────────────────────
 *
 * It reads the complete export, which the API serves whole or not at all.
 * The file carries its own scope — organisation, range, total, time of
 * export — and is saved only if the entries it holds match that total. A
 * range too large for one file comes back 413 and is shown here, on the
 * screen, with the count, instead of a short file.
 *
 * The date range is the one filter this panel offers, because it is the one
 * that makes an over-large export possible to take in parts.
 */
export function AuditExportPanel() {
  const [loading, setLoading] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [problem, setProblem] = useState(null);
  const [lastTotal, setLastTotal] = useState(null);

  const rangeInvalid = Boolean(from && to && from > to);

  const handleExport = async () => {
    setProblem(null);
    setLastTotal(null);
    setLoading(true);
    try {
      const params = {};
      const fromIso = dayBoundary(from, false);
      const toIso = dayBoundary(to, true);
      if (fromIso) params.from = fromIso;
      if (toIso) params.to = toIso;

      const result = await $apiClient.get(COMPLETE_EXPORT_PATH, { params });
      const exported = result.data?.data ?? null;
      const entries = exported?.entries;

      // Belt and braces: never save a file whose entries do not match the
      // total it declares.
      if (
        !Array.isArray(entries) ||
        typeof exported.total !== "number" ||
        entries.length !== exported.total
      ) {
        setProblem(
          `The export came back incomplete (${Array.isArray(entries) ? entries.length : 0} entries against a declared ${exported?.total ?? "unknown"}). No file was saved.`,
        );
        return;
      }

      const blob = new Blob([JSON.stringify(exported, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `audit-export-${from || "start"}-to-${to || new Date().toISOString().slice(0, 10)}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
      setLastTotal(exported.total);
      toastSuccess(
        `Audit export downloaded: ${exported.total.toLocaleString("en-GB")} entries.`,
      );
    } catch (e) {
      // Shown in the panel, not only as a toast: a refused export (413, too
      // many entries for one file) has to be read and acted on.
      setProblem(normalizeApiClientError(e).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <p className="eyebrow">Compliance</p>
        <h2 className="mt-0.5 text-base font-semibold text-neutral-900">
          Audit log export
        </h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-neutral-600">
          Download every audit event in the range as JSON for compliance review.
          Leave the dates empty to export the whole log. The file states its
          range and how many entries it holds.
        </p>
        <div className="flex flex-wrap items-end gap-3">
          <div className="w-44">
            <InputField
              name="audit-export-from"
              label="From"
              type="date"
              value={from}
              max={to || undefined}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
          <div className="w-44">
            <InputField
              name="audit-export-to"
              label="To"
              type="date"
              value={to}
              min={from || undefined}
              onChange={(e) => setTo(e.target.value)}
              error={rangeInvalid ? "Must be on or after From" : undefined}
            />
          </div>
          <Button
            onClick={handleExport}
            loading={loading}
            disabled={rangeInvalid}
            leftIcon={Shield}
          >
            Export audit log
          </Button>
        </div>

        {problem ? (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-lg bg-danger-50 px-3 py-2 text-sm text-danger-600"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>{problem}</span>
          </p>
        ) : null}
        {lastTotal !== null && !problem ? (
          <p className="text-xs text-neutral-500">
            Last export: {lastTotal.toLocaleString("en-GB")} entries, every one
            in the range.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
