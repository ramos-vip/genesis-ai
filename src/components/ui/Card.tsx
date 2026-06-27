import { ComponentPropsWithoutRef, ReactNode } from "react";

export type CardVariant = "default" | "bordered" | "elevated" | "ghost" | "accent";

interface CardProps extends ComponentPropsWithoutRef<"div"> {
  variant?: CardVariant;
  padding?: "none" | "sm" | "md" | "lg";
}

interface CardSectionProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
}

const variantClasses: Record<CardVariant, string> = {
  default:  "border border-border bg-surface",
  bordered: "border border-border-hover bg-surface",
  elevated: "border border-border bg-surface shadow-[0_4px_6px_rgba(0,0,0,0.3),0_1px_3px_rgba(0,0,0,0.2)]",
  ghost:    "bg-transparent",
  accent:   "border border-accent/20 bg-accent-subtle",
};

const paddingClasses = {
  none: "",
  sm:   "p-4",
  md:   "p-6",
  lg:   "p-8",
};

export function CardHeader({ className = "", children, ...props }: CardSectionProps) {
  return (
    <div
      className={`px-6 py-4 border-b border-border flex items-center justify-between ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBody({ className = "", children, ...props }: CardSectionProps) {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className = "", children, ...props }: CardSectionProps) {
  return (
    <div
      className={`px-6 py-4 border-t border-border flex items-center gap-3 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default function Card({
  variant  = "default",
  padding  = "none",
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={[
        "rounded-2xl overflow-hidden",
        variantClasses[variant],
        paddingClasses[padding],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
