import {
  BarChart3,
  BookMarked,
  BookOpen,
  ClipboardCheck,
  ClipboardList,
  FileText,
  FolderOpen,
  LayoutDashboard,
  MessageCircle,
  Route,
  Settings,
  TrendingUp,
  UserCircle,
} from "lucide-react";

export const NAV_SECTIONS = [
  {
    title: "My Learning",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
      { label: "My journey", href: "/journey", icon: Route },
      { label: "My Courses", href: "/courses", icon: BookMarked },
      { label: "OTJ log", href: "/otj-logs", icon: BookOpen },
      {
        label: "Portfolio & KSBs",
        href: "/portfolio",
        icon: ClipboardCheck,
      },
      {
        label: "Assessments",
        href: "/assessments",
        icon: ClipboardList,
      },
      {
        label: "Progress",
        href: "/progress",
        icon: TrendingUp,
      },
      { label: "Messages", href: "/messages", icon: MessageCircle },
    ],
  },
  {
    title: "Curriculum",
    items: [
      { label: "Curriculum", href: "/curriculum", icon: FileText },
      { label: "Analytics", href: "/analytics", icon: BarChart3 },
    ],
  },
  {
    title: "Reporting",
    items: [{ label: "Documents", href: "/reports", icon: FolderOpen }],
  },
  {
    title: "Account",
    items: [
      { label: "Profile", href: "/profile", icon: UserCircle },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];
