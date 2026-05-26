"use client";

import { RefreshCw, ShieldAlert } from "lucide-react";

import { GradllyLogo } from "@/assets/svgs/GradllyLogo";
import { LogoutButton } from "@/features/auth/components/LogoutButton";

export function SessionErrorScreen() {
  return (
    <div className="flex h-dvh flex-col items-center justify-center bg-linear-to-b from-neutral-50 to-white px-4">
      {/* Card */}
      <div className="w-full max-w-[380px] overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-[0_12px_48px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)]">
        {/* Top accent */}
        <div
          className="h-0.5"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #ef4444 40%, #ef4444 60%, transparent 100%)",
          }}
        />

        <div className="p-8">
          {/* Icon treatment */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              {/* Outer ring */}
              <div className="absolute -inset-2.5 rounded-[22px] border border-danger-100/60" />
              {/* Inner container */}
              <div className="flex h-[68px] w-[68px] items-center justify-center rounded-2xl bg-danger-50">
                <ShieldAlert
                  aria-hidden
                  className="h-8 w-8 text-danger-500"
                  strokeWidth={1.5}
                />
              </div>
            </div>
          </div>

          {/* Copy */}
          <div className="mb-7 space-y-2 text-center">
            <h1 className="text-[17px] font-bold tracking-tight text-neutral-900">
              Session unavailable
            </h1>
            <p className="text-sm leading-relaxed text-neutral-500">
              We could not load your account data. This is typically a temporary
              network issue. Refreshing the page usually resolves it.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-primary-600 focus-visible:outline-offset-2"
            >
              <RefreshCw
                aria-hidden
                className="h-3.5 w-3.5"
                strokeWidth={2.2}
              />
              Refresh page
            </button>
            <div className="overflow-hidden rounded-xl border border-neutral-100">
              <LogoutButton variant="menu" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-100 bg-neutral-50/70 px-8 py-3.5 text-center">
          <p className="text-[11px] text-neutral-400">
            Problem persists?{" "}
            <a
              href="mailto:support@gradlly.com"
              className="font-medium text-primary-600 hover:underline"
            >
              Contact support
            </a>
          </p>
        </div>
      </div>

      {/* Brand mark */}
      <div className="mt-8 flex items-center gap-2 opacity-40">
        <GradllyLogo size={16} />
        <span className="text-xs font-semibold text-neutral-500">Gradlly</span>
      </div>
    </div>
  );
}
