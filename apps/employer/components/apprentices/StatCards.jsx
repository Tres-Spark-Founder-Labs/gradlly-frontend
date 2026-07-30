"use client";

import { AlertTriangle, BookOpen, CalendarCheck, Users } from "lucide-react";

import { isFlagged, isOverdue } from "@/features/apprentices/utils/risk-status";

import { T } from "./tokens";

function Card({ icon, accent, bg, value, label, sub, badge, pulse, onClick }) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      className={`rounded-2xl p-5 cursor-pointer transition-shadow hover:shadow-md ${pulse ? "levy-expiry-pulse" : ""}`}
      style={{
        backgroundColor: T.surface,
        border: `1px solid ${T.border}`,
        borderLeft: `3px solid ${accent}`,
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="h-9 w-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: bg }}
        >
          <span style={{ color: accent }}>{icon}</span>
        </div>
        {badge}
      </div>
      <p
        className="text-[26px] font-extrabold tabular-nums leading-none"
        style={{ color: T.ink }}
      >
        {value}
      </p>
      <p className="mt-1.5 text-xs font-semibold" style={{ color: T.muted }}>
        {label}
      </p>
      <p className="mt-0.5 text-xs" style={{ color: T.subtle }}>
        {sub}
      </p>
    </div>
  );
}

export function StatCards({ roster = [], onFilter }) {
  const epaImm = roster.filter(
    (a) => a.epaDaysLeft !== null && a.epaDaysLeft < 90,
  );
  /**
   * F1.2.4 AC5 — the card counts everything currently flagged, at-risk and
   * overdue alike.
   *
   * It previously counted only `at_risk`, so an apprentice more than 30%
   * behind was in neither the "On track" card nor the "At risk" card. The
   * headline numbers did not add up to the roster, and the worst cases were
   * the ones missing.
   */
  const flagged = roster.filter((a) => isFlagged(a.status));
  const overdue = flagged.filter((a) => isOverdue(a.status));
  const soonest = epaImm.sort(
    (a, b) => (a.epaDaysLeft ?? 0) - (b.epaDaysLeft ?? 0),
  )[0];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <Card
        icon={<Users className="h-4 w-4" />}
        value={roster.length}
        label="Active apprentices"
        sub="In your organisation"
        onClick={() => onFilter?.("all")}
      />
      <Card
        icon={<BookOpen className="h-4 w-4" />}
        value={roster.filter((a) => a.status === "on_track").length}
        label="On track"
        sub="Progressing well"
        onClick={() => onFilter?.("on_track")}
      />
      <Card
        icon={<AlertTriangle className="h-4 w-4" />}
        value={flagged.length}
        label="At risk"
        sub={
          overdue.length > 0
            ? `${overdue.length} overdue · behind OTJ pace`
            : "Behind OTJ pace"
        }
        pulse={flagged.length > 0}
        onClick={() => onFilter?.("at_risk")}
        badge={
          flagged.length > 0 ? (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full levy-countdown-pulse"
              style={{
                backgroundColor: overdue.length > 0 ? T.redLight : T.amberLight,
                color: overdue.length > 0 ? T.red : T.amber,
              }}
            >
              OTJ
            </span>
          ) : null
        }
      />
      <Card
        icon={<CalendarCheck className="h-4 w-4" />}
        value={epaImm.length}
        label="EPA this quarter"
        sub={
          soonest
            ? `${soonest.name} · ${soonest.epaDaysLeft}d`
            : "No upcoming EPAs"
        }
        onClick={() => onFilter?.("epa_imminent")}
        badge={
          soonest ? (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: T.redLight, color: T.red }}
            >
              {soonest.epaDaysLeft}d
            </span>
          ) : null
        }
      />
    </div>
  );
}
