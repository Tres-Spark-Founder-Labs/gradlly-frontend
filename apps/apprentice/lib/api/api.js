//import { useAuthStore } from "@/store/auth.store";

const baseURL = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL_LIVE
  : import.meta.env.VITE_API_URL_DEV;

export class ApiError extends Error {
  constructor(message, status, data, headers) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.headers = headers;
  }
}

function getToken() {
  // return useAuthStore.getState().token;
}

function buildURL(path, params) {
  const url = new URL(path, baseURL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null) url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
}

function buildHeaders(customHeaders, body) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...customHeaders,
  };
  if (body instanceof FormData) delete headers["Content-Type"];
  return headers;
}

async function request(method, path, options = {}) {
  const {
    params,
    timeout = 0,
    body,
    headers: customHeaders,
    ...rest
  } = options;

  const url = buildURL(path, params);
  const controller = new AbortController();
  const timeoutId =
    timeout > 0 ? setTimeout(() => controller.abort(), timeout) : null;

  try {
    const response = await fetch(url, {
      method,
      headers: buildHeaders(customHeaders, body),
      body:
        body === null
          ? undefined
          : body instanceof FormData
            ? body
            : JSON.stringify(body),
      signal: controller.signal,
      ...rest,
    });

    const contentType = response.headers.get("Content-Type") ?? "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      if (response.status === 401 && typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:unauthorized"));
      }
      throw new ApiError(
        `Request failed with status ${response.status}`,
        response.status,
        data,
        response.headers,
      );
    }

    return { data, status: response.status, headers: response.headers };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("Request timed out", 408, null, new Headers());
    }
    throw new ApiError(
      error?.message ?? "Network error",
      0,
      null,
      new Headers(),
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

const $api = {
  get: (path, options) => request("GET", path, options),
  post: (path, body, options) => request("POST", path, { ...options, body }),
  put: (path, body, options) => request("PUT", path, { ...options, body }),
  patch: (path, body, options) => request("PATCH", path, { ...options, body }),
  delete: (path, options) => request("DELETE", path, options),
};

export default $api;
