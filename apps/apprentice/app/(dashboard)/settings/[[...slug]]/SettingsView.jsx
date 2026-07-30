"use client";

import { Bell, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { TabNav } from "@/components/ui/TabNav";
import { MfaSetup } from "@/features/auth/components/MfaSetup";
import { NotificationsPanel } from "@/features/notifications/components/NotificationsPanel";

const TABS = [
  {
    value: "notifications",
    label: "Notifications",
    icon: Bell,
    description: "Your latest activity, alerts and updates.",
  },
  {
    value: "security",
    label: "Security",
    icon: ShieldCheck,
    description: "Two-factor authentication and login security.",
  },
];

export function SettingsView({ activeTab = "notifications" }) {
  const router = useRouter();
  const resolvedTab = TABS.some((t) => t.value === activeTab)
    ? activeTab
    : "notifications";
  const current = TABS.find((t) => t.value === resolvedTab);
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
        <aside className="lg:w-60 lg:shrink-0">
          <div className="rounded-lg border border-neutral-200 bg-white p-2 shadow-sm lg:sticky lg:top-4">
            <TabNav
              tabs={TABS}
              value={resolvedTab}
              onChange={setTab}
              ariaLabel="Settings sections"
            />
          </div>
        </aside>

        <section
          className="min-w-0 flex-1"
          role="tabpanel"
          aria-label={resolvedTab}
        >
          {resolvedTab === "security" ? <MfaSetup /> : <NotificationsPanel />}
        </section>
      </div>
    </div>
  );
}
