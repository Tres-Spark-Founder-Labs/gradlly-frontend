"use client";

import { Bell, CheckSquare, Settings } from "lucide-react";
import { useState } from "react";

import { T } from "@/components/dashboard/levy/tokens";
import { BULK_OTJ_MAX, OTJ_STATUSES } from "@/features/otj/constants";
import {
  useBulkApproveOtj,
  useBulkRejectOtj,
  useOtjEntries,
} from "@/features/otj/queries/otj.query";
import { toastError } from "@/hooks/useToast";

import { OTJBulkToolbar } from "./OTJBulkToolbar";
import { OTJEvidenceModal } from "./OTJEvidenceModal";
import { OTJFilterBar } from "./OTJFilterBar";
import { OTJNotificationDrawer } from "./OTJNotificationDrawer";
import { OTJQueueCard } from "./OTJQueueCard";
import { OTJSummaryBanner } from "./OTJSummaryBanner";

function EmptyState({ tab }) {
  const messages = {
    [OTJ_STATUSES.SUBMITTED]: {
      title: "All caught up",
      body: "No OTJ entries pending approval.",
    },
    [OTJ_STATUSES.APPROVED]: {
      title: "No approved entries",
      body: "Approved OTJ entries will appear here.",
    },
    [OTJ_STATUSES.REJECTED]: {
      title: "No rejected entries",
      body: "Rejected OTJ entries will appear here.",
    },
  };
  const { title, body } = messages[tab] ?? messages[OTJ_STATUSES.SUBMITTED];

  return (
    <div className="flex flex-col items-center gap-3 py-20 text-center">
      <div
        className="h-16 w-16 rounded-full flex items-center justify-center"
        style={{ backgroundColor: T.greenLight }}
      >
        <CheckSquare className="h-7 w-7" style={{ color: T.green }} />
      </div>
      <p className="text-base font-bold" style={{ color: T.ink }}>
        {title}
      </p>
      <p className="text-sm max-w-xs" style={{ color: T.muted }}>
        {body}
      </p>
    </div>
  );
}

export function OTJApprovalsDashboard() {
  const [tab, setTab] = useState(OTJ_STATUSES.SUBMITTED);
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(new Set());
  const [evidence, setEvidence] = useState(null);
  const [notif, setNotif] = useState(false);

  const { data, isLoading, isFetching } = useOtjEntries({
    status: tab,
    from: from || undefined,
    to: to || undefined,
    page,
    perPage: 20,
  });

  const entries = data?.entries ?? [];
  const meta = data?.meta ?? null;

  const { mutate: bulkApprove, isPending: isApproving } = useBulkApproveOtj();
  const { mutate: bulkReject, isPending: isRejecting } = useBulkRejectOtj();

  const visible = search
    ? entries.filter((e) =>
        e.note?.toLowerCase().includes(search.toLowerCase()),
      )
    : entries;

  /**
   * F1.2.3 AC4 — up to 20 at a time. Enforced here as well as at the API so
   * the limit is explained before the request rather than surfacing as a
   * validation error afterwards.
   */
  const toggleSelect = (id) =>
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) {
        n.delete(id);
        return n;
      }
      if (n.size >= BULK_OTJ_MAX) {
        toastError(
          `You can action up to ${BULK_OTJ_MAX} entries at a time. Approve or reject the current selection first.`,
        );
        return s;
      }
      n.add(id);
      return n;
    });

  // No `reason` on approve: only rejection carries a comment, and the API
  // rejects unknown properties, so sending an empty one is a 400.
  const handleApprove = (id) => {
    bulkApprove({ ids: [id] });
  };

  const handleReject = (id, reason) => {
    bulkReject({ ids: [id], reason });
  };

  const handleBulkApprove = () => {
    // Acts on the explicit selection only. This previously fell back to every
    // entry on the page when nothing was selected — unreachable today because
    // the toolbar hides at zero, but it would have silently approved a whole
    // page the moment that changed.
    const ids = [...selected];
    if (ids.length === 0) return;
    bulkApprove({ ids }, { onSuccess: () => setSelected(new Set()) });
  };

  const handleBulkReject = (reason) => {
    const ids = [...selected];
    bulkReject({ ids, reason }, { onSuccess: () => setSelected(new Set()) });
  };

  const handleTabChange = (next) => {
    setTab(next);
    setPage(1);
    setSelected(new Set());
  };

  return (
    <div
      className="space-y-5"
      style={{ animation: "slide-up 320ms var(--ease-out) both" }}
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-extrabold" style={{ color: T.ink }}>
            OTJ Approvals
          </h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setNotif(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border hover:opacity-75 transition-opacity"
            style={{ borderColor: T.border, color: T.subtle }}
          >
            <Settings className="h-3.5 w-3.5" /> Notification settings
          </button>
          <button
            type="button"
            onClick={() => setNotif(true)}
            className="flex h-8 w-8 items-center justify-center rounded-xl border hover:opacity-75 transition-opacity"
            style={{ borderColor: T.border, color: T.subtle }}
          >
            <Bell className="h-4 w-4" />
          </button>
        </div>
      </div>

      {tab === OTJ_STATUSES.SUBMITTED && (
        <OTJSummaryBanner
          pending={meta?.total ?? 0}
          total={meta?.total ?? null}
          onBulkApprove={handleBulkApprove}
          isLoading={isLoading}
        />
      )}

      <OTJFilterBar
        tab={tab}
        onTab={handleTabChange}
        search={search}
        onSearch={setSearch}
        from={from}
        onFrom={(v) => {
          setFrom(v);
          setPage(1);
        }}
        to={to}
        onTo={(v) => {
          setTo(v);
          setPage(1);
        }}
      />

      <div
        className="space-y-3"
        style={{
          opacity: isFetching && !isLoading ? 0.7 : 1,
          transition: "opacity 150ms",
        }}
      >
        {isLoading ? (
          <div className="py-16 text-center text-sm" style={{ color: T.muted }}>
            Loading…
          </div>
        ) : visible.length === 0 ? (
          <EmptyState tab={tab} />
        ) : (
          visible.map((entry, i) => (
            <OTJQueueCard
              key={entry.id}
              entry={entry}
              index={i}
              selected={selected.has(entry.id)}
              onSelect={() => toggleSelect(entry.id)}
              onApprove={handleApprove}
              onReject={handleReject}
              onEvidence={setEvidence}
              isApproving={isApproving}
              isRejecting={isRejecting}
            />
          ))
        )}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            disabled={!meta.hasPreviousPage}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border disabled:opacity-40 hover:opacity-75 transition-opacity"
            style={{ borderColor: T.border, color: T.subtle }}
          >
            ← Previous
          </button>
          <span className="text-xs" style={{ color: T.muted }}>
            Page {meta.page} of {meta.totalPages}
          </span>
          <button
            type="button"
            disabled={!meta.hasNextPage}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border disabled:opacity-40 hover:opacity-75 transition-opacity"
            style={{ borderColor: T.border, color: T.subtle }}
          >
            Next →
          </button>
        </div>
      )}

      <OTJBulkToolbar
        count={selected.size}
        onApprove={handleBulkApprove}
        onReject={handleBulkReject}
        onClear={() => setSelected(new Set())}
        isApproving={isApproving}
        isRejecting={isRejecting}
      />

      {evidence && (
        <OTJEvidenceModal entry={evidence} onClose={() => setEvidence(null)} />
      )}
      {notif && <OTJNotificationDrawer onClose={() => setNotif(false)} />}
    </div>
  );
}
