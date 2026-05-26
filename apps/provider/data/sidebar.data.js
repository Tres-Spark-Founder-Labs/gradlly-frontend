import {
  AlertTriangle,
  Archive,
  BarChart3,
  BookOpen,
  Building2,
  ClipboardList,
  FileText,
  HelpCircle,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Shield,
  UserCircle,
  Users,
  Users2,
} from "lucide-react";

export const NAV_SECTIONS = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
      { label: "Cohort", href: "/cohort", icon: Users2 },
      { label: "At-Risk Queue", href: "/at-risk", icon: AlertTriangle },
    ],
  },
  {
    title: "Compliance",
    items: [
      { label: "Ofsted Hub", href: "/ofsted-hub", icon: Shield },
      { label: "QIP", href: "/qip", icon: ClipboardList },
      { label: "ILR & DAS", href: "/ilr-das", icon: FileText },
      { label: "Evidence Vault", href: "/evidence-vault", icon: Archive },
    ],
  },
  {
    title: "Delivery",
    items: [
      { label: "Reviews", href: "/reviews", icon: MessageSquare },
      { label: "Tutors", href: "/tutors", icon: Users },
      {
        label: "Employers",
        href: "/employers",
        icon: Building2,
        children: [
          { label: "All Employers", href: "/employers" },
          { label: "Commitment Statements", href: "/commitment-statements" },
        ],
      },
    ],
  },
  {
    title: "Insights",
    items: [
      { label: "Reports", href: "/reports", icon: BarChart3 },
      { label: "KSB Coverage", href: "/ksb-coverage", icon: BookOpen },
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
