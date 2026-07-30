"use client";

import { Bell, BookOpen, Building2, ShieldCheck, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { TabNav } from "@/components/ui/TabNav";
import { MfaSetup } from "@/features/auth/components/MfaSetup";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { useRoleAccess } from "@/features/auth/hooks/useRoleAccess";
import { InvitationsTable } from "@/features/invitations/components/InvitationsTable";
import { NotificationsPanel } from "@/features/notifications/components/NotificationsPanel";
import { UpdateOrganizationForm } from "@/features/organization/components/UpdateOrganizationForm";
import { ProgrammesPanel } from "@/features/standards/components/ProgrammesPanel";

const TAB_META = {
  organisation: {
    label: "Organisation",
    icon: Building2,
    description: "Manage your organisation's details and contact information.",
  },
  invitations: {
    label: "Invitations",
    icon: UserPlus,
    description:
      "Invite people to your organisation and manage pending invites.",
  },
  notifications: {
    label: "Notifications",
    icon: Bell,
    description: "Your latest activity, alerts and updates.",
  },
  security: {
    label: "Security",
    icon: ShieldCheck,
    description: "Two-factor authentication and login security.",
  },
  standards: {
    label: "Standards",
    icon: BookOpen,
    description:
      "Manage apprenticeship programmes and standards used in enrolments.",
  },
};

export function SettingsView({ activeTab = "invitations" }) {
  const router = useRouter();
  const { isOwner } = useRoleAccess();
  const { activeOrganisation } = useAuthUser();
  const hasOrg = Boolean(activeOrganisation?.organisation);

  // The Organisation tab is only available to owners of an existing org.
  const tabs = useMemo(() => {
    const base = [
      { value: "invitations", ...TAB_META.invitations },
      { value: "notifications", ...TAB_META.notifications },
      { value: "security", ...TAB_META.security },
    ];
    if (isOwner && hasOrg) {
      base.unshift({ value: "organisation", ...TAB_META.organisation });
      base.push({ value: "standards", ...TAB_META.standards });
    }
    return base;
  }, [isOwner, hasOrg]);

  // Page protection: fall back to a permitted tab if the requested one is not
  // available to this user (e.g. a non-owner deep-linking to /settings/organisation).
  const resolvedTab = tabs.some((t) => t.value === activeTab)
    ? activeTab
    : "invitations";

  const current = TAB_META[resolvedTab];
  const setTab = (value) => router.push(`/settings/${value}`);

  return (
    <div className="space-y-6">
      <PageSubheader
        icon={current.icon}
        eyebrow="Settings"
        title={current.label}
        description={current.description}
      />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Tab rail: horizontal on small screens, vertical on large screens. */}
        <aside className="lg:w-60 lg:shrink-0">
          <div className="rounded-xl border border-neutral-200 bg-white p-2 shadow-sm lg:sticky lg:top-4">
            <TabNav
              tabs={tabs}
              value={resolvedTab}
              onChange={setTab}
              ariaLabel="Settings sections"
            />
          </div>
        </aside>

        {/* Active panel */}
        <section
          className="min-w-0 flex-1"
          role="tabpanel"
          aria-label={resolvedTab}
        >
          {resolvedTab === "organisation" ? (
            <UpdateOrganizationForm />
          ) : resolvedTab === "invitations" ? (
            <InvitationsTable />
          ) : resolvedTab === "standards" ? (
            <ProgrammesPanel />
          ) : resolvedTab === "security" ? (
            <MfaSetup />
          ) : (
            <NotificationsPanel />
          )}
        </section>
      </div>
    </div>
  );
}
