import type { Viewport } from "next";

interface CreateViewportOptions {
  themeColor?: string;
}

export function createViewport({
  themeColor = "#3b62f6",
}: CreateViewportOptions = {}): Viewport {
  return {
    width: "device-width",
    initialScale: 1,
    themeColor,
  };
}
