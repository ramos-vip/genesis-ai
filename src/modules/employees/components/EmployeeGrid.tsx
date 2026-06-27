"use client";

import { useEmployees } from "../hooks/useEmployees";
import EmployeeCard from "./EmployeeCard";
import Skeleton from "@/components/ui/Skeleton";
import { ROUTES } from "@/shared/constants";

interface EmployeeGridProps {
  limit?: number;
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="p-6 rounded-2xl border border-border bg-surface space-y-4">
          <div className="flex items-start justify-between">
            <Skeleton variant="rect" width={44} height={44} className="rounded-xl" />
            <Skeleton variant="rect" width={60} height={22} className="rounded-full" />
          </div>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" lines={2} />
          <Skeleton variant="rect" height={36} className="rounded-lg" />
        </div>
      ))}
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  /* Detect the specific "no database" case to show actionable guidance */
  const isDatabaseMissing = message.includes("DATABASE_URL") || message.includes("connect");
  const isUnauthorized   = message.includes("Unauthorized") || message.includes("auth");

  return (
    <div className="rounded-2xl border border-danger-border bg-danger-bg p-8 text-center">
      <div className="mx-auto mb-4 w-10 h-10 rounded-xl bg-danger/10 border border-danger-border flex items-center justify-center">
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5 text-danger"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      <h3 className="text-sm font-semibold text-danger mb-2">
        {isDatabaseMissing
          ? "Database not configured"
          : isUnauthorized
          ? "Session expired"
          : "Failed to load employees"}
      </h3>

      <p className="text-xs text-text-secondary leading-relaxed max-w-xs mx-auto">
        {isDatabaseMissing
          ? "Set DATABASE_URL in .env.local and run npm run db:push to create the schema."
          : isUnauthorized
          ? "Please refresh the page and sign in again."
          : "An error occurred. Please refresh the page."}
      </p>

      {process.env.NODE_ENV === "development" && (
        <details className="mt-4 text-left">
          <summary className="text-xs text-text-muted cursor-pointer hover:text-text-secondary transition-colors">
            Debug: show error
          </summary>
          <pre className="mt-2 p-3 rounded-lg bg-surface text-xs text-text-muted overflow-auto whitespace-pre-wrap break-all">
            {message}
          </pre>
        </details>
      )}
    </div>
  );
}

function EmptyEmployees() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-dashed border-border">
      <div className="mb-4 w-12 h-12 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center">
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-6 h-6 text-text-muted"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            d="M13 7a3 3 0 11-6 0 3 3 0 016 0zM3 17a7 7 0 0114 0"
          />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-text-primary mb-2">No AI employees yet</h3>
      <p className="text-sm text-text-secondary max-w-xs leading-relaxed mb-6">
        Create your first AI employee to start automating your business workflows.
      </p>
      <a
        href={ROUTES.APP.EMPLOYEES.NEW}
        className="inline-flex items-center gap-2 h-9 px-5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
      >
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" aria-hidden>
          <path d="M8 2v12M2 8h12" strokeLinecap="round" />
        </svg>
        Create AI Employee
      </a>
    </div>
  );
}

export default function EmployeeGrid({ limit }: EmployeeGridProps) {
  const { data: employees, isLoading, isError, error } = useEmployees();

  if (isLoading) return <LoadingSkeleton />;

  if (isError) {
    const message = error instanceof Error ? error.message : String(error);
    return <ErrorState message={message} />;
  }

  const list = limit ? (employees ?? []).slice(0, limit) : (employees ?? []);

  if (list.length === 0) return <EmptyEmployees />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {list.map((employee) => (
        <EmployeeCard key={employee.id} employee={employee} />
      ))}
    </div>
  );
}
