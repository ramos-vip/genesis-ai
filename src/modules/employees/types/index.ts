import type { ID, ISODate, Timestamps } from "@/shared/types";

export type EmployeeRole =
  | "support"
  | "sales"
  | "seo"
  | "content"
  | "email"
  | "operations"
  | "custom";

export type EmployeeStatus = "active" | "paused" | "training" | "error" | "draft";

export interface EmployeeConfig {
  toneOfVoice:     "professional" | "friendly" | "concise" | "custom";
  customTone?:     string;
  language:        string;
  responseMaxLength?: number;
  escalationRules: EscalationRule[];
}

export interface EscalationRule {
  trigger:  string;
  action:   "email" | "slack" | "webhook";
  target:   string;
}

export interface EmployeeStats {
  tasksCompleted:  number;
  tasksToday:      number;
  avgResponseTime: number;
  successRate:     number;
}

export interface Employee extends Timestamps {
  id:             ID;
  name:           string;
  role:           EmployeeRole;
  status:         EmployeeStatus;
  description:    string;
  organizationId: ID;
  config:         EmployeeConfig;
  stats:          EmployeeStats;
  knowledgeIds:   ID[];
  automationIds:  ID[];
  avatar?:        string;
}

/** Data required to create an employee */
export interface CreateEmployeeDto {
  name:             string;
  role:             EmployeeRole;
  description:      string;
  knowledgeSources: string[];
}

export type UpdateEmployeeDto = Partial<CreateEmployeeDto & { status: EmployeeStatus }>;

/** Wizard state data shape */
export interface WizardData {
  name:             string;
  role:             EmployeeRole | "";
  description:      string;
  knowledgeSources: string[];
}

export const INITIAL_WIZARD_DATA: WizardData = {
  name:             "",
  role:             "",
  description:      "",
  knowledgeSources: [],
};
