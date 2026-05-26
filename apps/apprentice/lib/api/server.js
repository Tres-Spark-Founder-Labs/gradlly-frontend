// ============================================================
// FILE: apps/provider/lib/api/server.js
// ============================================================
import "server-only";

import { serverEnv } from "@/config/env/server";
import { PORTAL } from "@/config/portal.config";
import { parseFetchResponse } from "@/lib/api/parse-response";

export class ApiServerError extends Error {
  constructor({ message, status, data, headers }) {
    super(message);
    this.name = "ApiServerError";
    this.status = status;
    this.data = data;
    this.headers = headers;
  }
}

export async function $apiServer(
  path,
  { method = "GET", body, accessToken, headers, signal } = {},
) {
  const url = new URL(path, serverEnv.API_BASE_URL).toString();

  const reqHeaders = new Headers(headers);
  reqHeaders.set("Accept", "application/json");
  reqHeaders.set("X-Portal-Type", PORTAL.key);
  if (body !== undefined) reqHeaders.set("Content-Type", "application/json");
  if (accessToken) reqHeaders.set("Authorization", `Bearer ${accessToken}`);

  const response = await fetch(url, {
    method,
    headers: reqHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
    signal,
  });

  return parseFetchResponse(response, {
    throwError: (err) => {
      throw new ApiServerError(err);
    },
  });
}
