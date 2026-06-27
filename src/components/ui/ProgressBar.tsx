interface ProgressBarProps {
  /** 0–100 */
  value: number;
  color?:    "accent" | "success" | "warning";
  size?:     "xs" | "sm" | "md";
  showLabel?: boolean;
  className?: string;
}

const colorClasses = {
  accent:  "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
} as const;

const sizeClasses = {
  xs: "h-0.5",
  sm: "h-1",
  md: "h-2",
} as const;

export default function ProgressBar({
  value,
  color     = "accent",
  size      = "sm",
  showLabel = false,
  className = "",
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={className}>
      <div
        className={`w-full rounded-full bg-surface-elevated overflow-hidden ${sizeClasses[size]}`}
      >
        <div
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${clamped}% complete`}
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorClasses[color]}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <p className="mt-1.5 text-xs text-text-muted text-right" aria-hidden>
          {clamped}%
        </p>
      )}
    </div>
  );
}
