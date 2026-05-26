"use client";

import {
  BookOpen,
  ClipboardCheck,
  LayoutDashboard,
  TrendingUp,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/utils/helper";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: LayoutDashboard },
  { label: "Courses", href: "/courses", icon: BookOpen },
  { label: "Assessments", href: "/assessments", icon: ClipboardCheck },
  { label: "Progress", href: "/progress", icon: TrendingUp },
  { label: "Profile", href: "/profile", icon: UserCircle },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden shrink-0"
      style={{
        borderTop: "1px solid #e5e7eb",
        backgroundColor: "#ffffff",
        boxShadow: "0 -1px 8px rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex h-16 items-center">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              className="relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#16a34a] focus-visible:-outline-offset-2"
            >
              <Icon
                aria-hidden
                strokeWidth={isActive ? 2 : 1.75}
                className={cn(
                  "h-5 w-5 transition-colors duration-150",
                  isActive ? "text-[#16a34a]" : "text-[#9ca3af]",
                )}
              />
              <span
                className={cn(
                  "text-[10px] font-medium transition-colors duration-150",
                  isActive ? "text-[#15803d]" : "text-[#9ca3af]",
                )}
              >
                {label}
              </span>
              {isActive && (
                <span
                  aria-hidden
                  className="absolute top-0 h-0.5 w-8 rounded-full bg-[#16a34a]"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
