"use client";

import { ComponentPropsWithoutRef, forwardRef, useId } from "react";

interface SwitchProps extends Omit<ComponentPropsWithoutRef<"input">, "type" | "size"> {
  label?:       string;
  description?: string;
  size?:        "sm" | "md" | "lg";
}

const sizeMap = {
  sm: {
    track:  "w-8  h-4",
    thumb:  "w-3  h-3  peer-checked:translate-x-4",
    text:   "text-sm",
    desc:   "text-xs",
  },
  md: {
    track:  "w-10 h-5",
    thumb:  "w-3.5 h-3.5 peer-checked:translate-x-5",
    text:   "text-sm",
    desc:   "text-xs",
  },
  lg: {
    track:  "w-12 h-6",
    thumb:  "w-4.5 h-4.5 peer-checked:translate-x-6",
    text:   "text-base",
    desc:   "text-sm",
  },
} as const;

const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, description, size = "md", className = "", id: idProp, ...props },
  ref
) {
  const autoId = useId();
  const id     = idProp ?? autoId;
  const sz     = sizeMap[size];

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="relative mt-px shrink-0">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          role="switch"
          className="peer sr-only"
          {...props}
        />
        {/* Track */}
        <span
          aria-hidden
          className={[
            sz.track,
            "flex items-center px-0.5 rounded-full cursor-pointer",
            "transition-all duration-200",
            "bg-surface-elevated border border-border",
            "peer-checked:bg-accent peer-checked:border-accent",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
            "peer-disabled:opacity-50 peer-disabled:cursor-not-allowed",
          ].join(" ")}
          onClick={() => {
            const el = document.getElementById(id) as HTMLInputElement | null;
            if (el && !props.disabled) el.click();
          }}
        >
          {/* Thumb */}
          <span
            className={[
              sz.thumb,
              "rounded-full bg-text-muted transition-transform duration-200",
              "peer-checked:bg-white",
            ].join(" ")}
          />
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

export default Switch;
