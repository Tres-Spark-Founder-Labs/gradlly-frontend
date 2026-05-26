"use client";

import { Toaster } from "react-hot-toast";

import { PORTAL } from "@/config/portal.config";

export function ToasterProvider() {
  return <Toaster {...PORTAL?.toastOptions} />;
}
