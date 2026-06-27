/**
 * Shared — HTTP Client
 *
 * Thin fetch wrapper that:
 * - Attaches auth headers from session
 * - Serialises/deserialises JSON
 * - Normalises errors into ApiException
 * - Respects request timeouts
 * - No Axios dependency
 */

import { ApiException, type RequestOptions } from "@/shared/types";
import { appConfig } from "@/shared/config/app";

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", headers = {}, body, signal, public: isPublic = false } = options;

  // Build URL
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${appConfig.api.baseUrl}${endpoint}`;

  // Timeout signal
  const controller = new AbortController();
  const timeoutId  = setTimeout(() => controller.abort(), appConfig.api.timeout);
  const mergedSignal = signal ?? controller.signal;

  // Auth header — token injected from session storage (replaced in Sprint 4)
  const authHeader: Record<string, string> = {};
  if (!isPublic && typeof window !== "undefined") {
    const token = sessionStorage.getItem("genesis:token");
    if (token) authHeader["Authorization"] = `Bearer ${token}`;
  }

  const contentHeader: Record<string, string> =
    body && !(body instanceof FormData)
      ? { "Content-Type": "application/json" }
      : {};

  try {
    const response = await fetch(url, {
      method,
      headers: { ...contentHeader, ...authHeader, ...headers },
      body:    body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
      signal:  mergedSignal,
    });

    clearTimeout(timeoutId);

    // Handle empty responses (204 No Content)
    if (response.status === 204) return undefined as T;

    const json = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new ApiException(
        {
          code:    json.code    ?? "UNKNOWN_ERROR",
          message: json.message ?? "An unexpected error occurred",
          status:  response.status,
          errors:  json.errors,
          traceId: json.traceId,
        },
        response.status
      );
    }

    return json as T;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof ApiException) throw err;
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiException(
        { code: "REQUEST_TIMEOUT", message: "Request timed out", status: 408 },
        408
      );
    }
    throw new ApiException(
      { code: "NETWORK_ERROR", message: "Network request failed", status: 0 },
      0
    );
  }
}

export const http = {
  get:    <T>(url: string, opts?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(url, { ...opts, method: "GET" }),

  post:   <T>(url: string, body?: unknown, opts?: Omit<RequestOptions, "method">) =>
    request<T>(url, { ...opts, method: "POST", body }),

  put:    <T>(url: string, body?: unknown, opts?: Omit<RequestOptions, "method">) =>
    request<T>(url, { ...opts, method: "PUT", body }),

  patch:  <T>(url: string, body?: unknown, opts?: Omit<RequestOptions, "method">) =>
    request<T>(url, { ...opts, method: "PATCH", body }),

  delete: <T>(url: string, opts?: Omit<RequestOptions, "method">) =>
    request<T>(url, { ...opts, method: "DELETE" }),
};
