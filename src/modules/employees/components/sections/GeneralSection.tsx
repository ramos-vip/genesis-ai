"use client";

import { useEffect, useState } from "react";
import Input   from "@/components/ui/Input";
import Button  from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { useToast } from "@/shared/providers";
import { useUpdateEmployee } from "../../hooks/useEmployees";
import { EMPLOYEE_ROLES } from "../../constants";
import type { Employee, EmployeeRole } from "../../types";

interface GeneralSectionProps {
  employee: Employee;
}

export default function GeneralSection({ employee }: GeneralSectionProps) {
  const [name, setName]   = useState(employee.name);
  const [role, setRole]   = useState<EmployeeRole>(employee.role);
  const { toast }         = useToast();
  const { mutate, isPending } = useUpdateEmployee();

  /* Sync when employee changes (e.g., cache invalidation refetch) */
  useEffect(() => {
    setName(employee.name);
    setRole(employee.role);
  }, [employee.id, employee.name, employee.role]);

  const isDirty = name !== employee.name || role !== employee.role;

  function save() {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    mutate(
      { id: employee.id, dto: { name: trimmedName, role } },
      {
        onSuccess: () => toast.success("Changes saved."),
        onError:   () => toast.error("Failed to save changes."),
      }
    );
  }

  function cancel() {
    setName(employee.name);
    setRole(employee.role);
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-white">General</h3>
          <p className="text-sm text-text-secondary mt-0.5">
            Basic information about this employee.
          </p>
        </div>
        {isDirty && (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={cancel} disabled={isPending}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={save} disabled={isPending}>
              {isPending ? <Spinner size="xs" color="white" /> : null}
              Save
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-5">
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={50}
          placeholder="Employee name"
          hint={`${name.length}/50`}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-primary">Role</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {EMPLOYEE_ROLES.map((r) => {
              const isSelected = role === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id as EmployeeRole)}
                  className={[
                    "px-3 py-2.5 rounded-lg border text-sm font-medium text-left transition-all duration-150 focus-ring",
                    isSelected
                      ? "border-accent/40 bg-accent-subtle text-accent"
                      : "border-border bg-surface-elevated text-text-secondary hover:border-border-hover hover:text-text-primary",
                  ].join(" ")}
                  aria-pressed={isSelected}
                >
                  {r.shortLabel}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
