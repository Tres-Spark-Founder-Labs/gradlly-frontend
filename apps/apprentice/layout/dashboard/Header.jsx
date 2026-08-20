"use client";

import { ChevronDown, Menu, Settings, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";

import { Avatar } from "@/components/ui/Avatar";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { cn, getFullName, getInitials } from "@/utils/helper";

import { HeaderNotifications } from "./HeaderNotifications";
import { UserMenu } from "./UserMenu";

const BREADCRUMBS = {
  "/": { parent: "My Learning", current: "Dashboard" },
  "/journey": { parent: "My Learning", current: "My journey" },
  "/otj-logs": { parent: "My Learning", current: "OTJ log" },
  "/portfolio": { parent: "My Learning", current: "Portfolio" },
  "/documents": { parent: "Reporting", current: "Documents" },
  "/learners": { parent: "Reporting", current: "Learners" },
  "/profile": { parent: "Account", current: "Profile" },
  "/settings": { parent: "Account", current: "Settings" },
};

/**
 * Resolves the breadcrumb for a pathname. Falls back to the closest parent
 * route (e.g. /settings/foo -> /settings) before the dashboard default, so
 * nested routes always show a sensible title.
 */
function resolveBreadcrumb(pathname) {
  if (BREADCRUMBS[pathname]) return BREADCRUMBS[pathname];
  const segments = pathname.split("/").filter(Boolean);
  while (segments.length > 0) {
    segments.pop();
    const parent = `/${segments.join("/")}`;
    if (BREADCRUMBS[parent]) return BREADCRUMBS[parent];
  }
  return { parent: "My Learning", current: "Dashboard" };
}

const MENU_BTN = cn(
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
  "border border-neutral-200 bg-white text-neutral-500 transition-colors duration-150",
  "hover:border-neutral-300 hover:bg-neutral-100 hover:text-neutral-700",
  "focus-visible:outline-2 focus-visible:outline-[#16a34a] focus-visible:outline-offset-2",
);

const ICON_BTN = cn(
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
  "border border-neutral-200 bg-white text-neutral-500 transition-colors duration-150",
  "hover:border-green-300 hover:bg-green-50 hover:text-green-700",
  "focus-visible:outline-2 focus-visible:outline-[#16a34a] focus-visible:outline-offset-2",
);

export function Header({
  sidebarOpen,
  onMenuOpen,
  userMenuOpen,
  onUserMenuOpenChange,
}) {
  const { user } = useAuthUser();
  const pathname = usePathname();
  const avatarRef = useRef(null);

  const breadcrumb = resolveBreadcrumb(pathname);
  const initials = getInitials(user?.firstName, user?.lastName);
  const fullName = getFullName(user);
  const email = user?.email;

  return (
    <header
      className="sticky top-0 z-200 flex h-16 shrink-0 items-center gap-4 px-4 sm:px-6"
      style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #f1f5f9",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
      }}
    >
      <a href="#main-content" className="sr-only-focusable">
        Skip to content
      </a>

      {/* ── Left: hamburger + page title ───────────── */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          onClick={onMenuOpen}
          aria-label={
            sidebarOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={sidebarOpen}
          className={MENU_BTN}
        >
          {sidebarOpen ? (
            <X aria-hidden className="h-5 w-5" />
          ) : (
            <Menu aria-hidden className="h-5 w-5" />
          )}
        </button>

        <div className="min-w-0">
          <p className="hidden text-[10px] font-semibold uppercase tracking-widest text-[#9ca3af] sm:block">
            {breadcrumb.parent}
          </p>
          <h1 className="truncate text-[17px] font-bold leading-tight text-[#111827]">
            {breadcrumb.current}
          </h1>
        </div>
      </div>

      {/* ── Right: actions + user ───────────────────── */}
      <div className="flex shrink-0 items-center gap-2">
        <Link
          href="/settings"
          aria-label="Settings"
          className={ICON_BTN}
          title="Settings"
        >
          <Settings aria-hidden className="h-4 w-4" strokeWidth={1.75} />
        </Link>

        <HeaderNotifications />

        <div aria-hidden className="mx-2 h-5 w-px bg-[#e5e7eb]" />

        <div className="relative">
          <button
            ref={avatarRef}
            onClick={() => onUserMenuOpenChange?.(!userMenuOpen)}
            aria-label="Open user menu"
            aria-expanded={userMenuOpen}
            aria-haspopup="menu"
            className={cn(
              "flex items-center gap-2 rounded-xl px-2 py-1.5",
              "transition-colors duration-150",
              "hover:bg-[#f9fafb]",
              "focus-visible:outline-2 focus-visible:outline-[#16a34a] focus-visible:outline-offset-2",
              userMenuOpen && "bg-[#f9fafb]",
            )}
          >
            <Avatar
              initials={initials}
              src={user?.avatarUrl}
              size="sm"
              className="shrink-0 ring-2 ring-[#dcfce7]"
            />
            <div className="hidden min-w-0 text-left sm:block">
              <p className="text-[13px] font-semibold leading-snug text-[#111827]">
                {fullName}
              </p>
              <p className="truncate text-[11px] leading-none text-[#9ca3af]">
                {email}
              </p>
            </div>
            <ChevronDown
              aria-hidden
              className={cn(
                "hidden h-3.5 w-3.5 shrink-0 text-[#9ca3af] transition-transform duration-150 sm:block",
                userMenuOpen && "rotate-180",
              )}
            />
          </button>

          <UserMenu
            open={userMenuOpen}
            onClose={() => onUserMenuOpenChange?.(false)}
            anchorRef={avatarRef}
          />
        </div>
      </div>
    </header>
  );
}
