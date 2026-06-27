import type { ID } from "@/shared/types";
import type { EmployeeRole } from "@/modules/employees";

export type AnalyticsPeriod = "7d" | "30d" | "90d" | "1y" | "custom";

export interface MetricValue {
  value:  number;
  change: number; // percentage change vs previous period
  trend:  "up" | "down" | "flat";
}

export interface OverviewMetrics {
  tasksCompleted:    MetricValue;
  activeEmployees:   MetricValue;
  avgResponseTime:   MetricValue;
  successRate:       MetricValue;
  costSaved:         MetricValue;
  automationRuns:    MetricValue;
}

export interface TimeSeriesPoint {
  date:  string;
  value: number;
}

export interface EmployeeAnalytics {
  employeeId:    ID;
  role:          EmployeeRole;
  tasks:         TimeSeriesPoint[];
  successRate:   number;
  avgDuration:   number;
  topCategories: { label: string; count: number }[];
}

export interface AnalyticsDashboard {
  period:   AnalyticsPeriod;
  overview: OverviewMetrics;
  tasksByDay: TimeSeriesPoint[];
  byEmployee: EmployeeAnalytics[];
}
