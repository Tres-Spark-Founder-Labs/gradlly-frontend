// ============================================================
// FILE: apps/provider/utils/helper.js
// ============================================================

import { PORTAL } from "@/config/portal.config";

// ── Class merger ─────────────────────────────────────────────
export const cn = (...classes) => classes.filter(Boolean).join(" ");

export function cva(base, config = {}) {
  const { variants = {}, defaultVariants = {}, compoundVariants = [] } = config;
  return function resolver(props = {}) {
    let classes = base;
    for (const [key, variantMap] of Object.entries(variants)) {
      const value = props[key] ?? defaultVariants[key];
      if (value !== null && value !== undefined && variantMap[value]) {
        classes += " " + variantMap[value];
      }
    }
    for (const { class: cls, ...conditions } of compoundVariants) {
      const matches = Object.entries(conditions).every(
        ([k, v]) => (props[k] ?? defaultVariants[k]) === v,
      );
      if (matches && cls) classes += " " + cls;
    }
    if (props.className) classes += " " + props.className;
    return classes.trim();
  };
}
// ── User display helpers ──────────────────────────────────────
export function getInitials(firstName, lastName) {
  const f = (firstName?.[0] ?? "").toUpperCase();
  const l = (lastName?.[0] ?? "").toUpperCase();
  return f + l || "?";
}

export function getFullName(user) {
  return [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "User";
}

export function capitalise(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function formatDate(isoString, locale = PORTAL.locale) {
  if (!isoString) return "";
  try {
    return new Date(isoString).toLocaleDateString(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: PORTAL.timeZone,
    });
  } catch {
    return "";
  }
}

export function formatTime(
  isoString,
  timezone = PORTAL.timeZone,
  locale = PORTAL.locale,
) {
  if (!isoString) return "";
  try {
    return new Date(isoString).toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: timezone,
      timeZoneName: "short",
    });
  } catch {
    return "";
  }
}

export function formatDateTime(isoString) {
  if (!isoString) return "";
  return `${formatDate(isoString)}, ${formatTime(isoString)}`;
}

export function formatRelativeTime(isoString) {
  if (!isoString) return "";
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHr = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHr / 24);

    if (diffSec < 60) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay < 30) return `${diffDay}d ago`;
    return formatDate(isoString);
  } catch {
    return "";
  }
}

export function getGreeting(timezone = PORTAL.timeZone) {
  try {
    const hourStr = new Date().toLocaleString(PORTAL.locale, {
      hour: "numeric",
      hour12: false,
      timeZone: timezone,
    });
    const h = parseInt(hourStr, 10);
    if (h >= 5 && h < 12) return "Good morning";
    if (h >= 12 && h < 17) return "Good afternoon";
    return "Good evening";
  } catch {
    return "Good morning";
  }
}

export function prettifyField(field) {
  const last = field.split(".").pop() ?? field;
  const spaced = last
    .replace(/([A-Z])/g, " $1")
    .trim()
    .toLowerCase();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export function capitalizeWords(str = "") {
  return str?.replace(
    /\S+/g,
    (word) => word[0]?.toUpperCase() + word?.slice(1)?.toLowerCase(),
  );
}

export function slugify(value = "") {
  return value
    ?.toString()
    ?.trim()
    ?.toLowerCase()
    ?.normalize("NFD")
    ?.replace(/[̀-ͯ]/g, "")
    ?.replace(/[^a-z0-9\s-]/g, "")
    ?.replace(/\s+/g, "-")
    ?.replace(/-+/g, "-");
}

export function maskEmail(email) {
  if (!email) return "";
  const at = email.indexOf("@");
  if (at <= 1) return email;
  const local = email.slice(0, at);
  const domain = email.slice(at);
  const keep = Math.min(2, Math.floor(local.length / 2));
  const dots = "•".repeat(Math.max(1, local.length - keep * 2));
  return `${local.slice(0, keep)}${dots}${local.slice(-keep)}${domain}`;
}

export function formatCountdown(secs) {
  const m = String(Math.floor(secs / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");
  return `${m}:${s}`;
}
