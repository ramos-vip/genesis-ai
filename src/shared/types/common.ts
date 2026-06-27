/**
 * Shared — Common Types
 *
 * Primitive types used across all modules. Import from '@/shared/types'.
 */

/** Branded string for type-safe IDs */
export type ID = string & { readonly __brand: "ID" };

export function toId(value: string): ID {
  return value as ID;
}

/** ISO 8601 date string */
export type ISODate = string & { readonly __brand: "ISODate" };

/** Standard timestamp mixin for all DB entities */
export interface Timestamps {
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface SoftDelete {
  deletedAt?: ISODate;
}

/** Pagination metadata returned from list endpoints */
export interface PaginationMeta {
  page:       number;
  perPage:    number;
  total:      number;
  totalPages: number;
  hasMore:    boolean;
}

/** Generic list query params */
export interface ListParams {
  page?:    number;
  perPage?: number;
  search?:  string;
  sortBy?:  string;
  order?:   "asc" | "desc";
}

/** Generic key-value record */
export type Dict<T = string> = Record<string, T>;

/** Extract the value type of a readonly array */
export type ArrayElement<T extends readonly unknown[]> = T[number];

/** Make specific keys required */
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/** Make specific keys optional */
export type PartialFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** Nullish union */
export type Nullable<T> = T | null;
export type Maybe<T>    = T | null | undefined;
