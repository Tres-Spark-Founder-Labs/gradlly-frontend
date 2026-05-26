"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { SessionErrorScreen } from "@/components/error/SessionErrorScreen";
import { DashboardSkeleton } from "@/components/skeleton";
import { Modal } from "@/components/ui/Modal";
import { AUTH_REDIRECTS } from "@/features/auth/constants";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { CreateOrganisationContent } from "@/features/organization/components/CreateOrganisationContent";
import { Header } from "@/layout/dashboard/Header";
import { Sidebar } from "@/layout/dashboard/Sidebar";
import { cn } from "@/utils/helper";

const MODAL_DELAY_MS = 2000;

export function DashboardLayout({ children }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("gradlly_sidebar_open");
    return saved !== null ? saved === "true" : window.innerWidth >= 1024;
  });
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [orgModalOpen, setOrgModalOpen] = useState(false);

  const { user, isLoading, isError } = useAuthUser();

  const needsOrg = Boolean(user && !user.activeOrganisation);

  useEffect(() => {
    localStorage.setItem("gradlly_sidebar_open", sidebarOpen);
  }, [sidebarOpen]);

  useEffect(() => {
    if (!needsOrg) return;
    const timer = setTimeout(() => setOrgModalOpen(true), MODAL_DELAY_MS);
    return () => {
      clearTimeout(timer);
      setOrgModalOpen(false);
    };
  }, [needsOrg]);

  useEffect(() => {
    if (!isLoading && !isError && !user) {
      router.replace(AUTH_REDIRECTS.LOGIN_PAGE);
    }
  }, [isLoading, isError, user, router]);

  if (isLoading || (!isError && !user)) return <DashboardSkeleton />;
  if (isError) return <SessionErrorScreen />;

  return (
    <>
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
            className="flex-1 overflow-y-auto focus-visible:outline-none"
          >
            <div className="mx-auto w-full max-w-360 px-8 py-8 sm:px-6 sm:py-6 max-sm:px-4 max-sm:py-4">
              {children}
            </div>
          </main>
        </div>
      </div>

      <Modal
        open={orgModalOpen}
        closable={false}
        size="4xl"
        className="flex-col lg:flex-row"
      >
        <CreateOrganisationContent
          onOrgCreated={() => setOrgModalOpen(false)}
        />
      </Modal>
    </>
  );
}
