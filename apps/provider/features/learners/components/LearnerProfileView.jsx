"use client";

import {
  Award,
  Briefcase,
  Calendar,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Flag,
  GraduationCap,
  Mail,
  Megaphone,
  MessageCircle,
  PauseCircle,
  PlayCircle,
  User,
} from "lucide-react";
import { useState } from "react";

import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { GoBackButton } from "@/components/ui/GoBackButton";
import { PageSubheader } from "@/components/ui/PageSubheader";
import { useRoleAccess } from "@/features/auth/hooks/useRoleAccess";
import { BreakInLearningModal } from "@/features/enrolments/components/BreakInLearningModal";
import { LearnerMessageThread } from "@/features/messaging/components/LearnerMessageThread";
import { FlagOtjEntryModal } from "@/features/otj-log-entries/components/FlagOtjEntryModal";
import { useUnflagOtjEntry } from "@/features/otj-log-entries/queries/otj-log-entries.query";
import { ReviewStatusBadge } from "@/features/reviews/components/ReviewBadges";
import { useDownloadObject } from "@/features/storage/queries/storage.query";
import { formatDate, formatDateTime } from "@/utils/helper";

import { LogInterventionModal } from "./LogInterventionModal";
import {
  INTERVENTION_ACTION_LABELS,
  LEARNER_DOC_TYPE_LABELS,
} from "../constants";
import { useLearnerProfile } from "../queries/learners.query";

function Field({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      {Icon ? (
        <Icon className="mt-0.5 size-4 shrink-0 text-neutral-400" aria-hidden />
      ) : null}
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-400">
          {label}
        </p>
        <p className="truncate text-sm text-neutral-700">{value ?? "—"}</p>
      </div>
    </div>
  );
}

function SectionCard({ icon: Icon, title, children, action }) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon ? (
            <Icon className="size-4 text-neutral-400" aria-hidden />
          ) : null}
          <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
        </div>
        {action}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function DocumentRow({ doc }) {
  const { download, isDownloading } = useDownloadObject();

  const open = () => {
    if (doc.downloadUrl) {
      window.open(doc.downloadUrl, "_blank", "noopener,noreferrer");
    } else if (doc.externalUrl) {
      window.open(doc.externalUrl, "_blank", "noopener,noreferrer");
    } else if (doc.storageKey) {
      // Presigned URL was stale/absent — mint a fresh one from the key.
      download(doc.storageKey);
    }
  };

  const isLink = !doc.downloadUrl && !doc.storageKey && doc.externalUrl;

  return (
    <li className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
      <div className="flex min-w-0 items-center gap-2.5">
        <FileText className="size-4 shrink-0 text-neutral-400" aria-hidden />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-neutral-800">
            {doc.title}
          </p>
          <p className="text-xs text-neutral-400">
            {LEARNER_DOC_TYPE_LABELS[doc.type] ?? doc.type}
            {doc.documentAt ? ` · ${formatDate(doc.documentAt)}` : ""}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={open}
        disabled={isDownloading}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-50 disabled:opacity-50"
      >
        {isLink ? (
          <>
            <ExternalLink className="size-3.5" aria-hidden />
            Open
          </>
        ) : (
          <>
            <Download className="size-3.5" aria-hidden />
            Download
          </>
        )}
      </button>
    </li>
  );
}

/**
 * F2.2.4 AC3 — one off-the-job entry.
 *
 * The row used to be a date and a duration. It now carries what the learner
 * said they did and whether a tutor has queried it, because "all sessions
 * submitted" is not useful if every session looks identical.
 */
function OtjEntryRow({ entry, canManage, onFlag }) {
  const unflag = useUnflagOtjEntry();
  const isFlagged = !!entry.flaggedAt;

  return (
    <li className="py-2.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm text-neutral-700">
            {entry.activityName || "Off-the-job activity"}
          </p>
          <p className="text-xs text-neutral-400">
            {formatDate(entry.loggedDate)} · {entry.minutes} min ·{" "}
            {entry.status}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {isFlagged ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
              <Flag className="size-3" aria-hidden />
              Flagged
            </span>
          ) : null}
          {canManage ? (
            <button
              type="button"
              onClick={() =>
                isFlagged ? unflag.mutate(entry.id) : onFlag(entry)
              }
              disabled={unflag.isPending}
              className="rounded-lg px-2 py-1 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-50 disabled:opacity-50"
            >
              {isFlagged ? "Clear flag" : "Flag"}
            </button>
          ) : null}
        </div>
      </div>
      {isFlagged && entry.flagNote ? (
        <p className="mt-1 rounded-lg bg-amber-50/60 px-2.5 py-1.5 text-xs text-amber-800">
          {entry.flagNote}
        </p>
      ) : null}
    </li>
  );
}

/**
 * F2.2.4 AC5 — one conversation, as it appears on the profile.
 *
 * The profile response used to carry thread UUIDs and nothing else, so this
 * panel could only have said "a conversation exists somewhere". It now shows
 * who, how recently, and what about.
 */
