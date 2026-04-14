import toast from "react-hot-toast";

import { DEFAULT_TOAST_DURATION } from "./toast.config";

import type { AppToastOptions } from "./toast.types";

const withDefaults = (options?: AppToastOptions): AppToastOptions => ({
  duration: DEFAULT_TOAST_DURATION,
  ...options,
});

export const toastSuccess = (message: string, options?: AppToastOptions) =>
  toast.success(message, withDefaults(options));

export const toastError = (message: string, options?: AppToastOptions) =>
  toast.error(message, withDefaults(options));

export const toastLoading = (message: string, options?: AppToastOptions) =>
  toast.loading(message, withDefaults(options));

export const toastDefault = (message: string, options?: AppToastOptions) =>
  toast(message, withDefaults(options));
