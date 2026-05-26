import {
  Activity,
  BarChart3,
  GitBranch,
  HelpCircle,
  LayoutDashboard,
  Link2,
  Settings,
  UserCircle,
  Wand2,
  Zap,
} from "lucide-react";

export const NAV_SECTIONS = [
  {
    title: "Workspace",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
      { label: "My Flows", href: "/flows", icon: GitBranch },
      { label: "Flow Builder", href: "/builder", icon: Wand2 },
    ],
  },
  {
    title: "Integrations",
    items: [
      { label: "Connections", href: "/connections", icon: Link2 },
      {
        label: "Automation",
        href: "/webhooks",
        icon: Zap,
        children: [
          { label: "Webhooks", href: "/webhooks" },
          { label: "Activity Logs", href: "/logs" },
        ],
      },
    ],
  },
  {
    title: "Analytics",
    items: [
      { label: "Reports", href: "/reports", icon: BarChart3 },
      { label: "Activity", href: "/logs", icon: Activity },
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
