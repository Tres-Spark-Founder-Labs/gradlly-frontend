import type { Metadata } from "next";

import { TodoDashboard } from "@/features/todo";

export const metadata: Metadata = {
  title: "Todo Test | Gradlly Main",
};

/**
 * Integration test page for TanStack Query and $api setup.
 * Uses JSONPlaceholder — write operations do not persist data.
 * This page must be removed before the production launch.
 */
export default function TodosPage(): React.ReactNode {
  return <TodoDashboard />;
}
