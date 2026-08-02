"use client";

import { FileText, Lock, Save, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { SingleSelectField } from "@/components/form/SingleSelectField";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";

import { LockedBadge, SarSectionEditor } from "./SarSectionEditor";
import {
  academicYearOptions,
  currentAcademicYear,
  SAR_STATUS,
} from "../constants";
import {
  useDownloadSarDocx,
  useGenerateSarReport,
  useLockSarReport,
  useSarReports,
  useUpdateSarReport,
} from "../queries/ofsted.query";

function MetricRow({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1">
      <span className="text-xs text-neutral-500">{label}</span>
      <span className="text-sm font-semibold tabular-nums text-neutral-800">
        {value}
      </span>
    </div>
  );
}

/** `null` is not zero, and on a self-assessment the difference matters. */
function rate(value) {
  return value === null || value === undefined
    ? "Not yet measurable"
    : `${value}%`;
}

function MetricsSummary({ metrics }) {
  if (!metrics) return null;
  const outcomes = metrics.outcomes ?? {};
  const qip = metrics.qip ?? {};

  return (
    <div className="grid grid-cols-1 gap-x-6 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 sm:grid-cols-2">
      <MetricRow
        label="Overall EIF readiness"
        value={
          metrics.eifOverallPercent === null ||
          metrics.eifOverallPercent === undefined
            ? "Not yet measurable"
            : `${metrics.eifOverallPercent}%`
        }
      />
      <MetricRow
        label="QIP complete"
        value={`${qip.completed ?? 0} of ${qip.total ?? 0} (${qip.percentComplete ?? 0}%)`}
      />
      <MetricRow label="In learning" value={outcomes.activeCount ?? 0} />
      <MetricRow label="Completions" value={outcomes.completedCount ?? 0} />
      <MetricRow
        label="EPA pass rate"
        value={
          outcomes.epaAssessedCount
            ? `${outcomes.epaPassRate}% of ${outcomes.epaAssessedCount}`
            : "No outcomes yet"
        }
      />
      <MetricRow
        label="Review compliance"
        value={rate(metrics.reviewComplianceRate)}
      />
      <MetricRow label="Withdrawal rate" value={rate(metrics.withdrawalRate)} />
    </div>
  );
}

/**
 * F2.1.3 — the Self-Assessment Report.
 *
 * The platform assembles the evidence; the provider writes the judgement.
 * Nothing here ever picks a grade for them.
 */
export function SarPanel({ canManage = true }) {
  const { data: reports = [], isLoading } = useSarReports();
  const [selectedId, setSelectedId] = useState(null);
  const [draftSections, setDraftSections] = useState(null);
  const [lockOpen, setLockOpen] = useState(false);
  const [year, setYear] = useState(() => currentAcademicYear());

  const { mutateAsync: generate, isPending: generating } =
    useGenerateSarReport();
  const { mutateAsync: save, isPending: saving } = useUpdateSarReport();
  const { mutateAsync: lock, isPending: locking } = useLockSarReport();
  const { mutate: download, isPending: downloading } = useDownloadSarDocx();

  const yearOptions = useMemo(() => academicYearOptions(), []);

  // Default to the newest report until the user picks another.
  const report = useMemo(() => {
    if (!reports.length) return null;
    return reports.find((r) => r.id === selectedId) ?? reports[0];
  }, [reports, selectedId]);

  const locked = report?.status === SAR_STATUS.LOCKED;
  // Local edits win until saved; otherwise show what the server holds.
  const sections = draftSections ?? report?.sections ?? [];
  const dirty = draftSections !== null;

  const patchSection = (next) => {
    setDraftSections(
      (sections ?? []).map((s) => (s.key === next.key ? next : s)),
    );
  };

  const handleGenerate = async () => {
    const created = await generate(year).catch(() => null);
    if (created?.id) {
      setSelectedId(created.id);
      setDraftSections(null);
    }
  };

  const handleSave = async () => {
    if (!report || !draftSections) return;
    await save({
      id: report.id,
      sections: draftSections.map((s) => ({
        key: s.key,
        narrative: s.narrative,
        grade: s.grade,
      })),
    }).catch(() => null);
    setDraftSections(null);
  };

  const handleLock = async () => {
    if (!report) return;
    // Save first, or the lock freezes a version missing their last edits.
    if (draftSections) await handleSave();
    await lock(report.id).catch(() => null);
    setLockOpen(false);
  };

  return (
    <Card>
      <CardContent className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <FileText className="size-4 text-neutral-400" aria-hidden />
            <h2 className="text-base font-semibold text-neutral-900">
              Self-Assessment Report
            </h2>
            {locked ? <LockedBadge lockedAt={report.lockedAt} /> : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {reports.length > 0 ? (
              <div className="w-36">
                <SingleSelectField
                  name="sarYear"
                  options={reports.map((r) => ({
                    value: r.id,
                    text: r.academicYear,
                  }))}
                  value={report?.id ?? ""}
                  setValue={(_, v) => {
                    setSelectedId(v);
                    setDraftSections(null);
                  }}
                  searchable={false}
                />
              </div>
            ) : null}

            {report ? (
              <Button
                size="sm"
                variant="outline"
                startIcon={<FileText className="size-4" />}
                disabled={downloading}
                onClick={() =>
                  download({
                    id: report.id,
                    academicYear: report.academicYear,
                  })
                }
              >
                {downloading ? "Preparing…" : "Word"}
              </Button>
            ) : null}

            {canManage && report && !locked ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  startIcon={<Save className="size-4" />}
                  onClick={handleSave}
                  disabled={!dirty || saving}
                >
                  {saving ? "Saving…" : "Save"}
                </Button>
                <Button
                  size="sm"
                  color="green"
                  startIcon={<Lock className="size-4" />}
                  onClick={() => setLockOpen(true)}
                  disabled={locking}
                >
                  Lock
                </Button>
              </>
            ) : null}
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm text-neutral-400">Loading…</p>
        ) : !report ? (
          <div className="space-y-3 rounded-xl border border-dashed border-neutral-300 px-4 py-6 text-center">
            <p className="text-sm text-neutral-500">
              No self-assessment yet. Generating one fills each section with
              your current EIF scores, QIP progress, learner outcomes, review
              compliance and withdrawal rate — the judgement and grades are
              yours to write.
            </p>
            {canManage ? (
              <div className="flex flex-wrap items-center justify-center gap-2">
                <div className="w-36">
                  <SingleSelectField
                    name="sarNewYear"
                    options={yearOptions}
                    value={year}
                    setValue={(_, v) => setYear(v)}
                    searchable={false}
                  />
                </div>
                <Button
                  size="sm"
                  color="green"
                  startIcon={<Sparkles className="size-4" />}
                  onClick={handleGenerate}
                  disabled={generating}
                >
                  {generating ? "Generating…" : "Generate draft"}
                </Button>
              </div>
            ) : null}
          </div>
        ) : (
          <>
            <MetricsSummary metrics={report.metrics} />

            {locked ? (
              <p className="text-xs text-neutral-400">
                Figures frozen when this report was locked. It cannot be edited
                — that is what makes it a record of the year.
              </p>
            ) : (
              <p className="text-xs text-neutral-400">
                Figures are live and will move until you lock this report.
              </p>
            )}

            <div className="space-y-6">
              {sections.map((section) => (
                <SarSectionEditor
                  key={section.key}
                  section={section}
                  locked={locked || !canManage}
                  onChange={patchSection}
                />
              ))}
            </div>
          </>
        )}
      </CardContent>

      <Modal
        open={lockOpen}
        onClose={() => setLockOpen(false)}
        busy={locking || saving}
        icon={<Lock className="size-4.5" strokeWidth={1.85} aria-hidden />}
        title={`Lock the ${report?.academicYear ?? ""} SAR?`}
        description="This cannot be undone."
        footer={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setLockOpen(false)}
              disabled={locking || saving}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              color="green"
              onClick={handleLock}
              loading={locking || saving}
              disabled={locking || saving}
              startIcon={<Lock className="size-4" />}
            >
              Lock report
            </Button>
          </div>
        }
      >
        <p className="text-sm text-neutral-600">
          Locking saves your current text, freezes every figure as it stands
          today, and makes the report permanently read-only. That is the point:
          a self-assessment you can still change afterwards is not a record of
          what you judged at the time.
        </p>
        <p className="mt-3 text-sm text-neutral-600">
          There is no unlock. You can still generate a SAR for a different
          academic year.
        </p>
      </Modal>
    </Card>
  );
}
