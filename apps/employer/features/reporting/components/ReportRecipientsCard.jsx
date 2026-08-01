"use client";

import { Mail } from "lucide-react";
import { useMemo, useState } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { useEmployerManagerOptions } from "@/features/enrolments/queries/enrolments.query";
import {
  useLevyRoiSubscribers,
  useSetLevyRoiSubscribers,
} from "@/features/reporting/queries/reporting.query";

function formatLastSent(iso) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * F1.4.1 AC5 — "scheduled monthly email delivery to configurable recipients".
 *
 * Recipients are picked from organisation members rather than typed as free
 * text. The report carries apprentice counts, completion and withdrawal rates
 * and levy spend, so a mistyped address is a data-protection incident — the
 * same reasoning that settled decision 5 for the OTJ digest. The API enforces
 * this too; the picker exists so the rule is visible rather than only
 * discovered on save.
 */
export function ReportRecipientsCard() {
  const { data: subscribers, isLoading, isError } = useLevyRoiSubscribers();
  const { data: members = [], isLoading: loadingMembers } =
    useEmployerManagerOptions();
  const { mutate: save, isPending } = useSetLevyRoiSubscribers();

  const savedIds = useMemo(
    () => (subscribers ?? []).map((s) => s.userId),
    [subscribers],
  );

  /**
   * Re-syncs when the server list arrives or changes under us.
   *
   * Adjusted during render rather than in an effect: React re-runs this
   * component immediately without painting the stale list, so the checkboxes
   * never flash the wrong state. An effect would also fight the user's
   * in-progress edits on every background refetch.
   */
  const [selected, setSelected] = useState(savedIds);
  const [syncedFrom, setSyncedFrom] = useState(savedIds);
  if (savedIds !== syncedFrom) {
    setSyncedFrom(savedIds);
    setSelected(savedIds);
  }

  const lastSentByUser = useMemo(
    () => new Map((subscribers ?? []).map((s) => [s.userId, s.lastSentAt])),
    [subscribers],
  );

  /**
   * The API is owner/admin only. A member gets 403, and the honest response
   * is to hide a control they cannot use rather than render it and let it
   * fail on save.
   */
  if (isError) return null;

  const dirty =
    selected.length !== savedIds.length ||
    selected.some((id) => !savedIds.includes(id));

  const toggle = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-neutral-400" />
          <h3 className="text-sm font-semibold text-neutral-900">
            Monthly report recipients
          </h3>
        </div>
        <p className="mt-0.5 text-xs text-neutral-500">
          This report is emailed on the 1st of each month. Only members of your
          organisation can be added.
        </p>
      </CardHeader>
      <CardContent>
        {isLoading || loadingMembers ? (
          <div className="h-20 animate-pulse rounded-xl bg-neutral-100" />
        ) : members.length === 0 ? (
          <p className="text-sm text-neutral-500">
            No colleagues available to add yet.
          </p>
        ) : (
          <>
            <div className="space-y-1">
              {members.map((member) => {
                const lastSent = formatLastSent(lastSentByUser.get(member.id));
                return (
                  <label
                    key={member.id}
                    className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-1.5 hover:bg-neutral-50"
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={selected.includes(member.id)}
                        onChange={() => toggle(member.id)}
                        className="h-4 w-4 shrink-0 rounded border-neutral-300"
                      />
                      <span className="truncate text-sm text-neutral-800">
                        {member.displayName ??
                          `${member.firstName} ${member.lastName}`}
                      </span>
                    </span>
                    {lastSent ? (
                      <span className="shrink-0 text-[11px] text-neutral-400">
                        Last sent {lastSent}
                      </span>
                    ) : null}
                  </label>
                );
              })}
            </div>

            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={() => save(selected)}
                disabled={!dirty || isPending}
                className="rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-bold text-white transition-opacity hover:opacity-80 disabled:opacity-40"
              >
                {isPending ? "Saving…" : "Save recipients"}
              </button>
              {/* Said plainly rather than left to be inferred from an empty
                  list — turning off a board report is worth being explicit
                  about. */}
              {selected.length === 0 ? (
                <span className="text-xs text-neutral-500">
                  No recipients — the monthly email will not be sent.
                </span>
              ) : null}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
