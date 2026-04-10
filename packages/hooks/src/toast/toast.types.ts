import type { ToastOptions } from "react-hot-toast";

export type ToastKind = "success" | "error" | "loading" | "default";

export type AppToastOptions = Omit<ToastOptions, "style" | "position" | "duration"> & {
  duration?: number;
};

export interface AppToastPayload {
  message: string;
  options?: AppToastOptions;
}

export type ShowToast = (
  message: string,
  options?: AppToastOptions,
) => string;

export interface AppToastApi {
  success: ShowToast;
  error: ShowToast;
  loading: ShowToast;
  default: ShowToast;
}
