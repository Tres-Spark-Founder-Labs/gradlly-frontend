"use client";

import { ChevronDown, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { GradllyLogo } from "@/assets/svgs/GradllyLogo";
import { Avatar } from "@/components/ui/Avatar";
import { NAV_SECTIONS } from "@/data/sidebar.data";
import { LogoutButton } from "@/features/auth/components/LogoutButton";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { capitalise, cn, getFullName, getInitials } from "@/utils/helper";

export function Sidebar({ isOpen, onClose }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const { user, activeOrganisation } = useAuthUser();
  const pathname = usePathname();

  const org = activeOrganisation?.organisation;
  const roles = activeOrganisation?.roles ?? [];
  const orgName = org?.name ?? "Acme Corp";
  const orgInitial = orgName[0].toUpperCase();
  const initials = getInitials(user?.firstName, user?.lastName);
  const fullName = getFullName(user);
  const role = capitalise(roles?.[0] ?? "member");

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
          <div
            className="rounded-xl p-3"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(94,164,120,0.15)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[14px] font-extrabold text-white"
                style={{
                  background: "linear-gradient(145deg,#22c55e 0%,#15803d 100%)",
                }}
              >
                {orgInitial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12.5px] font-semibold text-white">
                  {orgName}
                </p>
                <p className="mt-0.5 text-[10.5px] text-white/40">
                  Employer Account
                </p>
              </div>
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
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav aria-label="Primary navigation" className="sidebar-nav py-2">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              <p className="mx-4 mb-1 mt-3 text-[10px] font-semibold uppercase tracking-widest text-white/25">
                {section.title}
              </p>

              {section.items.map((item) => {
                const hasChildren = Boolean(item.children?.length);
                const isActive =
                  pathname === item.href ||
                  (hasChildren &&
                    item.children.some((c) => pathname === c.href));
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
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                "flex rounded-lg px-3 py-2.5 text-[12.5px] font-medium transition-colors duration-150",
                                "focus-visible:outline-2 focus-visible:outline-[#5ea478] focus-visible:-outline-offset-2",
                                pathname === child.href
                                  ? "text-white"
                                  : "text-white/45 hover:text-white/75",
                              )}
                            >
                              {child.label}
                            </Link>
                          ))}
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
                      "group mx-2 flex items-center gap-3 rounded-lg px-3 py-3.5",
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
                    {item.label}
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
                {role}
              </p>
            </div>
            <LogoutButton variant="sidebar" />
          </div>
        </div>
      </aside>
    </>
  );
}
