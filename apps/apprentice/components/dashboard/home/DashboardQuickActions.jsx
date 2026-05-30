import {
  ClipboardList,
  FileText,
  MessageSquare,
  PlusCircle,
  Timer,
} from "lucide-react";
import Link from "next/link";

import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { cn } from "@/utils/helper";

const ACTIONS = [
  {
    icon: Timer,
    label: "Log off-the-job",
    sub: "Add OTJ hours",
    href: null,
    color: "primary",
    onClick: true,
  },
  {
    icon: PlusCircle,
    label: "Add portfolio evidence",
    sub: "Evidence a KSB",
    href: "/assessments",
    color: "info",
  },
  {
    icon: MessageSquare,
    label: "Message tutor",
    sub: "Sarah Chen",
    href: "/analytics",
    color: "success",
  },
  {
    icon: ClipboardList,
    label: "Prep next review",
    sub: "Due 10 Apr",
    href: "/curriculum",
    color: "warning",
  },
  {
    icon: FileText,
    label: "View training plan",
    sub: "Full schedule",
    href: "/reports",
    color: "neutral",
  },
];

const T = {
  primary: {
    wrap: "hover:border-primary-200 hover:bg-primary-50/40",
    iconBg: "bg-primary-100",
    icon: "text-primary-700",
    text: "group-hover:text-primary-700",
  },
  info: {
    wrap: "hover:border-info-200 hover:bg-info-50/40",
    iconBg: "bg-info-100",
    icon: "text-info-700",
    text: "group-hover:text-info-700",
  },
  success: {
    wrap: "hover:border-success-200 hover:bg-success-50/40",
    iconBg: "bg-success-100",
    icon: "text-success-700",
    text: "group-hover:text-success-700",
  },
  warning: {
    wrap: "hover:border-warning-200 hover:bg-warning-50/40",
    iconBg: "bg-warning-100",
    icon: "text-warning-700",
    text: "group-hover:text-warning-700",
  },
  neutral: {
    wrap: "hover:border-neutral-200 hover:bg-neutral-50",
    iconBg: "bg-neutral-100",
    icon: "text-neutral-600",
    text: "group-hover:text-neutral-700",
  },
};

export function DashboardQuickActions({ onLogSession }) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-sm font-semibold text-neutral-800">
          Quick actions
        </h2>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {ACTIONS.map((a) => {
            const t = T[a.color];
            const cls = cn(
              "group flex flex-col items-start gap-3 p-4 rounded-xl border border-neutral-100 transition-all duration-150 cursor-pointer",
              t.wrap,
            );
            const inner = (
              <>
                <div
                  className={cn("p-2.5 rounded-lg transition-colors", t.iconBg)}
                >
                  <a.icon size={17} className={t.icon} />
                </div>
                <div>
                  <p
                    className={cn(
                      "text-xs font-semibold text-neutral-800 transition-colors leading-snug",
                      t.text,
                    )}
                  >
                    {a.label}
                  </p>
                  <p className="text-xs text-neutral-400 mt-0.5">{a.sub}</p>
                </div>
              </>
            );
            return a.onClick ? (
              <button
                key={a.label}
                type="button"
                className={cls}
                onClick={onLogSession}
              >
                {inner}
              </button>
            ) : (
              <Link key={a.label} href={a.href} className={cls}>
                {inner}
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
