"use client";

import { ComponentPropsWithoutRef, useId } from "react";

interface SliderProps extends Omit<ComponentPropsWithoutRef<"input">, "type" | "onChange"> {
  /** Current value (same unit as min/max) */
  value:      number;
  onChange:   (value: number) => void;
  min?:       number;
  max?:       number;
  step?:      number;
  label?:     string;
  /** Label for the min end */
  minLabel?:  string;
  /** Label for the max end */
  maxLabel?:  string;
  /** Formats the current value for display */
  format?:    (value: number) => string;
  className?: string;
}

export default function Slider({
  value,
  onChange,
  min       = 0,
  max       = 100,
  step      = 1,
  label,
  minLabel,
  maxLabel,
  format    = String,
  className = "",
  id: idProp,
  disabled,
  ...rest
}: SliderProps) {
  const autoId = useId();
  const id     = idProp ?? autoId;

  /** Percentage of slider filled — used as CSS variable for track fill */
  const progress = `${((value - min) / (max - min)) * 100}%`;

  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={id}
            className="text-sm font-medium text-text-primary select-none"
          >
            {label}
          </label>
          <span className="text-sm font-semibold text-accent tabular-nums">
            {format(value)}
          </span>
        </div>
      )}

      <input
        {...rest}
        id={id}
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={label}
        className="w-full"
        style={{ "--slider-progress": progress } as React.CSSProperties}
      />

      {(minLabel || maxLabel) && (
        <div className="flex items-center justify-between">
          {minLabel && (
            <span className="text-xs text-text-muted">{minLabel}</span>
          )}
          {maxLabel && (
            <span className="text-xs text-text-muted">{maxLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
