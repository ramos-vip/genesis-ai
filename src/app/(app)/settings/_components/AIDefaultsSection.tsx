"use client";

import { useToast } from "@/shared/providers";
import { useLocalStorage } from "@/shared/hooks";
import Slider from "@/components/ui/Slider";
import Button from "@/components/ui/Button";

interface AIDefaults {
  model:       string;
  temperature: number;  // 0-100, maps to 0.0-1.0
  tone:        string;
  streaming:   boolean;
}

const DEFAULT_AI: AIDefaults = {
  model:       "gemini-2.5-flash",
  temperature: 50,
  tone:        "professional",
  streaming:   true,
};

const MODELS = [
  { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash",    badge: "Fastest" },
  { value: "gemini-2.5-pro",   label: "Gemini 2.5 Pro",      badge: "Most capable" },
];

const TONES = [
  { value: "professional", label: "Professional" },
  { value: "friendly",     label: "Friendly" },
  { value: "concise",      label: "Concise" },
  { value: "custom",       label: "Custom" },
];

function SelectRow({
  label, sub, value, onChange, options,
}: {
  label: string; sub?: string; value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; badge?: string }[];
}) {
  return (
    <div className="flex items-start justify-between gap-6 py-4 border-b border-border last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-text-primary">{label}</p>
        {sub && <p className="text-xs text-text-muted mt-0.5">{sub}</p>}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="shrink-0 h-9 rounded-lg border border-border bg-surface-elevated px-3 pr-8 text-sm text-text-primary appearance-none cursor-pointer outline-none focus:border-border-focus focus:ring-2 focus:ring-accent/20 transition-all"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%2371717a' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "12px" }}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}{o.badge ? ` — ${o.badge}` : ""}</option>
        ))}
      </select>
    </div>
  );
}

function ToggleRow({ label, sub, value, onChange }: { label: string; sub?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-6 py-4 border-b border-border last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-text-primary">{label}</p>
        {sub && <p className="text-xs text-text-muted mt-0.5">{sub}</p>}
      </div>
      <button
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`shrink-0 relative w-10 h-5 rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
          value ? "bg-accent border-accent/50" : "bg-surface-elevated border-border"
        }`}
      >
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${value ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}

export default function AIDefaultsSection() {
  const [defaults, setDefaults] = useLocalStorage<AIDefaults>("genesis:settings:ai-defaults", DEFAULT_AI);
  const { toast } = useToast();

  function set<K extends keyof AIDefaults>(key: K, value: AIDefaults[K]) {
    setDefaults(prev => ({ ...prev, [key]: value }));
  }

  function handleReset() {
    setDefaults(DEFAULT_AI);
    toast.info("AI defaults reset.");
  }

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden" id="ai-defaults">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">AI Defaults</h3>
          <p className="text-xs text-text-muted mt-0.5">Default settings applied to new AI employees.</p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleReset}>Reset</Button>
      </div>

      <div className="px-6">
        <SelectRow
          label="Default AI Model"
          sub="Used when creating new employees"
          value={defaults.model}
          onChange={(v) => set("model", v)}
          options={MODELS}
        />
        <SelectRow
          label="Default Tone"
          sub="Communication style for new employees"
          value={defaults.tone}
          onChange={(v) => set("tone", v)}
          options={TONES}
        />
        <div className="py-4 border-b border-border last:border-0">
          <div className="flex items-start justify-between gap-6 mb-4">
            <div>
              <p className="text-sm font-medium text-text-primary">Default Temperature</p>
              <p className="text-xs text-text-muted mt-0.5">Creativity level (0 = precise, 100 = creative)</p>
            </div>
            <span className="text-sm font-semibold text-accent tabular-nums">
              {(defaults.temperature / 100).toFixed(1)}
            </span>
          </div>
          <Slider
            value={defaults.temperature}
            onChange={(v) => set("temperature", v)}
            min={0} max={100} step={5}
            minLabel="Precise" maxLabel="Creative"
          />
        </div>
        <ToggleRow
          label="Streaming responses"
          sub="Show AI responses as they generate in real-time"
          value={defaults.streaming}
          onChange={(v) => set("streaming", v)}
        />
      </div>
    </div>
  );
}
