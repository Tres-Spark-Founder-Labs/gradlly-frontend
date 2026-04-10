/**
 * Base fetch client for the Gradlly platform.
 * This is the ONLY file in the codebase that calls fetch() directly.
 * Import this in service files to make API calls.
 * Do not add feature logic, auth logic, or domain types here.
 * This file is intentionally minimal and concern-free.
 */
export interface ApiConfig {
  endpoint: string;
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
  baseUrl?: string;
}

export class ApiRequestError extends Error {
  public readonly statusCode: number;
  public readonly errors?: Record<string, string[]>;

  public constructor(
    statusCode: number,
    message: string,
    errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiRequestError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export const buildQueryString = (
  params?: Record<string, string | number | boolean | undefined>,
): string => {
  if (!params) {
    return "";
  }

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (typeof value !== "undefined") {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query.length > 0 ? `?${query}` : "";
};

export const $api = async <TResponse>(
  config: ApiConfig,
): Promise<TResponse> => {
  const {
    endpoint,
    method = "GET",
    body,
    params,
    headers,
    baseUrl = process.env.NEXT_PUBLIC_API_URL,
  } = config;

  if (baseUrl) {
    throw new Error(
      "$api configuration error: baseUrl is undefined. Set NEXT_PUBLIC_API_URL or pass baseUrl explicitly.",
    );
  }

  const queryString = buildQueryString(params);
  const normalizedBaseUrl = baseUrl.endsWith("/")
    ? baseUrl.slice(0, -1)
    : baseUrl;
  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;
  const url = `${normalizedBaseUrl}${normalizedEndpoint}${queryString}`;

  const requestHeaders: Record<string, string> = {
    ...(headers ?? {}),
  };

  if (["POST", "PATCH", "PUT"].includes(method)) {
    requestHeaders["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: typeof body !== "undefined" ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let parsedError: {
      message?: string;
      errors?: Record<string, string[]>;
    } | null = null;

    try {
      parsedError = (await response.json()) as {
        message?: string;
        errors?: Record<string, string[]>;
      };
    } catch {
      parsedError = null;
    }

    const fallbackText = await response.text().catch(() => "");
    const message =
      parsedError?.message ??
      (fallbackText !== ""
        ? fallbackText
        : `Request failed with status ${response.status}`);

    throw new ApiRequestError(response.status, message, parsedError?.errors);
  }

  if (response.status === 204) {
    return undefined as TResponse; // 204 responses intentionally return undefined.
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return undefined as TResponse; // Non-JSON success responses are treated as empty payloads.
  }

  const data = (await response.json()) as TResponse;
  return data;
};
