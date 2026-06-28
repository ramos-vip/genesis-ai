/**
 * Workflow Runtime Engine
 *
 * Executes a workflow definition against a trigger payload.
 *
 * Execution model:
 *   1. Find the trigger node
 *   2. Execute it, merge its output into ExecutionContext.variables
 *   3. Follow edges to the next node(s)
 *   4. For condition nodes, follow only the branch that matches the result
 *   5. Continue until reaching "end" nodes or no outgoing edges
 *
 * The engine is fully client-side for this sprint (simulation).
 * Moving to server-side execution (for webhooks, scheduling, etc.) requires:
 *   - Moving this file to src/server/automation/engine.ts
 *   - Adding a POST /api/workflows/[id]/run endpoint
 *   - Replacing node executors with real provider integrations
 *
 * The onNodeStart/onNodeComplete callbacks enable streaming UI updates.
 */

import type { Workflow, WorkflowNode } from "../types";
import type { ExecutionContext, WorkflowRun, NodeResult, TriggerPayload } from "./types";
import { NODE_EXECUTORS } from "./executors";

/* ─── Default trigger payloads ────────────────────────────────────────────── */

export const DEFAULT_TRIGGER_PAYLOADS: Record<string, TriggerPayload> = {
  form:     { name: "Alex Johnson", email: "alex@acmecorp.com", company: "Acme Corp", message: "We're interested in your Pro plan for our 30-person support team." } as TriggerPayload,
  webhook:  { event: "order.created", data: { orderId: "ORD-7841", amount: 499.99, customer: "alex@acmecorp.com", items: 3 } } as TriggerPayload,
  email:    { from: "alex@acmecorp.com", subject: "Re: Enterprise pricing", body: "Hi, following up on our conversation about Genesis AI. Can we schedule a demo?" } as TriggerPayload,
  schedule: { scheduledAt: new Date().toISOString(), timezone: "America/New_York" } as TriggerPayload,
  api:      { event: "api.call", data: { endpoint: "/api/trigger", method: "POST", body: { userId: "usr_abc123", event: "signup" } } } as TriggerPayload,
};

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function genId(): string {
  return `run_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

/* ─── Engine ──────────────────────────────────────────────────────────────── */

export interface RunCallbacks {
  /** Called when a node starts executing */
  onNodeStart:    (nodeId: string) => void;
  /** Called when a node finishes (success or failure) */
  onNodeComplete: (result: NodeResult) => void;
  /** Called when the entire run finishes */
  onRunComplete:  (run: WorkflowRun) => void;
}

export class WorkflowRuntime {
  private workflow: Workflow;
  private callbacks: RunCallbacks;

  constructor(workflow: Workflow, callbacks: RunCallbacks) {
    this.workflow  = workflow;
    this.callbacks = callbacks;
  }

  /** Start execution and return immediately. Progress via callbacks. */
  async execute(triggerPayload?: Partial<TriggerPayload>): Promise<WorkflowRun> {
    const wf    = this.workflow;
    const runId = genId();
    const trigger = {
      ...(DEFAULT_TRIGGER_PAYLOADS[wf.nodes.find(n => n.type === "trigger")?.data.triggerType ?? "form"] ?? {}),
      ...triggerPayload,
    } as Record<string, unknown>;

    const run: WorkflowRun = {
      id:           runId,
      workflowId:   wf.id,
      workflowName: wf.name,
      status:       "running",
      startedAt:    new Date().toISOString(),
      trigger,
      results:      [],
      logs:         [`[RUN] Started workflow "${wf.name}" (${wf.id})`, `[RUN] Trigger payload: ${JSON.stringify(trigger).slice(0, 100)}…`],
      simulatedAt:  true,
    };

    const ctx: ExecutionContext = {
      runId,
      workflowId: wf.id,
      trigger,
      variables:  {},
    };

    const startNode = wf.nodes.find(n => n.type === "trigger");
    if (!startNode) {
      run.status  = "failed";
      run.logs.push("[RUN] ERROR: No trigger node found in workflow");
      run.endedAt  = new Date().toISOString();
      run.durationMs = 0;
      this.callbacks.onRunComplete(run);
      return run;
    }

    try {
      await this.executeNode(startNode, ctx, run);
      run.status = run.results.some(r => r.status === "failed") ? "failed" : "completed";
    } catch (err) {
      run.status = "failed";
      run.logs.push(`[RUN] FATAL: ${err instanceof Error ? err.message : "Unknown error"}`);
    }

    run.endedAt   = new Date().toISOString();
    run.durationMs = new Date(run.endedAt).getTime() - new Date(run.startedAt).getTime();
    run.logs.push(`[RUN] Completed in ${run.durationMs}ms — status: ${run.status}`);

    this.callbacks.onRunComplete(run);
    return run;
  }

  private async executeNode(
    node: WorkflowNode,
    ctx:  ExecutionContext,
    run:  WorkflowRun,
    depth = 0
  ): Promise<void> {
    if (depth > 50) {
      run.logs.push(`[RUN] WARNING: Maximum execution depth reached at node ${node.id}`);
      return;
    }

    // Signal UI that this node is starting
    this.callbacks.onNodeStart(node.id);

    const executor = NODE_EXECUTORS[node.type];
    const startMs  = Date.now();

    let partial: Awaited<ReturnType<typeof executor>>;
    try {
      partial = await executor(node, ctx);
    } catch (err) {
      partial = {
        status: "failed",
        output: {},
        error:  err instanceof Error ? err.message : "Executor threw",
        logs:   [`[${node.type.toUpperCase()}] FATAL: ${err instanceof Error ? err.message : "Unknown error"}`],
      };
    }

    const nodeResult: NodeResult = {
      nodeId:   node.id,
      nodeType: node.type,
      label:    node.label,
      duration: Date.now() - startMs,
      status:   partial.status ?? "success",
      output:   partial.output,
      error:    partial.error,
      logs:     partial.logs,
      branch:   partial.branch,
    };

    // Merge outputs into context for downstream nodes
    Object.assign(ctx.variables, nodeResult.output);

    run.results.push(nodeResult);
    this.callbacks.onNodeComplete(nodeResult);

    if (nodeResult.status === "failed") return;

    // Resolve next node(s)
    const outEdges = this.workflow.edges.filter(e => e.source === node.id);

    if (node.type === "condition") {
      // Follow only the matching branch
      const branch     = nodeResult.branch;
      const branchEdge = outEdges.find(e => e.branch === branch);
      if (branchEdge) {
        const next = this.workflow.nodes.find(n => n.id === branchEdge.target);
        if (next) await this.executeNode(next, ctx, run, depth + 1);
      }
    } else {
      // Sequential: follow all outgoing edges
      for (const edge of outEdges) {
        const next = this.workflow.nodes.find(n => n.id === edge.target);
        if (next) await this.executeNode(next, ctx, run, depth + 1);
      }
    }
  }
}
