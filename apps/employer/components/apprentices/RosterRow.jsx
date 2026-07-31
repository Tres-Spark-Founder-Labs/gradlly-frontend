"use client";

import { MoreHorizontal } from "lucide-react";

import { isCriticallyBehind } from "@/features/apprentices/utils/risk-status";

import { ApprenticeAvatar } from "./ApprenticeAvatar";
import { attendanceColor, epaDays } from "./helpers";
import { OtjBar } from "./OtjBar";
import { StatusBadge } from "./StatusBadge";
import { T } from "./tokens";

function LevelBadge({ standard }) {
  const lv = standard.match(/L\d/)?.[0] ?? "";
  return lv ? (
    <span
      className="ml-1 px-1.5 py-0.5 rounded text-[9px] font-bold"
      style={{ backgroundColor: T.blueLight, color: T.blue }}
    >
      {lv}
    </span>
  ) : null;
}

function lastActivityColor(dateStr) {
  if (!dateStr) return T.muted;
  const [d, m, y] = dateStr.split(" ");
  const months = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };
  const dt = new Date(+y, months[m], +d);
  const days = Math.floor((Date.now() - dt) / 86400000);
  return days <= 7 ? T.green : days <= 30 ? T.amber : T.red;
}

export function RosterRow({ a, index, onView, onContact, isFiltered }) {
  // F1.2.4 AC5. These keyed off string literals that the API never emits, so
  // the red accent bar for the most serious cases never rendered. Both now go
  // through the shared status helpers.
  const isCriticallyBehindRow = isCriticallyBehind(a.status);
  const isAtRisk = a.status === "at_risk";
  const isEpaNear = a.epaDaysLeft !== null && a.epaDaysLeft < 60;
  const epa = epaDays(a.epaDaysLeft);
  const attColor =
    a.attendance !== null && a.attendance !== undefined
      ? attendanceColor(a.attendance)
      : T.muted;
  const actColor = lastActivityColor(a.lastActivity);
  const accentColor = isCriticallyBehindRow
    ? T.red
    : isAtRisk
      ? T.amber
      : isEpaNear
        ? T.red
        : "transparent";

  return (
    <tr
      onClick={() => onView?.(a)}
      className="transition-all duration-150 hover:bg-neutral-50/80 cursor-pointer group"
      style={{
        borderLeft: `3px solid ${accentColor}`,
        opacity: isFiltered ? 0.35 : 1,
        borderBottom: `1px solid ${T.border}`,
      }}
    >
      <td
        className="px-4 py-3"
        style={{
          position: "sticky",
          left: 0,
          zIndex: 1,
          backgroundColor: T.surface,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="checkbox"
          className="rounded"
          style={{ accentColor: T.blue }}
        />
      </td>
      <td
        className="px-4 py-3"
        style={{
          position: "sticky",
          left: 52,
          zIndex: 1,
          backgroundColor: T.surface,
          boxShadow: "2px 0 4px rgba(0,0,0,0.06)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <ApprenticeAvatar initials={a.initials} color={a.avatarColor} />
          <div>
            <p
              className="text-sm font-semibold whitespace-nowrap"
              style={{ color: T.ink }}
            >
              {a.name}
            </p>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded font-semibold"
              style={{ backgroundColor: T.card, color: T.muted }}
            >
              {a.cohort}
            </span>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <p className="text-xs font-medium" style={{ color: T.ink }}>
          {a.standard.replace(/ L\d$/, "")}
          <LevelBadge standard={a.standard} />
        </p>
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onContact?.(a);
          }}
          className="text-xs font-medium hover:underline"
          style={{ color: T.blue }}
        >
          {a.provider}
        </button>
      </td>
      <td className="px-4 py-3">
        <OtjBar
          actual={a.otjActual}
          expected={a.otjExpected}
          delay={index * 80}
        />
      </td>
      <td className="px-4 py-3 hidden lg:table-cell">
        <div className="flex items-center gap-1.5">
          <span className="text-xs tabular-nums" style={{ color: T.subtle }}>
            {a.epaDate}
          </span>
          {epa && (
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: `${epa.color}15`, color: epa.color }}
            >
              {epa.label}
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        {a.attendance !== null && a.attendance !== undefined ? (
          <div className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: attColor }}
            />
            <span className="text-xs tabular-nums" style={{ color: T.ink }}>
              {a.attendance}%
            </span>
          </div>
        ) : (
          <span className="text-xs" style={{ color: T.muted }}>
            —
          </span>
        )}
      </td>
      <td className="px-4 py-3 hidden lg:table-cell">
        <div className="flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full shrink-0"
            style={{ backgroundColor: actColor }}
          />
          <span className="text-xs tabular-nums" style={{ color: T.subtle }}>
            {a.lastActivity ?? "—"}
          </span>
          {actColor === T.red && (
            <span className="text-[9px] font-bold" style={{ color: T.red }}>
              ⚠
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={a.status} />
      </td>
      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onView?.(a)}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold hover:opacity-80 transition-opacity"
            style={{ backgroundColor: T.blueLight, color: T.blue }}
          >
            View
          </button>
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors"
            style={{ color: T.muted }}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
