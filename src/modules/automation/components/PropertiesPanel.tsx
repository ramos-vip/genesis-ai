import type { WorkflowNode, WorkflowEdge, WorkflowNodeData } from "../types";
import { NODE_CONFIG } from "../types";

interface PropertiesPanelProps {
  node:          WorkflowNode | null;
  edges:         WorkflowEdge[];
  onUpdateNode:  (node: WorkflowNode) => void;
  onDeleteNode:  (id: string) => void;
  onDeleteEdge:  (id: string) => void;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full h-8 rounded-lg border border-border bg-surface-elevated px-2.5 text-xs text-text-primary placeholder:text-text-muted outline-none focus:border-border-focus focus:ring-1 focus:ring-accent/30 transition-all";
const selectCls = `${inputCls} cursor-pointer appearance-none pr-8`;

export default function PropertiesPanel({ node, edges, onUpdateNode, onDeleteNode, onDeleteEdge }: PropertiesPanelProps) {
  if (!node) {
    return (
      <aside className="w-56 shrink-0 border-l border-border bg-surface flex flex-col">
        <div className="px-4 py-3 border-b border-border">
          <p className="text-xs font-bold text-white">Properties</p>
        </div>
        <div className="flex-1 flex items-center justify-center text-center px-4">
          <div>
            <p className="text-xs text-text-muted">Select a node to edit its properties.</p>
            <p className="text-[10px] text-text-muted mt-2">Press Delete to remove selected node.</p>
          </div>
        </div>
      </aside>
    );
  }

  const n    = node;          // non-null at this point — we returned early above
  const cfg  = NODE_CONFIG[n.type];
  const nodeEdges = edges.filter(e => e.source === n.id || e.target === n.id);

  function update(data: Partial<WorkflowNodeData>) {
    onUpdateNode({ ...n, data: { ...n.data, ...data } });
  }
  function updateLabel(label: string) {
    onUpdateNode({ ...n, label });
  }

  return (
    <aside className="w-56 shrink-0 border-l border-border bg-surface flex flex-col overflow-y-auto">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm" aria-hidden>{cfg.icon}</span>
          <p className={`text-xs font-bold ${cfg.color}`}>{cfg.label}</p>
        </div>
        <button
          onClick={() => onDeleteNode(n.id)}
          className="w-6 h-6 rounded-md flex items-center justify-center text-text-muted hover:text-danger hover:bg-danger-bg transition-colors"
          title="Delete node"
          aria-label="Delete node"
        >
          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3" aria-hidden>
            <path d="M2 2l8 8M10 2L2 10" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Label */}
        <Field label="Label">
          <input
            className={inputCls}
            value={n.label}
            onChange={e => updateLabel(e.target.value)}
            placeholder="Node label"
          />
        </Field>

        {/* Trigger config */}
        {n.type === "trigger" && (
          <Field label="Trigger type">
            <select
              className={selectCls}
              value={n.data.triggerType ?? "form"}
              onChange={e => update({ triggerType: e.target.value as never })}
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%2371717a' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center", backgroundSize: "10px" }}
            >
              <option value="form">Form submission</option>
              <option value="webhook">Incoming webhook</option>
              <option value="schedule">Schedule / cron</option>
              <option value="email">Email received</option>
              <option value="api">API call</option>
            </select>
          </Field>
        )}

        {/* Employee config */}
        {n.type === "employee" && (
          <>
            <Field label="Employee name">
              <input className={inputCls} value={n.data.employeeName ?? ""} onChange={e => update({ employeeName: e.target.value })} placeholder="e.g. Sarah" />
            </Field>
            <Field label="Role">
              <select
                className={selectCls}
                value={n.data.employeeRole ?? "support"}
                onChange={e => update({ employeeRole: e.target.value })}
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%2371717a' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center", backgroundSize: "10px" }}
              >
                {["support","sales","content","seo","email","operations","custom"].map(r => (
                  <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                ))}
              </select>
            </Field>
          </>
        )}

        {/* Knowledge config */}
        {n.type === "knowledge" && (
          <Field label="Knowledge source">
            <input className={inputCls} value={n.data.knowledgeName ?? ""} onChange={e => update({ knowledgeName: e.target.value })} placeholder="e.g. Support Docs" />
          </Field>
        )}

        {/* Condition config */}
        {n.type === "condition" && (
          <>
            <Field label="Condition expression">
              <input className={inputCls} value={n.data.conditionExpr ?? ""} onChange={e => update({ conditionExpr: e.target.value })} placeholder="e.g. score > 7" />
            </Field>
            <Field label="True branch label">
              <input className={inputCls} value={n.data.trueLabel ?? "Yes"} onChange={e => update({ trueLabel: e.target.value })} placeholder="Yes" />
            </Field>
            <Field label="False branch label">
              <input className={inputCls} value={n.data.falseLabel ?? "No"} onChange={e => update({ falseLabel: e.target.value })} placeholder="No" />
            </Field>
          </>
        )}

        {/* Action config */}
        {n.type === "action" && (
          <>
            <Field label="Action type">
              <select
                className={selectCls}
                value={n.data.actionType ?? "email"}
                onChange={e => update({ actionType: e.target.value as never })}
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%2371717a' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center", backgroundSize: "10px" }}
              >
                <option value="email">Send email</option>
                <option value="slack">Post to Slack</option>
                <option value="crm">Create CRM record</option>
                <option value="webhook">Call webhook</option>
                <option value="sms">Send SMS</option>
              </select>
            </Field>
            <Field label="Target / details">
              <input className={inputCls} value={n.data.actionLabel ?? ""} onChange={e => update({ actionLabel: e.target.value })} placeholder="e.g. #channel, email@..." />
            </Field>
          </>
        )}

        {/* Delay config */}
        {n.type === "delay" && (
          <>
            <Field label="Delay amount">
              <input className={inputCls} type="number" min={1} value={n.data.delayValue ?? 1} onChange={e => update({ delayValue: Number(e.target.value) })} />
            </Field>
            <Field label="Unit">
              <select
                className={selectCls}
                value={n.data.delayUnit ?? "hours"}
                onChange={e => update({ delayUnit: e.target.value as never })}
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%2371717a' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center", backgroundSize: "10px" }}
              >
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
              </select>
            </Field>
          </>
        )}

        {/* Connected edges */}
        {nodeEdges.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">Connections ({nodeEdges.length})</p>
            <div className="flex flex-col gap-1">
              {nodeEdges.map(edge => (
                <div key={edge.id} className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-surface-elevated border border-border text-[10px]">
                  <span className="text-text-muted truncate">
                    {edge.source === node.id ? `→ ${edge.target}` : `← ${edge.source}`}
                    {edge.label && <span className="text-accent ml-1">({edge.label})</span>}
                  </span>
                  <button
                    onClick={() => onDeleteEdge(edge.id)}
                    className="w-4 h-4 flex items-center justify-center text-text-muted hover:text-danger transition-colors shrink-0"
                    aria-label="Remove connection"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
