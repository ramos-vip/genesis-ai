import { ReactNode } from "react";

export type BadgeVariant = "default" | "primary" | "success" | "warning" | "danger" | "info" | "outline";
export type BadgeSize    = "sm" | "md" | "lg";

interface BadgeProps {
  variant?:  BadgeVariant;
  size?:     BadgeSize;
  dot?:      boolean;
  children:  ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-white/[0.06] text-text-secondary border border-border",
  primary: "bg-accent-muted text-accent border border-accent/20",
  success: "bg-success-bg text-success border border-success-border",
  warning: "bg-warning-bg text-warning border border-warning-border",
  danger:  "bg-danger-bg  text-danger  border border-danger-border",
  info:    "bg-info-bg    text-info    border border-info-border",
  outline: "bg-transparent text-text-secondary border border-border hover:border-border-hover",
};

const dotClasses: Record<BadgeVariant, string> = {
  default: "bg-text-muted",
  primary: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger:  "bg-danger",
  info:    "bg-info",
  outline: "bg-text-muted",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "h-5  px-2   text-[10px] gap-1   rounded-full font-semibold tracking-wide",
  md: "h-6  px-2.5 text-xs     gap-1.5 rounded-full font-medium",
  lg: "h-7  px-3   text-sm     gap-2   rounded-full font-medium",
};

export default function Badge({
  variant   = "default",
  size      = "md",
  dot       = false,
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(" ")}
    >
      {dot && (
        <span
          className={`shrink-0 w-1.5 h-1.5 rounded-full ${dotClasses[variant]}`}
          aria-hidden
        />
      )}
      {children}
    </span>
  );
}
