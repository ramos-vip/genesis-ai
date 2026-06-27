export type SpinnerSize  = "xs" | "sm" | "md" | "lg" | "xl";
export type SpinnerColor = "default" | "accent" | "white" | "success" | "danger";

interface SpinnerProps {
  size?:      SpinnerSize;
  color?:     SpinnerColor;
  label?:     string;
  className?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  xs: "w-3   h-3",
  sm: "w-4   h-4",
  md: "w-5   h-5",
  lg: "w-6   h-6",
  xl: "w-8   h-8",
};

const strokeWidths: Record<SpinnerSize, number> = {
  xs: 2.5,
  sm: 2.5,
  md: 2,
  lg: 2,
  xl: 1.75,
};

const colorClasses: Record<SpinnerColor, string> = {
  default: "text-text-muted",
  accent:  "text-accent",
  white:   "text-white",
  success: "text-success",
  danger:  "text-danger",
};

export default function Spinner({
  size      = "md",
  color     = "accent",
  label     = "Loading…",
  className = "",
}: SpinnerProps) {
  const sw = strokeWidths[size];

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      role="status"
      aria-label={label}
      className={[
        "animate-spin shrink-0",
        sizeClasses[size],
        colorClasses[color],
        className,
      ].join(" ")}
    >
      <circle cx="12" cy="12" r="9" strokeOpacity="0.2" />
      <path d="M21 12a9 9 0 0 0-9-9" strokeLinecap="round" />
    </svg>
  );
}
