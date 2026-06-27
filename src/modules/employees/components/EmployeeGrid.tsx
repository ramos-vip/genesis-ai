"use client";

import { useEmployees } from "../hooks/useEmployees";
import EmployeeCard     from "./EmployeeCard";
import EmptyState       from "@/shared/components/EmptyState";
import Skeleton         from "@/components/ui/Skeleton";
import { ROUTES }       from "@/shared/constants";

interface EmployeeGridProps {
  /** Show max N employees. Omit for all. */
  limit?: number;
}

export default function EmployeeGrid({ limit }: EmployeeGridProps) {
  const { data: employees, isLoading, isError } = useEmployees();

  if (isLoading) {
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

  if (isError) {
    return (
      <EmptyState
        title="Failed to load employees"
        description="An error occurred. Please refresh the page."
      />
    );
  }

  const list = limit ? (employees ?? []).slice(0, limit) : (employees ?? []);

  if (list.length === 0) {
    return (
      <EmptyState
        title="No AI employees yet"
        description="Create your first AI employee to start automating your business workflows."
        action={{ label: "Create AI Employee", href: ROUTES.APP.EMPLOYEES.NEW }}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {list.map((employee) => (
        <EmployeeCard key={employee.id} employee={employee} />
      ))}
    </div>
  );
}
