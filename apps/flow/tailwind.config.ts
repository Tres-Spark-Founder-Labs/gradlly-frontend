import type { Config } from 'tailwindcss';

import { baseConfig } from '@gradlly/config/tailwind/base';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/**/*.{ts,tsx}',
    '../../packages/**/*.{ts,tsx}',
  ],
  presets: [baseConfig],
};

export default config;
