import {
  BarChart3,
  Briefcase,
  ClipboardList,
  CreditCard,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  Settings,
  UserCircle,
  UserPlus,
} from "lucide-react";

export const NAV_SECTIONS = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
      { label: "Analytics", href: "/analytics", icon: BarChart3 },
    ],
  },
  {
    title: "Talent",
    items: [
      { label: "Apprentices", href: "/apprentices", icon: GraduationCap },
      {
        label: "Recruitment",
        href: "/jobs",
        icon: Briefcase,
        children: [
          { label: "Job Posts", href: "/jobs" },
          { label: "Applications", href: "/applications" },
        ],
      },
      { label: "Onboarding", href: "/onboarding", icon: UserPlus },
      { label: "Assessments", href: "/assessments", icon: ClipboardList },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Billing", href: "/billing", icon: CreditCard },
      { label: "Profile", href: "/profile", icon: UserCircle },
      { label: "Settings", href: "/settings", icon: Settings },
      { label: "Help & Docs", href: "/help", icon: HelpCircle },
    ],
  },
];
