import { clientEnv } from "./env/client";

const PORTAL_KEY = clientEnv.NEXT_PUBLIC_PORTAL || "employer";
const themeColor = "#1b4f32";
const capitalize = (word) =>
  word ? word[0]?.toUpperCase() + word?.slice(1) : "";

export const PORTAL = Object.freeze({
  key: PORTAL_KEY,
  name: `${capitalize(PORTAL_KEY)} Portal`,
  brand: "Gradlly",
  locale: "en-GB",
  timeZone: "Europe/London",
  themeColor: themeColor,
  baseUrl: clientEnv.NEXT_PUBLIC_APP_URL || "https://employer.gradlly.com",
  defaultDescription:
    "Gradlly Employer Portal: manage apprentice hiring, track team performance, and streamline your apprenticeship programme.",
  loadingIndicatorProperties: {
    color: themeColor,
    height: 2,
    showSpinner: true,
    zIndex: 999999999,
  },
  emailVerification: Object.freeze({
    storageKey: "gradlly_verify_cooldown",
    cooldownMs: 5 * 60 * 1000,
    cooldownSeconds: 300,
  }),
  forgotPassword: Object.freeze({
    storageKey: "gradlly_fp_cooldown",
    cooldownMs: 5 * 60 * 1000,
    cooldownSeconds: 300,
  }),
  toastOptions: {
    position: "top-center",
    duration: 4000,
    style: {
      borderRadius: "10px",
      fontSize: "14px",
      padding: "12px 14px",
    },
    success: {
      iconTheme: {
        primary: "#22c55e",
        secondary: "#f8fafc",
      },
    },
    error: {
      iconTheme: {
        primary: "#ef4444",
        secondary: "#f8fafc",
      },
    },
    loading: {
      iconTheme: {
        primary: "#38bdf8",
        secondary: "#f8fafc",
      },
    },
  },
});
