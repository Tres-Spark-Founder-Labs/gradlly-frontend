/**
 * Local service for the Todo test feature.
 * Uses JSONPlaceholder (https://jsonplaceholder.typicode.com) — a public
 * fake REST API. Write operations return HTTP 200/201 but do not persist
 * data. This is intentional for testing the query/mutation lifecycle.
 * This service is scoped to apps/main only.
 */
import { $api } from "@gradlly/api";

import type {
  CreateTodoPayload,
  Todo,
  TodoFilters,
  UpdateTodoPayload,
} from "../types/todo.types";

const JSON_PLACEHOLDER_BASE_URL = "https://jsonplaceholder.typicode.com";

export const fetchTodos = async (filters?: TodoFilters): Promise<Todo[]> => {
  return $api<Todo[]>({
    endpoint: "/todos",
    method: "GET",
    params: filters,
    baseUrl: JSON_PLACEHOLDER_BASE_URL,
  });
};

export const fetchTodoById = async (id: number): Promise<Todo> => {
  return $api<Todo>({
    endpoint: `/todos/${id}`,
    method: "GET",
    baseUrl: JSON_PLACEHOLDER_BASE_URL,
  });
};

export const createTodo = async (payload: CreateTodoPayload): Promise<Todo> => {
  return $api<Todo>({
    endpoint: "/todos",
    method: "POST",
    body: payload,
    baseUrl: JSON_PLACEHOLDER_BASE_URL,
  });
};

export const updateTodo = async (
  id: number,
  payload: UpdateTodoPayload,
): Promise<Todo> => {
  return $api<Todo>({
    endpoint: `/todos/${id}`,
    method: "PATCH",
    body: payload,
    baseUrl: JSON_PLACEHOLDER_BASE_URL,
  });
};

export const deleteTodo = async (id: number): Promise<void> => {
  await $api<void>({
    endpoint: `/todos/${id}`,
    method: "DELETE",
    baseUrl: JSON_PLACEHOLDER_BASE_URL,
  });
};
