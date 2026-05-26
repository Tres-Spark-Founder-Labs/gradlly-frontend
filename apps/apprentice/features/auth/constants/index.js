export const AUTH_API_PATHS = Object.freeze({
  LOGIN: "/api/v1/auth/login",
  REFRESH: "/api/v1/auth/refresh",
  LOGOUT: "/api/v1/auth/logout",
  ME: "/api/v1/auth/me",
  FORGOT_PASSWORD: "/api/v1/auth/forgot-password",
  RESET_PASSWORD: "/api/v1/auth/reset-password",
});

export const AUTH_COOKIES = Object.freeze({
  ACCESS: "gradlly_at",
  REFRESH: "gradlly_rt",
});

export const AUTH_REDIRECTS = Object.freeze({
  DASHBOARD_HOME_PAGE: "/",
  LOGIN_PAGE: "/login",
});
