"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { SessionErrorScreen } from "@/components/error/SessionErrorScreen";
import { DashboardSkeleton } from "@/components/skeleton";
import { AUTH_REDIRECTS } from "@/features/auth/constants";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { BottomNav } from "@/layout/dashboard/BottomNav";
import { Header } from "@/layout/dashboard/Header";
import { Sidebar } from "@/layout/dashboard/Sidebar";
import { cn } from "@/utils/helper";

export function DashboardLayout({ children }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("gradlly_sidebar_open");
    return saved !== null ? saved === "true" : window.innerWidth >= 1024;
  });
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { user, isLoading, isError } = useAuthUser();

  useEffect(() => {
    localStorage.setItem("gradlly_sidebar_open", sidebarOpen);
  }, [sidebarOpen]);

  useEffect(() => {
    if (!isLoading && !isError && !user) {
      router.replace(AUTH_REDIRECTS.LOGIN_PAGE);
    }
  }, [isLoading, isError, user, router]);

  if (isLoading || (!isError && !user)) return <DashboardSkeleton />;
  if (isError) return <SessionErrorScreen />;

  return (
    <div className="h-dvh overflow-hidden bg-neutral-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div
        suppressHydrationWarning
        className={cn(
          "main-content-area flex h-dvh flex-col overflow-hidden",
          sidebarOpen && "sidebar-open",
        )}
      >
        <Header
          sidebarOpen={sidebarOpen}
          onMenuOpen={() => setSidebarOpen((v) => !v)}
          userMenuOpen={userMenuOpen}
          onUserMenuOpenChange={setUserMenuOpen}
        />
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 overflow-y-auto pb-16 focus-visible:outline-none md:pb-0"
        >
          <div className="mx-auto w-full max-w-360 px-8 py-8 sm:px-6 sm:py-6 max-sm:px-4 max-sm:py-4">
            {children}
          </div>
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
