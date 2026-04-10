import type { DefaultToastOptions, ToasterProps } from "react-hot-toast";

export const DEFAULT_TOAST_DURATION = 3500;

export const TOAST_POSITION: ToasterProps["position"] = "top-right";

export const toastOptions: DefaultToastOptions = {
  duration: DEFAULT_TOAST_DURATION,
  style: {
    borderRadius: "10px",
    background: "#0f172a",
    color: "#f8fafc",
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
};

export const toasterConfig: ToasterProps = {
  position: TOAST_POSITION,
  toastOptions,
};
