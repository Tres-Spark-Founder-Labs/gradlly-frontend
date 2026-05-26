"use client";

import { FileText, ShieldCheck, Users } from "lucide-react";

import { GradllyLogo } from "@/assets/svgs/GradllyLogo";
import { LogoutButton } from "@/features/auth/components/LogoutButton";

import { CreateOrganizationForm } from "./CreateOrganizationForm";

// ─── Static data ──────────────────────────────────────────────────────────────

const BENEFITS = [
  { Icon: ShieldCheck, label: "Ofsted readiness, automated" },
  { Icon: FileText, label: "ILR & DAS submissions, simplified" },
  { Icon: Users, label: "Learner progress, at a glance" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function LeftPanel() {
  return (
    <div
      className="hidden lg:flex lg:flex-col lg:w-75 xl:w-[320px] lg:shrink-0 lg:relative lg:overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #060e09 0%, #0d2918 35%, #1b4f32 75%, #2c6b44 100%)",
      }}
    >
      {/* Grid pattern */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.055) 1px, transparent 1px), " +
            "linear-gradient(90deg, rgba(255,255,255,0.055) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Top shimmer */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-0.5 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(94,164,120,0.7) 50%, transparent 100%)",
        }}
      />

      {/* Ambient glow */}
      <div
        aria-hidden
        className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(78,163,106,0.18), transparent 65%)",
        }}
      />

      <div className="relative z-10 flex h-full flex-col p-8 xl:p-10">
        {/* Brand mark */}
        <div className="flex items-center gap-2.5">
          <GradllyLogo size={32} />
          <span className="text-sm font-semibold tracking-tight text-white/90">
            Gradlly Provider
          </span>
        </div>

        {/* Main copy */}
        <div className="my-10 xl:my-12">
          <p
            className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{ color: "#8cc4a1" }}
          >
            Welcome aboard
          </p>
          <h2 className="mb-4 text-[1.75rem] font-bold leading-[1.2] text-white xl:text-3xl">
            Your portal,
            <br />
            ready for Ofsted.
          </h2>
          <p
            className="text-[13px] leading-relaxed"
            style={{ color: "rgba(255,255,255,0.52)" }}
          >
            Set up your organisation once. Everything on Gradlly - from ILR
            submissions to learner reviews - connects to it automatically.
          </p>
        </div>

        {/* Benefit chips */}
        <div className="mt-auto space-y-2.5">
          {BENEFITS.map(({ Icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
              >
                <Icon
                  className="h-3.5 w-3.5"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                  strokeWidth={1.75}
                  aria-hidden
                />
              </div>
              <span
                className="text-[13px] leading-snug"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FormPanel({ onOrgCreated }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      {/* Mobile brand strip */}
      <div
        className="flex shrink-0 items-center gap-3 px-5 py-3.5 lg:hidden"
        style={{ background: "linear-gradient(135deg, #0d2918, #1b4f32)" }}
      >
        <GradllyLogo size={28} />
        <span className="text-[13px] font-semibold text-white/90">
          Gradlly Provider
        </span>
      </div>

      {/* Header */}
      <div className="shrink-0 px-6 pb-0 pt-6 sm:px-8 sm:pt-8 lg:px-8 lg:pt-10">
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
              style={{ backgroundColor: "#f1f7f3", color: "#1b4f32" }}
            >
              <span
                className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold leading-none text-white"
                style={{ backgroundColor: "#1b4f32" }}
              >
                1
              </span>
              Organisation Setup
            </span>
            <span className="text-[11px] font-medium text-neutral-400">
              Step 1 of 1
            </span>
          </div>
          <div className="shrink-0">
            <LogoutButton variant="menu" />
          </div>
        </div>

        <h2 className="mb-1.5 text-xl font-bold leading-tight tracking-tight text-neutral-900 sm:text-2xl">
          Set up your organisation
        </h2>
        <p className="mb-5 text-[13px] leading-relaxed text-neutral-500 sm:mb-6 sm:text-sm">
          Tell us about your training provider so we can prepare your dashboard,
          link your ESFA records, and connect you to your learners.
        </p>

        <div className="-mx-6 h-px bg-neutral-100 sm:-mx-8" />
      </div>

      {/* Scrollable form */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-5 sm:px-8 sm:py-6">
        <CreateOrganizationForm onSuccess={onOrgCreated} />
      </div>
    </div>
  );
}

export function CreateOrganisationContent({ onOrgCreated }) {
  return (
    <>
      <LeftPanel />
      <FormPanel onOrgCreated={onOrgCreated} />
    </>
  );
}
