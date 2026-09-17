"use client";

import { ClipboardList, Hourglass, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";

import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

import { MatchApplicationsList } from "./MatchApplicationsList";
import { MatchCard } from "./MatchCard";
import { formatGbpDecimal } from "../constants";
import {
  useCreateMatchApplication,
  useRecipientMatchApplications,
  useRecipientProfile,
  useSearchMatches,
} from "../queries/levy-exchange.query";

const isText = (value) => typeof value === "string" && value.trim() !== "";

/**
 * F4.2.3 — donor matches for the signed-in SME, and the applications it sent.
 *
 * The search runs once when the screen opens (AC2 measures results from
 * "an SME completing their profile", and saving the profile lands here), then
 * only on "Search again". It is a POST that can insert a waiting-pool entry,
 * so it is never refetched behind the user's back.
 */
export function LevyMatchesScreen() {
  const profileQuery = useRecipientProfile();
  const profile = profileQuery.data;
  const search = useSearchMatches();
  const applicationsQuery = useRecipientMatchApplications();
  const apply = useCreateMatchApplication();

  // Once per visit. The ref survives StrictMode's mount → unmount → mount.
  const searched = useRef(false);
  useEffect(() => {
    if (profile && !searched.current) {
      searched.current = true;
      search.mutate({});
    }
  }, [profile, search]);

  const result = search.data;
  const matches = useMemo(
    () => (Array.isArray(result?.matches) ? result.matches : []),
    [result],
  );
  const applications = useMemo(
    () => applicationsQuery.data?.applications ?? [],
    [applicationsQuery.data],
  );

  // Applications arrive newest first, so the first seen per donor is latest.
  const latestByDonor = useMemo(() => {
    const latest = new Map();
    for (const a of applications) {
      if (
        isText(a?.donorOrganisationId) &&
        !latest.has(a.donorOrganisationId)
      ) {
        latest.set(a.donorOrganisationId, a);
      }
    }
    return latest;
  }, [applications]);

  const onApply = (match) =>
    apply.mutate({
      donorOrganisationId: match.donorOrganisationId,
      // The amount this donor can actually transfer to this SME, exactly as
      // the search returned it — a string, never re-parsed.
      requestedAmount: match.transferableAmount,
      ...(isText(match.matchScore) ? { matchScore: match.matchScore } : {}),
      ...(match.scoreBreakdown && typeof match.scoreBreakdown === "object"
        ? { scoreBreakdown: match.scoreBreakdown }
        : {}),
    });

  if (profileQuery.isLoading) {
    return <p className="text-sm text-neutral-500">Loading your profile…</p>;
  }

  if (profileQuery.isError) {
    return (
      <p className="text-sm text-danger-600" role="alert">
        {profileQuery.error?.message}
      </p>
    );
  }

  // Search 404s without a profile, so don't send one that cannot succeed.
  if (profile === null) {
    return (
      <Card>
        <EmptyState
          icon={ClipboardList}
          title="Complete your recipient profile first"
          description="Matching compares your sector, region, programme type and the amount you need against what levy donors have said they will fund."
          action={<Button href="/levy-exchange/profile">Create profile</Button>}
        />
      </Card>
    );
  }

  const required = formatGbpDecimal(profile?.transferAmountRequired);
  const summary = [profile?.sector, profile?.region, profile?.programmeType]
    .filter(isText)
    .join(" · ");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-neutral-900">
                Donor matches
              </h2>
              <p className="text-sm text-neutral-500">
                {summary}
                {summary && required ? " · " : null}
                {required ? `${required} required` : null}
              </p>
            </div>
            <div className="flex gap-2">
              <Button href="/levy-exchange/profile" variant="outline" size="sm">
                Edit profile
              </Button>
              <Button
                size="sm"
                variant="neutral"
                loading={search.isPending}
                startIcon={<RefreshCw className="size-4" />}
                onClick={() => search.mutate({})}
              >
                Search again
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <MatchOutcome
            search={search}
            result={result}
            matches={matches}
            latestByDonor={latestByDonor}
            onApply={onApply}
            applyingDonorId={
              apply.isPending ? apply.variables?.donorOrganisationId : null
            }
          />
        </CardContent>
      </Card>

      <MatchApplicationsList
        applications={applications}
        meta={applicationsQuery.data?.meta ?? null}
        isLoading={applicationsQuery.isLoading}
        isError={applicationsQuery.isError}
        error={applicationsQuery.error}
      />
    </div>
  );
}

function MatchOutcome({
  search,
  result,
  matches,
  latestByDonor,
  onApply,
  applyingDonorId,
}) {
  if (search.isPending || search.isIdle) {
    return <p className="text-sm text-neutral-500">Finding donors…</p>;
  }
  if (search.isError) {
    return (
      <p className="text-sm text-danger-600" role="alert">
        {search.error?.message}
      </p>
    );
  }

  if (matches.length > 0) {
    return (
      <ul className="grid gap-3 md:grid-cols-2">
        {matches.map((match) => (
          <MatchCard
            key={match.donorOrganisationId}
            match={match}
            latestApplication={latestByDonor.get(match.donorOrganisationId)}
            onApply={onApply}
            isApplying={
              isText(applyingDonorId) &&
              applyingDonorId === match.donorOrganisationId
            }
          />
        ))}
      </ul>
    );
  }

  /*
   * No matches. The pool state is read from `addedToWaitingPool`, not from
   * the empty array — and it is true only on the search that INSERTED the
   * entry. levy-matching.service.ts (upsertWaitingPoolEntry) returns false
   * when an active entry already exists, so an empty result with false means
   * an earlier search placed this organisation there. No endpoint reads the
   * pool, so that is as much as the screen can know.
   */
  // Three-way on purpose: a response without the flag makes no pool claim.
  const pool = result?.addedToWaitingPool;
  let poolMessage = null;
  if (pool === true) {
    poolMessage = "You have been added to the waiting pool.";
  } else if (pool === false) {
    poolMessage =
      "You were already in the waiting pool from an earlier search, so this search did not add you again.";
  }
  return (
    <EmptyState
      compact
      icon={Hourglass}
      title="No donor matches your profile yet"
      description={poolMessage}
    />
  );
}
