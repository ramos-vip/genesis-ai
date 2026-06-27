import type { ID, Timestamps } from "@/shared/types";

export type TriggerType  = "schedule" | "webhook" | "event" | "manual";
export type ActionType   = "employee_task" | "notification" | "api_call" | "condition";
export type WorkflowStatus = "active" | "paused" | "draft" | "error";

export interface WorkflowTrigger {
  type:     TriggerType;
  config:   Record<string, unknown>;
}

export interface WorkflowAction {
  id:     ID;
  type:   ActionType;
  name:   string;
  config: Record<string, unknown>;
  /** Next action id. Null = end of workflow. */
  next?:  ID | null;
}

export interface WorkflowRun extends Timestamps {
  id:         ID;
  workflowId: ID;
  status:     "running" | "success" | "failed" | "cancelled";
  durationMs: number;
  triggeredBy: TriggerType | "manual";
  error?:     string;
}

export interface Workflow extends Timestamps {
  id:             ID;
  name:           string;
  description?:   string;
  status:         WorkflowStatus;
  organizationId: ID;
  trigger:        WorkflowTrigger;
  actions:        WorkflowAction[];
  runCount:       number;
  lastRunAt?:     string;
  lastRunStatus?: WorkflowRun["status"];
}

export type CreateWorkflowDto = Pick<Workflow, "name" | "description" | "trigger" | "actions">;
