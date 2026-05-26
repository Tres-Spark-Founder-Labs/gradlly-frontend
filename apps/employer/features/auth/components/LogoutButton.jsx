"use client";

import { Loader2, LogOut } from "lucide-react";

import { useLogout } from "@/features/auth/queries/auth.query";
import { cn } from "@/utils/helper";

/**
 * Reusable logout button with two visual variants:
 *
 *   variant="menu"    — full-width danger menu item (for dropdown menus)
 *   variant="sidebar" — compact icon-only button (for the dark sidebar user block)
 */
export function LogoutButton({ variant = "menu" }) {
  const { mutate: logout, isPending } = useLogout();

  if (variant === "sidebar") {
    return (
      <button
        type="button"
        onClick={() => logout()}
        disabled={isPending}
        aria-label="Sign out"
        title="Sign out"
        className={cn(
          "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg",
          "text-white/25 transition-colors duration-150",
          "hover:bg-white/6 hover:text-white/60",
          "focus-visible:outline-2 focus-visible:outline-primary-300 focus-visible:outline-offset-1",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        {isPending ? (
          <Loader2 aria-hidden="true" className="size-3.5 animate-spin" />
        ) : (
          <LogOut aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
        )}
      </button>
    );
  }

  // variant="menu" — full-width row inside a dropdown
  return (
    <button
      type="button"
      role="menuitem"
      onClick={() => logout()}
      disabled={isPending}
      className={cn(
        "flex w-full items-center gap-2.5 px-3 py-2.5 text-sm transition-colors duration-100",
        "text-danger-600 hover:bg-danger-50",
        "focus-visible:bg-danger-50 focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-60",
      )}
    >
      {isPending ? (
        <Loader2
          aria-hidden="true"
          className="size-3.5 shrink-0 animate-spin text-danger-500"
        />
      ) : (
        <LogOut
          aria-hidden="true"
          className="size-3.5 shrink-0 text-danger-500"
          strokeWidth={1.75}
        />
      )}
      <span>{isPending ? "Signing out…" : "Sign out"}</span>
    </button>
  );
}
