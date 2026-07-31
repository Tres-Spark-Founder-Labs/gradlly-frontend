"use client";

import { Building2, ChevronDown, Globe, Hash, Mail, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import { GradllyLogo } from "@/assets/svgs/GradllyLogo";
import { Avatar } from "@/components/ui/Avatar";
import { NAV_SECTIONS } from "@/data/sidebar.data";
import { LogoutButton } from "@/features/auth/components/LogoutButton";
import { OrgSwitcher } from "@/features/auth/components/OrgSwitcher";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { useRoleAccess } from "@/features/auth/hooks/useRoleAccess";
import { useCommitmentBoard } from "@/features/commitments/queries/commitments.query";
import { useOtjPendingCount } from "@/features/otj/queries/otj.query";
import { capitalise, cn, getFullName, getInitials } from "@/utils/helper";

// Compact labelled row for the sidebar organisation card.
function OrgDetailRow({ icon: Icon, value, mono = false, href }) {
  if (!value) return null;
  const body = (
    <>
      <Icon
        className="h-3 w-3 shrink-0 text-white/35"
        strokeWidth={2}
        aria-hidden
      />
      <span
        className={cn(
          "truncate text-[10.5px] text-white/55",
          mono && "font-mono tracking-tight",
        )}
      >
        {value}
      </span>
    </>
  );
  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 transition-colors hover:text-white/85"
    >
      {body}
    </a>
  ) : (
    <div className="flex items-center gap-1.5">{body}</div>
  );
}

