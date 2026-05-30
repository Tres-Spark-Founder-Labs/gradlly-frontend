import { CheckCircle, Clock, ExternalLink } from "lucide-react";

import Button from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { cn } from "@/utils/helper";

const SESSIONS = [
  {
    title: "Researched REST API pagination & error handling",
    date: "18 Mar 2025",
    cat: "Self-study",
    status: "pending",
    ksbs: ["K7", "S11", "S17"],
    h: 3.5,
  },
  {
    title: "Agile sprint planning & retro workshop",
    date: "12 Mar 2025",
    cat: "Workshop",
    status: "approved",
    ksbs: ["K5", "K6", "B4"],
    h: 4,
  },
  {
    title: "Unit testing & TDD online module",
    date: "6 Mar 2025",
    cat: "Self-study",
    status: "approved",
    ksbs: ["K12", "S4", "S13"],
    h: 2.5,
  },
  {
    title: "Shadowed senior dev on code review",
    date: "3 Mar 2025",
    cat: "Shadowing",
    status: "approved",
    ksbs: ["K6", "S7", "B6"],
    h: 2,
  },
  {
    title: "Relational vs non-relational databases study",
    date: "27 Feb 2025",
    cat: "Self-study",
    status: "approved",
    ksbs: ["K10", "S3"],
    h: 3,
  },
];

function Session({ s }) {
  const ok = s.status === "approved";
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-neutral-100 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-800 leading-snug">
          {s.title}
        </p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className="text-xs text-neutral-400">{s.date}</span>
          <span className="text-neutral-200">·</span>
          <span className="text-xs text-neutral-500">{s.cat}</span>
          <span className="text-neutral-200">·</span>
          <span
            className={cn(
              "inline-flex items-center gap-1 text-xs font-medium",
              ok ? "text-success-700" : "text-warning-600",
            )}
          >
            {ok ? <CheckCircle size={11} /> : <Clock size={11} />}
            {ok ? "Approved" : "Pending"}
          </span>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {s.ksbs.map((k) => (
            <span
              key={k}
              className="text-xs bg-primary-50 text-primary-700 border border-primary-100 px-1.5 py-0.5 rounded"
            >
              {k}
            </span>
          ))}
        </div>
      </div>
      <div className="text-right shrink-0 pt-0.5">
        <span className="text-base font-bold text-neutral-800">{s.h}h</span>
      </div>
    </div>
  );
}

export function OTJSessionsList() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-neutral-800">
              Recent sessions
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Showing 5 of 47 sessions
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            endIcon={<ExternalLink size={13} />}
          >
            View all
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {SESSIONS.map((s) => (
          <Session key={s.title} s={s} />
        ))}
      </CardContent>
    </Card>
  );
}
