"use client";

import { useWizardContext } from "../../hooks/useCreateEmployeeWizard";
import { ROLE_BY_ID } from "../../constants";
import type { EmployeeRole } from "../../types";

interface ReviewRowProps {
  label:    string;
  value:    string;
  onEdit:   () => void;
  muted?:   boolean;
}

function ReviewRow({ label, value, onEdit, muted = false }: ReviewRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
          {label}
        </p>
        <p
          className={[
            "text-sm leading-relaxed",
            muted ? "text-text-muted italic" : "text-text-primary",
          ].join(" ")}
        >
          {value}
        </p>
      </div>
      <button
        onClick={onEdit}
        className="shrink-0 text-xs font-medium text-accent hover:text-violet-400 transition-colors focus-ring rounded px-2 py-1"
        aria-label={`Edit ${label}`}
      >
        Edit
      </button>
    </div>
  );
}

export default function Step5Review() {
  const { state, jumpToStep } = useWizardContext();
  const { name, role, description } = state.data;
  const roleData = role ? ROLE_BY_ID[role as EmployeeRole] : null;

  return (
    <div className="animate-fade-in">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
          Review{" "}
          <span className="text-accent">{name || "your AI employee"}</span>
        </h2>
        <p className="text-sm text-text-secondary">
          Everything looks good? Click create to deploy.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface overflow-hidden">
        <div className="divide-y divide-border px-6">
          <ReviewRow
            label="Name"
            value={name || "—"}
            onEdit={() => jumpToStep(0)}
          />
          <ReviewRow
            label="Role"
            value={roleData?.label ?? "—"}
            onEdit={() => jumpToStep(1)}
          />
          <ReviewRow
            label="Description"
            value={description.trim() || "Not provided"}
            onEdit={() => jumpToStep(2)}
            muted={!description.trim()}
          />
          <ReviewRow
            label="Knowledge Sources"
            value="None — can be added after creation"
            onEdit={() => jumpToStep(3)}
            muted
          />
        </div>
      </div>

      <p className="mt-6 text-xs text-text-muted text-center leading-relaxed">
        Your AI employee will be created in active status.
        <br />
        You can pause, edit, or delete it at any time.
      </p>
    </div>
  );
}
