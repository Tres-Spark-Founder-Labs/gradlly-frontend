import { Calendar, CheckCircle, Clock, MessageSquare } from "lucide-react";

import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { cn } from "@/utils/helper";

const FEED = [
  {
    icon: Clock,
    label: "OTJ session pending approval",
    detail: "REST API pagination research · 3.5h",
    time: "2h ago",
    color: "warning",
  },
  {
    icon: CheckCircle,
    label: "Portfolio evidence approved",
    detail: "Unit test suite → S4, S13",
    time: "Yesterday",
    color: "success",
  },
  {
    icon: MessageSquare,
    label: "New message from Sarah (tutor)",
    detail: "",
    time: "1 day ago",
    color: "info",
  },
  {
    icon: Calendar,
    label: "Progress review booked",
    detail: "10 Apr 2025 · Tripartite",
    time: "2 days ago",
    color: "primary",
  },
];

const DOT = {
  warning: "bg-warning-100 text-warning-600",
  success: "bg-success-100 text-success-600",
  info: "bg-info-100 text-info-600",
  primary: "bg-primary-100 text-primary-700",
};

export function DashboardActivity() {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-sm font-semibold text-neutral-800">
          Recent activity
        </h2>
      </CardHeader>
      <CardContent className="py-0 pb-2">
        {FEED.map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-3 py-3 border-b border-neutral-100 last:border-0"
          >
            <div
              className={cn(
                "p-1.5 rounded-lg shrink-0 mt-0.5",
                DOT[item.color],
              )}
            >
              <item.icon size={13} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-neutral-800 leading-snug">
                {item.label}
              </p>
              {item.detail && (
                <p className="text-xs text-neutral-400 mt-0.5">{item.detail}</p>
              )}
            </div>
            <span className="text-xs text-neutral-400 shrink-0 whitespace-nowrap">
              {item.time}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
