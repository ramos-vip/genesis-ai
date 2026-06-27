"use client";

import { ComponentPropsWithoutRef, ReactNode, forwardRef, useId } from "react";

export type InputSize    = "sm" | "md" | "lg";
export type InputVariant = "default" | "error" | "success";

interface InputProps extends Omit<ComponentPropsWithoutRef<"input">, "size"> {
  label?:    string;
  hint?:     string;
  error?:    string;
  size?:     InputSize;
  variant?:  InputVariant;
  leading?:  ReactNode;
  trailing?: ReactNode;
  required?: boolean;
}

const sizeClasses: Record<InputSize, { wrapper: string; input: string; icon: string }> = {
  sm: {
    wrapper: "h-8",
    input:   "text-sm px-3",
    icon:    "w-4 h-4",
  },
  md: {
    wrapper: "h-10",
    input:   "text-sm px-4",
    icon:    "w-4 h-4",
  },
  lg: {
    wrapper: "h-12",
    input:   "text-base px-4",
    icon:    "w-5 h-5",
  },
};

const variantRing: Record<InputVariant, string> = {
  default: "border-border hover:border-border-hover focus-within:border-border-focus focus-within:ring-2 focus-within:ring-accent/20",
  error:   "border-danger-border focus-within:ring-2 focus-within:ring-danger/20",
  success: "border-success-border focus-within:ring-2 focus-within:ring-success/20",
};

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    hint,
    error,
    size     = "md",
    variant,
    leading,
    trailing,
    required,
    className = "",
    id: idProp,
    ...props
  },
  ref
) {
  const autoId  = useId();
  const id      = idProp ?? autoId;
  const hintId  = `${id}-hint`;
  const derivedVariant: InputVariant = error ? "error" : (variant ?? "default");
  const sz = sizeClasses[size];

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-text-primary select-none"
        >
          {label}
          {required && <span className="ml-1 text-danger" aria-hidden>*</span>}
        </label>
      )}

      <div
        className={[
          "relative flex items-center rounded-lg border bg-surface-elevated",
          "transition-all duration-150",
          sz.wrapper,
          variantRing[derivedVariant],
          className,
        ].join(" ")}
      >
        {leading && (
          <span className={`shrink-0 ml-3 text-text-muted ${sz.icon}`} aria-hidden>
            {leading}
          </span>
        )}

        <input
          ref={ref}
          id={id}
          required={required}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={hint || error ? hintId : undefined}
          className={[
            "flex-1 h-full bg-transparent outline-none placeholder:text-text-muted",
            "text-text-primary disabled:cursor-not-allowed disabled:opacity-50",
            sz.input,
            leading  ? "pl-2" : "",
            trailing ? "pr-2" : "",
          ].join(" ")}
          {...props}
        />

        {trailing && (
          <span className={`shrink-0 mr-3 text-text-muted ${sz.icon}`} aria-hidden>
            {trailing}
          </span>
        )}
      </div>

      {(error || hint) && (
        <p
          id={hintId}
          className={`text-xs ${error ? "text-danger" : "text-text-muted"}`}
          role={error ? "alert" : undefined}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
});

export default Input;
