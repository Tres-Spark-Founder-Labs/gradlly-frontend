import type { Config } from 'tailwindcss';

import sharedConfig from '@gradlly/config/tailwind.config';

const config: Config = {
  ...sharedConfig,
  content: ['./src/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
  // Portal-specific theme overrides go here if needed
};

export default config;
