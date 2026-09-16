"use client";

import TextBadge from "@/components/ui/TextBadge";

import { TRANSFER_STATUS_META } from "../constants";

const isText = (value) => typeof value === "string" && value.trim() !== "";

/**
 * The six statuses LevyTransferStatus carries get a label; anything else is
 * rendered as the value the API sent, not as a label invented for it.
 */
export function TransferStatusBadge({ status, size = "xs" }) {
  if (!isText(status)) return null;
  const meta = TRANSFER_STATUS_META[status] ?? { label: status, color: "gray" };

  return (
    <TextBadge variant="light" color={meta.color} size={size}>
      {meta.label}
    </TextBadge>
  );
}
