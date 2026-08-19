"use client";

import { AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

import { Modal } from "@/components/ui/Modal";

import { fmt } from "./helpers";
import { T } from "./tokens";

function Option({
  icon,
  title,
  desc,
  badge,
  badgeColor,
  badgeBg,
  href,
  onClose,
  btnLabel,
  btnColor,
}) {
  return (
    <div
      className="rounded-xl p-4 space-y-3"
      style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl shrink-0">{icon}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold" style={{ color: T.ink }}>
              {title}
            </p>
            {badge && (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: badgeBg, color: badgeColor }}
              >
                {badge}
              </span>
            )}
          </div>
          <p
            className="mt-1 text-xs leading-relaxed"
            style={{ color: T.subtle }}
          >
            {desc}
          </p>
        </div>
      </div>
      <Link
        href={href}
        onClick={onClose}
        className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-bold hover:opacity-90 transition-opacity"
        style={{ backgroundColor: btnColor, color: "#fff" }}
      >
        {btnLabel} <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

export function ExpiryModal({ open, onClose, levy }) {
  const expiring = levy?.expiring ?? 0;
  const expiringDays = levy?.expiringDays ?? 0;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title="Expiring Levy Funds — Action Required"
      description={`${fmt(expiring)} expiring · ${expiringDays} days remaining`}
    >
      <div className="space-y-3">
        <div
          className="rounded-xl p-3.5 flex items-start gap-3"
          style={{
            backgroundColor: T.redLight,
            border: `1px solid ${T.red}18`,
          }}
        >
          <AlertTriangle
            className="h-4 w-4 shrink-0 mt-0.5"
            style={{ color: T.red }}
          />
          <p className="text-sm" style={{ color: T.red }}>
            Funds will be permanently lost if not allocated before expiry. Act
            now to protect your levy investment.
          </p>
        </div>
        <Option
          icon="🏭"
          title="Transfer to SME partner"
          desc="Move unused levy funds to a supply-chain SME. Supports smaller employers and meets ESFA transfer rules."
          badge="Recommended"
          badgeColor={T.blue}
          badgeBg={T.blueLight}
          href="/levy-transfer"
          onClose={onClose}
          btnLabel="Go to Transfers"
          btnColor={T.blue}
        />
        <Option
          icon="🎓"
          title="Assign to new programme"
          desc="Enrol a new apprentice and fund their programme with the expiring allocation before the deadline."
          href="/apprentices"
          onClose={onClose}
          btnLabel="Start Enrolment"
          btnColor={T.green}
        />
      </div>
    </Modal>
  );
}
