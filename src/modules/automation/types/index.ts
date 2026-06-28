export type NodeType =
  | "trigger"
  | "employee"
  | "knowledge"
  | "condition"
  | "action"
  | "delay"
  | "end";

export type WorkflowStatus = "draft" | "active" | "paused";

export interface WorkflowNodeData {
  // trigger
  triggerType?: "form" | "webhook" | "schedule" | "email" | "api";
  // employee
  employeeRole?: string;
  employeeName?: string;
  // knowledge
  knowledgeName?: string;
  // condition
  conditionExpr?: string;
  trueLabel?:     string;
  falseLabel?:    string;
  // action
  actionType?: "email" | "slack" | "crm" | "webhook" | "sms";
  actionLabel?: string;
  // delay
  delayValue?:  number;
  delayUnit?:   "minutes" | "hours" | "days";
}

export interface WorkflowNode {
  id:       string;
  type:     NodeType;
  position: { x: number; y: number };
  label:    string;
  data:     WorkflowNodeData;
}

export interface WorkflowEdge {
  id:      string;
  source:  string;
  target:  string;
  /** "Yes" | "No" for condition branches */
  label?:  string;
  /** "yes" | "no" — controls which output handle is used */
  branch?: "yes" | "no";
}

export interface Workflow {
  id:          string;
  name:        string;
  description: string;
  nodes:       WorkflowNode[];
  edges:       WorkflowEdge[];
  status:      WorkflowStatus;
  createdAt:   string;
  updatedAt:   string;
}

/* ─── Node visual config ──────────────────────────────────────────────────── */

export const NODE_CONFIG: Record<NodeType, {
  label:       string;
  color:       string;
  bg:          string;
  border:      string;
  selectedRing: string;
  icon:        string; // emoji as simple icon for canvas
}> = {
  trigger:   { label: "Trigger",      color: "text-emerald-300", bg: "bg-emerald-600/15", border: "border-emerald-500/40", selectedRing: "ring-emerald-500/60", icon: "⚡" },
  employee:  { label: "AI Employee",  color: "text-violet-300",  bg: "bg-violet-600/15",  border: "border-violet-500/40",  selectedRing: "ring-violet-500/60",  icon: "✦" },
  knowledge: { label: "Knowledge",    color: "text-blue-300",    bg: "bg-blue-600/15",    border: "border-blue-500/40",    selectedRing: "ring-blue-500/60",    icon: "📚" },
  condition: { label: "Condition",    color: "text-yellow-300",  bg: "bg-yellow-600/15",  border: "border-yellow-500/40",  selectedRing: "ring-yellow-500/60",  icon: "⟨?" },
  action:    { label: "Action",       color: "text-orange-300",  bg: "bg-orange-600/15",  border: "border-orange-500/40",  selectedRing: "ring-orange-500/60",  icon: "▶" },
  delay:     { label: "Delay",        color: "text-zinc-300",    bg: "bg-zinc-600/15",    border: "border-zinc-500/40",    selectedRing: "ring-zinc-500/60",    icon: "⏱" },
  end:       { label: "End",          color: "text-red-300",     bg: "bg-red-600/15",     border: "border-red-500/40",     selectedRing: "ring-red-500/60",     icon: "⏹" },
};

export const NODE_W = 180;
export const NODE_H = 68;
