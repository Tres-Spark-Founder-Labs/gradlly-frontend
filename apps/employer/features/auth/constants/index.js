export const AUTH_API_PATHS = Object.freeze({
  SIGNUP: "/api/v1/auth/signup",
  LOGIN: "/api/v1/auth/login",
  REFRESH: "/api/v1/auth/refresh",
  LOGOUT: "/api/v1/auth/logout",
  ME: "/api/v1/auth/me",
  VERIFY_EMAIL: "/api/v1/auth/verify-email",
  RESEND_VERIFICATION: "/api/v1/auth/resend-verification",
  FORGOT_PASSWORD: "/api/v1/auth/forgot-password",
  RESET_PASSWORD: "/api/v1/auth/reset-password",
});

export const AUTH_COOKIES = Object.freeze({
  ACCESS: "gradlly_at",
  REFRESH: "gradlly_rt",
});

export const AUTH_REDIRECTS = Object.freeze({
  DASHBOARD_HOME_PAGE: "/",
  VERIFY_EMAIL_PAGE: "/verify-email",
  LOGIN_PAGE: "/login",
});
