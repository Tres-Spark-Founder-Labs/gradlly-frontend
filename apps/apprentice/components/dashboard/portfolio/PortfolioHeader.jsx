import { Download, Plus } from "lucide-react";

import Button from "@/components/ui/Button";

export function PortfolioHeader({ onAddEvidence }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-neutral-900">
              Portfolio &amp; KSBs
            </h1>
            <span className="text-xs font-semibold text-primary-700 bg-primary-50 border border-primary-200 px-2.5 py-1 rounded-full">
              38 KSBs · maps to EPA
            </span>
          </div>
          <p className="mt-1.5 text-sm text-neutral-500 max-w-2xl leading-relaxed">
            Your evidence library, mapped to the knowledge, skills &amp;
            behaviours in your standard. This portfolio underpins your EPA
            professional discussion (AM2).
          </p>
          <p className="mt-1 text-xs text-neutral-400">
            Jamie Okafor · Software Developer L4 · ST0116 v1.1 · Birmingham Met
            College
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="shrink-0"
            startIcon={<Download size={14} />}
          >
            Export showcase
          </Button>
          <Button
            size="sm"
            className="shrink-0"
            startIcon={<Plus size={14} />}
            onClick={onAddEvidence}
          >
            Add evidence
          </Button>
        </div>
      </div>
    </div>
  );
}
