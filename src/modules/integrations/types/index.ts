export type IntegrationCategory =
  | "communication"
  | "commerce"
  | "crm"
  | "productivity"
  | "accounting"
  | "developer";

export const CATEGORY_LABELS: Record<IntegrationCategory, string> = {
  communication: "Communication",
  commerce:      "Commerce",
  crm:           "CRM",
  productivity:  "Productivity",
  accounting:    "Accounting",
  developer:     "Developer",
};

export type AuthType = "oauth" | "api_key" | "webhook" | "basic";
export type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";
export type Environment = "production" | "sandbox";

export interface AuthField {
  key:         string;
  label:       string;
  type:        "text" | "password" | "url" | "select";
  placeholder?: string;
  required:     boolean;
  options?:    string[];
}

export interface Integration {
  id:          string;
  name:        string;
  description: string;
  longDesc:    string;
  category:    IntegrationCategory;
  authType:    AuthType;
  icon:        string;         // emoji
  color:       string;         // Tailwind gradient
  iconBg:      string;         // bg color class
  popular?:    boolean;
  isNew?:      boolean;
  features:    string[];
  authFields:  AuthField[];
  docsUrl?:    string;
  region?:     string;         // e.g. "Turkey" for regional integrations
}

/** Connection state stored per integration in localStorage */
export interface IntegrationConnection {
  status:      ConnectionStatus;
  config:      Record<string, string>;
  environment: Environment;
  connectedAt?: string;
  error?:      string;
}
