"use client";

import { useEffect, useRef } from "react";
import { useWizardContext } from "../../hooks/useCreateEmployeeWizard";

export default function Step1Name() {
  const { state, setField } = useWizardContext();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const name      = state.data.name;
  const error     = state.errors.name;
  const maxLength = 50;
  const count     = name.length;

  return (
    <div className="animate-fade-in">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
          What should we call your AI employee?
        </h2>
        <p className="text-sm text-text-secondary">
          Give them a name your team will recognize.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <div
          className={[
            "relative flex items-center h-14 rounded-xl border bg-surface-elevated transition-all duration-150",
            error
              ? "border-danger-border focus-within:ring-2 focus-within:ring-danger/20"
              : "border-border hover:border-border-hover focus-within:border-border-focus focus-within:ring-2 focus-within:ring-accent/20",
          ].join(" ")}
        >
          <input
            ref={inputRef}
            id="employee-name"
            type="text"
            value={name}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="e.g., Sarah, Alex, Support Bot…"
            maxLength={maxLength}
            aria-label="Employee name"
            aria-describedby={error ? "name-error" : "name-counter"}
            aria-invalid={!!error}
            className="flex-1 h-full bg-transparent px-5 text-base text-text-primary placeholder:text-text-muted outline-none"
          />
          <span
            id="name-counter"
            className={[
              "shrink-0 pr-4 text-xs font-mono",
              count > maxLength - 10 ? "text-warning" : "text-text-muted",
            ].join(" ")}
            aria-live="polite"
          >
            {count}/{maxLength}
          </span>
        </div>

        {error ? (
          <p id="name-error" role="alert" className="text-xs text-danger">
            {error}
          </p>
        ) : null}
      </div>

      {/* Tips */}
      <ul className="mt-8 space-y-2">
        {[
          "Use a name your team will recognize",
          "Keep it short and memorable",
          "You can change it any time later",
        ].map((tip) => (
          <li key={tip} className="flex items-center gap-2 text-sm text-text-muted">
            <span className="w-1 h-1 rounded-full bg-text-muted shrink-0" aria-hidden />
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}