export function Sidebar({ isOpen, onClose }) {
  const { user, activeOrganisation } = useAuthUser();
  const { can } = useRoleAccess();
  const pathname = usePathname();
  const otjPendingCount = useOtjPendingCount();
  // F1.3.1 AC5 — "'Statements requiring action' count is shown as a badge on
  // the sidebar navigation item". The board returns this alongside its rows,
  // so the badge and the table are computed from one query and cannot
  // disagree.
  const commitmentBoard = useCommitmentBoard();

  /**
   * Live counts override the static `badge` values in sidebar.data.js.
   *
   * Those statics are placeholders — Commitments was hardcoded to 2 and
   * Messages to 5, shown to every employer regardless of what was actually
   * waiting. A red badge that never changes trains people to ignore it, so
   * anything still on a static number should be treated as unfinished rather
   * than as a working feature.
   */
  const liveBadges = {
    "/otj-approvals": otjPendingCount.data ?? 0,
    "/commitments": commitmentBoard.data?.actionRequiredCount ?? 0,
  };

  // Active matching for nested routes (e.g. Settings sub-pages). Bare /settings
  // resolves to its default first sub-page (/settings/invitations).
  const isHrefActive = (href) =>
    pathname === href ||
    (href === "/settings/invitations" && pathname === "/settings");

  // Auto-open the dropdown whose child route is currently active.
  const activeParentLabel = useMemo(() => {
    const matches = (href) =>
      pathname === href ||
      (href === "/settings/invitations" && pathname === "/settings");
    for (const section of NAV_SECTIONS) {
      for (const item of section.items) {
        if (item.children?.some((c) => matches(c.href))) return item.label;
      }
    }
    return null;
  }, [pathname]);

  // Initialise the dropdown open-state from the active route on mount. The
  // active parent also stays highlighted via isHrefActive regardless of toggle.
  const [openDropdown, setOpenDropdown] = useState(activeParentLabel);

  const org = activeOrganisation?.organisation;
  const roles = activeOrganisation?.roles ?? [];
  const membershipStatus = activeOrganisation?.membershipStatus ?? null;
  const hasOrg = Boolean(org);
  const orgName = org?.name ?? "";
  const orgInitial = orgName ? orgName[0].toUpperCase() : "";
  const orgWebsite = org?.website?.replace(/^https?:\/\//, "") ?? "";
  const roleLabel = roles.length ? capitalise(roles[0]) : null;
  const initials = getInitials(user?.firstName, user?.lastName);
  const fullName = getFullName(user);

  return (
    <>
      {isOpen && (
        <div
          aria-hidden
          className="sidebar-backdrop lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        aria-label="Main navigation"
        aria-hidden={!isOpen || undefined}
        inert={!isOpen}
        className={cn("sidebar", !isOpen && "sidebar-closed")}
      >
        {/* Brand */}
        <div
          className="flex shrink-0 items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid rgba(94,164,120,0.12)" }}
        >
          <Link
            href="/"
            aria-label="Gradlly home"
            className="flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-[#5ea478] focus-visible:outline-offset-2"
          >
            <GradllyLogo size={34} />
            <span className="text-[15px] font-bold tracking-tight text-white">
              Gradlly
            </span>
            <span
              className="rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest"
              style={{ background: "rgba(94,164,120,0.18)", color: "#5ea478" }}
            >
              Employer
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="lg:hidden flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-white/50 transition-colors duration-150 hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <X size={14} aria-hidden />
          </button>
        </div>

        {/* Org block */}
        <div className="shrink-0 px-4 py-3">
          {hasOrg ? (
            <div
              className="rounded-xl p-3"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(94,164,120,0.15)",
              }}
            >
              <div className="flex items-center gap-3">
                <Avatar
                  src={org?.logoUrl}
                  initials={orgInitial}
                  alt={`${orgName} logo`}
                  size="md"
                  shape="square"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-semibold text-white">
                    {orgName}
                  </p>
                  {roleLabel ? (
                    <p className="mt-0.5 truncate text-[10.5px] font-medium text-white/45">
                      {roleLabel}
                    </p>
                  ) : null}
                </div>
                {membershipStatus === "active" ? (
                  <span
                    className="flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5"
                    style={{ background: "rgba(34,197,94,0.15)" }}
                  >
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 rounded-full bg-[#22c55e]"
                    />
                    <span className="text-[9px] font-bold text-[#22c55e]">
                      Active
                    </span>
                  </span>
                ) : membershipStatus ? (
                  <span
                    className="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold capitalize text-white/60"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                  >
                    {membershipStatus}
                  </span>
                ) : null}
              </div>

              {/* Org detail rows */}
              {org?.orgEmail || org?.ukprn || orgWebsite ? (
                <div
                  className="mt-2 space-y-1 pt-2"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <OrgDetailRow icon={Mail} value={org?.orgEmail} />
                  <OrgDetailRow icon={Hash} value={org?.ukprn} mono />
                  <OrgDetailRow
                    icon={Globe}
                    value={orgWebsite}
                    href={org?.website}
                  />
                </div>
              ) : null}
            </div>
          ) : (
            <div
              className="rounded-xl p-3"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px dashed rgba(255,255,255,0.14)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <Building2
                    className="h-4 w-4 text-white/40"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-semibold text-white/80">
                    No organisation yet
                  </p>
                  <p className="mt-0.5 text-[10.5px] leading-snug text-white/40">
                    Create one to unlock your dashboard.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Organisation switcher (only when the user has >1 org on this portal) */}
        <OrgSwitcher variant="sidebar" />

        {/* Nav */}
        <nav aria-label="Primary navigation" className="sidebar-nav py-2">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              <p className="mx-4 mb-1 mt-3 text-[10px] font-semibold uppercase tracking-widest text-white/25">
                {section.title}
              </p>

              {section.items.map((item) => {
                // Hide child links the user's role is not permitted to see.
                const visibleChildren = (item.children ?? []).filter(
                  (c) => !c.requiresRole || can(c.requiresRole),
                );
                const hasChildren = visibleChildren.length > 0;
                const isActive =
                  pathname === item.href ||
                  (hasChildren &&
                    visibleChildren.some((c) => isHrefActive(c.href)));
                const isExpanded = openDropdown === item.label;
                const Icon = item.icon;

                if (hasChildren) {
                  return (
                    <div key={item.label}>
                      <button
                        type="button"
                        onClick={() =>
                          setOpenDropdown((p) =>
                            p === item.label ? null : item.label,
                          )
                        }
                        aria-expanded={isExpanded}
                        className={cn(
                          "group mx-2 flex w-[calc(100%-1rem)] items-center gap-3 rounded-lg px-3 py-3.5",
                          "text-[13px] font-medium transition-colors duration-150",
                          "focus-visible:outline-2 focus-visible:outline-[#5ea478] focus-visible:-outline-offset-2",
                          isActive
                            ? "bg-primary-400/14 text-white"
                            : "text-white/55 hover:bg-primary-400/8 hover:text-white/85",
                        )}
                        style={
                          isActive
                            ? {
                                borderLeft: "3px solid #5ea478",
                                paddingLeft: "9px",
                              }
                            : undefined
                        }
                      >
                        <Icon
                          aria-hidden
                          strokeWidth={1.75}
                          className={cn(
                            "h-4 w-4 shrink-0",
                            isActive
                              ? "text-primary-400"
                              : "text-white/40 group-hover:text-primary-400/70",
                          )}
                        />
                        <span className="flex-1 text-left">{item.label}</span>
                        <ChevronDown
                          aria-hidden
                          className={cn(
                            "h-3.5 w-3.5 text-white/30 transition-transform duration-200",
                            isExpanded && "rotate-180",
                          )}
                        />
                      </button>

                      <div
                        className={cn("sidebar-submenu", isExpanded && "open")}
                      >
                        <div className="sidebar-submenu-inner py-0.5 pl-10 pr-2">
                          {visibleChildren.map((child) => {
                            const ChildIcon = child.icon;
                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={cn(
                                  "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[12.5px] font-medium transition-colors duration-150",
                                  "focus-visible:outline-2 focus-visible:outline-[#5ea478] focus-visible:-outline-offset-2",
                                  isHrefActive(child.href)
                                    ? "text-white"
                                    : "text-white/45 hover:text-white/75",
                                )}
                              >
                                {ChildIcon ? (
                                  <ChildIcon
                                    aria-hidden
                                    strokeWidth={1.75}
                                    className="h-3.5 w-3.5 shrink-0"
                                  />
                                ) : null}
                                <span>{child.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group mx-2 flex items-center gap-3 rounded-lg px-3 py-3.5 mb-0.5",
                      "text-[13px] font-medium transition-colors duration-150",
                      "focus-visible:outline-2 focus-visible:outline-[#5ea478] focus-visible:-outline-offset-2",
                      isActive
                        ? "bg-primary-400/14 text-white"
                        : "text-white/55 hover:bg-primary-400/8 hover:text-white/85",
                    )}
                    style={
                      isActive
                        ? {
                            borderLeft: "3px solid #5ea478",
                            paddingLeft: "9px",
                          }
                        : undefined
                    }
                  >
                    <Icon
                      aria-hidden
                      strokeWidth={1.75}
                      className={cn(
                        "h-4 w-4 shrink-0",
                        isActive
                          ? "text-primary-400"
                          : "text-white/40 group-hover:text-primary-400/70",
                      )}
                    />
                    <span className="flex-1">{item.label}</span>
                    {(liveBadges[item.href] ?? item.badge ?? 0) > 0 && (
                      <span className="flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white leading-none">
                        {liveBadges[item.href] ?? item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User block */}
        <div
          className="shrink-0 px-3 py-3"
          style={{ borderTop: "1px solid rgba(94,164,120,0.12)" }}
        >
          <div className="flex items-center gap-2.5 rounded-xl px-3 py-2.5">
            <div className="relative shrink-0">
              <Avatar
                initials={initials}
                src={user?.avatarUrl}
                size="sm"
                className="ring-2 ring-primary-400/30"
              />
              {user?.isActive && (
                <span
                  aria-hidden
                  className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#22c55e]"
                  style={{ outline: "2px solid #06170d" }}
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12.5px] font-semibold text-white">
                {fullName}
              </p>
              <p className="mt-0.5 truncate text-[10.5px] text-white/40">
                {user?.email}
              </p>
            </div>
            <LogoutButton variant="sidebar" />
          </div>
        </div>
      </aside>
    </>
  );
}
