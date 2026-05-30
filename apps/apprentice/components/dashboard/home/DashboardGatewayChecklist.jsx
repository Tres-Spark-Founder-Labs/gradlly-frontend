import { CheckCircle, Circle, Clock } from "lucide-react";

import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { cn } from "@/utils/helper";

const ITEMS = [
  { label: "English & maths at Level 2", detail: "Complete", state: "done" },
  {
    label: "Off-the-job training",
    detail: "198 / 439h logged",
    state: "partial",
  },
  { label: "Portfolio", detail: "22 / 38 KSBs evidenced", state: "partial" },
  {
    label: "Work-based project title agreed with employer & EPAO",
    detail: "Not started",
    state: "todo",
  },
  {
    label: "Employer confirms performing consistently at standard",
    detail: "Not yet",
    state: "todo",
  },
];

function CheckRow({ item }) {
  const isDone = item.state === "done";
  const isPartial = item.state === "partial";
  return (
    <div className="flex items-start gap-3 py-3.5 border-b border-neutral-100 last:border-0">
      {isDone && (
        <CheckCircle size={17} className="text-success-600 shrink-0 mt-0.5" />
      )}
      {isPartial && (
        <Clock size={17} className="text-warning-500 shrink-0 mt-0.5" />
      )}
      {!isDone && !isPartial && (
        <Circle size={17} className="text-neutral-300 shrink-0 mt-0.5" />
      )}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-medium leading-snug",
            item.state === "todo" ? "text-neutral-400" : "text-neutral-800",
          )}
        >
          {item.label}
        </p>
        <p
          className={cn(
            "text-xs mt-0.5",
            isDone
              ? "text-success-600 font-medium"
              : isPartial
                ? "text-warning-600"
                : "text-neutral-400",
          )}
        >
          {item.detail}
        </p>
      </div>
    </div>
  );
}

export function DashboardGatewayChecklist() {
  const doneCount = ITEMS.filter((i) => i.state === "done").length;
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <h2 className="text-sm font-semibold text-neutral-800">
              Gateway readiness
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              All 5 criteria must be met before your gateway review
            </p>
          </div>
          <span className="text-xs font-semibold text-warning-700 bg-warning-50 border border-warning-200 px-2.5 py-1 rounded-full">
            {doneCount} of {ITEMS.length} ready
          </span>
        </div>
      </CardHeader>
      <CardContent className="py-0 pb-1">
        {ITEMS.map((item) => (
          <CheckRow key={item.label} item={item} />
        ))}
      </CardContent>
    </Card>
  );
}
