import type { CSSProperties } from "react";

export type AppName = "main" | "apprentice" | "employer" | "provider" | "flow";

export type SidebarIconName =
  | "Home"
  | "ChartBar"
  | "Users"
  | "Briefcase"
  | "GraduationCap"
  | "Building2"
  | "Settings"
  | "FileText"
  | "Shield"
  | "Workflow"
  | "Calendar"
  | "Bell"
  | "Search";

export interface SidebarBadgeData {
  text: string;
  color: "neutral" | "success" | "warning" | "danger" | "info";
}

export interface SidebarItemData {
  section?: string;
  label: string;
  icon: SidebarIconName;
  path: string;
  badge?: SidebarBadgeData;
  children?: SidebarItemData[];
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export interface HeaderActionData {
  id: string;
  label: string;
  icon: SidebarIconName;
  href?: string;
}

export interface HeaderData {
  logo: string;
  title: string;
  enableSearch: boolean;
  actions: HeaderActionData[];
}

export interface FooterSectionData {
  title: string;
  links: Array<{ label: string; href: string }>;
}

export interface FooterData {
  copyright: string;
  sections: FooterSectionData[];
}

export interface UserData {
  name: string;
  role: string;
  company: string;
  avatar: string;
  email: string;
}

export interface DashboardTheme {
  name: AppName;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  hover: string;
}

export type DashboardThemeVars = CSSProperties & {
  [key in
    | "--dashboard-primary"
    | "--dashboard-secondary"
    | "--dashboard-accent"
    | "--dashboard-background"
    | "--dashboard-text"
    | "--dashboard-hover"]: string;
};
