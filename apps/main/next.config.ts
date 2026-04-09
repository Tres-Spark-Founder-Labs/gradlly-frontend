import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  transpilePackages: ['@gradlly/ui', '@gradlly/utils', '@gradlly/env'],
};

export default nextConfig;
