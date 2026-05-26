// ============================================================
// FILE: apps/provider/lib/api/parse-response.js
// ============================================================

export async function parseFetchResponse(response, { throwError }) {
  const contentType = response.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json")
    ? await response.json().catch(() => ({}))
    : await response.text();

  if (!response.ok) {
    const message =
      (data && typeof data === "object" && (data.message || data.error)) ||
      "Something went wrong. Please try again.";
    throwError({
      message,
      status: response.status,
      data,
      headers: response.headers,
    });
  }

  return { data, status: response.status, headers: response.headers };
}
