import type { NextConfig } from 'next';

import { loadEnvConfig } from '@next/env';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const appDirectory = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = join(appDirectory, '../..');

loadEnvConfig(workspaceRoot);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // Transpile shared workspace packages
  transpilePackages: ['@gradlly/ui', '@gradlly/utils'],
  experimental: {
    // React 19 server actions
    // serverActions: { allowedOrigins: ['employer.gradlly.com'] },
  },
  images: {
    remotePatterns: [
      // { protocol: 'https', hostname: 'storage.gradlly.com' },
    ],
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
