import type { HeaderData } from "./types";

export const HEADER_DATA: HeaderData = {
  logo: "Gradlly",
  title: "Shared Dashboard",
  enableSearch: true,
  actions: [
    { id: "alerts", label: "Alerts", icon: "Bell", href: "/alerts" },
    { id: "security", label: "Security", icon: "Shield", href: "/security" },
  ],
};
