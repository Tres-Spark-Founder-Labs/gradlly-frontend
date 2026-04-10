"use client";

import { useState } from "react";

import { useCreateTodo } from "../queries";

export function CreateTodoForm(): React.ReactNode {
  const [title, setTitle] = useState<string>("");
  const [completed, setCompleted] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const createTodoMutation = useCreateTodo();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (trimmedTitle.length < 3) {
      setValidationError("Title must be at least 3 characters.");
      return;
    }

    setValidationError(null);

    createTodoMutation.mutate(
      {
        // JSONPlaceholder demo dataset uses static users; userId is hardcoded for local testing.
        userId: 1,
        title: trimmedTitle,
        completed,
      },
      {
        onSuccess: () => {
          setTitle("");
          setCompleted(false);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-md border border-gray-200 bg-white p-4">
      <div>
        <label htmlFor="todo-title" className="mb-1 block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          id="todo-title"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
          required
          minLength={3}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={completed}
          onChange={(event) => {
            setCompleted(event.target.checked);
          }}
        />
        Completed
      </label>

      {validationError !== null ? <p className="text-sm text-red-600">{validationError}</p> : null}
      {createTodoMutation.isError === true ? (
        <p className="text-sm text-red-600">Failed to create todo. Please try again.</p>
      ) : null}

      <button
        type="submit"
        disabled={createTodoMutation.isPending}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {createTodoMutation.isPending ? "Creating..." : "Create Todo"}
      </button>
    </form>
  );
}
