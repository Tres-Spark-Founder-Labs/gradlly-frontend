"use client";

import { useUpdateTodo } from "../queries";
import type { Todo } from "../types/todo.types";

interface TodoItemProps {
  todo: Todo;
  onDelete: (id: number) => void;
}

export function TodoItem({ todo, onDelete }: TodoItemProps): React.ReactNode {
  const updateTodoMutation = useUpdateTodo();

  return (
    <li className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-3">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={todo.completed}
          disabled={updateTodoMutation.isPending}
          onChange={() => {
            updateTodoMutation.mutate({ id: todo.id, completed: !todo.completed });
          }}
          className="h-4 w-4"
        />
        <div>
          <p className={todo.completed ? "text-gray-500 line-through" : "text-gray-900"}>{todo.title}</p>
          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">User {todo.userId}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          onDelete(todo.id);
        }}
        className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
      >
        Delete
      </button>
    </li>
  );
}
