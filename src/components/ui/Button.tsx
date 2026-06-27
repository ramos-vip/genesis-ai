import Link from "next/link";
import { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

interface LinkProps extends BaseProps {
  href: string;
  onClick?: never;
  type?: never;
  disabled?: never;
}

interface ButtonProps extends BaseProps {
  href?: never;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

type Props = LinkProps | ButtonProps;

const variantClasses: Record<Variant, string> = {
  primary: [
    "bg-accent text-white",
    "hover:bg-accent-hover",
    "shadow-[0_0_20px_rgba(124,58,237,0.2)]",
    "hover:shadow-[0_0_28px_rgba(124,58,237,0.35)]",
  ].join(" "),
  secondary:
    "bg-white/[0.04] text-zinc-200 border border-white/10 hover:bg-white/[0.08] hover:border-white/[0.18]",
  ghost: "text-zinc-400 hover:text-white hover:bg-white/[0.05]",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-4 text-sm rounded-lg",
  md: "h-10 px-5 text-sm rounded-lg",
  lg: "h-12 px-7 text-[15px] rounded-xl",
};

const base =
  "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
  "disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer select-none";

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: Props) {
  const classes = [base, variantClasses[variant], sizeClasses[size], className].join(" ");

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const { onClick, type = "button", disabled } = props as ButtonProps;
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
