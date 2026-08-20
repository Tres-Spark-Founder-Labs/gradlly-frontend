import {
  BookOpen,
  ClipboardCheck,
  FolderOpen,
  LayoutDashboard,
  MessageCircle,
  Route,
  Settings,
  UserCircle,
} from "lucide-react";

export const NAV_SECTIONS = [
  {
    title: "My Learning",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
      { label: "My journey", href: "/journey", icon: Route },
      { label: "OTJ log", href: "/otj-logs", icon: BookOpen },
      {
        label: "Portfolio",
        href: "/portfolio",
        icon: ClipboardCheck,
      },
      { label: "Messages", href: "/messages", icon: MessageCircle },
    ],
  },
  /**
   * The "Curriculum" section is gone — authoring-tool language naming nothing
   * in the PRD. Its two entries were a second link to the evidence library
   * (now /portfolio) and "Analytics", which is folded into the dashboard.
   *
   * "My Courses", "Assessments" and "Progress" are gone from this list for the
   * same reason: after the §5.2 renames they pointed at /journey, /journey and
   * /otj-logs — pages already listed above them. The routes still resolve via
   * redirects; only the duplicate rows are removed.
   */
  {
    title: "Reporting",
    items: [{ label: "Documents", href: "/documents", icon: FolderOpen }],
  },
  {
    title: "Account",
    items: [
      { label: "Profile", href: "/profile", icon: UserCircle },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];
