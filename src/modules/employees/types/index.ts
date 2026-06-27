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

export type ToneOfVoice = "professional" | "friendly" | "concise" | "custom";

export interface EmployeeConfig {
  toneOfVoice:        ToneOfVoice;
  customTone?:        string;
  language:           string;
  /** AI creativity / temperature: 0.0 (precise) – 1.0 (creative) */
  temperature:        number;
  /** System prompt injected before every conversation */
  systemInstructions: string;
  responseMaxLength?: number;
  escalationRules:    EscalationRule[];
}

export interface EscalationRule {
  trigger: string;
  action:  "email" | "slack" | "webhook";
  target:  string;
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

/** Partial update — config is deep-merged in the service */
export type UpdateEmployeeDto = Partial<
  Pick<Employee, "name" | "role" | "description" | "status"> & {
    config: Partial<EmployeeConfig>;
  }
>;

/** Wizard multi-step form data */
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

export const DEFAULT_EMPLOYEE_CONFIG: EmployeeConfig = {
  toneOfVoice:        "professional",
  language:           "en",
  temperature:        0.5,
  systemInstructions: "",
  escalationRules:    [],
};
