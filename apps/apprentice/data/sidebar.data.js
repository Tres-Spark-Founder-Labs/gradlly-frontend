import {
  BarChart3,
  BookMarked,
  BookOpen,
  ClipboardCheck,
  HelpCircle,
  LayoutDashboard,
  Settings,
  TrendingUp,
  UserCircle,
  Users,
} from "lucide-react";

export const NAV_SECTIONS = [
  {
    title: "My Learning",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
      { label: "OTJ log ", href: "/otj-logs", icon: BookOpen },
      {
        label: "Portfolio & KSBs",
        href: "/portfolio",
        icon: ClipboardCheck,
      },
      { label: "Milestones ", href: "/progress", icon: TrendingUp },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Reviews ", href: "/curriculum", icon: BookMarked },
      { label: "Messages ", href: "/analytics", icon: BarChart3 },
    ],
  },
  {
    title: "Programme",
    items: [
      { label: "Training plan", href: "/reports", icon: BarChart3 },
      { label: "English & maths ", href: "/learners", icon: Users },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Profile", href: "/profile", icon: UserCircle },
      { label: "Settings", href: "/settings", icon: Settings },
      { label: "Help & Docs", href: "/help", icon: HelpCircle },
    ],
  },
];
