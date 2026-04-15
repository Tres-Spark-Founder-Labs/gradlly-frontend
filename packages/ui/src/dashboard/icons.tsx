import type { SidebarIconName } from "@gradlly/utils";
import type { ReactNode } from "react";

const iconClass = "h-4 w-4";

export const renderIconByName = (
  name: SidebarIconName,
  className?: string,
): ReactNode => {
  const classes = className ? `${iconClass} ${className}` : iconClass;

  switch (name) {
    case "Home":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          className={classes}
        >
          <path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z" />
        </svg>
      );
    case "ChartBar":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          className={classes}
        >
          <path d="M4 20V9" />
          <path d="M10 20V4" />
          <path d="M16 20v-7" />
          <path d="M22 20v-3" />
        </svg>
      );
    case "Users":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          className={classes}
        >
          <circle cx="9" cy="8" r="3" />
          <circle cx="17" cy="10" r="2.5" />
          <path d="M3 20c0-3.2 2.6-5.8 5.8-5.8h.4C12.4 14.2 15 16.8 15 20" />
          <path d="M14.5 19.8c.3-2.3 2.2-4 4.5-4h.2c1.1 0 2.2.4 3 .9" />
        </svg>
      );
    case "Briefcase":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          className={classes}
        >
          <path d="M4 8h16v11H4z M9 8V6h6v2 M4 12h16" />
        </svg>
      );
    case "GraduationCap":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          className={classes}
        >
          <path d="m2 9 10-5 10 5-10 5z M6 11.5V15c0 1.7 2.7 3 6 3s6-1.3 6-3v-3.5" />
        </svg>
      );
    case "Building2":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          className={classes}
        >
          <path d="M4 21V5l8-3v19 M12 8h8v13 M8 10h.01 M8 14h.01 M8 18h.01 M16 12h.01 M16 16h.01" />
        </svg>
      );
    case "Settings":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          className={classes}
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a2 2 0 1 1-4 0v-.2a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a2 2 0 1 1 0-4h.2a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1 1 0 0 0 1.1.2H9A1 1 0 0 0 9.8 4H10a2 2 0 1 1 4 0h.2a1 1 0 0 0 .9.6 1 1 0 0 0 1.1-.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1V9c0 .4.2.8.6.9H20a2 2 0 1 1 0 4h-.2a1 1 0 0 0-.6.9Z" />
        </svg>
      );
    case "FileText":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          className={classes}
        >
          <path d="M7 3h7l5 5v13H7z M14 3v6h5 M10 13h6 M10 17h6" />
        </svg>
      );
    case "Shield":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          className={classes}
        >
          <path d="M12 3 5 6v6c0 5 3.2 8.8 7 10 3.8-1.2 7-5 7-10V6z" />
        </svg>
      );
    case "Workflow":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          className={classes}
        >
          <path d="M3 6h7v4H3z M14 4h7v4h-7z M14 16h7v4h-7z M10 8h4v8h-4z" />
        </svg>
      );
    case "Calendar":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          className={classes}
        >
          <path d="M4 6h16v14H4z M8 3v4 M16 3v4 M4 10h16" />
        </svg>
      );
    case "Bell":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          className={classes}
        >
          <path d="M12 3a5 5 0 0 0-5 5v3.5L5 14v1h14v-1l-2-2.5V8a5 5 0 0 0-5-5Zm0 18a2.5 2.5 0 0 0 2.3-1.5h-4.6A2.5 2.5 0 0 0 12 21Z" />
        </svg>
      );
    case "Search":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          className={classes}
        >
          <path d="m21 21-4.3-4.3M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z" />
        </svg>
      );
    default:
      return null;
  }
};
