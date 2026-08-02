"use client";

import { Shield } from "lucide-react";
import { useState } from "react";

import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { toastError, toastSuccess } from "@/hooks/useToast";
import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

export function AuditExportPanel() {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const result = await $apiClient.get("/api/v1/audit/export");
      const rows = result.data?.data ?? [];
      const blob = new Blob([JSON.stringify(rows, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `audit-export-${Date.now()}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
      toastSuccess("Audit export downloaded.");
    } catch (e) {
      toastError(normalizeApiClientError(e).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <p className="eyebrow">Compliance</p>
        <h2 className="mt-0.5 text-base font-semibold text-neutral-900">
          Audit log export
        </h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-neutral-600">
          Download organisation audit events as JSON for compliance review.
        </p>
        <Button onClick={handleExport} loading={loading} leftIcon={Shield}>
          Export audit log
        </Button>
      </CardContent>
    </Card>
  );
}
