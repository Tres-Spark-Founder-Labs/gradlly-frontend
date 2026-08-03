import {
  ClipboardCheck,
  AlertTriangle,
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
  UserCircle,
  UserPlus,
  Users,
  // ── Icons for not-yet-built sections (kept for when they are re-enabled) ──
  // BarChart3,
  // Briefcase,
  // ClipboardList,
  // CreditCard,
  // GraduationCap,
  // UsersRound,
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
      {
        label: "At-Risk Management",
        href: "/at-risk",
        icon: AlertTriangle,
        badge: 5,
      },
      { label: "Messages", href: "/messages", icon: MessageCircle },
    ],
  },
  {
    title: "Levy & Finance",
    items: [
      { label: "Levy Dashboard", href: "/levy-dashboard", icon: PoundSterling },
      { label: "Levy Transfer", href: "/levy-transfer", icon: Briefcase },
      { label: "Reports", href: "/reports", icon: FileText },
    ],
  },
  {
    title: "Recruitment",
    items: [
      {
        label: "Jobs",
        href: "/jobs",
        icon: Briefcase,
        children: [
          { label: "Job Posts", href: "/jobs" },
          { label: "Applications", href: "/applications" },
        ],
      },
      { label: "Onboarding", href: "/onboarding", icon: UserPlus },
    ],
  },
  // ── Talent section: pages not yet built. Re-enable when ready. ──
  // {
  //   title: "Talent",
  //   items: [
  //     { label: "Apprentices", href: "/apprentices", icon: GraduationCap },
  //     {
  //       label: "Recruitment",
  //       href: "/jobs",
  //       icon: Briefcase,
  //       children: [
  //         { label: "Job Posts", href: "/jobs" },
  //         { label: "Applications", href: "/applications" },
  //       ],
  //     },
  //     { label: "Onboarding", href: "/onboarding", icon: UserPlus },
  //     { label: "Assessments", href: "/assessments", icon: ClipboardList },
  //   ],
  // },
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
      // { label: "Billing", href: "/billing", icon: CreditCard },
    ],
  },
];
