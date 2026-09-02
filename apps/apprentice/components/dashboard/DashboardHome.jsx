"use client";

import {
  Clock,
  BarChart3,
  BookOpen,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  ExternalLink,
  FileText,
  Globe,
  Hash,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

import { Avatar } from "@/components/ui/Avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import TextBadge from "@/components/ui/TextBadge";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { HomeEpaCountdown } from "@/features/journey/components/HomeEpaCountdown";
import { OTJ_PACE_LABELS } from "@/features/reporting/constants";
import { useLearnerSummary } from "@/features/reporting/queries/reporting.query";
import { useReviews } from "@/features/reviews/queries/reviews.query";
import {
  capitalise,
  cn,
  formatDate,
  formatDateTime,
  getFullName,
  getGreeting,
  getInitials,
} from "@/utils/helper";

// ─── Static config ────────────────────────────────────────────────────────────

const STAT_CARDS = [
  {
    id: "otj",
    label: "OTJ Progress",
    icon: TrendingUp,
    iconBg: "bg-success-50",
    iconColor: "text-success-700",
    accentBg: "bg-success-600",
    hint: "Approved hours",
  },
  {
    id: "review",
    label: "Next Review",
    icon: ClipboardList,
    iconBg: "bg-warning-50",
    iconColor: "text-warning-700",
    accentBg: "bg-warning-600",
    hint: "Upcoming review",
  },
  {
    id: "epa",
    label: "Days to EPA",
    icon: BookOpen,
    iconBg: "bg-primary-50",
    iconColor: "text-primary-700",
    accentBg: "bg-primary-600",
    hint: "End-point assessment",
  },
  {
    id: "alert",
    label: "OTJ Pace Alert",
    icon: BarChart3,
    iconBg: "bg-info-50",
    iconColor: "text-info-700",
    accentBg: "bg-info-600",
    hint: "Pace status",
  },
  /**
   * These two came from /analytics, which is folded into this page. They were
   * the only figures that screen showed and this one did not — the other two
   * of its four cards (OTJ progress, pace alert) were already here, over the
   * same `useLearnerSummary` data. Carried over rather than dropped so the
   * fold loses nothing.
   */
  {
    id: "hours",
    label: "Approved OTJ Hours",
    icon: Clock,
    iconBg: "bg-success-50",
    iconColor: "text-success-700",
    accentBg: "bg-success-600",
    hint: "Counting towards 20%",
  },
  {
    id: "openReviews",
    label: "Open Reviews",
    icon: ClipboardList,
    iconBg: "bg-warning-50",
    iconColor: "text-warning-700",
    accentBg: "bg-warning-600",
    hint: "Awaiting completion",
  },
];

const QUICK_ACTIONS = [
  {
    label: "My Courses",
    description: "Browse enrolled courses",
    href: "/journey",
    icon: BookOpen,
    iconBg: "bg-primary-50 group-hover:bg-primary-100",
    iconColor: "text-primary-700",
  },
  {
    label: "Assessments",
    description: "View & complete tasks",
    href: "/journey",
    icon: ClipboardList,
    iconBg: "bg-warning-50 group-hover:bg-warning-100",
    iconColor: "text-warning-700",
  },
  {
    label: "Progress",
    description: "Track your journey",
    href: "/otj-logs",
    icon: TrendingUp,
    iconBg: "bg-success-50 group-hover:bg-success-100",
    iconColor: "text-success-700",
  },
  {
    label: "Curriculum",
    description: "Course content",
    href: "/portfolio",
    icon: FileText,
    iconBg: "bg-info-50 group-hover:bg-info-100",
    iconColor: "text-info-700",
  },
  {
    label: "Reports",
    description: "Learning analytics",
    href: "/documents",
    icon: BarChart3,
    iconBg: "bg-neutral-100 group-hover:bg-neutral-200",
    iconColor: "text-neutral-700",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PROFILE_FIELDS = [
  { key: "avatarUrl", label: "Profile photo" },
  { key: "phone", label: "Phone number" },
  { key: "jobTitle", label: "Job title" },
  { key: "department", label: "Department" },
  { key: "bio", label: "Bio" },
  { key: "dateOfBirth", label: "Date of birth" },
];

function getProfileStatus(user) {
  const completed = PROFILE_FIELDS.filter((f) => Boolean(user?.[f.key])).length;
  const missing = PROFILE_FIELDS.filter((f) => !user?.[f.key]);
  const pct = Math.round((completed / PROFILE_FIELDS.length) * 100);
  return { completed, total: PROFILE_FIELDS.length, pct, missing };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MiniRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="shrink-0 text-xs text-neutral-400">{label}</span>
      <span className="truncate text-right text-xs font-medium text-neutral-700">
        {value}
      </span>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value, href }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2.5">
      <Icon
        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neutral-400"
        aria-hidden
      />
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
          {label}
        </p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 truncate text-sm font-medium text-primary-700 hover:underline"
          >
            {value}
            <ExternalLink className="h-3 w-3 shrink-0" aria-hidden />
          </a>
        ) : (
          <p className="truncate text-sm font-medium text-neutral-700">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Organisation card ────────────────────────────────────────────────────────
//
// Shows the organisation the apprentice belongs to (their training provider /
// employer), along with their role and membership status. Hidden when the
// learner is not yet part of an organisation.
function OrganisationCard({ activeOrganisation }) {
  const org = activeOrganisation?.organisation;
  if (!org) return null;

  const roles = activeOrganisation?.roles ?? [];
  const membershipStatus = activeOrganisation?.membershipStatus;
  const location = [org.city, org.country].filter(Boolean).join(", ");

  return (
    <Card className="overflow-hidden">
      {/* Accent header */}
      <div
        className="flex items-center gap-3 px-5 py-4"
        style={{
          background: "linear-gradient(135deg, #166534 0%, #16a34a 100%)",
        }}
      >
        {org.logoUrl ? (
          <Avatar
            src={org.logoUrl}
            alt={`${org.name} logo`}
            initials={org.name?.slice(0, 2) ?? ""}
            size="md"
            shape="square"
          />
        ) : (
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
          >
            <Building2
              className="h-4.5 w-4.5 text-white"
              strokeWidth={1.75}
              aria-hidden
            />
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">
            {org.name}
          </p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
            Your organisation
          </p>
        </div>
      </div>

      <CardContent className="space-y-3.5">
        <DetailRow icon={MapPin} label="Location" value={location} />
        <DetailRow icon={Mail} label="Email" value={org.orgEmail} />
        {org.orgPhone && (
          <DetailRow icon={Phone} label="Phone" value={org.orgPhone} />
        )}
        {org.website && (
          <DetailRow
            icon={Globe}
            label="Website"
            value={org.website.replace(/^https?:\/\//, "")}
            href={org.website}
          />
        )}

        {/* Role + membership badges */}
        <div className="flex flex-wrap gap-1.5 border-t border-neutral-100 pt-3.5">
          {roles.map((r) => (
            <TextBadge key={r} variant="light" color="purple" size="xs">
              {capitalise(r)}
            </TextBadge>
          ))}
          {membershipStatus && (
            <TextBadge variant="light" color="green" size="xs">
              <CheckCircle2 className="h-3 w-3" aria-hidden />
              {capitalise(membershipStatus)}
            </TextBadge>
          )}
          {org.portalType && (
            <TextBadge variant="light" color="gray" size="xs">
              {capitalise(org.portalType)}
            </TextBadge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection({ user, activeOrganisation, greeting }) {
  const org = activeOrganisation?.organisation;
  const roles = activeOrganisation?.roles ?? [];
  const membershipStatus = activeOrganisation?.membershipStatus ?? null;
  const orgInitial = org?.name ? org.name[0].toUpperCase() : "";
  const orgLocation = [org?.city, org?.country].filter(Boolean).join(", ");
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: user?.timezone ?? "Europe/London",
  });

  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{
        background:
          "linear-gradient(135deg, #14532d 0%, #166534 45%, #15803d 80%, #16a34a 100%)",
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), " +
            "linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[2px] pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(94,164,120,0.65) 50%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute -top-24 -right-24 h-80 w-80 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(78,163,106,0.14), transparent 70%)",
        }}
      />

      <div className="relative z-10 p-6 sm:p-8 lg:p-10">
        {/* Greeting */}
        <div className="min-w-0">
          <p
            className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{ color: "#8cc4a1" }}
          >
            Learner Portal
          </p>
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
            {greeting},
            <br />
            <span className="text-white">{user?.firstName ?? "there"}</span>
          </h1>
          <p
            className="mt-2 text-sm"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            {today}
          </p>
        </div>

        {/* Organisation panel */}
        {org && (
          <div
            className="mt-6 flex flex-col gap-4 rounded-2xl px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
            style={{
              backgroundColor: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex min-w-0 items-center gap-3.5">
              <Avatar
                src={org.logoUrl}
                initials={orgInitial}
                alt={`${org.name} logo`}
                size="xl"
                shape="square"
                className="border border-white/15"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-white sm:text-[15px]">
                  {org.name}
                </p>
                <div
                  className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  {org.ukprn && (
                    <span className="flex items-center gap-1">
                      <Hash className="h-3 w-3" aria-hidden />
                      <span className="font-mono">{org.ukprn}</span>
                    </span>
                  )}
                  {orgLocation && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" aria-hidden />
                      {orgLocation}
                    </span>
                  )}
                  {org.website && (
                    <a
                      href={org.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 transition-colors hover:text-white hover:underline"
                    >
                      <Globe className="h-3 w-3" aria-hidden />
                      {org.website.replace(/^https?:\/\//, "")}
                      <ExternalLink className="h-2.5 w-2.5" aria-hidden />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Role + membership (org context) */}
            <div className="flex shrink-0 flex-wrap items-center gap-1.5">
              {roles.map((role) => (
                <span
                  key={role}
                  className="rounded-full px-2.5 py-1 text-[11px] font-semibold text-white"
                  style={{ background: "rgba(255,255,255,0.15)" }}
                >
                  {capitalise(role)}
                </span>
              ))}
              {membershipStatus === "active" && (
                <span
                  className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                  style={{
                    background: "rgba(34,197,94,0.2)",
                    color: "#86efac",
                  }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-success-400" />
                  Active
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Metrics row ──────────────────────────────────────────────────────────────

function MetricCard({ stat, value, isLoading }) {
  const { label, icon: Icon, iconBg, iconColor, accentBg, hint } = stat;
  const display =
    value !== null && value !== "" ? value : isLoading ? "…" : "N/A";

  return (
    <Card className="relative overflow-hidden transition-shadow duration-200 hover:shadow-md">
      <CardContent className="pb-5 pt-5">
        <div className="flex items-start justify-between gap-2">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
              iconBg,
            )}
          >
            <Icon className={cn("h-5 w-5", iconColor)} aria-hidden />
          </div>
          <span className="mt-0.5 text-right text-[10px] leading-tight text-neutral-400">
            {hint}
          </span>
        </div>

        <div className="mt-4">
          <p
            className={cn(
              "text-3xl font-bold tracking-tight",
              display === "N/A" || display === "…"
                ? "text-neutral-300"
                : "text-neutral-900",
            )}
          >
            {display}
          </p>
          <p className="mt-1 text-sm font-medium text-neutral-500">{label}</p>
        </div>
      </CardContent>

      <div
        className={cn("absolute inset-x-0 bottom-0 h-0.5 opacity-60", accentBg)}
      />
    </Card>
  );
}

// ─── Quick actions ────────────────────────────────────────────────────────────

function QuickActionsCard() {
  return (
    <Card>
      <CardHeader>
        <p className="eyebrow">Quick Actions</p>
        <h2 className="mt-0.5 text-base font-semibold text-neutral-900">
          Jump to key areas
        </h2>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group relative flex flex-col gap-3 rounded-xl border border-neutral-100 p-4 transition-all duration-200 hover:border-neutral-200 hover:shadow-sm"
            >
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-150",
                  action.iconBg,
                )}
              >
                <action.icon
                  className={cn("h-4.5 w-4.5", action.iconColor)}
                  aria-hidden
                />
              </div>
              <div className="min-w-0 pr-4">
                <p className="text-sm font-semibold text-neutral-800">
                  {action.label}
                </p>
                <p className="mt-0.5 text-xs leading-snug text-neutral-500">
                  {action.description}
                </p>
              </div>
              <ChevronRight
                className="absolute right-3 top-3.5 h-3.5 w-3.5 text-neutral-300 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-neutral-500"
                aria-hidden
              />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Getting started ──────────────────────────────────────────────────────────

function GettingStartedCard({ user, profileStatus }) {
  const steps = [
    {
      id: "email",
      label: "Verify your email address",
      done: Boolean(user?.isEmailVerified),
      href: user?.isEmailVerified ? null : "/verify-email",
    },
    {
      id: "profile",
      label: "Complete your profile",
      done: profileStatus.pct === 100,
      href: "/settings",
    },
    {
      id: "course",
      label: "Start your first course",
      done: false,
      href: "/journey",
    },
    {
      id: "assessment",
      label: "Complete an assessment",
      done: false,
      href: "/journey",
    },
    {
      id: "progress",
      label: "Check your progress report",
      done: false,
      href: "/otj-logs",
    },
  ];

  const doneCount = steps.filter((s) => s.done).length;
  const pct = Math.round((doneCount / steps.length) * 100);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Get Started</p>
            <h2 className="mt-0.5 text-base font-semibold text-neutral-900">
              {doneCount} of {steps.length} steps complete
            </h2>
          </div>
          <span className="text-2xl font-bold tabular-nums text-primary-700">
            {pct}%
          </span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-neutral-100">
          <div
            className="h-1.5 rounded-full bg-primary-600 transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="py-3">
        <ul className="space-y-0.5">
          {steps.map((step) => {
            const inner = (
              <div
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  step.done && "opacity-50",
                  !step.done && step.href && "hover:bg-neutral-50",
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors",
                    step.done
                      ? "bg-primary-100 text-primary-700"
                      : "border-2 border-neutral-200",
                  )}
                >
                  {step.done && (
                    <Check className="h-3 w-3" strokeWidth={2.5} aria-hidden />
                  )}
                </span>
                <span
                  className={cn(
                    "flex-1 font-medium text-neutral-700",
                    step.done && "line-through decoration-neutral-300",
                  )}
                >
                  {step.label}
                </span>
                {!step.done && step.href && (
                  <ChevronRight
                    className="h-3.5 w-3.5 text-neutral-300"
                    aria-hidden
                  />
                )}
              </div>
            );
            return (
              <li key={step.id}>
                {!step.done && step.href ? (
                  <Link href={step.href} className="block">
                    {inner}
                  </Link>
                ) : (
                  inner
                )}
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

// ─── Profile card ─────────────────────────────────────────────────────────────

function ProfileCard({ user, activeOrganisation, profileStatus }) {
  const roles = activeOrganisation?.roles ?? [];
  const initials = getInitials(user?.firstName, user?.lastName);
  const fullName = getFullName(user);
  const { pct, missing } = profileStatus;

  return (
    <Card>
      <CardContent>
        <div className="flex items-center gap-3">
          <Avatar
            initials={initials}
            src={user?.avatarUrl}
            size="lg"
            className="ring-2 ring-primary-100"
          />
          <div className="min-w-0">
            <p className="truncate font-semibold text-neutral-900">
              {fullName}
            </p>
            <p className="truncate text-xs text-neutral-500">{user?.email}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              {roles.map((r) => (
                <TextBadge key={r} variant="light" color="purple" size="xs">
                  {capitalise(r)}
                </TextBadge>
              ))}
              {user?.isEmailVerified && (
                <TextBadge variant="light" color="green" size="xs">
                  <CheckCircle2 className="h-3 w-3" aria-hidden />
                  Verified
                </TextBadge>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2 border-t border-neutral-100 pt-4">
          <MiniRow label="Timezone" value={user?.timezone ?? "Not set"} />
          <MiniRow label="Locale" value={user?.locale ?? "Not set"} />
          <MiniRow
            label="Last login"
            value={
              user?.lastLoginAt
                ? formatDateTime(user.lastLoginAt)
                : "Not recorded"
            }
          />
          <MiniRow
            label="Member since"
            value={
              user?.createdAt ? formatDate(user.createdAt) : "Not recorded"
            }
          />
          <MiniRow
            label="Account"
            value={user?.isActive ? "Active" : "Inactive"}
          />
        </div>

        {pct < 100 && (
          <div className="mt-4 border-t border-neutral-100 pt-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="flex items-center gap-1.5 text-xs font-medium text-neutral-600">
                <Sparkles className="h-3 w-3 text-warning-500" aria-hidden />
                Profile completeness
              </p>
              <span className="text-xs font-bold text-primary-700">{pct}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
              <div
                className="h-1.5 rounded-full bg-primary-600 transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            {missing.length > 0 && (
              <p className="mt-2 text-xs leading-relaxed text-neutral-400">
                Add{" "}
                {missing
                  .slice(0, 3)
                  .map((m) => m.label.toLowerCase())
                  .join(", ")}
                {missing.length > 3 && ` +${missing.length - 3} more`}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function DashboardHome() {
  const { user, activeOrganisation } = useAuthUser();
  const { data: summary, isLoading: summaryLoading } = useLearnerSummary();

  /**
   * Open reviews, carried over from /analytics. There is no count field on the
   * learner summary, so this is derived exactly as that screen derived it:
   * everything not completed and not cancelled.
   */
  const { data: reviewData } = useReviews({ page: 1, perPage: 100 });
  const pendingReviews = (reviewData?.reviews ?? []).filter(
    (r) => r.status !== "completed" && r.status !== "cancelled",
  ).length;
  const greeting = getGreeting(user?.timezone);
  const profileStatus = getProfileStatus(user);

  const getStatValue = (stat) => {
    if (!summary) return null;
    switch (stat.id) {
      case "otj":
        return summary.otjPace?.otjPercent !== null &&
          summary.otjPace?.otjPercent !== undefined
          ? `${Math.round(summary.otjPace.otjPercent)}%`
          : null;
      case "review":
        return summary.nextReviewDate
          ? formatDate(summary.nextReviewDate)
          : null;
      case "epa":
        return summary.daysToEpa !== null && summary.daysToEpa !== undefined
          ? `${summary.daysToEpa}d`
          : null;
      case "alert":
        return (
          OTJ_PACE_LABELS[summary.otjPace?.alertLevel] ??
          summary.otjPace?.alertLevel ??
          null
        );
      // Approved minutes only, per D2 — the same field F3.1.4's pace maths uses.
      case "hours":
        return summary.otjPace?.approvedMinutes !== null &&
          summary.otjPace?.approvedMinutes !== undefined
          ? `${Math.round(summary.otjPace.approvedMinutes / 60)}h`
          : null;
      case "openReviews":
        return String(pendingReviews);
      default:
        return null;
    }
  };

  return (
    <div
      className="space-y-6"
      style={{ animation: "slide-up 320ms var(--ease-out) both" }}
    >
      <HeroSection
        user={user}
        activeOrganisation={activeOrganisation}
        greeting={greeting}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {STAT_CARDS.map((stat, i) => (
          <div
            key={stat.id}
            style={{
              animation: "slide-up 320ms var(--ease-out) both",
              animationDelay: `${i * 50}ms`,
            }}
          >
            <MetricCard
              stat={stat}
              value={getStatValue(stat)}
              isLoading={summaryLoading}
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <QuickActionsCard />
          <GettingStartedCard user={user} profileStatus={profileStatus} />
        </div>

        <div className="space-y-6">
          {/*
            F3.2.3 AC1 — the EPA countdown belongs on the home screen. It reads
            the same journey payload as `/journey`; react-query dedupes the two
            renders, so mounting it here does not cost a second request.
          */}
          <HomeEpaCountdown />
          <OrganisationCard activeOrganisation={activeOrganisation} />
          <ProfileCard
            user={user}
            activeOrganisation={activeOrganisation}
            profileStatus={profileStatus}
          />
        </div>
      </div>
    </div>
  );
}
