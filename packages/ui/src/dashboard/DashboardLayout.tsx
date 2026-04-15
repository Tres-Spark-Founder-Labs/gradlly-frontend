"use client";

import {
  DASHBOARD_THEMES,
  FOOTER_DATA,
  HEADER_DATA,
  SIDEBAR_DATA,
  USER_DATA,
  getThemeVars,
  resolveAppName,
  type AppName,
} from "@gradlly/utils";
import { usePathname } from "next/navigation";
import { useMemo, useState, type PropsWithChildren } from "react";

import { Footer } from "./Footer";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps extends PropsWithChildren {
  appName?: AppName;
}

export function DashboardLayout({ appName, children }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const resolvedApp = resolveAppName(appName);
  const theme = DASHBOARD_THEMES[resolvedApp];
  const themeVars = useMemo(() => getThemeVars(theme), [theme]);

  return (
    <div className="min-h-dvh" style={themeVars}>
      <style>{`@keyframes dashboard-enter { from { opacity: 0; transform: translate3d(0, 8px, 0) scale(0.98); } to { opacity: 1; transform: translate3d(0,0,0) scale(1); } }`}</style>
      <Sidebar
        items={SIDEBAR_DATA}
        currentPath={pathname}
        user={USER_DATA}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="md:pl-72">
        <Header
          data={HEADER_DATA}
          user={USER_DATA}
          onToggleSidebar={() => setMobileOpen((prev) => !prev)}
        />
        <main
          className="min-h-[calc(100dvh-8rem)] p-4 md:p-6"
          style={{
            backgroundColor: "var(--dashboard-background)",
          }}
        >
          {children}
        </main>
        <Footer data={FOOTER_DATA} />
      </div>
    </div>
  );
}
