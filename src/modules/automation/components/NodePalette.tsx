import type { NodeType } from "../types";
import { NODE_CONFIG } from "../types";

interface NodePaletteProps {
  onAddNode: (type: NodeType) => void;
}

const PALETTE_SECTIONS: { label: string; types: NodeType[] }[] = [
  { label: "Triggers",   types: ["trigger"] },
  { label: "AI Nodes",   types: ["employee", "knowledge"] },
  { label: "Logic",      types: ["condition", "delay"] },
  { label: "Actions",    types: ["action"] },
  { label: "Terminal",   types: ["end"] },
];

const TRIGGER_SUBTYPES = [
  { icon: "📝", label: "Form Submit"  },
  { icon: "🔗", label: "Webhook"     },
  { icon: "⏰", label: "Schedule"    },
  { icon: "📧", label: "Email Rcvd"  },
];

const ACTION_SUBTYPES = [
  { icon: "📧", label: "Send Email"  },
  { icon: "💬", label: "Slack Msg"   },
  { icon: "🗃",  label: "CRM Record" },
  { icon: "🔗", label: "Webhook"    },
];

export default function NodePalette({ onAddNode }: NodePaletteProps) {
  return (
    <aside className="w-52 shrink-0 border-r border-border bg-surface flex flex-col overflow-y-auto">
      <div className="px-4 py-3 border-b border-border">
        <p className="text-xs font-bold text-white">Node Palette</p>
        <p className="text-[10px] text-text-muted mt-0.5">Click to add to canvas</p>
      </div>

      <div className="p-3 flex flex-col gap-4">
        {PALETTE_SECTIONS.map(section => (
          <div key={section.label}>
            <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-2">
              {section.label}
            </p>
            <div className="flex flex-col gap-1">
              {section.types.map(type => {
                const cfg = NODE_CONFIG[type];
                return (
                  <button
                    key={type}
                    onClick={() => onAddNode(type)}
                    className={[
                      "flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left",
                      "transition-all duration-150 hover:scale-[1.02]",
                      cfg.bg, cfg.border,
                      "hover:brightness-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                    ].join(" ")}
                    title={`Add ${cfg.label} node`}
                  >
                    <span className="text-base shrink-0" aria-hidden>{cfg.icon}</span>
                    <div className="min-w-0">
                      <p className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Quick trigger types */}
        <div>
          <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-2">
            Quick Triggers
          </p>
          <div className="grid grid-cols-2 gap-1">
            {TRIGGER_SUBTYPES.map(t => (
              <button
                key={t.label}
                onClick={() => onAddNode("trigger")}
                className="flex flex-col items-center gap-1 p-2 rounded-lg border border-border bg-surface-elevated hover:border-emerald-500/30 hover:bg-emerald-600/10 transition-all text-center"
              >
                <span className="text-sm" aria-hidden>{t.icon}</span>
                <span className="text-[9px] text-text-muted font-medium leading-tight">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick action types */}
        <div>
          <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-2">
            Quick Actions
          </p>
          <div className="grid grid-cols-2 gap-1">
            {ACTION_SUBTYPES.map(a => (
              <button
                key={a.label}
                onClick={() => onAddNode("action")}
                className="flex flex-col items-center gap-1 p-2 rounded-lg border border-border bg-surface-elevated hover:border-orange-500/30 hover:bg-orange-600/10 transition-all text-center"
              >
                <span className="text-sm" aria-hidden>{a.icon}</span>
                <span className="text-[9px] text-text-muted font-medium leading-tight">{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
