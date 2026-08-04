"use client";

import { MapPin, Plus } from "lucide-react";
import { useMemo, useState } from "react";

import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Pagination } from "@/components/ui/Pagination";
import { useRoleAccess } from "@/features/auth/hooks/useRoleAccess";
import { useEmployerDirectory } from "@/features/reporting/queries/reporting.query";
import { formatDate } from "@/utils/helper";

import { LogEmployerVisitModal } from "./LogEmployerVisitModal";
import { EMPLOYER_VISIT_TYPE_LABELS } from "../constants";
import { useEmployerVisits } from "../queries/employer-visits.query";

function VisitRow({ visit }) {
  return (
    <li className="py-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-neutral-800">
            {visit.employerName || "Employer"}
          </p>
          <p className="text-xs text-neutral-400">
            {formatDate(visit.visitedOn)} ·{" "}
            {EMPLOYER_VISIT_TYPE_LABELS[visit.visitType] ?? visit.visitType}
            {visit.learners?.length
              ? ` · ${visit.learners.length} learner${
                  visit.learners.length === 1 ? "" : "s"
                } discussed`
              : ""}
          </p>
        </div>
        {visit.nextVisitDate ? (
          <span className="shrink-0 text-xs text-neutral-500">
            Next {formatDate(visit.nextVisitDate)}
          </span>
        ) : null}
      </div>

      <p className="mt-1.5 text-sm text-neutral-600">
        {visit.discussionPoints}
      </p>

      {visit.actionPoints ? (
        <p className="mt-1 rounded-lg bg-primary-50/60 px-2.5 py-1.5 text-xs text-primary-900">
          {visit.actionPoints}
        </p>
      ) : null}

      <p className="mt-1 text-xs text-neutral-400">
        Attendees: {visit.attendees}
      </p>

      {visit.learners?.length ? (
        <p className="mt-0.5 text-xs text-neutral-400">
          Learners: {visit.learners.map((l) => l.apprenticeName).join(", ")}
        </p>
      ) : null}
    </li>
  );
}

/**
 * F2.4.2 — the employer visit log, which is Ofsted evidence first and admin
 * second.
 */
export function EmployerVisitLog() {
  const { can } = useRoleAccess();
  const canLog = can("admin");

  const [page, setPage] = useState(1);
  const [logOpen, setLogOpen] = useState(false);

  const { data, isLoading } = useEmployerVisits({ page, perPage: 20 });
  // Only to populate the employer picker in the modal.
  const { data: directory } = useEmployerDirectory({ page: 1, perPage: 200 });

  const employerOptions = useMemo(
    () =>
      (directory?.employers ?? []).map((employer) => ({
        value: employer.employerOrganisationId,
        text: employer.organisationName,
      })),
    [directory],
  );

  const visits = data?.visits ?? [];
  const meta = data?.meta ?? null;

  return (
    <Card>
      <CardHeader className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <MapPin className="size-4 text-neutral-400" aria-hidden />
          <h2 className="text-base font-semibold text-neutral-900">
            Visit log
          </h2>
        </div>
        {canLog ? (
          <Button
            size="sm"
            color="green"
            startIcon={<Plus className="size-4" />}
            onClick={() => setLogOpen(true)}
          >
            Log visit
          </Button>
        ) : null}
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <p className="py-6 text-sm text-neutral-400">Loading visits…</p>
        ) : visits.length ? (
          <>
            <ul className="divide-y divide-neutral-100">
              {visits.map((visit) => (
                <VisitRow key={visit.id} visit={visit} />
              ))}
            </ul>
            {meta ? <Pagination meta={meta} onPageChange={setPage} /> : null}
          </>
        ) : (
          <p className="py-6 text-sm text-neutral-400">
            No visits recorded yet. Employer engagement is one of the first
            things an inspection asks to see evidence of.
          </p>
        )}
      </CardContent>

      <LogEmployerVisitModal
        employerOptions={employerOptions}
        open={logOpen}
        onClose={() => setLogOpen(false)}
      />
    </Card>
  );
}
