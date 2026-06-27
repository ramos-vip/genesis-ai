import { ReactNode } from "react";
import Button from "@/components/ui/Button";

interface EmptyStateProps {
  icon?:         ReactNode;
  title:         string;
  description?:  string;
  action?:       {
    label:   string;
    href?:   string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label:   string;
    href?:   string;
    onClick?: () => void;
  };
  className?: string;
}

const defaultIcon = (
  <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12" aria-hidden>
    <rect x="8" y="8" width="32" height="32" rx="8" stroke="currentColor" strokeWidth="1.5" />
    <path d="M16 24h16M24 16v16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
  </svg>
);

export default function EmptyState({
  icon        = defaultIcon,
  title,
  description,
  action,
  secondaryAction,
  className   = "",
}: EmptyStateProps) {
  return (
    <div
      className={[
        "flex flex-col items-center justify-center text-center",
        "py-16 px-6",
        className,
      ].join(" ")}
    >
      {icon && (
        <div className="mb-4 text-text-muted">{icon}</div>
      )}

      <h3 className="text-base font-semibold text-text-primary mb-2">{title}</h3>

      {description && (
        <p className="text-sm text-text-secondary max-w-sm leading-relaxed mb-6">
          {description}
        </p>
      )}

      {(action || secondaryAction) && (
        <div className="flex items-center gap-3">
          {action && (
            <Button
              variant="primary"
              size="sm"
              href={action.href}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="secondary"
              size="sm"
              href={secondaryAction.href}
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
