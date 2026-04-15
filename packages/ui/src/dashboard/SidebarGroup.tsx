"use client";

import { SidebarItem } from "./SidebarItem";

import type { SidebarItemData } from "@gradlly/utils";

interface SidebarGroupProps {
  title: string;
  items: SidebarItemData[];
  currentPath: string;
  expandedPaths: Set<string>;
  onToggle: (path: string) => void;
}

export function SidebarGroup({
  title,
  items,
  currentPath,
  expandedPaths,
  onToggle,
}: SidebarGroupProps) {
  return (
    <section className="space-y-2">
      <h3 className="px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
        {title}
      </h3>
      <ul className="space-y-1">
        {items.map((item) => (
          <SidebarItem
            key={item.path}
            item={item}
            currentPath={currentPath}
            expanded={expandedPaths.has(item.path)}
            onToggle={onToggle}
          />
        ))}
      </ul>
    </section>
  );
}
