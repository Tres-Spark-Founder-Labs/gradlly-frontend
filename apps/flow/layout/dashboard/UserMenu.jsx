"use client";

import { ArrowLeftRight, Bell, HelpCircle, Settings, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { Avatar } from "@/components/ui/Avatar";
import TextBadge from "@/components/ui/TextBadge";
import { LogoutButton } from "@/features/auth/components/LogoutButton";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import {
  capitalise,
  cn,
  formatDateTime,
  getFullName,
  getInitials,
} from "@/utils/helper";

// ─── Menu items ───────────────────────────────────────────────────────────────

const MENU_ITEMS = [
  { label: "Profile", icon: User, href: "/profile" },
  { label: "Preferences", icon: Settings, href: "/settings" },
  {
    label: "Notification settings",
    icon: Bell,
    href: "/settings/notifications",
  },
  { label: "Switch organisation", icon: ArrowLeftRight, href: "/organisation" },
  { label: "Help & docs", icon: HelpCircle, href: "/help" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function UserMenu({ open, onClose, anchorRef }) {
  const { user, activeOrganisation } = useAuthUser();
  const initials = getInitials(user?.firstName, user?.lastName);
  const fullName = getFullName(user);
  const role = capitalise(activeOrganisation?.roles?.[0] ?? "member");
  const lastLogin = formatDateTime(user?.lastLoginAt);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e) => {
      if (
        ref.current &&
        !ref.current.contains(e.target) &&
        !anchorRef?.current?.contains(e.target)
      )
        onClose();
    };
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  return (
    /*
     * Mobile fix: max-w-[calc(100vw-1rem)] caps the panel width to the
     * viewport width minus a small gutter, preventing horizontal overflow
     * on narrow screens while keeping right-0 alignment on desktop.
     */
    <div
      ref={ref}
      role="menu"
      aria-label="User menu"
      className={cn(
        "absolute right-0 top-full z-50 mt-2",
        "w-72 max-w-[calc(100vw-1rem)]",
        "overflow-hidden rounded-xl border border-neutral-200 bg-white",
        "shadow-[0_8px_32px_rgba(0,0,0,0.08)]",
        "animate-[slide-up_200ms_cubic-bezier(0.16,1,0.3,1)_forwards]",
      )}
    >
      {/* User identity header */}
      <div className="border-b border-neutral-100 px-4 py-4">
        <div className="flex items-center gap-3">
          <Avatar
            initials={initials}
            src={user?.avatarUrl}
            size="md"
            className="shrink-0 ring-2 ring-primary-100"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-neutral-900">
              {fullName}
            </p>
            <p className="truncate text-xs text-neutral-500">{user?.email}</p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <TextBadge variant="light" color="purple" size="xs">
            {role}
          </TextBadge>
          {user?.isEmailVerified && (
            <TextBadge variant="light" color="green" size="xs">
              Verified
            </TextBadge>
          )}
        </div>

        {lastLogin && (
          <p className="mt-2 text-[11px] tabular-nums text-neutral-400">
            Last login · {lastLogin}
          </p>
        )}
      </div>

      {/* Menu items */}
      <div className="py-1">
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.href + item.label}
            href={item.href}
            role="menuitem"
            onClick={onClose}
            className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-neutral-700 transition-colors duration-100 hover:bg-neutral-50 hover:text-neutral-900 focus-visible:bg-neutral-100 focus-visible:outline-none"
          >
            <item.icon
              aria-hidden
              className="h-3.5 w-3.5 shrink-0 text-neutral-400"
              strokeWidth={1.75}
            />
            {item.label}
          </Link>
        ))}
      </div>

      {/* Sign out */}
      <div className="border-t border-neutral-100 py-1">
        <LogoutButton variant="menu" />
      </div>
    </div>
  );
}
