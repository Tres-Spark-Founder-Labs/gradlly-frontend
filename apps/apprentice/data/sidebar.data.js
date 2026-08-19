import {
  BarChart3,
  BookMarked,
  BookOpen,
  ClipboardCheck,
  ClipboardList,
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
        label: "Portfolio",
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
  /**
   * The "Curriculum" section is gone. It held two entries: "Curriculum", which
   * was a second link to the evidence library now reached at /portfolio, and
   * "Analytics", which belongs with the rest of the learner's own data.
   * "Curriculum" is authoring-tool language and names nothing in the PRD.
   */
  {
    title: "Reporting",
    items: [
      { label: "Analytics", href: "/analytics", icon: BarChart3 },
      { label: "Documents", href: "/reports", icon: FolderOpen },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Profile", href: "/profile", icon: UserCircle },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];
