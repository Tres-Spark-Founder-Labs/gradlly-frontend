"use client";

import type { TodoFilters as TodoFilterValues } from "../types/todo.types";

interface TodoFiltersProps {
  filters: TodoFilterValues;
  onChange: (filters: TodoFilterValues) => void;
}

export function TodoFilters({ filters, onChange }: TodoFiltersProps): React.ReactNode {
  const selected =
    typeof filters.completed === "undefined"
      ? "all"
      : filters.completed
        ? "complete"
        : "incomplete";

  const buttonClass = (isActive: boolean): string =>
    `rounded px-3 py-1 text-sm ${isActive ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`;

  return (
    <div className="flex gap-2">
      <button type="button" className={buttonClass(selected === "all")} onClick={() => onChange({})}>
        All
      </button>
      <button
        type="button"
        className={buttonClass(selected === "complete")}
        onClick={() => onChange({ completed: true })}
      >
        Complete
      </button>
      <button
        type="button"
        className={buttonClass(selected === "incomplete")}
        onClick={() => onChange({ completed: false })}
      >
        Incomplete
      </button>
    </div>
  );
}
