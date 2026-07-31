"use client";
import { Download, X } from "lucide-react";

import { T } from "@/components/dashboard/levy/tokens";
import {
  useCommitmentVersionHistory,
  useDownloadSignedCommitment,
} from "@/features/commitments/queries/commitments.query";
import {
  partyStatusMeta,
  statementStatusLabel,
} from "@/features/commitments/utils/board";

/** Party keys the API returns, in signing order (COMMITMENT_SIGNING_ORDER). */
const PARTY_LABELS = Object.freeze({
  tutor: "Provider",
  employer_manager: "Employer",
  apprentice: "Apprentice",
});

function formatDate(iso) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** F1.3.2 AC5 — one version, with its dates and who signed it. */
function VersionCard({ version, isCurrent, onDownload, downloading }) {
  const published = formatDate(version.publishedAt);
  const superseded = formatDate(version.supersededAt);

  return (
    <div
      className="rounded-xl px-4 py-3 space-y-2"
      style={{
        backgroundColor: isCurrent ? T.blueLight : T.card,
        border: `1px solid ${isCurrent ? `${T.blue}30` : T.border}`,
      }}
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold" style={{ color: T.ink }}>
            Version {version.version}
          </span>
          {isCurrent && (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: T.blue, color: "#fff" }}
            >
              Current
            </span>
          )}
          <span className="text-[11px]" style={{ color: T.muted }}>
            {statementStatusLabel(version.status)}
          </span>
        </div>

        {/* AC6 — offered only once the PDF exists. A download button on an
            unsigned statement would fail when pressed. */}
        {version.finalSignedPdfKey && (
          <button
            type="button"
            onClick={() => onDownload(version.statementId)}
            disabled={downloading}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold hover:opacity-80 transition-opacity disabled:opacity-40"
            style={{ backgroundColor: "#f5f4f2", color: T.subtle }}
          >
            <Download className="h-3 w-3" />
            {downloading ? "Opening…" : "Signed PDF"}
          </button>
        )}
      </div>

      <div className="flex gap-4 text-[11px]" style={{ color: T.muted }}>
        {published && <span>Published {published}</span>}
        {superseded && <span>Replaced {superseded}</span>}
      </div>

      {/* AC5 — the signatories, with the date each one signed. */}
      <div className="space-y-1.5 pt-1">
        {version.signatories.length === 0 ? (
          <p className="text-[11px]" style={{ color: T.muted }}>
            Not yet sent for signature.
          </p>
        ) : (
          version.signatories.map((s) => {
            const meta = partyStatusMeta(s.signed ? "signed" : "pending");
            const signedOn = formatDate(s.signedAt);
            return (
              <div
                key={s.party}
                className="flex items-center justify-between gap-2 text-xs"
              >
                <span style={{ color: T.subtle }}>
                  {PARTY_LABELS[s.party] ?? s.party}
                  {s.name ? ` · ${s.name}` : ""}
                </span>
                <span className="flex items-center gap-2 shrink-0">
                  {signedOn && (
                    <span className="text-[11px]" style={{ color: T.muted }}>
                      {signedOn}
                    </span>
                  )}
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                    style={{ backgroundColor: meta.bg, color: meta.color }}
                  >
                    {meta.label}
                  </span>
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/**
 * F1.3.2 AC5 and AC6.
 *
 * This panel previously read `statement.apprenticeSigned`,
 * `statement.providerSigned` and `statement.employerSigned` — fields invented
 * by a client-side normaliser that mapped every status to a fixed guess: both
 * employer and provider were reported as signed whenever the statement was
 * signed, and the apprentice whenever it was merely awaiting signatures. So
 * the "who has signed" panel was inferred from a single status field rather
 * than read from the signatures. Its download button had no `onClick` at all.
 *
 * It now shows the real per-version signing history from the API.
 */
export function DocumentPanel({ statement, onClose }) {
  const groupId = statement?.groupId ?? null;
  const currentStatementId = statement?.statementId ?? statement?.id ?? null;

  const { data, isLoading } = useCommitmentVersionHistory(groupId);
  const { mutate: download, isPending: downloading } =
    useDownloadSignedCommitment();

  const versions = data?.versions ?? [];

  return (
    <>
      <div
        className="fixed inset-0 z-[230] bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="fixed right-0 top-0 h-full z-[240] flex flex-col shadow-2xl w-full sm:w-[460px]"
        style={{
          backgroundColor: T.surface,
          borderLeft: `1px solid ${T.border}`,
          animation: "slide-in-right 300ms cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        <div
          className="flex items-start justify-between gap-3 px-5 py-4 shrink-0"
          style={{ borderBottom: `1px solid ${T.border}` }}
        >
          <div>
            <p className="text-sm font-bold" style={{ color: T.ink }}>
              Commitment statement
            </p>
            <p className="text-xs mt-0.5" style={{ color: T.muted }}>
              {statement?.apprenticeName ?? "Apprentice"}
              {statement?.providerName ? ` · ${statement.providerName}` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-neutral-100 shrink-0"
            style={{ color: T.muted }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          <p
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: T.muted }}
          >
            Version history
          </p>

          {isLoading ? (
            <div
              className="h-24 rounded-xl animate-pulse"
              style={{ backgroundColor: T.card }}
            />
          ) : versions.length === 0 ? (
            <p className="text-xs" style={{ color: T.muted }}>
              No versions to show yet.
            </p>
          ) : (
            versions.map((version) => (
              <VersionCard
                key={version.statementId}
                version={version}
                isCurrent={version.statementId === currentStatementId}
                onDownload={download}
                downloading={downloading}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}
