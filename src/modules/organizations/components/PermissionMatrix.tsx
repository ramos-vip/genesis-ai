"use client";

import {
  ACTIONS,
  RESOURCES,
  ROLE_LABELS,
  ROLE_PERMISSIONS,
  SYSTEM_ROLES,
  can,
} from "../permissions";

const ACTION_LABEL: Record<string, string> = {
  view:   "V",
  create: "C",
  update: "U",
  delete: "D",
  manage: "M",
};

export function PermissionMatrix() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-text-secondary">
        System roles and the permissions they grant. Per-organization custom roles are on the
        roadmap for a later release.
      </p>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="sticky left-0 bg-surface px-4 py-3 text-left font-medium text-text-muted">
                Resource
              </th>
              {SYSTEM_ROLES.map((r) => (
                <th
                  key={r}
                  className="px-3 py-3 text-center font-medium text-text-muted whitespace-nowrap"
                >
                  {ROLE_LABELS[r]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RESOURCES.map((resource) => (
              <tr key={resource} className="border-b border-border/60 last:border-0">
                <td className="sticky left-0 bg-surface px-4 py-2.5 font-medium text-text-primary capitalize whitespace-nowrap">
                  {resource}
                </td>
                {SYSTEM_ROLES.map((role) => {
                  const granted = ACTIONS.filter((a) => can(ROLE_PERMISSIONS[role], resource, a));
                  const all = granted.length === ACTIONS.length;
                  return (
                    <td key={role} className="px-3 py-2.5 text-center">
                      {granted.length === 0 ? (
                        <span className="text-text-muted/40">—</span>
                      ) : all ? (
                        <span className="text-accent font-semibold text-xs">Full</span>
                      ) : (
                        <span className="text-xs font-mono text-text-secondary">
                          {granted.map((a) => ACTION_LABEL[a]).join(" ")}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
        <span>V = View</span>
        <span>C = Create</span>
        <span>U = Update</span>
        <span>D = Delete</span>
        <span>M = Manage</span>
        <span>Full = all actions</span>
      </div>
    </div>
  );
}
