import type { ApiConfig, ApiErrorPayload } from "../types/api.types";

export class ApiRequestError extends Error {
  public readonly statusCode: number;
  public readonly errors: Record<string, string[]> | undefined;

  public constructor(
    statusCode: number,
    message: string,
    errors: Record<string, string[]> | undefined,
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

// const runtimeEnv = (
//   globalThis as { process?: { env?: Record<string, string | undefined> } }
// ).process?.env;

export const $api = async <TResponse>(
  config: ApiConfig,
): Promise<TResponse> => {
  const {
    endpoint,
    method = "GET",
    body,
    params,
    headers,
    baseUrl = "runtimeEnv?.NEXT_PUBLIC_API_URL",
  } = config;

  if (!baseUrl) {
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

  const requestInit: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (typeof body !== "undefined") {
    requestInit.body = JSON.stringify(body);
  }

  const response = await fetch(url, requestInit);

  if (!response.ok) {
    let parsedError: ApiErrorPayload | null = null;

    try {
      parsedError = (await response.json()) as ApiErrorPayload;
    } catch {
      parsedError = null;
    }

    const fallbackText = await response.text().catch(() => "");
    const message =
      parsedError?.message ??
      (fallbackText || `Request failed with status ${response.status}`);

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
