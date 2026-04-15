"use client";

import {
  cn,
  hasActiveChild,
  isPathActive,
  type SidebarItemData,
} from "@gradlly/utils";
import Link from "next/link";

import { renderIconByName } from "./icons";
import { AnimatedContainer } from "../motion/AnimatedContainer";
import { Badge } from "../primitives/Badge";

interface SidebarItemProps {
  item: SidebarItemData;
  currentPath: string;
  expanded: boolean;
  onToggle: (path: string) => void;
}

export function SidebarItem({
  item,
  currentPath,
  expanded,
  onToggle,
}: SidebarItemProps) {
  const active = isPathActive(currentPath, item.path);
  const childActive = hasActiveChild(item.children, currentPath);
  const isOpen = expanded || childActive;

  return (
    <li>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          {item.collapsible && item.children?.length ? (
            <button
              onClick={() => onToggle(item.path)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-300 transition-colors",
                active || childActive
                  ? "bg-white/10 text-white"
                  : "hover:bg-white/5",
              )}
              type="button"
            >
              {renderIconByName(item.icon)}
              <span className="flex-1">{item.label}</span>
              {item.badge ? (
                <Badge tone={item.badge.color}>{item.badge.text}</Badge>
              ) : null}
              <span
                className={cn(
                  "transition-transform",
                  isOpen ? "rotate-90" : "",
                )}
              >
                ›
              </span>
            </button>
          ) : (
            <Link
              href={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors",
                active ? "bg-white/10 text-white" : "hover:bg-white/5",
              )}
            >
              {renderIconByName(item.icon)}
              <span className="flex-1">{item.label}</span>
              {item.badge ? (
                <Badge tone={item.badge.color}>{item.badge.text}</Badge>
              ) : null}
            </Link>
          )}
        </div>

        {item.children?.length && isOpen ? (
          <AnimatedContainer
            variant="slideDown"
            duration={0.2}
            className="pl-8"
          >
            <ul className="space-y-1">
              {item.children.map((child) => {
                const isChildActive = isPathActive(currentPath, child.path);
                return (
                  <li key={child.path}>
                    <Link
                      href={child.path}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-slate-300 transition-colors",
                        isChildActive
                          ? "bg-white/10 text-white"
                          : "hover:bg-white/5",
                      )}
                    >
                      {renderIconByName(child.icon)}
                      <span>{child.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </AnimatedContainer>
        ) : null}
      </div>
    </li>
  );
}
