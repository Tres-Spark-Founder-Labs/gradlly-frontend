export const AUTH_TOKEN_KEY = "gradlly_access_token" as const;
export const AUTH_REFRESH_TOKEN_KEY = "gradlly_refresh_token" as const;
export const AUTH_SESSION_KEY = "gradlly_session" as const;
export const ACCESS_TOKEN_EXPIRY_MS = 15 * 60 * 1000;
export const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;
export const AUTH_ROUTES = {
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_EMAIL: "/verify-email",
} as const;
