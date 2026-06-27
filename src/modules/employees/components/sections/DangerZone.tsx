"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button  from "@/components/ui/Button";
import Modal   from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import { useToast }         from "@/shared/providers";
import { useDeleteEmployee } from "../../hooks/useEmployees";
import { ROUTES }           from "@/shared/constants";
import type { Employee }    from "../../types";

interface DangerZoneProps {
  employee: Employee;
}

export default function DangerZone({ employee }: DangerZoneProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { toast }                     = useToast();
  const router                        = useRouter();
  const { mutate: deleteEmployee, isPending } = useDeleteEmployee();

  function handleDelete() {
    deleteEmployee(employee.id, {
      onSuccess: () => {
        setConfirmOpen(false);
        toast.success(`${employee.name} has been removed.`);
        router.push(ROUTES.APP.EMPLOYEES.ROOT);
      },
      onError: () => {
        setConfirmOpen(false);
        toast.error("Failed to delete employee. Please try again.");
      },
    });
  }

  return (
    <>
      <div className="rounded-2xl border border-danger-border bg-danger-bg p-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h3 className="text-base font-semibold text-danger mb-1">Danger Zone</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Permanently delete{" "}
              <span className="font-medium text-text-primary">{employee.name}</span>.
              This action cannot be undone.
            </p>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setConfirmOpen(true)}
            className="shrink-0"
          >
            Delete Employee
          </Button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        open={confirmOpen}
        onClose={() => !isPending && setConfirmOpen(false)}
        title="Delete employee?"
        size="sm"
        persistent={isPending}
      >
        <div className="flex flex-col gap-6">
          <p className="text-sm text-text-secondary leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-text-primary">{employee.name}</span>?
            All configuration and history will be permanently removed.
            This action cannot be undone.
          </p>

          <div className="flex items-center justify-end gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setConfirmOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? <Spinner size="xs" color="danger" /> : null}
              {isPending ? "Deleting…" : "Delete permanently"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
