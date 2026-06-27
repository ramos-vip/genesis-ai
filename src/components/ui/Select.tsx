"use client";

import { ComponentPropsWithoutRef, ReactNode, forwardRef, useId } from "react";

export type SelectSize = "sm" | "md" | "lg";

interface SelectProps extends Omit<ComponentPropsWithoutRef<"select">, "size"> {
  label?:    string;
  hint?:     string;
  error?:    string;
  size?:     SelectSize;
  leading?:  ReactNode;
  placeholder?: string;
}

const sizeClasses: Record<SelectSize, string> = {
  sm: "h-8  text-sm  pl-3 pr-8",
  md: "h-10 text-sm  pl-4 pr-9",
  lg: "h-12 text-base pl-4 pr-9",
};

const ChevronDownIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4 pointer-events-none"
    aria-hidden
  >
    <path d="M4 6l4 4 4-4" />
  </svg>
);

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    label,
    hint,
    error,
    size      = "md",
    leading,
    placeholder,
    required,
    className  = "",
    children,
    id: idProp,
    ...props
  },
  ref
) {
  const autoId = useId();
  const id     = idProp ?? autoId;
  const hintId = `${id}-hint`;
  const hasError = !!error;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-text-primary select-none">
          {label}
          {required && <span className="ml-1 text-danger" aria-hidden>*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {leading && (
          <span className="absolute left-3 w-4 h-4 text-text-muted pointer-events-none" aria-hidden>
            {leading}
          </span>
        )}

        <select
          ref={ref}
          id={id}
          required={required}
          aria-required={required}
          aria-invalid={hasError}
          aria-describedby={hint || error ? hintId : undefined}
          className={[
            "w-full appearance-none rounded-lg border bg-surface-elevated",
            "text-text-primary outline-none transition-all duration-150",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "cursor-pointer",
            sizeClasses[size],
            leading ? "pl-9" : "",
            hasError
              ? "border-danger-border focus:ring-2 focus:ring-danger/20"
              : "border-border hover:border-border-hover focus:border-border-focus focus:ring-2 focus:ring-accent/20",
            className,
          ].join(" ")}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {children}
        </select>

        <span className="absolute right-3 text-text-muted">
          <ChevronDownIcon />
        </span>
      </div>

      {(error || hint) && (
        <p
          id={hintId}
          className={`text-xs ${hasError ? "text-danger" : "text-text-muted"}`}
          role={hasError ? "alert" : undefined}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
});

export default Select;
