import "@/assets/css/globals.css";
import { PORTAL } from "@/config/portal.config";
import { AppProvider } from "@/providers";
import { createPageSeo } from "@/utils/metadata";

export const { metadata, viewport } = createPageSeo();

export default function RootLayout({ children }) {
  return (
    <html
      lang={PORTAL.locale.replace("_", "-")}
      data-scroll-behavior="smooth"
      className="h-full antialiased"
    >
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
