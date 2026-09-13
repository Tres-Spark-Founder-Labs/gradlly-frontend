"use client";

import { FileText } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import TextBadge from "@/components/ui/TextBadge";

import {
  MATCH_APPLICATION_STATUS_META,
  formatGbpDecimal,
  formatIsoDate,
} from "../constants";

const isText = (value) => typeof value === "string" && value.trim() !== "";

/**
 * The applications this SME has sent (GET /match-applications?role=recipient),
 * with the state the donor has put them in.
 *
 * MatchApplicationResponseDto carries the donor's id and no name. A name is
 * shown only when the current search returned that donor, taken from its
 * donorDisplayName (already "Matched donor" when anonymous). Otherwise the row
 * says "a levy donor" rather than borrowing "Matched donor", which in F4.2.3
 * AC3 means anonymous, not "name unknown to this screen".
 */
export function MatchApplicationsList({
  applications,
  meta,
  donorNames,
  isLoading,
  isError,
  error,
}) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-base font-semibold text-neutral-900">
          Your applications
        </h2>
        <p className="text-sm text-neutral-500">
          Pending until the donor confirms or rejects. A donor with open
          matching confirms automatically.
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-neutral-500">Loading applications…</p>
        ) : isError ? (
          <p className="text-sm text-danger-600" role="alert">
            {error?.message}
          </p>
        ) : applications.length === 0 ? (
          <EmptyState
            compact
            icon={FileText}
            title="No applications yet"
            description="Apply to a matched donor and the application appears here."
          />
        ) : (
          <>
            <ul className="divide-y divide-neutral-100">
              {applications.map((application) => {
                const status = application?.status;
                const statusMeta = isText(status)
                  ? (MATCH_APPLICATION_STATUS_META[status] ?? {
                      label: status,
                      color: "gray",
                    })
                  : null;
                const donorName = isText(application?.donorOrganisationId)
                  ? donorNames.get(application.donorOrganisationId)
                  : undefined;
                const amount = formatGbpDecimal(application?.requestedAmount);
                const sentOn = formatIsoDate(application?.createdAt);

                return (
                  <li
                    key={application.id}
                    className="flex items-start justify-between gap-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-neutral-900">
                        {amount
                          ? `${amount} requested from `
                          : "Requested from "}
                        {isText(donorName) ? donorName : "a levy donor"}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {sentOn ? `Sent ${sentOn}` : null}
                        {sentOn && isText(application?.matchScore)
                          ? " · "
                          : null}
                        {isText(application?.matchScore)
                          ? `Match score ${application.matchScore}`
                          : null}
                      </p>
                    </div>
                    {statusMeta ? (
                      <TextBadge
                        variant="light"
                        color={statusMeta.color}
                        size="xs"
                      >
                        {statusMeta.label}
                      </TextBadge>
                    ) : null}
                  </li>
                );
              })}
            </ul>
            {typeof meta?.total === "number" &&
            meta.total > applications.length ? (
              <p className="mt-3 text-xs text-neutral-500">
                {`Showing the ${applications.length} most recent of ${meta.total}.`}
              </p>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
}
