"use client";

import { ComponentPropsWithoutRef, forwardRef, useId } from "react";

interface TextareaProps extends ComponentPropsWithoutRef<"textarea"> {
  label?:   string;
  hint?:    string;
  error?:   string;
  rows?:    number;
  resize?:  "none" | "vertical" | "horizontal" | "both";
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    label,
    hint,
    error,
    rows     = 4,
    resize   = "vertical",
    required,
    className = "",
    id: idProp,
    ...props
  },
  ref
) {
  const autoId = useId();
  const id     = idProp ?? autoId;
  const hintId = `${id}-hint`;
  const hasError = !!error;

  const resizeClass = {
    none:       "resize-none",
    vertical:   "resize-y",
    horizontal: "resize-x",
    both:       "resize",
  }[resize];

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-text-primary select-none">
          {label}
          {required && <span className="ml-1 text-danger" aria-hidden>*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        id={id}
        rows={rows}
        required={required}
        aria-required={required}
        aria-invalid={hasError}
        aria-describedby={hint || error ? hintId : undefined}
        className={[
          "w-full rounded-lg border bg-surface-elevated px-4 py-3",
          "text-sm text-text-primary placeholder:text-text-muted",
          "outline-none transition-all duration-150",
          "disabled:cursor-not-allowed disabled:opacity-50",
          resizeClass,
          hasError
            ? "border-danger-border focus:ring-2 focus:ring-danger/20"
            : "border-border hover:border-border-hover focus:border-border-focus focus:ring-2 focus:ring-accent/20",
          className,
        ].join(" ")}
        {...props}
      />

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

export default Textarea;
