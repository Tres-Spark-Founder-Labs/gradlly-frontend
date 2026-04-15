import type { AppName, DashboardTheme, DashboardThemeVars } from "./types";

export const DASHBOARD_THEMES: Record<AppName, DashboardTheme> = {
  main: {
    name: "main",
    primary: "#2563eb",
    secondary: "#dbeafe",
    accent: "#1d4ed8",
    background: "#eff6ff",
    text: "#1e3a8a",
    hover: "#bfdbfe",
  },
  apprentice: {
    name: "apprentice",
    primary: "#16a34a",
    secondary: "#dcfce7",
    accent: "#15803d",
    background: "#f0fdf4",
    text: "#14532d",
    hover: "#bbf7d0",
  },
  employer: {
    name: "employer",
    primary: "#9333ea",
    secondary: "#f3e8ff",
    accent: "#7e22ce",
    background: "#faf5ff",
    text: "#581c87",
    hover: "#e9d5ff",
  },
  provider: {
    name: "provider",
    primary: "#ea580c",
    secondary: "#ffedd5",
    accent: "#c2410c",
    background: "#fff7ed",
    text: "#7c2d12",
    hover: "#fed7aa",
  },
  flow: {
    name: "flow",
    primary: "#dc2626",
    secondary: "#fee2e2",
    accent: "#b91c1c",
    background: "#fef2f2",
    text: "#7f1d1d",
    hover: "#fecaca",
  },
};

export const getThemeVars = (theme: DashboardTheme): DashboardThemeVars => ({
  "--dashboard-primary": theme.primary,
  "--dashboard-secondary": theme.secondary,
  "--dashboard-accent": theme.accent,
  "--dashboard-background": theme.background,
  "--dashboard-text": theme.text,
  "--dashboard-hover": theme.hover,
});
