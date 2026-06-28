/**
 * Node Executors — Simulated
 *
 * Every executor:
 *   - Receives the node definition + shared ExecutionContext
 *   - Returns a structured NodeResult
 *   - Merges its output into ctx.variables for downstream nodes
 *
 * Simulation strategy:
 *   - Artificial delays mimic real network latency
 *   - Responses are realistic but deterministic enough to demo well
 *   - All executors are async so swapping in real APIs requires no interface changes
 *
 * Future provider integration:
 *   - Replace the `simulate*` functions with real API calls
 *   - Add provider config (apiKey, endpoint) to ExecutionContext or node.data
 */

import type { WorkflowNode, WorkflowNodeData } from "../types";
import type { ExecutionContext, NodeResult } from "./types";

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function result(
  partial: Partial<NodeResult> & Pick<NodeResult, "output" | "logs">
): Omit<NodeResult, "nodeId" | "nodeType" | "label" | "duration"> {
  return {
    status:   "success",
    error:    undefined,
    branch:   undefined,
    ...partial,
  };
}

/* ─── Simple expression evaluator for Condition nodes ─────────────────────── */

function evalCondition(expr: string, vars: Record<string, unknown>): boolean {
  try {
    // Replace known variable names with their string values
    const hydrated = expr.replace(/\b([a-z_][a-z0-9_]*)\b/gi, (match) =>
      vars[match] !== undefined ? JSON.stringify(vars[match]) : match
    );
    // Safe eval for simple comparisons (simulation only — never used with real user input)
    // eslint-disable-next-line no-new-func
    return Boolean(new Function(`"use strict"; return (${hydrated})`)());
  } catch {
    // If evaluation fails, choose randomly to ensure both branches get tested
    return Math.random() > 0.5;
  }
}

/* ─── AI response simulation ──────────────────────────────────────────────── */

const AI_RESPONSES: Record<string, string[]> = {
  sales: [
    "Lead qualified. Company: Acme Corp (50+ employees). Budget: confirmed. Timeline: Q3. Score: 8/10. Recommend: schedule discovery call within 24hrs.",
    "Initial analysis complete. This lead matches our ICP for mid-market SaaS. Pain point: manual support workflows. Personalized outreach sent. Awaiting response.",
  ],
  support: [
    "Ticket resolved. Root cause: API rate limit exceeded during peak hours. Fix provided: implement exponential backoff. Documentation link sent.",
    "Customer issue identified as billing cycle confusion. Explanation email drafted and sent. Escalation not required. CSAT survey queued for 48hrs.",
  ],
  content: [
    "Blog post draft complete: 'How AI Transforms Customer Support' — 1,200 words, SEO-optimized, includes 3 case studies. Ready for review.",
    "LinkedIn post created. Hook: '87% of support tickets can be automated. Here's how.' Engagement prediction: above-average. Scheduled for 9 AM Tuesday.",
  ],
  operations: [
    "Daily digest compiled: 3 action items outstanding, 1 blocker (awaiting design), 7 tasks closed. Team velocity: on track. Report delivered to #ops-daily.",
    "Meeting summary: Q3 roadmap approved, hiring frozen for 60 days, customer success SLA updated to 4hr response. Action items assigned to 4 owners.",
  ],
  default: [
    "Task processed successfully. Output ready for next step.",
    "Analysis complete. Proceeding with recommended action based on context.",
  ],
};

