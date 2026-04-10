/**
 * Local TanStack Query hooks for the Todo feature.
 * Queries AND mutations are combined in this single file following
 * the one-file-per-feature pattern. All hooks are scoped to apps/main.
 */
import { getBrowserQueryClient } from "@gradlly/lib";
import { useMutation, useQuery } from "@tanstack/react-query";

import { todoKeys } from "../querykeys";
import {
  createTodo,
  deleteTodo,
  fetchTodoById,
  fetchTodos,
  updateTodo,
} from "../services/todo.service";

import type {
  CreateTodoPayload,
  Todo,
  TodoFilters,
  UpdateTodoPayload,
} from "../types/todo.types";

export const useTodos = (
  filters?: TodoFilters,
): {
  todos: Todo[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  isFetching: boolean;
} => {
  const query = useQuery({
    queryKey: todoKeys.list(filters ?? {}),
    queryFn: () => fetchTodos(filters),
    staleTime: 2 * 60 * 1000,
    select: (todos: Todo[]) => {
      if (typeof filters?.completed === "boolean") {
        return todos.filter((todo) => todo.completed === filters.completed);
      }
      return todos;
    },
  });

  return {
    todos: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null, // query.error is unknown by default.
    refetch: () => {
      void query.refetch();
    },
    isFetching: query.isFetching,
  };
};

export const useTodo = (
  id: number,
): {
  todo: Todo | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
} => {
  const query = useQuery({
    queryKey: todoKeys.detail(id),
    queryFn: () => fetchTodoById(id),
    staleTime: 5 * 60 * 1000,
    enabled: id > 0,
  });

  return {
    todo: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null, // query.error is unknown by default.
  };
};

export const useCreateTodo = () => {
  const queryClient = getBrowserQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTodoPayload) => createTodo(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });
};

export const useUpdateTodo = () => {
  const queryClient = getBrowserQueryClient();

  return useMutation<
    Todo,
    Error,
    { id: number } & UpdateTodoPayload,
    { previousTodo: Todo | undefined }
  >({
    mutationFn: ({ id, ...payload }) => updateTodo(id, payload),
    onMutate: async ({ id, ...payload }) => {
      await queryClient.cancelQueries({ queryKey: todoKeys.detail(id) });
      const previousTodo = queryClient.getQueryData<Todo>(todoKeys.detail(id));
      if (typeof previousTodo !== "undefined") {
        queryClient.setQueryData(todoKeys.detail(id), {
          ...previousTodo,
          ...payload,
        });
      }
      return { previousTodo };
    },
    onError: (_error, variables, context) => {
      if (typeof context?.previousTodo !== "undefined") {
        queryClient.setQueryData(
          todoKeys.detail(variables.id),
          context.previousTodo,
        );
      }
    },
    onSettled: async (_data, _error, variables) => {
      await queryClient.invalidateQueries({
        queryKey: todoKeys.detail(variables.id),
      });
      await queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });
};

export const useDeleteTodo = () => {
  const queryClient = getBrowserQueryClient();

  return useMutation<
    void,
    Error,
    { id: number },
    { previousLists: Array<[unknown, Todo[] | undefined]> }
  >({
    mutationFn: ({ id }) => deleteTodo(id),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: todoKeys.lists() });

      const queryCache = queryClient
        .getQueryCache()
        .findAll({ queryKey: todoKeys.lists() });
      const previousLists: Array<[unknown, Todo[] | undefined]> =
        queryCache.map((query) => [
          query.queryKey,
          queryClient.getQueryData<Todo[]>(query.queryKey),
        ]);

      queryClient.setQueriesData<Todo[]>(
        { queryKey: todoKeys.lists() },
        (oldTodos) => {
          if (typeof oldTodos === "undefined") {
            return oldTodos;
          }
          return oldTodos.filter((todo) => todo.id !== id);
        },
      );

      return { previousLists };
    },
    onError: (_error, _variables, context) => {
      context?.previousLists.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });
};