function ThreadSummaryRow({ thread }) {
  return (
    <li className="py-2.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-neutral-800">
            {thread.counterpartyName || "Unnamed participant"}
            <span className="ml-1.5 text-xs font-normal text-neutral-400">
              {thread.counterpartyParty === "tutor"
                ? "Tutor"
                : "Employer manager"}
            </span>
          </p>
          <p className="truncate text-xs text-neutral-500">
            {thread.lastMessagePreview || "No messages yet."}
          </p>
        </div>
        <div className="shrink-0 text-right">
          {thread.unreadCount > 0 ? (
            <span className="inline-flex items-center rounded-full bg-primary-600 px-1.5 py-0.5 text-[11px] font-semibold text-white">
              {thread.unreadCount}
            </span>
          ) : null}
          <p className="mt-0.5 text-[11px] text-neutral-400">
            {thread.lastMessageAt
              ? formatDateTime(thread.lastMessageAt)
              : `${thread.messageCount} messages`}
          </p>
        </div>
      </div>
    </li>
  );
}

export function LearnerProfileView({ enrolmentId }) {
  const { can } = useRoleAccess();
  const canManage = can("admin");

  const { data: profile, isError } = useLearnerProfile(enrolmentId);
  const [logOpen, setLogOpen] = useState(false);
  const [breakMode, setBreakMode] = useState(null);
  const [flagEntry, setFlagEntry] = useState(null);

  if (isError) {
    return (
      <div className="space-y-4">
        <GoBackButton className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-800" />
        <Card>
          <CardContent className="py-10 text-center text-sm text-neutral-500">
            This learner could not be found.
          </CardContent>
        </Card>
      </div>
    );
  }

  const name = profile
    ? `${profile.personal?.firstName ?? ""} ${profile.personal?.lastName ?? ""}`.trim()
    : "Learner";
  const bil = profile?.breakInLearning;

  return (
    <div className="space-y-6">
      <GoBackButton className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-800" />

      <PageSubheader
        icon={GraduationCap}
        eyebrow="Learner"
        title={name || "Learner"}
        description={profile?.programme?.standardTitle}
        actions={
          canManage ? (
            <div className="flex flex-wrap items-center gap-2">
              {/* F2.2.4 AC6 — pausing and resuming both notify the ESFA. */}
              {bil?.active ? (
                <Button
                  size="sm"
                  color="black"
                  variant="outline"
                  startIcon={<PlayCircle className="size-4" />}
                  onClick={() => setBreakMode("end")}
                >
                  Record return
                </Button>
              ) : (
                <Button
                  size="sm"
                  color="black"
                  variant="outline"
                  startIcon={<PauseCircle className="size-4" />}
                  onClick={() => setBreakMode("start")}
                >
                  Break in learning
                </Button>
              )}
              <Button
                size="sm"
                color="green"
                startIcon={<Megaphone className="size-4" />}
                onClick={() => setLogOpen(true)}
              >
                Log intervention
              </Button>
            </div>
          ) : null
        }
      />

      {profile ? (
        <>
          {/* Break in learning banner */}
          {bil?.active ? (
            <div className="flex items-start gap-2 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3">
              <PauseCircle
                className="mt-0.5 size-4 shrink-0 text-sky-600"
                aria-hidden
              />
              <div>
                <p className="text-sm font-semibold text-sky-800">
                  Break in learning
                </p>
                <p className="mt-0.5 text-sm text-sky-700">
                  {/*
                   * F2.2.4 AC6. `reason` used to be hardcoded `null` by the
                   * API, so this line always fell through to the generic
                   * copy. It is real now — and when it is still blank, that
                   * means the learner was paused without a break being
                   * recorded, which is worth saying rather than papering over.
                   */}
                  {bil.reason || "Paused with no recorded reason."}
                  {bil.expectedReturnDate
                    ? ` Expected return ${formatDate(bil.expectedReturnDate)}.`
                    : ""}
                </p>
              </div>
            </div>
          ) : null}

          {/* Overview */}
          <SectionCard icon={User} title="Overview">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Field
                icon={Mail}
                label="Email"
                value={profile.personal?.email}
              />
              <Field
                icon={Briefcase}
                label="Employer"
                value={profile.employer?.organisationName}
              />
              <Field
                icon={User}
                label="Employer manager"
                value={profile.employer?.managerName}
              />
              <Field icon={User} label="Tutor" value={profile.tutor?.name} />
              <Field
                icon={Calendar}
                label="Planned start"
                value={
                  profile.programme?.plannedStartDate
                    ? formatDate(profile.programme.plannedStartDate)
                    : "—"
                }
              />
              <Field
                icon={Calendar}
                label="EPA date"
                value={
                  profile.programme?.epaDate
                    ? formatDate(profile.programme.epaDate)
                    : "—"
                }
              />
              {/*
               * F2.2.4 AC1 — who is assessing, not only when. Set from the
               * enrolment's EPA details; blank until an EPAO is appointed,
               * which normally happens part-way through the programme.
               */}
              <Field
                icon={Award}
                label="EPA organisation"
                value={
                  profile.programme?.epaOrganisationName
                    ? `${profile.programme.epaOrganisationName}${
                        profile.programme.epaOrganisationUkprn
                          ? ` (${profile.programme.epaOrganisationUkprn})`
                          : ""
                      }`
                    : "Not yet appointed"
                }
              />
            </div>
          </SectionCard>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* OTJ */}
            <SectionCard icon={Clock} title="Off-the-job">
              <div className="mb-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-neutral-900">
                  {profile.otj?.otjPercent === null ||
                  profile.otj?.otjPercent === undefined
                    ? "—"
                    : `${Math.round(profile.otj.otjPercent)}%`}
                </span>
                <span className="text-xs text-neutral-400">approved</span>
              </div>
              {profile.otj?.recentEntries?.length ? (
                <>
                  <ul className="divide-y divide-neutral-100">
                    {profile.otj.recentEntries.map((e) => (
                      <OtjEntryRow
                        key={e.id}
                        entry={e}
                        canManage={canManage}
                        onFlag={setFlagEntry}
                      />
                    ))}
                  </ul>
                  {/*
                   * F2.2.4 AC3 — the panel says so when it is not showing the
                   * whole log, rather than presenting a capped list as
                   * complete.
                   */}
                  {profile.otj.truncated ? (
                    <p className="mt-3 text-xs text-neutral-400">
                      Showing the most recent {profile.otj.recentEntries.length}{" "}
                      of {profile.otj.totalCount} sessions.
                    </p>
                  ) : (
                    <p className="mt-3 text-xs text-neutral-400">
                      All {profile.otj.totalCount} sessions.
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-neutral-400">
                  No sessions logged yet.
                </p>
              )}
            </SectionCard>

            {/* Reviews */}
            <SectionCard icon={Calendar} title="Reviews">
              {profile.reviews?.length ? (
                <ul className="divide-y divide-neutral-100">
                  {profile.reviews.map((r) => (
                    <li
                      key={r.id}
                      className="flex items-center justify-between gap-2 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm text-neutral-700">
                          {formatDateTime(r.scheduledAt)}
                        </p>
                        <p className="text-xs text-neutral-400">
                          Tutor {r.tutorSigned ? "✓" : "—"} · Apprentice{" "}
                          {r.apprenticeSigned ? "✓" : "—"}
                        </p>
                      </div>
                      <ReviewStatusBadge status={r.status} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-neutral-400">No reviews yet.</p>
              )}
            </SectionCard>
          </div>

          {/* Messages — F2.2.4 AC5 */}
          <SectionCard icon={MessageCircle} title="Messages">
            {profile.messageThreads?.length ? (
              <ul className="mb-4 divide-y divide-neutral-100 border-b border-neutral-100 pb-1">
                {profile.messageThreads.map((thread) => (
                  <ThreadSummaryRow key={thread.id} thread={thread} />
                ))}
              </ul>
            ) : null}
            <LearnerMessageThread enrolmentId={enrolmentId} />
          </SectionCard>

          {/* Documents */}
          <SectionCard icon={FileText} title="Documents">
            {profile.documents?.length ? (
              <ul className="divide-y divide-neutral-100">
                {profile.documents.map((doc) => (
                  <DocumentRow key={doc.id} doc={doc} />
                ))}
              </ul>
            ) : (
              <p className="text-sm text-neutral-400">
                No documents yet (signed commitments, completed reviews, and
                accepted evidence appear here).
              </p>
            )}
          </SectionCard>

          {/* Recent interventions */}
          {bil?.recentInterventions?.length ? (
            <SectionCard icon={Megaphone} title="Recent interventions">
              <ul className="divide-y divide-neutral-100">
                {bil.recentInterventions.map((a) => (
                  <li key={a.id} className="py-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-neutral-800">
                        {INTERVENTION_ACTION_LABELS[a.actionType] ??
                          a.actionType}
                      </span>
                      <span className="text-xs text-neutral-400">
                        {formatDateTime(a.createdAt)}
                      </span>
                    </div>
                    {a.notes ? (
                      <p className="mt-0.5 text-sm text-neutral-600">
                        {a.notes}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </SectionCard>
          ) : null}

          <LogInterventionModal
            enrolmentId={enrolmentId}
            learnerName={name}
            open={logOpen}
            onClose={() => setLogOpen(false)}
          />

          {/* F2.2.4 AC6 */}
          <BreakInLearningModal
            enrolmentId={enrolmentId}
            learnerName={name}
            mode={breakMode ?? "start"}
            open={!!breakMode}
            onClose={() => setBreakMode(null)}
          />

          {/* F2.2.4 AC3 */}
          <FlagOtjEntryModal
            entry={flagEntry}
            open={!!flagEntry}
            onClose={() => setFlagEntry(null)}
          />
        </>
      ) : (
        <Card>
          <CardContent className="py-10 text-center text-sm text-neutral-400">
            Loading learner…
          </CardContent>
        </Card>
      )}
    </div>
  );
}
