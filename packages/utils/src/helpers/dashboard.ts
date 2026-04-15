import type { AppName, SidebarItemData } from "../dashboard/types";

export const isPathActive = (
  currentPath: string,
  targetPath: string,
): boolean => {
  if (targetPath === "/") {
    return currentPath === "/";
  }
  return currentPath.startsWith(targetPath);
};

export const hasActiveChild = (
  items: SidebarItemData[] = [],
  currentPath: string,
): boolean =>
  items.some(
    (item) =>
      isPathActive(currentPath, item.path) ||
      hasActiveChild(item.children, currentPath),
  );

export const resolveAppName = (value?: string): AppName => {
  const valid: AppName[] = [
    "main",
    "apprentice",
    "employer",
    "provider",
    "flow",
  ];
  return valid.includes(value as AppName) ? (value as AppName) : "main";
};
