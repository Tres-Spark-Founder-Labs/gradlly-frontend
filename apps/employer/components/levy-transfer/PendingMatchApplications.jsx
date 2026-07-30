"use client";
import { Building2, Check, X } from "lucide-react";
import { useState } from "react";

import { T } from "@/components/dashboard/levy/tokens";
import {
  useConfirmMatchApplication,
  useLevyMatchApplications,
  useRejectMatchApplication,
} from "@/features/levy/queries/levy.query";

const fmt = (n) => `£${Number(n).toLocaleString("en-GB")}`;

function ApplicationRow({ application, onCreateTransfer }) {
  const confirm = useConfirmMatchApplication();
  const reject = useRejectMatchApplication();
  const busy = confirm.isPending || reject.isPending;

  return (
    <div
      className="px-5 py-4 flex items-start gap-3.5"
      style={{ borderTop: `1px solid ${T.border}` }}
    >
      <div
        className="flex h-9 w-9 items-center justify-center rounded-full shrink-0"
        style={{ backgroundColor: T.card, color: T.subtle }}
      >
        <Building2 className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <p className="text-sm font-bold" style={{ color: T.ink }}>
              SME application · {fmt(application.requestedAmount)}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: T.muted }}>
              Submitted{" "}
              {new Date(application.createdAt).toLocaleDateString("en-GB")}
              {application.matchScore !== null &&
                application.matchScore !== undefined &&
                ` · match score ${application.matchScore}`}
            </p>
          </div>
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0"
            style={{
              backgroundColor:
                application.status === "confirmed"
                  ? T.greenLight
                  : application.status === "rejected"
                    ? `${T.red}22`
                    : T.amberLight,
              color:
                application.status === "confirmed"
                  ? T.green
                  : application.status === "rejected"
                    ? T.red
                    : T.amber,
            }}
          >
            {application.status}
          </span>
        </div>

        {application.status === "pending" && (
          <div className="flex items-center gap-2 mt-3">
            <button
              type="button"
              disabled={busy}
              onClick={() => confirm.mutate(application.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold hover:opacity-80 transition-opacity disabled:opacity-40"
              style={{ backgroundColor: T.green, color: "#fff" }}
            >
              <Check className="h-3.5 w-3.5" /> Confirm
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => reject.mutate(application.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border hover:opacity-75 transition-opacity disabled:opacity-40"
              style={{ borderColor: T.border, color: T.subtle }}
            >
              <X className="h-3.5 w-3.5" /> Reject
            </button>
          </div>
        )}

        {application.status === "confirmed" && (
          <button
            type="button"
            onClick={() => onCreateTransfer(application)}
            className="mt-3 text-xs font-bold hover:underline"
            style={{ color: T.blue }}
          >
            Create transfer from this match →
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Pending/confirmed/rejected SME match applications submitted to this org as
 * donor. Donors do not browse an SME directory directly — the platform's
 * matching flow has SMEs apply to donors (POST /levy-exchange/match-applications),
 * and the donor confirms or rejects here (PATCH .../match-applications/:id).
 */
export function PendingMatchApplications({ onCreateTransfer }) {
  const [statusFilter, setStatusFilter] = useState("pending");
  const { data, isLoading } = useLevyMatchApplications({
    role: "donor",
    ...(statusFilter === "all" ? {} : { status: statusFilter }),
  });
  const applications = data?.applications ?? [];

  const TABS = [
    { key: "pending", label: "Pending" },
    { key: "confirmed", label: "Confirmed" },
    { key: "rejected", label: "Rejected" },
    { key: "all", label: "All" },
  ];

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: T.surface, border: `1px solid ${T.border}` }}
    >
      <div
        className="px-5 py-4 flex items-start justify-between flex-wrap gap-3"
        style={{ borderBottom: `1px solid ${T.border}` }}
      >
        <div>
          <p className="text-sm font-bold" style={{ color: T.ink }}>
            SME match applications
          </p>
          <p className="text-[11px] mt-0.5" style={{ color: T.muted }}>
            SMEs apply to you for a levy transfer via FlowPortal — confirm to
            unlock the transfer agreement
          </p>
        </div>
        <div className="flex items-center gap-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setStatusFilter(t.key)}
              className="px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors"
              style={{
                backgroundColor: statusFilter === t.key ? T.blue : T.card,
                color: statusFilter === t.key ? "#fff" : T.subtle,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <p className="px-5 py-6 text-xs" style={{ color: T.muted }}>
          Loading applications…
        </p>
      )}

      {!isLoading && applications.length === 0 && (
        <p className="px-5 py-6 text-xs" style={{ color: T.muted }}>
          No {statusFilter === "all" ? "" : statusFilter} match applications
          yet.
        </p>
      )}

      {applications.map((application) => (
        <ApplicationRow
          key={application.id}
          application={application}
          onCreateTransfer={onCreateTransfer}
        />
      ))}
    </div>
  );
}
