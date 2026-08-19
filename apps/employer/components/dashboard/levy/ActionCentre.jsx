"use client";

import { CheckCircle2, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { toastSuccess } from "@/hooks/useToast";

import { fmt } from "./helpers";
import { T } from "./tokens";

function buildActions(levy) {
  const actions = [];
  const expiring = levy?.expiring ?? 0;
  const expiringDays = levy?.expiringDays ?? 91;
  const projectedSurplus = levy?.projectedSurplus ?? 0;

  if (expiring > 0 && expiringDays <= 90) {
    actions.push({
      id: "expiry",
      icon: "🔴",
      label: `Allocate ${fmt(expiring)} before expiry`,
      detail: `${expiringDays} days · action required`,
      btn: "Transfer now",
      href: "/levy-transfer",
      color: T.red,
    });
  }

  if (projectedSurplus > 0) {
    actions.push({
      id: "surplus",
      icon: "🟡",
      label: `Projected surplus of ${fmt(projectedSurplus)}`,
      detail: "Consider new enrolment",
      btn: "Plan now",
      href: "/apprentices",
      color: T.amber,
    });
  }

  actions.push({
    id: "das",
    icon: "🔵",
    label: "Sync DAS balance",
    detail: "Keep your levy balance up to date",
    btn: "Sync now",
    href: null,
    color: T.blue,
  });

  return actions;
}

export function ActionCentre({ levy, onSync }) {
  const initial = useMemo(() => buildActions(levy), [levy]);
  const [dismissed, setDismissed] = useState(new Set());
  const [dismissing, setDismissing] = useState([]);

  const actions = initial.filter((a) => !dismissed.has(a.id));

  function dismiss(id) {
    setDismissing((d) => [...d, id]);
    setTimeout(() => {
      setDismissed((s) => new Set([...s, id]));
      setDismissing((d) => d.filter((x) => x !== id));
    }, 320);
  }

  function handleDas() {
    onSync?.();
    toastSuccess("DAS sync triggered.");
    dismiss("das");
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <p className="eyebrow">Actions Needed</p>
          {actions.length > 0 && (
            <span
              className="inline-flex items-center justify-center h-5 w-5 rounded-full text-[10px] font-bold"
              style={{ backgroundColor: T.red, color: "#fff" }}
            >
              {actions.length}
            </span>
          )}
        </div>
        <h2 className="mt-0.5 text-base font-semibold text-neutral-900">
          Actions needed on this page
        </h2>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.length === 0 ? (
          <div
            className="flex items-center gap-3 rounded-xl px-4 py-4"
            style={{
              backgroundColor: T.greenLight,
              border: `1px solid ${T.green}18`,
            }}
          >
            <CheckCircle2
              className="h-5 w-5 shrink-0"
              style={{ color: T.green }}
            />
            <p className="text-sm font-semibold" style={{ color: T.green }}>
              All actions reviewed — dashboard is up to date
            </p>
          </div>
        ) : (
          actions.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-3 rounded-xl px-4 py-3.5 transition-all duration-300"
              style={{
                backgroundColor: T.card,
                border: `1px solid ${T.border}`,
                opacity: dismissing.includes(a.id) ? 0 : 1,
                transform: dismissing.includes(a.id)
                  ? "translateX(16px)"
                  : "none",
              }}
            >
              <span className="text-base shrink-0">{a.icon}</span>
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-semibold truncate"
                  style={{ color: T.ink }}
                >
                  {a.label}
                </p>
                <p className="text-xs" style={{ color: T.muted }}>
                  {a.detail}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {a.href ? (
                  <Link
                    href={a.href}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg hover:opacity-80"
                    style={{ backgroundColor: a.color, color: "#fff" }}
                  >
                    {a.btn}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={handleDas}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg hover:opacity-80"
                    style={{ backgroundColor: a.color, color: "#fff" }}
                  >
                    {a.btn}
                  </button>
                )}
                <button
                  onClick={() => dismiss(a.id)}
                  type="button"
                  aria-label="Dismiss"
                  className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-neutral-200 transition-colors"
                >
                  <X className="h-3 w-3" style={{ color: T.muted }} />
                </button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
