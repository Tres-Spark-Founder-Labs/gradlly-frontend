import toast from "react-hot-toast";

import { DEFAULT_TOAST_DURATION } from "./toast.config";

import type { AppToastApi, AppToastOptions, ShowToast } from "./toast.types";

const withDefaults = (options?: AppToastOptions): AppToastOptions => ({
  duration: DEFAULT_TOAST_DURATION,
  ...options,
});

const showSuccess: ShowToast = (message, options) =>
  toast.success(message, withDefaults(options));
const showError: ShowToast = (message, options) =>
  toast.error(message, withDefaults(options));
const showLoading: ShowToast = (message, options) =>
  toast.loading(message, withDefaults(options));
const showDefault: ShowToast = (message, options) =>
  toast(message, withDefaults(options));

export const useToast = (): AppToastApi => ({
  success: showSuccess,
  error: showError,
  loading: showLoading,
  default: showDefault,
});
