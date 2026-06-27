/**
 * Shared — API Response Types
 *
 * Standardised envelope types for all HTTP responses.
 */

import type { PaginationMeta } from "./common";

/** Successful single-resource response */
export interface ApiResponse<T> {
  data:    T;
  message?: string;
}

/** Successful paginated list response */
export interface PaginatedResponse<T> {
  data:       T[];
  pagination: PaginationMeta;
}

/** Validation error detail */
export interface FieldError {
  field:   string;
  message: string;
}

/** Error response from the API */
export interface ApiError {
  code:     string;
  message:  string;
  status:   number;
  errors?:  FieldError[];
  traceId?: string;
}

/** Wrapper for error responses thrown by the HTTP client */
export class ApiException extends Error {
  constructor(
    public readonly error: ApiError,
    public readonly status: number
  ) {
    super(error.message);
    this.name = "ApiException";
  }
}

/** HTTP methods */
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/** Request options passed to the HTTP client */
export interface RequestOptions {
  method?:  HttpMethod;
  headers?: Record<string, string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?:    any;
  signal?:  AbortSignal;
  /** Skip auth header injection */
  public?:  boolean;
}
