/**
 * Workflow Runtime Types
 *
 * These types represent a single execution (run) of a workflow.
 * They are independent of the workflow definition — a workflow can have many runs.
 *
 * Future extension points:
 *   - Add webhookUrl to TriggerPayload for real webhook support
 *   - Add gmailMessageId, slackTs, shopifyOrderId etc. to ActionOutput
 *   - Add externalProvider to NodeResult for provider-specific metadata
 */

/* ─── Execution context ───────────────────────────────────────────────────── */

/** Shared mutable context threaded through every node execution */
export interface ExecutionContext {
  runId:      string;
  workflowId: string;
  /** Payload from the trigger that started this run */
  trigger:    Record<string, unknown>;
  /** Accumulated outputs from all prior nodes — writable by each node */
  variables:  Record<string, unknown>;
}

/* ─── Node result ─────────────────────────────────────────────────────────── */

export type NodeResultStatus = "pending" | "running" | "success" | "failed" | "skipped";

export interface NodeResult {
  nodeId:   string;
  nodeType: string;
  label:    string;
  status:   NodeResultStatus;
  /** Data produced by this node, merged into ExecutionContext.variables */
  output:   Record<string, unknown>;
  error?:   string;
  /** Wall-clock milliseconds */
  duration: number;
  /** Human-readable log lines for the inspector */
  logs:     string[];
  /** Which branch was taken (condition nodes only) */
  branch?:  "yes" | "no";
}

/* ─── Run ─────────────────────────────────────────────────────────────────── */

export type RunStatus = "pending" | "running" | "completed" | "failed" | "cancelled";

export interface WorkflowRun {
  id:          string;
  workflowId:  string;
  workflowName:string;
  status:      RunStatus;
  startedAt:   string;
  endedAt?:    string;
  /** Total wall-clock duration (endedAt - startedAt) in ms */
  durationMs?: number;
  trigger:     Record<string, unknown>;
  results:     NodeResult[];
  /** Workflow-level log (errors, warnings) */
  logs:        string[];
  /** Simulated — real implementations would set this */
  simulatedAt: true;
}

/* ─── Trigger payloads (future providers) ─────────────────────────────────── */

export interface FormTriggerPayload     { name: string; email: string; company?: string; message?: string }
export interface WebhookTriggerPayload  { event: string; data: Record<string, unknown> }
export interface EmailTriggerPayload    { from: string; subject: string; body: string }
export interface ScheduleTriggerPayload { scheduledAt: string; timezone: string }
export interface OrderTriggerPayload    { orderId: string; amount: number; customer: string; items: number }

export type TriggerPayload =
  | FormTriggerPayload
  | WebhookTriggerPayload
  | EmailTriggerPayload
  | ScheduleTriggerPayload
  | OrderTriggerPayload;

/* ─── Action output envelopes (future providers) ──────────────────────────── */

export interface EmailActionOutput  { sent: boolean; to: string; subject: string; messageId?: string }
export interface SlackActionOutput  { posted: boolean; channel: string; ts?: string }
export interface CRMActionOutput    { created: boolean; recordId: string; type: "contact" | "deal" | "ticket" }
export interface WebhookActionOutput{ called: boolean; statusCode: number; responseMs: number }
