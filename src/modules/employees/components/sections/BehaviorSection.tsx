"use client";

import { useEffect, useState } from "react";
import Button   from "@/components/ui/Button";
import Spinner  from "@/components/ui/Spinner";
import Slider   from "@/components/ui/Slider";
import { useToast } from "@/shared/providers";
import { useUpdateEmployee } from "../../hooks/useEmployees";
import type { Employee, ToneOfVoice } from "../../types";

const TONES: { id: ToneOfVoice; label: string; description: string }[] = [
  { id: "professional", label: "Professional", description: "Formal and authoritative"  },
  { id: "friendly",    label: "Friendly",     description: "Warm and conversational"    },
  { id: "concise",     label: "Concise",      description: "Direct and to-the-point"    },
  { id: "custom",      label: "Custom",       description: "Define your own guidelines" },
];

function formatTemperature(v: number): string {
  return (v / 100).toFixed(1);
}

interface BehaviorSectionProps {
  employee: Employee;
}

export default function BehaviorSection({ employee }: BehaviorSectionProps) {
  const [instructions, setInstructions] = useState(employee.config.systemInstructions);
  const [tone,         setTone]         = useState<ToneOfVoice>(employee.config.toneOfVoice);
  /* Store temperature as 0–100 integer for slider; convert to 0.0–1.0 on save */
  const [temperature,  setTemperature]  = useState(Math.round(employee.config.temperature * 100));

  const { toast }             = useToast();
  const { mutate, isPending } = useUpdateEmployee();

  /*
   * Sync ONLY when navigating to a different employee (employee.id changes).
   * Using primitive config values would re-run on every TanStack Query refetch
   * because the config object is a new reference each time, resetting in-progress edits.
   */
  useEffect(() => {
    setInstructions(employee.config.systemInstructions);
    setTone(employee.config.toneOfVoice);
    setTemperature(Math.round(employee.config.temperature * 100));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employee.id]);

  const isDirty =
    instructions !== employee.config.systemInstructions ||
    tone         !== employee.config.toneOfVoice        ||
    temperature  !== Math.round(employee.config.temperature * 100);

  function save() {
    mutate(
      {
        id:  employee.id,
        dto: {
          config: {
            systemInstructions: instructions,
            toneOfVoice:        tone,
            temperature:        temperature / 100,
          },
        },
      },
      {
        onSuccess: () => toast.success("Behavior settings saved."),
        onError:   () => toast.error("Failed to save settings."),
      }
    );
  }

  function cancel() {
    setInstructions(employee.config.systemInstructions);
    setTone(employee.config.toneOfVoice);
    setTemperature(Math.round(employee.config.temperature * 100));
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-white">Behavior</h3>
          <p className="text-sm text-text-secondary mt-0.5">
            Define how this AI employee communicates and responds.
          </p>
        </div>
        {isDirty && (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={cancel} disabled={isPending}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={save} disabled={isPending}>
              {isPending ? <Spinner size="xs" color="white" /> : null}
              Save
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {/* System Instructions */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-primary">
            System Instructions
          </label>
          <p className="text-xs text-text-muted mb-2">
            These instructions are injected at the beginning of every conversation.
          </p>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={4}
            maxLength={2000}
            placeholder="e.g., Always respond in a helpful, professional manner. Focus on resolving the customer's issue efficiently."
            className={[
              "w-full rounded-lg border bg-surface-elevated px-4 py-3",
              "text-sm text-text-primary placeholder:text-text-muted",
              "outline-none resize-y transition-all duration-150",
              "border-border hover:border-border-hover",
              "focus:border-border-focus focus:ring-2 focus:ring-accent/20",
            ].join(" ")}
          />
          <p className="text-xs text-text-muted text-right">{instructions.length}/2000</p>
        </div>

        {/* Tone of Voice */}
        <div>
          <p className="text-sm font-medium text-text-primary mb-3">Tone of Voice</p>
          <div className="grid grid-cols-2 gap-2">
            {TONES.map((t) => {
              const isSelected = tone === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={[
                    "flex flex-col gap-1 px-4 py-3 rounded-xl border text-left transition-all duration-150 focus-ring",
                    isSelected
                      ? "border-accent/40 bg-accent-subtle"
                      : "border-border bg-surface-elevated hover:border-border-hover",
                  ].join(" ")}
                  aria-pressed={isSelected}
                >
                  <span className={`text-sm font-medium ${isSelected ? "text-accent" : "text-text-primary"}`}>
                    {t.label}
                  </span>
                  <span className="text-xs text-text-muted">{t.description}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Creativity slider */}
        <div className="rounded-xl border border-border bg-surface-elevated p-5">
          <Slider
            label="Creativity"
            value={temperature}
            onChange={setTemperature}
            min={0}
            max={100}
            step={5}
            minLabel="Precise"
            maxLabel="Creative"
            format={formatTemperature}
          />
          <p className="mt-3 text-xs text-text-muted">
            {temperature <= 30
              ? "Low creativity — responses are focused and deterministic."
              : temperature <= 70
              ? "Balanced — a good mix of consistency and variety."
              : "High creativity — responses are more varied and inventive."}
          </p>
        </div>
      </div>
    </div>
  );
}
