/**
 * Local query keys for the Todo test feature.
 * Scoped to apps/main only.
 * Do not move to packages/lib — these are not cross-portal keys.
 */
import type { TodoFilters } from "../types/todo.types";

export const todoKeys = {
  all: ["todos"] as const,
  lists: () => [...todoKeys.all, "list"] as const,
  list: (filters: TodoFilters) => [...todoKeys.lists(), filters] as const,
  details: () => [...todoKeys.all, "detail"] as const,
  detail: (id: number) => [...todoKeys.details(), id] as const,
} as const;
