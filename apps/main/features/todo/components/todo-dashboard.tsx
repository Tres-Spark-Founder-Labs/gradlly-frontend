"use client";

import { useState } from "react";

import { useDeleteTodo } from "../queries";
import { CreateTodoForm } from "./create-todo-form";
import { TodoFilters as TodoFiltersComponent } from "./todo-filters";
import { TodoList } from "./todo-list";

import type { TodoFilters } from "../types/todo.types";

export function TodoDashboard(): React.ReactNode {
  const [filters, setFilters] = useState<TodoFilters>({});
  const deleteTodoMutation = useDeleteTodo();

  const handleDelete = (id: number): void => {
    deleteTodoMutation.mutate({ id });
  };

  return (
    <section className="mx-auto max-w-3xl space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">
          Todo Query Integration Dashboard
        </h1>
        <p className="text-sm text-gray-600">
          Testing TanStack Query queries, mutations, and optimistic updates.
        </p>
      </header>

      <CreateTodoForm />

      <TodoFiltersComponent filters={filters} onChange={setFilters} />

      <TodoList filters={filters} onDelete={handleDelete} />
    </section>
  );
}
