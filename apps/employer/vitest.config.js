import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Mirror the "@/..." alias used across the app so tests import the same
    // way the components do (jsconfig.json paths are not read by Vitest).
    alias: { "@": dirname },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.js"],
    include: ["**/*.test.{js,jsx}"],
    exclude: ["node_modules/**", ".next/**"],
    // config/env/client.js validates NEXT_PUBLIC_* at import time and throws if
    // any are missing. Components pull it in transitively (via portal.config),
    // so tests need these present or the module graph fails to load. Values are
    // placeholders — nothing under test performs real navigation.
    env: {
      NEXT_PUBLIC_PORTAL: "employer",
      NEXT_PUBLIC_APP_URL: "http://localhost:3002",
      NEXT_PUBLIC_EMPLOYER_URL: "http://localhost:3002",
      NEXT_PUBLIC_PROVIDER_URL: "http://localhost:3001",
      NEXT_PUBLIC_APPRENTICE_URL: "http://localhost:3003",
      NEXT_PUBLIC_FLOW_URL: "http://localhost:3004",
      NEXT_PUBLIC_MAIN_URL: "http://localhost:3000",
    },
  },
});
