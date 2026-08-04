"use client";

import { ScrollText } from "lucide-react";
import { useState } from "react";

import { CheckboxField } from "@/components/form/CheckboxField";
import { SingleSelectField } from "@/components/form/SingleSelectField";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Pagination } from "@/components/ui/Pagination";
import { formatDateTime } from "@/utils/helper";

import {
  DAS_OPERATION_FILTER_OPTIONS,
  DAS_OPERATION_LABELS,
} from "../constants";
import { useDasActivity } from "../queries/das.query";

/**
 * F2.3.1 AC7 — "full API activity log with each request, response code, and
 * any error messages".
 *
 * Before this, a call to the ESFA left no durable trace at all; a failure
 * became an exception message in a process log. A provider asking whether
 * their submission actually reached the ESFA now has somewhere to look.
 */
function ActivityRow({ entry }) {
  const [expanded, setExpanded] = useState(false);
  const hasDetail = !!entry.errorMessage || !!entry.requestSummary;

  return (
    <li className="py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-neutral-800">
            {DAS_OPERATION_LABELS[entry.operation] ?? entry.operation}
          </p>
          <p className="truncate text-xs text-neutral-400">
            {entry.method} · {formatDateTime(entry.occurredAt)} ·{" "}
            {entry.durationMs}ms
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
              entry.succeeded
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {/*
             * A missing status is not zero and not a blank — it means no reply
             * ever arrived. "Timeout" is the honest word for it, and it is a
             * different diagnosis from a 500.
             */}
            {entry.responseStatus ?? "No response"}
          </span>
          {hasDetail ? (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="rounded-lg px-2 py-1 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-50"
            >
              {expanded ? "Hide" : "Details"}
            </button>
          ) : null}
        </div>
      </div>

      {expanded ? (
        <div className="mt-2 space-y-2">
          <p className="break-all rounded-lg bg-neutral-50 px-2.5 py-1.5 font-mono text-[11px] text-neutral-500">
            {entry.url}
          </p>
          {entry.errorMessage ? (
            <p className="whitespace-pre-wrap rounded-lg bg-rose-50/60 px-2.5 py-1.5 font-mono text-[11px] text-rose-800">
              {entry.errorMessage}
            </p>
          ) : null}
          {entry.requestSummary ? (
            <pre className="overflow-x-auto rounded-lg bg-neutral-50 px-2.5 py-1.5 font-mono text-[11px] text-neutral-600">
              {JSON.stringify(entry.requestSummary, null, 2)}
            </pre>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}

export function DasActivityLog() {
  const [page, setPage] = useState(1);
  const [operation, setOperation] = useState("");
  const [failedOnly, setFailedOnly] = useState(false);

  const { data, isLoading } = useDasActivity({
    page,
    perPage: 20,
    operation: operation || undefined,
    failedOnly,
  });

  const entries = data?.entries ?? [];
  const meta = data?.meta ?? null;

  // Filters change what page 1 means; staying on page 7 of a narrower result
  // set shows an empty list that reads as "no activity".

  return (
    <Card>
      <CardHeader className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ScrollText className="size-4 text-neutral-400" aria-hidden />
          <h2 className="text-base font-semibold text-neutral-900">
            ESFA API activity
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-56">
            <SingleSelectField
              name="operation"
              options={DAS_OPERATION_FILTER_OPTIONS}
              value={operation}
              setValue={(_, v) => {
                setOperation(v);
                setPage(1);
              }}
              placeholder="All operations"
              searchable={false}
            />
          </div>
          <CheckboxField
            name="failedOnly"
            label="Failures only"
            checked={failedOnly}
            onChange={(e) => {
              setFailedOnly(e.target.checked);
              setPage(1);
            }}
          />
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <p className="py-6 text-sm text-neutral-400">Loading activity…</p>
        ) : entries.length ? (
          <>
            <ul className="divide-y divide-neutral-100">
              {entries.map((entry) => (
                <ActivityRow key={entry.id} entry={entry} />
              ))}
            </ul>
            {meta ? <Pagination meta={meta} onPageChange={setPage} /> : null}
          </>
        ) : (
          <p className="py-6 text-sm text-neutral-400">
            {failedOnly || operation
              ? "No calls match these filters."
              : "No DAS API calls recorded yet."}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
