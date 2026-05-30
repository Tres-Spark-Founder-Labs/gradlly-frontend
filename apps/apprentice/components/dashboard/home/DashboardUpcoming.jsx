import { BookOpen, Calendar, GraduationCap, Target } from "lucide-react";

import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { cn } from "@/utils/helper";

const ITEMS = [
  {
    icon: BookOpen,
    label: "Workshop: Secure coding practices",
    date: "24 Mar 2025",
    color: "warning",
    urgent: true,
  },
  {
    icon: Calendar,
    label: "Progress review — tripartite",
    date: "10 Apr 2025",
    color: "primary",
    urgent: false,
  },
  {
    icon: Target,
    label: "Portfolio: evidence 2 more KSBs",
    date: "End of April",
    color: "info",
    urgent: false,
  },
  {
    icon: GraduationCap,
    label: "EPA-prep: choose project area",
    date: "By May 2025",
    color: "success",
    urgent: false,
  },
];

const C = {
  warning: "bg-warning-100 text-warning-600",
  primary: "bg-primary-100 text-primary-700",
  info: "bg-info-100 text-info-700",
  success: "bg-success-100 text-success-700",
};

export function DashboardUpcoming() {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-sm font-semibold text-neutral-800">Upcoming</h2>
      </CardHeader>
      <CardContent className="py-0 pb-2">
        {ITEMS.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 py-3 border-b border-neutral-100 last:border-0"
          >
            <div className={cn("p-1.5 rounded-lg shrink-0", C[item.color])}>
              <item.icon size={13} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-neutral-800 leading-snug">
                {item.label}
              </p>
              <p
                className={cn(
                  "text-xs mt-0.5",
                  item.urgent
                    ? "text-warning-600 font-medium"
                    : "text-neutral-400",
                )}
              >
                {item.date}
              </p>
            </div>
            {item.urgent && (
              <span className="text-xs font-semibold text-warning-700 bg-warning-100 px-1.5 py-0.5 rounded shrink-0">
                Soon
              </span>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
