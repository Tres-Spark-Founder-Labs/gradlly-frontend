export interface ApiConfig {
  endpoint: string;
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
  baseUrl?: string;
}

export interface ApiErrorPayload {
  message?: string;
  errors?: Record<string, string[]>;
}
