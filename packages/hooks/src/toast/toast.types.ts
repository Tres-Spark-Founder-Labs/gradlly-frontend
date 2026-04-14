import type { ToastOptions } from "react-hot-toast";

export type ToastKind = "success" | "error" | "loading" | "default";

export type AppToastOptions = Omit<
  ToastOptions,
  "style" | "position" | "duration"
> & {
  duration?: number;
};
