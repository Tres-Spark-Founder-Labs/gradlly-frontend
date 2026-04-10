/**
 * Local types for the Todo test feature.
 * Scoped to apps/main only — used to validate the full query/mutation
 * lifecycle with JSONPlaceholder during development.
 * Do not move to packages/types — Todo is not a Gradlly domain type.
 */
export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface CreateTodoPayload {
  userId: number;
  title: string;
  completed: boolean;
}

export interface UpdateTodoPayload {
  title?: string;
  completed?: boolean;
}

export interface TodoFilters {
  completed?: boolean;
  userId?: number;
}
