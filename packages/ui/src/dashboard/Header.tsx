"use client";

import Link from "next/link";

import { renderIconByName } from "./icons";
import { Button } from "../primitives/Button";
import { Input } from "../primitives/Input";

import type { HeaderData, UserData } from "@gradlly/utils";

interface HeaderProps {
  data: HeaderData;
  user: UserData;
  onToggleSidebar: () => void;
}

export function Header({ data, user, onToggleSidebar }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 md:px-6">
        <Button
          variant="ghost"
          className="md:hidden"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          ☰
        </Button>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--dashboard-primary)]">
            {data.logo}
          </p>
          <h1 className="truncate text-base font-semibold text-slate-900">
            {data.title}
          </h1>
        </div>

        {data.enableSearch ? (
          <div className="mx-auto hidden max-w-md flex-1 md:block">
            <Input placeholder="Search dashboard" />
          </div>
        ) : null}

        <div className="ml-auto flex items-center gap-2">
          {data.actions.map((action) => {
            const content = (
              <>
                {renderIconByName(action.icon)}
                <span className="hidden md:inline">{action.label}</span>
              </>
            );
            return action.href ? (
              <Link
                key={action.id}
                href={action.href}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-2.5 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                {content}
              </Link>
            ) : (
              <Button key={action.id} variant="ghost">
                {content}
              </Button>
            );
          })}
          <div className="hidden rounded-full bg-[var(--dashboard-secondary)] px-3 py-1 text-xs font-semibold text-[var(--dashboard-text)] sm:block">
            {user.avatar}
          </div>
        </div>
      </div>
    </header>
  );
}
