import {
  ClipboardCheck,
  BarChart3,
  Briefcase,
  CheckSquare,
  ClipboardList,
  FileText,
  Bell,
  Building2,
  LayoutDashboard,
  MessageCircle,
  PoundSterling,
  Settings,
  SlidersHorizontal,
  TrendingUp,
  UserCircle,
  UserPlus,
  Users,
} from "lucide-react";

export const NAV_SECTIONS = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
      {
        label: "Analytics",
        href: "/analytics",
        icon: BarChart3,
        /**
         * Both children are built features that were reachable only by typing
         * the URL: F1.4.1 Levy ROI Report and F1.4.2 Provider Performance
         * Comparison. Labelled for what they show rather than by their route
         * segment — "Cost" and "Performance" say nothing about which numbers
         * are inside.
         */
        children: [
          {
            label: "Levy ROI report",
            href: "/analytics/cost",
            icon: PoundSterling,
          },
          {
            label: "Provider performance",
            href: "/analytics/performance",
            icon: TrendingUp,
          },
        ],
      },
    ],
  },
  {
    title: "Apprenticeships",
    items: [
      { label: "My Apprentices", href: "/apprentices", icon: Users },
      // F2.2.3 AC6 — the employer is notified when a review completes, so
      // they need somewhere to open it.
      { label: "Progress Reviews", href: "/reviews", icon: ClipboardCheck },
      {
        label: "Commitments",
        href: "/commitments",
        icon: ClipboardList,
        // Live from the board (F1.3.1 AC5) — see liveBadges in Sidebar.jsx.
      },
      {
        label: "OTJ Approvals",
        href: "/otj-approvals",
        icon: CheckSquare,
      },
      { label: "Messages", href: "/messages", icon: MessageCircle },
    ],
  },
  {
    title: "Levy & Finance",
    items: [
      { label: "Levy Dashboard", href: "/levy-dashboard", icon: PoundSterling },
      { label: "Levy Transfer", href: "/levy-transfer", icon: Briefcase },
      // F4.1.4 — reachable from the nav, not just by typing the URL.
      {
        label: "Donor Analytics",
        href: "/donor-analytics",
        icon: TrendingUp,
      },
      { label: "Reports", href: "/reports", icon: FileText },
      /**
       * Manual entry of the figures DAS would otherwise supply, for
       * deployments with no ESFA connection (F1.1.1, F1.1.2, F1.1.5, F4.1.1).
       *
       * It sits here rather than under Settings because the route is
       * /levy-data: a breadcrumb that disagrees with the sidebar is worse than
       * either placement on its own. "admin" is hierarchy-aware — owners
       * satisfy it — and matches @Roles(OWNER, ADMIN) on the API.
       */
      {
        label: "Levy Data",
        href: "/levy-data",
        icon: SlidersHorizontal,
        requiresRole: "admin",
      },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Profile", href: "/profile", icon: UserCircle },
      {
        label: "Settings",
        href: "/settings",
        icon: Settings,
        children: [
          {
            label: "Organisation",
            href: "/settings/organisation",
            icon: Building2,
            requiresRole: "owner",
          },
          {
            label: "Invitations",
            href: "/settings/invitations",
            icon: UserPlus,
          },
          {
            label: "Notifications",
            href: "/settings/notifications",
            icon: Bell,
          },
        ],
      },
    ],
  },
];
