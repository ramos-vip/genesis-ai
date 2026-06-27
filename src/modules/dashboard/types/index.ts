import type { OverviewMetrics, TimeSeriesPoint } from "@/modules/analytics";
import type { Employee } from "@/modules/employees";
import type { WorkflowRun } from "@/modules/automation";

export interface DashboardData {
  metrics:    OverviewMetrics;
  taskChart:  TimeSeriesPoint[];
  topEmployees: Pick<Employee, "id" | "name" | "role" | "stats">[];
  recentRuns: WorkflowRun[];
}

export interface ActivityItem {
  id:        string;
  type:      "task_completed" | "employee_activated" | "workflow_run" | "knowledge_added";
  actor:     string;
  message:   string;
  timestamp: string;
  meta?:     Record<string, string>;
}
