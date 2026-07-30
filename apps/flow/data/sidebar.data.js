import {
  Banknote,
  Bell,
  Building2,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  FileSignature,
  FileText,
  LayoutDashboard,
  MessageCircle,
  Settings,
  Sparkles,
  UserCircle,
  UserPlus,
  Users,
} from "lucide-react";

export const NAV_SECTIONS = [
  {
    title: "Workspace",
    items: [{ label: "Dashboard", href: "/", icon: LayoutDashboard }],
  },
  {
    title: "Talent",
    items: [
      { label: "AI Programmes", href: "/courses", icon: Sparkles },
      { label: "Apprentices", href: "/learners", icon: Users },
      { label: "Messages", href: "/messages", icon: MessageCircle },
    ],
  },
  {
    title: "Delivery",
    items: [
      { label: "OTJ Approvals", href: "/approvals", icon: ClipboardCheck },
      {
        label: "Commitment Statements",
        href: "/commitment-statements",
        icon: FileSignature,
      },
      { label: "Reviews", href: "/reviews", icon: CalendarCheck },
      { label: "Funding", href: "/funding", icon: Banknote },
    ],
  },
  {
    title: "Reporting",
    items: [{ label: "SME Analytics", href: "/analytics", icon: FileText }],
  },
  {
    title: "Onboarding",
    items: [
      { label: "Eligibility", href: "/eligibility", icon: CheckCircle2 },
      { label: "ESFA Registration", href: "/register", icon: FileText },
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
