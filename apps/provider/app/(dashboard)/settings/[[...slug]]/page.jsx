import { createPageSeo } from "@/utils/metadata";

import { SettingsView } from "./SettingsView";

export const { metadata } = createPageSeo({
  title: "Settings",
  description: "Manage your organisation invitations and notifications.",
  path: "/settings",
  noIndex: true,
});

const VALID_TABS = ["organisation", "invitations", "notifications", "security"];

export default async function SettingsPage({ params }) {
  const { slug } = await params;
  const requested = Array.isArray(slug) ? slug[0] : undefined;
  const activeTab = VALID_TABS.includes(requested) ? requested : "invitations";

  return <SettingsView activeTab={activeTab} />;
}
