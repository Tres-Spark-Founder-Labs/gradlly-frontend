"use client";

import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";

import { fmtGBP } from "./helpers";
import { T } from "./tokens";

const GROUPS = [
  { key: "standard", label: "By standard" },
  { key: "provider", label: "By provider" },
];

function EmptyState({ message }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-10 gap-2 rounded-xl"
      style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
    >
      <p className="text-sm font-semibold" style={{ color: T.ink }}>
        {message}
      </p>
      <Link
        href="/apprentices"
        className="mt-2 text-xs font-bold px-3 py-1.5 rounded-lg hover:opacity-80"
        style={{ backgroundColor: T.blueLight, color: T.blue }}
      >
        View apprentices →
      </Link>
    </div>
  );
}

/**
 * F1.1.3 AC4 — average cost by standard and provider.
 *
 * The rows arrive as a single flat list carrying a `groupType` discriminator
 * ('standard' | 'provider'), so the two views are one dataset filtered, not
 * two requests.
 */
export function ApprenticeTable({ rows, isLoading }) {
  const [group, setGroup] = useState("standard");

  const visible = (rows ?? []).filter((r) => r?.groupType === group);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Cost Per Apprentice</p>
            <h2 className="mt-0.5 text-base font-semibold text-neutral-900">
              Active programme costs
            </h2>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {GROUPS.map((g) => (
              <button
                key={g.key}
                type="button"
                onClick={() => setGroup(g.key)}
                aria-pressed={group === g.key}
                className="text-xs font-bold px-2.5 py-1.5 rounded-lg transition-opacity hover:opacity-80"
                style={
                  group === g.key
                    ? { backgroundColor: T.blue, color: "#fff" }
                    : { backgroundColor: T.blueLight, color: T.blue }
                }
              >
                {g.label}
              </button>
            ))}
            <Link
              href="/apprentices"
              aria-label="Add apprentice"
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg hover:opacity-80"
              style={{ backgroundColor: T.blueLight, color: T.blue }}
            >
              <PlusCircle className="h-3.5 w-3.5" /> Add
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <EmptyState message="Loading programme costs…" />
        ) : visible.length === 0 ? (
          <EmptyState message={`No ${group} cost data yet`} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ color: T.muted }}>
                  <th className="text-left font-semibold pb-2">
                    {group === "standard" ? "Standard" : "Provider"}
                  </th>
                  <th className="text-right font-semibold pb-2">Apprentices</th>
                  <th className="text-right font-semibold pb-2">Avg. cost</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((row) => (
                  <tr
                    key={row.groupId}
                    className="border-t"
                    style={{ borderColor: T.border }}
                  >
                    <td className="py-2.5 pr-3" style={{ color: T.ink }}>
                      {row.label}
                    </td>
                    <td
                      className="py-2.5 text-right tabular-nums"
                      style={{ color: T.subtle }}
                    >
                      {row.apprenticeCount}
                    </td>
                    <td
                      className="py-2.5 text-right tabular-nums font-semibold"
                      style={{ color: T.ink }}
                    >
                      {/* averageCost is nullable: a cohort with no agreed price
                          yet must read as unknown, not as £0.00. */}
                      {fmtGBP(row.averageCost)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
