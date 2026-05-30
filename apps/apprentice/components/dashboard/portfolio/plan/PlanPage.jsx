"use client";

import { BookOpen, CalendarDays, CheckCircle, Target } from "lucide-react";
import toast from "react-hot-toast";

import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { KSB_DATA } from "@/data/portfolio.data";
import { cn } from "@/utils/helper";

import { PlanPageGapCard } from "./PlanPageGapCard";
import { PlanPageSuggestions } from "./PlanPageSuggestions";
import { PlanPageTimeline } from "./PlanPageTimeline";
import { GAP_SUGGESTIONS, usePlanPageState } from "./usePlanPageState";

const ALL_GAPS = KSB_DATA.filter((k) =>
  ["not_started", "in_progress"].includes(k.state),
);
const FILTERS = [
  "All gaps",
  "Unplanned",
  "Planned",
  "Done",
  "Knowledge",
  "Skills",
  "Behaviours",
];
const DAYS_LEFT = 270;

const CARDS = (doneCount, planCount) => [
  {
    icon: Target,
    label: "KSBs to evidence",
    val: 16 - doneCount,
    sub: "of 16 gaps",
    iconBg: "bg-warning-100",
    iconC: "text-warning-700",
    valC: "text-warning-900",
  },
  {
    icon: BookOpen,
    label: "Planned",
    val: planCount,
    sub: "in your timeline",
    iconBg: "bg-primary-100",
    iconC: "text-primary-700",
    valC: "text-primary-900",
  },
  {
    icon: CheckCircle,
    label: "Done",
    val: doneCount,
    sub: "evidenced this session",
    iconBg: "bg-success-100",
    iconC: "text-success-700",
    valC: "text-success-900",
  },
  {
    icon: CalendarDays,
    label: "Days to gateway",
    val: DAYS_LEFT,
    sub: "15 Dec 2025",
    iconBg: "bg-info-100",
    iconC: "text-info-700",
    valC: "text-info-900",
  },
];

