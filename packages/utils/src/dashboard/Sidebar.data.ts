import type { SidebarItemData } from "./types";

export const SIDEBAR_DATA: SidebarItemData[] = [
  {
    section: "Overview",
    label: "Home",
    icon: "Home",
    path: "/",
  },
  {
    section: "Analytics",
    label: "Reports",
    icon: "ChartBar",
    path: "/reports",
    badge: { text: "New", color: "info" },
    collapsible: true,
    defaultExpanded: true,
    children: [
      { label: "KPI Summary", icon: "FileText", path: "/reports/kpi" },
      { label: "Calendar", icon: "Calendar", path: "/reports/calendar" },
    ],
  },
  {
    section: "Management",
    label: "Users",
    icon: "Users",
    path: "/users",
    collapsible: true,
    children: [
      {
        label: "Apprentices",
        icon: "GraduationCap",
        path: "/users/apprentices",
      },
      { label: "Employers", icon: "Briefcase", path: "/users/employers" },
      { label: "Providers", icon: "Building2", path: "/users/providers" },
    ],
  },
  {
    section: "Operations",
    label: "Workflows",
    icon: "Workflow",
    path: "/workflows",
    badge: { text: "3", color: "warning" },
  },
  {
    section: "System",
    label: "Settings",
    icon: "Settings",
    path: "/settings",
    badge: { text: "Admin", color: "neutral" },
  },
];
