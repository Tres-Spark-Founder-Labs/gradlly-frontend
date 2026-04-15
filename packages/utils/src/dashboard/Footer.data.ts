import type { FooterData } from "./types";

export const FOOTER_DATA: FooterData = {
  copyright: "© 2026 Gradlly. All rights reserved.",
  sections: [
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Careers", href: "/careers" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "/help" },
        { label: "Status", href: "/status" },
      ],
    },
  ],
};
