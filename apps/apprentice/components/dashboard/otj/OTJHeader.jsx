import { Calendar, Download, Plus } from "lucide-react";

import Button from "@/components/ui/Button";

export function OTJHeader({ data, onLogSession }) {
  const { today, apprentice } = data;

  return (
    <div className="flex flex-col gap-4">
      <span className="inline-flex items-center gap-1.5 self-start text-xs font-medium text-primary-700 bg-primary-50 border border-primary-100 px-3 py-1.5 rounded-full">
        <Calendar size={12} />
        {today.date} · Week {today.week} of your programme
      </span>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-neutral-900">
              Off-the-job training
            </h1>
            <span className="text-xs font-semibold text-primary-700 bg-primary-50 border border-primary-200 px-2.5 py-1 rounded-full">
              {apprentice.standard} · min 439h
            </span>
          </div>
          <p className="mt-1.5 text-sm text-neutral-500 max-w-xl">
            Training during paid hours that builds the knowledge, skills &amp;
            behaviours in your standard
          </p>
          <p className="mt-1 text-xs text-neutral-400">
            {apprentice.name} · {apprentice.role} · {apprentice.college}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="shrink-0"
            startIcon={<Download size={14} />}
          >
            Export hours report
          </Button>
          <Button
            size="sm"
            className="shrink-0"
            startIcon={<Plus size={14} />}
            onClick={onLogSession}
          >
            Log a session
          </Button>
        </div>
      </div>
    </div>
  );
}
