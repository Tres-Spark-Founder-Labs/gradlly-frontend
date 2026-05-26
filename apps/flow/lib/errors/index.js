export const ERROR_CODES = Object.freeze({
  NETWORK: "NETWORK",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  VALIDATION: "VALIDATION",
  TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
  SERVER: "SERVER",
  UNKNOWN: "UNKNOWN",
});

function codeFromStatus(status) {
  if (status === 0) return ERROR_CODES.NETWORK;
  if (status === 401) return ERROR_CODES.UNAUTHORIZED;
  if (status === 403) return ERROR_CODES.FORBIDDEN;
  if (status === 404) return ERROR_CODES.NOT_FOUND;
  if (status === 409) return ERROR_CODES.CONFLICT;
  if (status === 422 || status === 400) return ERROR_CODES.VALIDATION;
  if (status === 429) return ERROR_CODES.TOO_MANY_REQUESTS;
  if (status >= 500) return ERROR_CODES.SERVER;
  return ERROR_CODES.UNKNOWN;
}

function sanitizeMessage(raw) {
  if (!raw) return "Something went wrong. Please try again.";
  if (/^ThrottlerException/i.test(raw))
    return "Too many requests. Please try again later.";
  return raw;
}

export class ApiClientError extends Error {
  constructor({ message, status, data, error, fieldErrors } = {}) {
    const raw = message ?? data?.message ?? data?.error ?? null;
    super(sanitizeMessage(raw));
    this.name = "ApiClientError";
    this.status = status ?? 0;
    this.code = codeFromStatus(this.status);
    this.data = data ?? null;
    this.error = error ?? data?.error ?? null;
    this.fieldErrors =
      fieldErrors ??
      (data?.errors &&
      typeof data.errors === "object" &&
      !Array.isArray(data.errors)
        ? data.errors
        : null);
  }
}

export function applyServerErrors(error, setError) {
  if (!error?.fieldErrors) return;
  for (const [field, message] of Object.entries(error.fieldErrors)) {
    setError(field, { type: "server", message });
  }
}

export function normalizeApiClientError(error) {
  if (error instanceof ApiClientError) return error;
  if (error && typeof error === "object") {
    return new ApiClientError({
      message: error.message,
      status: error.status,
      data: error.data ?? error,
      error: error.error ?? null,
      fieldErrors: error.fieldErrors ?? null,
    });
  }
  return new ApiClientError({ message: String(error ?? "Unknown error") });
}
