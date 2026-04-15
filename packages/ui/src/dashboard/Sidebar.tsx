"use client";

import { useMemo, useState } from "react";

import { SidebarGroup } from "./SidebarGroup";
import { UserCard } from "./UserCard";

import type { SidebarItemData, UserData } from "@gradlly/utils";

interface SidebarProps {
  items: SidebarItemData[];
  currentPath: string;
  user: UserData;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  items,
  currentPath,
  user,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(
    new Set(
      items.filter((item) => item.defaultExpanded).map((item) => item.path),
    ),
  );

  const groupedItems = useMemo(() => {
    return items.reduce<Record<string, SidebarItemData[]>>((acc, item) => {
      const key = item.section ?? "General";
      acc[key] ??= [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [items]);

  const handleToggle = (path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/50 transition-opacity md:hidden ${mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onCloseMobile}
      />
      <aside
        className={`fixed left-0 top-0 z-40 flex h-dvh w-72 flex-col border-r border-white/10 bg-[#080808] text-white transition-transform md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-white/10 px-5 py-4">
          <p className="text-lg font-semibold">Gradlly Console</p>
          <p className="text-xs text-slate-400">Shared dashboard package</p>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
          {Object.entries(groupedItems).map(([group, groupItems]) => (
            <SidebarGroup
              key={group}
              title={group}
              items={groupItems}
              currentPath={currentPath}
              expandedPaths={expandedPaths}
              onToggle={handleToggle}
            />
          ))}
        </div>
        <div className="border-t border-white/10 p-3">
          <UserCard user={user} />
        </div>
      </aside>
    </>
  );
}