function getAIResponse(role: string, ctx: ExecutionContext): string {
  const responses = AI_RESPONSES[role] ?? AI_RESPONSES.default;
  // Deterministic choice based on trigger to make repeated runs consistent
  const key = JSON.stringify(ctx.trigger);
  const idx = Math.abs(key.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % responses.length;
  return responses[idx];
}

/* ─── Node executors ──────────────────────────────────────────────────────── */

export async function executeTrigger(
  node: WorkflowNode,
  ctx:  ExecutionContext
): Promise<Omit<NodeResult, "nodeId" | "nodeType" | "label" | "duration">> {
  await delay(30 + Math.random() * 50);
  const triggerType = node.data.triggerType ?? "form";
  return result({
    output: { ...ctx.trigger, triggerType, received: true },
    logs:   [
      `[TRIGGER] Type: ${triggerType}`,
      `[TRIGGER] Payload keys: ${Object.keys(ctx.trigger).join(", ")}`,
      `[TRIGGER] Workflow execution started at ${new Date().toISOString()}`,
    ],
  });
}

export async function executeEmployee(
  node: WorkflowNode,
  ctx:  ExecutionContext
): Promise<Omit<NodeResult, "nodeId" | "nodeType" | "label" | "duration">> {
  const role     = node.data.employeeRole ?? "default";
  const name     = node.data.employeeName ?? "AI Employee";
  const thinkMs  = 400 + Math.random() * 800;
  await delay(thinkMs);

  const response = getAIResponse(role, ctx);
  const score    = 5 + Math.floor(Math.random() * 5); // 5–9 out of 10

  return result({
    output: {
      response,
      score,
      qualified: score >= 7,
      employeeName: name,
      thinkTimeMs: Math.round(thinkMs),
    },
    logs: [
      `[EMPLOYEE] ${name} (${role}) activated`,
      `[EMPLOYEE] Context loaded: ${Object.keys(ctx.variables).length} variables`,
      `[EMPLOYEE] Inference complete in ${Math.round(thinkMs)}ms`,
      `[EMPLOYEE] Score assigned: ${score}/10`,
      `[EMPLOYEE] Response: "${response.slice(0, 80)}…"`,
    ],
  });
}

export async function executeKnowledge(
  node: WorkflowNode,
  ctx:  ExecutionContext
): Promise<Omit<NodeResult, "nodeId" | "nodeType" | "label" | "duration">> {
  await delay(80 + Math.random() * 120);
  const sourceName = node.data.knowledgeName ?? "Knowledge Base";
  const chunks     = 2 + Math.floor(Math.random() * 3);

  return result({
    output: {
      sourceName,
      chunksRetrieved: chunks,
      topRelevance: 0.87 + Math.random() * 0.12,
      excerpts: [`[Chunk 1] Most relevant content from ${sourceName}…`, `[Chunk 2] Supporting context from ${sourceName}…`],
    },
    logs: [
      `[KNOWLEDGE] Source: ${sourceName}`,
      `[KNOWLEDGE] Query: "${JSON.stringify(ctx.trigger).slice(0, 40)}…"`,
      `[KNOWLEDGE] Retrieved ${chunks} chunks via semantic search`,
      `[KNOWLEDGE] Top relevance score: ${(0.87 + Math.random() * 0.12).toFixed(2)}`,
    ],
  });
}

export async function executeCondition(
  node: WorkflowNode,
  ctx:  ExecutionContext
): Promise<Omit<NodeResult, "nodeId" | "nodeType" | "label" | "duration">> {
  await delay(10 + Math.random() * 30);
  const expr     = node.data.conditionExpr ?? "true";
  const passed   = evalCondition(expr, ctx.variables);
  const branch   = passed ? "yes" : "no";
  const branchLbl = passed ? (node.data.trueLabel ?? "Yes") : (node.data.falseLabel ?? "No");

  return result({
    status: "success",
    branch,
    output: { branch, passed, expression: expr, branchLabel: branchLbl },
    logs: [
      `[CONDITION] Expression: "${expr}"`,
      `[CONDITION] Evaluated variables: ${JSON.stringify(
        Object.fromEntries(Object.entries(ctx.variables).map(([k, v]) => [k, typeof v === "string" && v.length > 30 ? v.slice(0, 30) + "…" : v]))
      ).slice(0, 80)}`,
      `[CONDITION] Result: ${passed ? "TRUE" : "FALSE"} → taking "${branchLbl}" branch`,
    ],
  });
}

export async function executeAction(
  node: WorkflowNode,
  ctx:  ExecutionContext
): Promise<Omit<NodeResult, "nodeId" | "nodeType" | "label" | "duration">> {
  const actionType = node.data.actionType ?? "email";
  const target     = node.data.actionLabel ?? "default";
  const latency    = 60 + Math.random() * 140;
  await delay(latency);

  const outputs: Record<string, unknown> = { actionType, target, success: true };
  const logs: string[] = [`[ACTION] Type: ${actionType}`, `[ACTION] Target: ${target}`];

  switch (actionType) {
    case "email":
      outputs.messageId    = `msg_${Date.now().toString(36)}`;
      outputs.deliveredAt  = new Date().toISOString();
      logs.push(`[ACTION] Email queued → ${target} (messageId: ${outputs.messageId})`);
      logs.push("[ACTION] Delivery estimated: <2 minutes");
      break;
    case "slack":
      outputs.ts      = `${Date.now() / 1000}`;
      outputs.channel = target;
      logs.push(`[ACTION] Slack message posted to ${target}`);
      logs.push(`[ACTION] Message timestamp: ${outputs.ts}`);
      break;
    case "crm":
      outputs.recordId  = `rec_${Date.now().toString(36)}`;
      outputs.recordType= "contact";
      logs.push(`[ACTION] CRM record created: ${outputs.recordId}`);
      logs.push(`[ACTION] Provider: HubSpot (simulated)`);
      break;
    case "webhook":
      outputs.statusCode  = 200;
      outputs.responseMs  = Math.round(latency);
      logs.push(`[ACTION] Webhook called → ${target}`);
      logs.push(`[ACTION] Response: 200 OK in ${Math.round(latency)}ms`);
      break;
    case "sms":
      outputs.sid     = `SM_${Date.now().toString(36).toUpperCase()}`;
      outputs.status  = "queued";
      logs.push(`[ACTION] SMS queued to ${target} (SID: ${outputs.sid})`);
      break;
  }

  // Update context so downstream nodes can reference this action's output
  ctx.variables[`action_${actionType}`] = outputs;

  return result({ output: outputs, logs });
}

export async function executeDelay(
  node: WorkflowNode,
  _ctx: ExecutionContext
): Promise<Omit<NodeResult, "nodeId" | "nodeType" | "label" | "duration">> {
  // Simulate delay — don't actually wait in the execution UI
  const value = node.data.delayValue ?? 1;
  const unit  = node.data.delayUnit  ?? "hours";
  await delay(50); // visual pause only

  return result({
    output: { delayed: true, configuredDelay: `${value} ${unit}`, simulatedOnly: true },
    logs: [
      `[DELAY] Configured: ${value} ${unit}`,
      `[DELAY] Simulation: delay skipped — would pause ${value} ${unit} in production`,
      `[DELAY] Resumption timestamp set for: +${value} ${unit}`,
    ],
  });
}

export async function executeEnd(
  _node: WorkflowNode,
  ctx:  ExecutionContext
): Promise<Omit<NodeResult, "nodeId" | "nodeType" | "label" | "duration">> {
  await delay(20);
  return result({
    output: { completed: true, finalVariables: Object.keys(ctx.variables).length },
    logs: [
      `[END] Workflow branch completed`,
      `[END] Final context: ${Object.keys(ctx.variables).length} variables`,
      `[END] Run ID: ${ctx.runId}`,
    ],
  });
}

/* ─── Executor map ────────────────────────────────────────────────────────── */

export const NODE_EXECUTORS: Record<string, (node: WorkflowNode, ctx: ExecutionContext) => Promise<Omit<NodeResult, "nodeId" | "nodeType" | "label" | "duration">>> = {
  trigger:   executeTrigger,
  employee:  executeEmployee,
  knowledge: executeKnowledge,
  condition: executeCondition,
  action:    executeAction,
  delay:     executeDelay,
  end:       executeEnd,
};
