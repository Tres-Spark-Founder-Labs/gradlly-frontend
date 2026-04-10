"use client";

import { TodoItem } from "./todo-item";
import { useTodos } from "../queries";
import type { TodoFilters } from "../types/todo.types";

interface TodoListProps {
  filters: TodoFilters;
  onDelete: (id: number) => void;
}

export function TodoList({ filters, onDelete }: TodoListProps): React.ReactNode {
  const { todos, isLoading, isError, error, refetch, isFetching } = useTodos(filters);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((row) => (
          <div key={row} className="h-14 animate-pulse rounded-md bg-gray-100" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
        <p className="mb-2">Failed to load todos: {error?.message ?? "Unknown error"}</p>
        <button
          type="button"
          onClick={refetch}
          className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-gray-600">
        No todos match the selected filters.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {isFetching && !isLoading ? <p className="text-sm text-blue-600">Refreshing...</p> : null}
      <ul className="space-y-2">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onDelete={onDelete} />
        ))}
      </ul>
    </div>
  );
}
