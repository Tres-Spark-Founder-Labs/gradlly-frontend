"use client";

import {
  Activity,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  ExternalLink,
  Globe,
  Hash,
  MapPin,
  Sparkles,
  Workflow,
} from "lucide-react";
import Link from "next/link";

import { Avatar } from "@/components/ui/Avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import TextBadge from "@/components/ui/TextBadge";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { SmeDashboard } from "@/features/reporting/components/SmeDashboard";
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

const QUICK_ACTIONS = [
  {
    label: "AI Programmes",
    description: "Browse catalogue",
    href: "/courses",
    icon: Sparkles,
    iconBg: "bg-primary-50 group-hover:bg-primary-100",
    iconColor: "text-primary-700",
  },
  {
    label: "Approvals",
    description: "Approve OTJ hours",
    href: "/approvals",
    icon: ClipboardList,
    iconBg: "bg-warning-50 group-hover:bg-warning-100",
    iconColor: "text-warning-700",
  },
  {
    label: "Reviews",
    description: "Progress reviews",
    href: "/reviews",
    icon: Activity,
    iconBg: "bg-success-50 group-hover:bg-success-100",
    iconColor: "text-success-700",
  },
  {
    label: "Funding",
    description: "Levy & payments",
    href: "/funding",
    icon: BarChart3,
    iconBg: "bg-info-50 group-hover:bg-info-100",
    iconColor: "text-info-700",
  },
  {
    label: "Eligibility",
    description: "Check SME eligibility",
    href: "/eligibility",
    icon: CheckCircle2,
    iconBg: "bg-danger-50 group-hover:bg-danger-100",
    iconColor: "text-danger-700",
  },
  {
    label: "Reports",
    description: "Compliance overview",
    href: "/reports",
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
          "linear-gradient(135deg, var(--color-primary-950) 0%, var(--color-primary-950) 45%, var(--color-primary-900) 80%, var(--color-primary-900) 100%)",
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
            "linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--color-primary-400) 65%, transparent) 50%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute -top-24 -right-24 h-80 w-80 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--color-primary-400) 14%, transparent), transparent 70%)",
        }}
      />

      <div className="relative z-10 p-6 sm:p-8 lg:p-10">
        {/* Greeting */}
        <div className="min-w-0">
          <p
            className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{ color: "var(--color-primary-300)" }}
          >
            Flow Portal
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

function GettingStartedCard({ user, activeOrganisation, profileStatus }) {
  const org = activeOrganisation?.organisation;

  const steps = [
    {
      id: "org",
      label: "Set up your organisation",
      done: Boolean(org),
      href: null,
    },
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
      id: "register",
      label: "Complete ESFA registration",
      done: false,
      href: "/register",
    },
    // No "connect a donor DAS account" step: donor links are created in the
    // employer portal (the donor side), and this portal has no page for it.
    // The tile pointed at /donor-links, which does not exist here.
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

// ─── Workspace card ───────────────────────────────────────────────────────────

function WorkspaceCard({ activeOrganisation }) {
  const org = activeOrganisation?.organisation;
  if (!org) return null;

  const address = [org.address, org.city, org.postcode, org.country]
    .filter(Boolean)
    .join(", ");

  return (
    <Card className="overflow-hidden">
      <div
        className="flex items-center gap-3 px-5 py-4"
        style={{
          background:
            "linear-gradient(135deg, var(--color-primary-950) 0%, var(--color-primary-900) 100%)",
        }}
      >
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
        >
          <Workflow
            className="h-4.5 w-4.5 text-white"
            strokeWidth={1.75}
            aria-hidden
          />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">
            {org.name}
          </p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
            /{org.slug}
          </p>
        </div>
      </div>

      <CardContent className="space-y-3.5">
        {address && (
          <DetailRow icon={MapPin} label="Location" value={address} />
        )}
        {org.website && (
          <DetailRow
            icon={Globe}
            label="Website"
            value={org.website.replace(/^https?:\/\//, "")}
            href={org.website}
          />
        )}

        <div className="flex flex-wrap gap-1.5 border-t border-neutral-100 pt-3.5">
          <TextBadge variant="light" color="blue" size="xs">
            Flow
          </TextBadge>
          <TextBadge variant="light" color="green" size="xs">
            <CheckCircle2 className="h-3 w-3" aria-hidden />
            Active
          </TextBadge>
          {org.country && (
            <TextBadge variant="light" color="gray" size="xs">
              {org.country}
            </TextBadge>
          )}
        </div>
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
  const greeting = getGreeting(user?.timezone);
  const profileStatus = getProfileStatus(user);

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

      {/* Growth flow hub — live SME KPIs, pipeline, needs-you, roster */}
      <SmeDashboard />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <QuickActionsCard />
          <GettingStartedCard
            user={user}
            activeOrganisation={activeOrganisation}
            profileStatus={profileStatus}
          />
        </div>

        <div className="space-y-6">
          <WorkspaceCard activeOrganisation={activeOrganisation} />
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
