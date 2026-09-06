"use client";

import { Lock, SlidersHorizontal } from "lucide-react";

import { EmptyState } from "@/components/ui/EmptyState";
import { PageSubheader } from "@/components/ui/PageSubheader";
import { useRoleAccess } from "@/features/auth/hooks/useRoleAccess";

import { BalanceForm } from "./BalanceForm";
import { DonorLinkForm } from "./DonorLinkForm";
import { FundingPaymentForm } from "./FundingPaymentForm";
import { MonthlySeriesForm } from "./MonthlySeriesForm";
import { TrancheForm } from "./TrancheForm";

/**
 * Manual entry of the figures the ESFA's DAS API would otherwise supply.
 *
 * For deployments with no ESFA connection — access takes weeks to arrange, and
 * until it exists the levy dashboard, the expiry banners and the funding
 * reports have nothing to show. Everything entered here is read back through
 * the same endpoints as a live sync, so the dashboard does not know or care
 * which it is looking at. The sync status card says which, plainly.
 *
 * ── OWNER AND ADMIN ONLY ────────────────────────────────────────────────────
 *
 * These figures are what an employer believes about their own money. The API
 * enforces the same rule; this gate stops a member reaching a screen they
 * cannot use, rather than being the protection itself.
 */
export function LevyDataView() {
  const { can } = useRoleAccess();

  if (!can("admin")) {
    return (
      <EmptyState
        icon={Lock}
        title="You do not have access to levy data"
        description="Entering levy figures is limited to owners and administrators. Ask an owner of your organisation if you need access."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageSubheader
        icon={SlidersHorizontal}
        eyebrow="Levy &amp; Finance"
        title="Levy data"
        description="Enter the figures your DAS account would normally supply. They appear on the levy dashboard and in your reports exactly as a live sync would, marked as manually entered."
      />

      {/* Accounts first: tranches are recorded against one, so on a fresh
          deployment this is the only form that can be completed. */}
      <DonorLinkForm />
      <BalanceForm />
      <MonthlySeriesForm />
      <TrancheForm />
      <FundingPaymentForm />
    </div>
  );
}
