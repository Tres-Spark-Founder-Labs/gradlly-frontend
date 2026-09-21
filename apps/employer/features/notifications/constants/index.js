import { Bell, CheckCircle2, Info, Mail, ShieldAlert } from "lucide-react";

export const NOTIFICATION_PATHS = Object.freeze({
  BASE: "/api/v1/notifications",
  READ_ALL: "/api/v1/notifications/read-all",
  read: (id) => `/api/v1/notifications/${id}/read`,
  // F3.4.3 AC3 — the user's own per-type preferences (GET and PATCH).
  PREFERENCES: "/api/v1/notifications/preferences",
});

// Visual metadata per notification `type`. Unknown types fall back to `default`.
export const NOTIFICATION_TYPE_META = Object.freeze({
  system: {
    icon: Info,
    iconClass: "text-info-600",
    iconBg: "bg-info-50 ring-info-100",
  },
  invitation: {
    icon: Mail,
    iconClass: "text-primary-600",
    iconBg: "bg-primary-50 ring-primary-100",
  },
  success: {
    icon: CheckCircle2,
    iconClass: "text-success-600",
    iconBg: "bg-success-50 ring-success-100",
  },
  alert: {
    icon: ShieldAlert,
    iconClass: "text-danger-600",
    iconBg: "bg-danger-50 ring-danger-100",
  },
  default: {
    icon: Bell,
    iconClass: "text-neutral-500",
    iconBg: "bg-neutral-100 ring-neutral-200",
  },
});

export function getNotificationTypeMeta(type) {
  return NOTIFICATION_TYPE_META[type] ?? NOTIFICATION_TYPE_META.default;
}
