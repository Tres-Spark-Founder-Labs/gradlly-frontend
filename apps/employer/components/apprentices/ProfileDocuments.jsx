"use client";

import { Download, ExternalLink, Loader2 } from "lucide-react";

import { LEARNER_DOC_TYPE_LABELS } from "@/features/learners/constants";
import { useDownloadObject } from "@/features/storage/queries/storage.query";
import { formatDate } from "@/utils/helper";

import { ProfileTabState } from "./ProfileTabState";
import { T } from "./tokens";

/**
 * Documents from `profile.documents`.
 *
 * ── WHAT WAS HERE BEFORE ────────────────────────────────────────────────────
 *
 * `const docs = a?.documents ?? DOCS` — and `a.documents` was never populated,
 * so the fallback was the real behaviour. Every apprentice showed the same two
 * invented files: "Commitment statement (CS-001), 01 Mar 2024" and "6-month
 * review record, 03 Sep 2024", each with a Download button that did nothing.
 *
 * ── BOTH KINDS OF DOCUMENT OPEN ─────────────────────────────────────────────
 *
 * `LearnerDocumentItemDto` gives `storageKey` for stored files and
 * `externalUrl` for link evidence, and they need different treatment.
 *
 * A storage key is an S3 key, not a URL, so it is exchanged for a short-lived
 * signed URL through POST /storage/download-url first. An earlier version of
 * this component said no such endpoint existed and rendered "Held on the
 * provider record" instead — the endpoint was there all along, and the
 * provider app had been resolving keys through it since its own document
 * library was built. F1.2.2 AC5 asks for a library rather than a list, and a
 * list you cannot open anything from is a list.
 *
 * `externalUrl` rows keep their direct link: there is no key to exchange, and
 * routing them through the presigner would fail.
 *
 * A row with neither still says so plainly rather than offering a control that
 * cannot work — which is the fault the earlier version was avoiding, correctly,
 * with the wrong remedy.
 */

const TYPE_COLOR = {
  commitment: T.blue,
  review: T.green,
  evidence: T.muted,
};

function TypeBadge({ type }) {
  const color = TYPE_COLOR[type] ?? T.muted;
  return (
    <span
      className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ backgroundColor: `${color}18`, color }}
    >
      {LEARNER_DOC_TYPE_LABELS[type] ?? type}
    </span>
  );
}

export function ProfileDocuments({
  profile,
  isLoading,
  isError,
  error,
  unavailable,
}) {
  const { download, downloadingKey } = useDownloadObject();
  const docs = Array.isArray(profile?.documents) ? profile.documents : [];
  const ordered = docs
    .slice()
    .sort((a, b) => String(b.documentAt).localeCompare(String(a.documentAt)));

  return (
    <ProfileTabState
      unavailable={unavailable}
      isLoading={isLoading}
      isError={isError}
      error={error}
      isEmpty={!isLoading && !isError && ordered.length === 0}
      emptyTitle="No documents on this enrolment"
      emptyDetail="No commitment statement, review record or evidence has been filed."
    >
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: `1px solid ${T.border}` }}
      >
        {ordered.map((d, i) => (
          <div
            key={d.id}
            className="flex items-center justify-between gap-3 px-4 py-3"
            style={{
              borderBottom:
                i < ordered.length - 1 ? `1px solid ${T.border}` : "none",
              backgroundColor: i % 2 === 0 ? T.surface : T.card,
            }}
          >
            <div className="min-w-0">
              <p
                className="text-xs font-semibold truncate"
                style={{ color: T.ink }}
              >
                {d.title}
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: T.muted }}>
                {d.documentAt ? formatDate(d.documentAt) : "Date not recorded"}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <TypeBadge type={d.type} />
              {d.externalUrl ? (
                <a
                  href={d.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold hover:opacity-80"
                  style={{ backgroundColor: T.blueLight, color: T.blue }}
                >
                  <ExternalLink className="h-3 w-3" aria-hidden /> Open
                </a>
              ) : d.storageKey ? (
                <button
                  type="button"
                  onClick={() => download(d.storageKey)}
                  disabled={downloadingKey === d.storageKey}
                  aria-label={`Download ${d.title}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold hover:opacity-80 disabled:opacity-50"
                  style={{ backgroundColor: T.blueLight, color: T.blue }}
                >
                  {downloadingKey === d.storageKey ? (
                    <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
                  ) : (
                    <Download className="h-3 w-3" aria-hidden />
                  )}{" "}
                  Download
                </button>
              ) : (
                <span
                  className="text-[10px] whitespace-nowrap"
                  style={{ color: T.muted }}
                >
                  No file attached
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </ProfileTabState>
  );
}
