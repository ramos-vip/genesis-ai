"use client";

import { useRef } from "react";
import { useWizardContext } from "../../hooks/useCreateEmployeeWizard";
import { DESCRIPTION_MAX_LENGTH, ROLE_BY_ID } from "../../constants";

export default function Step3Description() {
  const { state, setField } = useWizardContext();
  const textareaRef         = useRef<HTMLTextAreaElement>(null);

  const description = state.data.description;
  const role        = state.data.role;
  const name        = state.data.name || "they";
  const count       = description.length;
  const remaining   = DESCRIPTION_MAX_LENGTH - count;

  const roleData    = role ? ROLE_BY_ID[role] : null;
  const suggestions = roleData?.suggestions ?? [];

  /* Color-code the counter */
  const counterColor =
    remaining <= 50
      ? "text-danger"
      : remaining <= 100
      ? "text-warning"
      : "text-text-muted";

  function applySuggestion(text: string) {
    const truncated = text.slice(0, DESCRIPTION_MAX_LENGTH);
    setField("description", truncated);
    textareaRef.current?.focus();
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
          What will{" "}
          <span className="text-accent">{name}</span> do?
        </h2>
        <p className="text-sm text-text-secondary">
          Describe their responsibilities in detail. The more specific, the better.
        </p>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          id="employee-description"
          value={description}
          onChange={(e) => setField("description", e.target.value)}
          maxLength={DESCRIPTION_MAX_LENGTH}
          rows={5}
          placeholder={
            roleData
              ? `e.g., "${roleData.suggestions[0].slice(0, 80)}…"`
              : "Describe what this AI employee will do…"
          }
          aria-label="Employee description"
          aria-describedby="description-counter"
          className={[
            "w-full rounded-xl border bg-surface-elevated px-5 py-4",
            "text-sm text-text-primary placeholder:text-text-muted",
            "outline-none resize-none transition-all duration-150",
            "border-border hover:border-border-hover",
            "focus:border-border-focus focus:ring-2 focus:ring-accent/20",
          ].join(" ")}
        />

        {/* Counter */}
        <span
          id="description-counter"
          aria-live="polite"
          className={`absolute bottom-3 right-4 text-xs font-mono ${counterColor}`}
        >
          {count}/{DESCRIPTION_MAX_LENGTH}
        </span>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
            Suggestions
          </p>
          <div className="flex flex-col gap-2">
            {suggestions.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => applySuggestion(suggestion)}
                className="text-left px-4 py-3 rounded-xl border border-border bg-surface hover:border-border-hover hover:bg-surface-elevated text-sm text-text-secondary hover:text-text-primary transition-all duration-150"
              >
                <span className="line-clamp-2">{suggestion}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Optional indicator */}
      <p className="mt-4 text-xs text-text-muted text-center">
        Optional — you can refine this after creating your employee.
      </p>
    </div>
  );
}
