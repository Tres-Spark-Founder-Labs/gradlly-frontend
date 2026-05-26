import "@/assets/css/globals.css";
import { PORTAL } from "@/config/portal.config";
import { createPageSeo } from "@/utils/metadata";

export const { metadata, viewport } = createPageSeo({
  portalName: PORTAL.name,
  description: PORTAL.defaultDescription,
});

export default function RootLayout({ children }) {
  return (
    <html lang={PORTAL.locale.replace("_", "-")} className="h-full antialiased">
      <body>
        <>{children}</>
      </body>
    </html>
  );
}
