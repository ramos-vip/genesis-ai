import Link from "next/link";
import { ComponentPropsWithoutRef, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
export type ButtonSize    = "xs" | "sm" | "md" | "lg" | "xl";

interface BaseButtonProps {
  variant?:  ButtonVariant;
  size?:     ButtonSize;
  loading?:  boolean;
  leadingIcon?:  ReactNode;
  trailingIcon?: ReactNode;
  className?: string;
  children?:  ReactNode;
}

type AsLink   = BaseButtonProps & { href: string } & Omit<ComponentPropsWithoutRef<"a">,    keyof BaseButtonProps | "href">;
type AsButton = BaseButtonProps & { href?: never } & Omit<ComponentPropsWithoutRef<"button">, keyof BaseButtonProps>;

type ButtonProps = AsLink | AsButton;

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    "bg-accent text-white",
    "hover:bg-accent-hover",
    "shadow-[0_0_20px_rgba(124,58,237,0.2)] hover:shadow-[0_0_28px_rgba(124,58,237,0.35)]",
    "disabled:shadow-none",
  ].join(" "),

  secondary: [
    "bg-white/[0.04] text-text-primary border border-border",
    "hover:bg-white/[0.08] hover:border-border-hover",
  ].join(" "),

  outline: [
    "bg-transparent text-accent border border-accent/40",
    "hover:bg-accent-subtle hover:border-accent/60",
  ].join(" "),

  ghost: "text-text-secondary hover:text-text-primary hover:bg-white/[0.05]",

  danger: [
    "bg-danger-bg text-danger border border-danger-border",
    "hover:bg-red-500/[0.15] hover:border-danger",
  ].join(" "),
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: "h-7  px-3   text-xs  gap-1.5 rounded-md",
  sm: "h-8  px-4   text-sm  gap-2   rounded-lg",
  md: "h-10 px-5   text-sm  gap-2   rounded-lg",
  lg: "h-12 px-7   text-[15px] gap-2.5 rounded-xl",
  xl: "h-14 px-8   text-base   gap-3   rounded-xl",
};

const iconSizeClasses: Record<ButtonSize, string> = {
  xs: "w-3.5 h-3.5",
  sm: "w-4   h-4",
  md: "w-4   h-4",
  lg: "w-5   h-5",
  xl: "w-5   h-5",
};

const base =
  "inline-flex items-center justify-center font-medium " +
  "transition-all duration-150 select-none cursor-pointer " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
  "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none";

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`animate-spin ${className}`}
      aria-hidden
    >
      <circle cx="8" cy="8" r="6" strokeOpacity="0.25" />
      <path d="M14 8a6 6 0 0 0-6-6" strokeLinecap="round" />
    </svg>
  );
}

export default function Button(props: ButtonProps) {
  const {
    variant  = "primary",
    size     = "md",
    loading  = false,
    leadingIcon,
    trailingIcon,
    className = "",
    children,
    ...rest
  } = props;

  const classes = [
    base,
    variantClasses[variant],
    sizeClasses[size],
    className,
  ].join(" ");

  const iconCls = iconSizeClasses[size];

  const content = (
    <>
      {loading ? (
        <Spinner className={iconCls} />
      ) : (
        leadingIcon && <span className={`${iconCls} shrink-0`} aria-hidden>{leadingIcon}</span>
      )}
      {children}
      {!loading && trailingIcon && (
        <span className={`${iconCls} shrink-0`} aria-hidden>{trailingIcon}</span>
      )}
    </>
  );

  if ("href" in rest && rest.href) {
    const { href, ...linkRest } = rest as AsLink;
    return (
      <Link href={href} className={classes} {...linkRest}>
        {content}
      </Link>
    );
  }

  const { ...buttonRest } = rest as AsButton;
  return (
    <button className={classes} disabled={loading || (buttonRest as { disabled?: boolean }).disabled} {...buttonRest}>
      {content}
    </button>
  );
}
