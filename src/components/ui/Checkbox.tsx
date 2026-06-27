"use client";

import { ComponentPropsWithoutRef, forwardRef, useId } from "react";

interface CheckboxProps extends Omit<ComponentPropsWithoutRef<"input">, "type" | "size"> {
  label?:       string;
  description?: string;
  size?:        "sm" | "md" | "lg";
  indeterminate?: boolean;
}

const sizeMap = {
  sm: { box: "w-4 h-4", text: "text-sm", desc: "text-xs" },
  md: { box: "w-5 h-5", text: "text-sm", desc: "text-xs" },
  lg: { box: "w-6 h-6", text: "text-base", desc: "text-sm" },
} as const;

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, size = "md", indeterminate = false, className = "", id: idProp, ...props },
  ref
) {
  const autoId = useId();
  const id     = idProp ?? autoId;
  const sz     = sizeMap[size];

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="relative flex items-center mt-px">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          className="peer sr-only"
          {...props}
        />
        {/* Visual checkbox */}
        <span
          aria-hidden
          className={[
            sz.box,
            "flex items-center justify-center rounded shrink-0",
            "border border-border bg-surface-elevated",
            "cursor-pointer transition-all duration-150",
            "peer-checked:bg-accent peer-checked:border-accent",
            "peer-indeterminate:bg-accent peer-indeterminate:border-accent",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
            "peer-disabled:opacity-50 peer-disabled:cursor-not-allowed",
          ].join(" ")}
          onClick={() => {
            const el = document.getElementById(id) as HTMLInputElement | null;
            if (el && !props.disabled) el.click();
          }}
        >
          {indeterminate ? (
            <svg viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2" className="w-2.5 h-2.5">
              <path d="M2 6h8" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" className="w-2.5 h-2.5 opacity-0 peer-checked:opacity-100">
              <path d="M1.5 6l3 3 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      </div>

      {label && (
        <label htmlFor={id} className="flex flex-col gap-0.5 cursor-pointer">
          <span className={`${sz.text} font-medium text-text-primary select-none`}>{label}</span>
          {description && (
            <span className={`${sz.desc} text-text-muted`}>{description}</span>
          )}
        </label>
      )}
    </div>
  );
});

export default Checkbox;
