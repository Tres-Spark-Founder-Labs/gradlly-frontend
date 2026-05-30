import { CheckCircle, Clock, Edit3, ExternalLink, Plus } from "lucide-react";

import Button from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { cn } from "@/utils/helper";

const EVIDENCE = [
  {
    title: "Inventory API — pagination & error handling (code + README)",
    type: "Code",
    date: "18 Mar 2025",
    ksbs: ["K7", "S1", "S11", "S17"],
    status: "approved",
  },
  {
    title: "Unit test suite — checkout service",
    type: "Code",
    date: "6 Mar 2025",
    ksbs: ["K12", "S4", "S6", "S13"],
    status: "approved",
  },
  {
    title: "Sprint retro reflection & team contribution",
    type: "Reflection",
    date: "12 Mar 2025",
    ksbs: ["K5", "K6", "B4"],
    status: "approved",
  },
  {
    title: "Database schema design (SQL + MongoDB)",
    type: "Design",
    date: "27 Feb 2025",
    ksbs: ["K10", "S3"],
    status: "approved",
  },
  {
    title: "Debugging case study — race-condition fix",
    type: "Case study",
    date: "14 Mar 2025",
    ksbs: ["S7", "K9"],
    status: "in_review",
  },
  {
    title: "Stakeholder demo presentation",
    type: "Presentation",
    date: "10 Mar 2025",
    ksbs: ["S15", "B7"],
    status: "draft",
  },
  {
    title: "Witness testimony — line manager (collaboration & integrity)",
    type: "Testimony",
    date: "1 Mar 2025",
    ksbs: ["B4", "B5"],
    status: "approved",
  },
];

const STATUS = {
  approved: {
    label: "Approved",
    Icon: CheckCircle,
    cls: "text-success-700 bg-success-50 border-success-200",
  },
  in_review: {
    label: "In review",
    Icon: Clock,
    cls: "text-warning-700 bg-warning-50 border-warning-200",
  },
  draft: {
    label: "Draft",
    Icon: Edit3,
    cls: "text-neutral-600 bg-neutral-50 border-neutral-200",
  },
};

function EvidenceRow({ item }) {
  const s = STATUS[item.status];
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-neutral-100 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-800 leading-snug">
          {item.title}
        </p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className="text-xs text-neutral-400">{item.date}</span>
          <span className="text-neutral-200">·</span>
          <span className="text-xs text-neutral-500">{item.type}</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {item.ksbs.map((k) => (
            <span
              key={k}
              className="text-xs bg-primary-50 text-primary-700 border border-primary-100 px-1.5 py-0.5 rounded font-medium"
            >
              {k}
            </span>
          ))}
        </div>
      </div>
      <span
        className={cn(
          "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border shrink-0",
          s.cls,
        )}
      >
        <s.Icon size={11} />
        {s.label}
      </span>
    </div>
  );
}

const TYPE_LABEL = {
  code: "Code",
  document: "Document",
  screenshot: "Screenshot",
  presentation: "Presentation",
  reflection: "Reflection",
  testimony: "Testimony",
  video: "Video",
  link: "Link",
};

export function PortfolioEvidenceList({
  activeKSB,
  newEvidence = [],
  onAddEvidence,
}) {
  const fresh = newEvidence.map((e) => ({
    title: e.title,
    type: TYPE_LABEL[e.type] ?? e.type,
    date: e.date,
    ksbs: e.ksbs,
    status: e.status,
  }));
  const all = [...fresh, ...EVIDENCE];
  const items = activeKSB ? all.filter((e) => e.ksbs.includes(activeKSB)) : all;
  const total = 31 + newEvidence.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <h2 className="text-sm font-semibold text-neutral-800">
              Evidence library
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              {activeKSB
                ? `Filtered by ${activeKSB}`
                : `Showing ${Math.min(items.length, 7)} of ${total} pieces`}
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="shrink-0"
            startIcon={<Plus size={13} />}
            onClick={onAddEvidence}
          >
            Add evidence
          </Button>
        </div>
      </CardHeader>
      <CardContent className="py-0 pb-2">
        {items.length === 0 ? (
          <p className="text-sm text-neutral-400 py-8 text-center">
            No evidence mapped to {activeKSB} yet.
          </p>
        ) : (
          items.map((item, i) => (
            <EvidenceRow key={item.title + i} item={item} />
          ))
        )}
      </CardContent>
      {!activeKSB && (
        <div className="px-6 py-4 border-t border-neutral-100 flex items-center justify-between">
          <span className="text-xs text-neutral-400">
            Showing {Math.min(items.length, 7)} of {total} pieces
          </span>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0"
            endIcon={<ExternalLink size={13} />}
          >
            View all
          </Button>
        </div>
      )}
    </Card>
  );
}
