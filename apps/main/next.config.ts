import type { NextConfig } from "next";

import { loadEnvConfig } from "@next/env";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appDirectory = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = join(appDirectory, "../..");

loadEnvConfig(workspaceRoot);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  transpilePackages: ["@gradlly/ui", "@gradlly/utils", "@gradlly/hooks"],
};

export default nextConfig;
