"use client";

import {
  Briefcase,
  Calendar,
  Clock,
  Download,
  ExternalLink,
  FileText,
  GraduationCap,
  Mail,
  Megaphone,
  MessageCircle,
  PauseCircle,
  User,
} from "lucide-react";
import { useState } from "react";

import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { GoBackButton } from "@/components/ui/GoBackButton";
import { PageSubheader } from "@/components/ui/PageSubheader";
import { useRoleAccess } from "@/features/auth/hooks/useRoleAccess";
import { LearnerMessageThread } from "@/features/messaging/components/LearnerMessageThread";
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

export function LearnerProfileView({ enrolmentId }) {
  const { can } = useRoleAccess();
  const canManage = can("admin");

  const { data: profile, isError } = useLearnerProfile(enrolmentId);
  const [logOpen, setLogOpen] = useState(false);

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
            <Button
              size="sm"
              color="green"
              startIcon={<Megaphone className="size-4" />}
              onClick={() => setLogOpen(true)}
            >
              Log intervention
            </Button>
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
                  {bil.reason || "Currently paused."}
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
                <ul className="divide-y divide-neutral-100">
                  {profile.otj.recentEntries.map((e) => (
                    <li
                      key={e.id}
                      className="flex items-center justify-between py-2 text-sm"
                    >
                      <span className="text-neutral-600">
                        {formatDate(e.loggedDate)}
                      </span>
                      <span className="tabular-nums text-neutral-500">
                        {e.minutes} min · {e.status}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-neutral-400">No recent entries.</p>
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

          {/* Messages */}
          <SectionCard icon={MessageCircle} title="Messages">
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
