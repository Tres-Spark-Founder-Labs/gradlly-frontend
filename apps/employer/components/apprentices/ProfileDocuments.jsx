"use client";

import { ExternalLink } from "lucide-react";

import { LEARNER_DOC_TYPE_LABELS } from "@/features/learners/constants";
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
 * ── THE DOWNLOAD BUTTON IS GONE FOR STORED FILES ────────────────────────────
 *
 * `LearnerDocumentItemDto` gives `storageKey` for stored files and
 * `externalUrl` for link evidence. A storage key is not a URL — downloading
 * needs a presigned-URL endpoint this app does not have — so a button that
 * cannot work has been removed rather than left to fail silently, and the row
 * says the file is held on the provider record. `externalUrl` entries do get a
 * real link, because that one is genuinely openable.
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
              ) : (
                <span
                  className="text-[10px] whitespace-nowrap"
                  style={{ color: T.muted }}
                >
                  Held on the provider record
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </ProfileTabState>
  );
}
