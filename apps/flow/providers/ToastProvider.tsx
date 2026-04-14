"use client";

import { toasterConfig } from "@gradlly/hooks";
import { Toaster } from "react-hot-toast";

export function ToasterProvider() {
  return <Toaster {...toasterConfig} />;
}
