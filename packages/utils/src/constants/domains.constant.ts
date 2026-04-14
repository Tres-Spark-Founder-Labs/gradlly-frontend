export const GRADLLY_DOMAINS = {
  employer: "employer.gradlly.com",
  provider: "provider.gradlly.com",
  apprentice: "apprentice.gradlly.com",
  flow: "flow.gradlly.com",
  main: "main.gradlly.com",
} as const;

export const GRADLLY_DEV_DOMAINS = {
  employer: "employer.gradlly.local",
  provider: "provider.gradlly.local",
  apprentice: "apprentice.gradlly.local",
  flow: "flow.gradlly.local",
  main: "main.gradlly.local",
} as const;

export const GRADLLY_WORKSPACE_PACKAGES = [
  "@gradlly/ui",
  "@gradlly/utils",
  "@gradlly/hooks",
] as const;

export const GRADLLY_IMAGE_HOSTS = {
  storage: "**.gradlly.com",
} as const;

export const GRADLLY_PROD_ORIGINS = Object.values(GRADLLY_DOMAINS).map(
  (d) => `https://${d}`,
);

export const GRADLLY_DEV_ORIGINS: string[] = [
  "*.gradlly.local",
  ...Object.values(GRADLLY_DEV_DOMAINS),
];
