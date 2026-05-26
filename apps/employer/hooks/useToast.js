import toast from "react-hot-toast";

import { PORTAL } from "@/config/portal.config";

const withDefaults = (options) => ({
  ...PORTAL?.toastOptions,
  ...options,
});

export const toastSuccess = (message, options) =>
  toast.success(message, withDefaults(options));

export const toastError = (message, options) =>
  toast.error(message, withDefaults(options));

export const toastLoading = (message, options) =>
  toast.loading(message, withDefaults(options));

export const toastDefault = (message, options) =>
  toast(message, withDefaults(options));