export function PlanPage() {
  const s = usePlanPageState();
  const {
    totalEvidenced,
    unplannedCount,
    doneCount,
    planCount,
    filter,
    setFilter,
  } = s;
  const pct = Math.round((totalEvidenced / 38) * 100);

  const filteredGaps = ALL_GAPS.filter((k) => {
    const st = s.gapStatus(k.code);
    if (filter === "Unplanned") return st === "unplanned";
    if (filter === "Planned") return st === "planned";
    if (filter === "Done") return st === "done";
    if (filter === "Knowledge") return k.group === "K";
    if (filter === "Skills") return k.group === "S";
    if (filter === "Behaviours") return k.group === "B";
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <span className="inline-flex text-xs font-medium text-neutral-500 bg-neutral-100 px-3 py-1.5 rounded-full mb-2">
            Thursday, 20 March 2025 · Gateway 15 Dec 2025 · ~{DAYS_LEFT} days
          </span>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-neutral-900">
              Plan your evidence
            </h1>
            <span className="text-xs font-semibold text-primary-700 bg-primary-50 border border-primary-200 px-2.5 py-1 rounded-full">
              Goal: 38 / 38 KSBs
            </span>
          </div>
          <p className="mt-1.5 text-sm text-neutral-500 max-w-2xl">
            16 KSBs still need evidence before your December gateway. Plan how
            and when you&apos;ll cover each one.
          </p>
          <p className="mt-1 text-xs text-neutral-400">
            Jamie Okafor · Software Developer L4 · ST0116 v1.1
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={() => toast.success("Plan shared with Sarah Chen.")}
          >
            Share with tutor
          </Button>
          <Button
            size="sm"
            className="shrink-0"
            onClick={() => toast.success("Plan saved.")}
          >
            Save plan
          </Button>
        </div>
      </div>

      {/* ── Stat cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {CARDS(doneCount, planCount).map((c, i) => (
          <div
            key={c.label}
            className="surface-card p-5 flex flex-col gap-3"
            style={{
              animation: "slide-up 320ms var(--ease-out) both",
              animationDelay: `${i * 60}ms`,
            }}
          >
            <div className={cn("p-2 rounded-lg w-fit", c.iconBg)}>
              <c.icon size={18} className={c.iconC} />
            </div>
            <div>
              <div className={cn("text-2xl font-bold tracking-tight", c.valC)}>
                {c.val}
              </div>
              <div className="text-xs font-medium text-neutral-500 mt-0.5">
                {c.label}
              </div>
            </div>
            <p className="text-xs text-neutral-400">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Progress bar ───────────────────────────────────────────────── */}
      <div className="surface-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-800">
            {totalEvidenced} of 38 KSBs evidenced
          </h2>
          <span className="text-2xl font-bold text-primary-700">{pct}%</span>
        </div>
        <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-linear-to-r from-primary-600 to-primary-400 transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-400">0</span>
          <p
            className={cn(
              "text-xs font-semibold",
              unplannedCount > 0 ? "text-warning-600" : "text-success-600",
            )}
          >
            {unplannedCount > 0
              ? `⚠ ${unplannedCount} KSBs have no plan yet`
              : "✓ Every gap has a plan"}
          </p>
          <span className="text-xs text-neutral-400">38</span>
        </div>
      </div>

      {/* ── Main grid: gaps + suggestions sidebar ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-neutral-800">
                    Gap cards
                  </h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {filteredGaps.length} KSB
                    {filteredGaps.length !== 1 ? "s" : ""} shown · expand to
                    plan
                  </p>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {FILTERS.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFilter(f)}
                      className={cn(
                        "px-2.5 py-1 text-xs font-medium rounded-full border transition-colors",
                        filter === f
                          ? "bg-primary-700 border-primary-700 text-white"
                          : "bg-white border-neutral-200 text-neutral-600 hover:border-primary-300 hover:text-primary-700",
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {filteredGaps.map((k) => (
                <PlanPageGapCard
                  key={k.code}
                  ksb={k}
                  suggestion={GAP_SUGGESTIONS[k.code]}
                  status={s.gapStatus(k.code)}
                  planItem={s.planItems.find((i) => i.ksbs.includes(k.code))}
                  onAdd={s.addItem}
                  onRemove={s.removeItem}
                  onUpdate={s.updateItem}
                />
              ))}
              {filteredGaps.length === 0 && (
                <p className="text-sm text-neutral-400 text-center py-8">
                  No KSBs match this filter.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <PlanPageSuggestions
            projOpen={s.projOpen}
            setProjOpen={s.setProjOpen}
            projSelected={s.projSelected}
            setProjSelected={s.setProjSelected}
            onAddProject={s.addProject}
            sessions={s.availableSessions}
            onConvert={s.convertSession}
            testimonyDone={s.testimonyDone}
            onRequestTestimony={s.requestTestimony}
          />
        </div>
      </div>

      {/* ── Timeline (appears after first plan item) ────────────────────── */}
      {s.planItems.length > 0 && (
        <PlanPageTimeline
          items={s.planItems}
          onUpdate={s.updateItem}
          onRemove={s.removeItem}
        />
      )}

      {/* ── Celebration panel ───────────────────────────────────────────── */}
      {totalEvidenced >= 38 && (
        <div
          className="p-8 rounded-xl text-center space-y-3"
          style={{
            background:
              "linear-gradient(135deg, var(--color-primary-800), var(--color-primary-600))",
          }}
        >
          <p className="text-4xl">🎉</p>
          <p className="text-xl font-bold text-white">
            Every KSB has evidence!
          </p>
          <p className="text-sm text-white/70">
            Review evidence strength before gateway, then export your showcase.
          </p>
          <button
            onClick={() => toast.success("Showcase exported.")}
            className="mt-1 inline-flex items-center h-9 px-4 text-sm font-semibold text-primary-800 bg-white rounded-lg hover:bg-neutral-100 transition-colors"
          >
            Export showcase
          </button>
        </div>
      )}

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 pt-4 border-t border-neutral-100 flex-wrap">
        <Button
          size="sm"
          className="shrink-0"
          onClick={() => toast.success("Plan saved.")}
        >
          Save plan
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={() => toast.success("Plan shared with tutor.")}
        >
          Share with tutor
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={() => toast.success("Target dates added to calendar.")}
        >
          Add to calendar
        </Button>
      </div>
    </div>
  );
}
