"use client";

import { useState } from "react";

import { useRoleAccess } from "@/features/auth/hooks/useRoleAccess";

import { EifScoresDashboard } from "./EifScoresDashboard";
import { EifTrendPanel } from "./EifTrendPanel";
import { EvidencePackPanel } from "./EvidencePackPanel";
import { ProgrammeDocumentsPanel } from "./ProgrammeDocumentsPanel";
import { QipPanel } from "./QipPanel";
import { SafeguardingChecklist } from "./SafeguardingChecklist";

export function OfstedHub() {
  const { can, isOwner, isAdmin } = useRoleAccess();
  const canManage = can("admin");
  // Evidence pack is owner/admin only (RolesGuard on the backend).
  const canBuildPack = isOwner || isAdmin;

  // A low-criterion CTA on the dashboard prefills a new QIP action.
  const [prefillSlug, setPrefillSlug] = useState(null);

  return (
    <div className="space-y-6">
      <EifScoresDashboard onCreateAction={setPrefillSlug} />

      {/* F2.1.1 AC5 — sits directly under the scores, because a criterion's
          movement is only meaningful next to where it stands today. */}
      <EifTrendPanel />

      <QipPanel
        canManage={canManage}
        prefillSlug={prefillSlug}
        onPrefillConsumed={() => setPrefillSlug(null)}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SafeguardingChecklist canManage={canManage} />
        {canBuildPack ? <EvidencePackPanel /> : null}
      </div>

      <ProgrammeDocumentsPanel canManage={canManage} />
    </div>
  );
}
