import type { EmployeeRole } from "@/modules/employees/types";

export type TemplateCategory =
  | "customer_support" | "sales"       | "marketing"   | "hr"
  | "operations"       | "finance"     | "hospitality" | "ecommerce"
  | "healthcare"       | "education";

export const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  customer_support: "Customer Support",
  sales:            "Sales",
  marketing:        "Marketing",
  hr:               "HR",
  operations:       "Operations",
  finance:          "Finance",
  hospitality:      "Hospitality",
  ecommerce:        "E-commerce",
  healthcare:       "Healthcare",
  education:        "Education",
};

export interface ExampleConversation {
  user: string;
  ai:   string;
}

export interface MarketplaceTemplate {
  id:                      string;
  name:                    string;
  role:                    EmployeeRole;
  category:                TemplateCategory;
  description:             string;
  longDescription:         string;
  tags:                    string[];
  avatar: {
    initials: string;
    gradient: string;
  };
  defaultPrompt:           string;
  temperature:             number;    // 0.0–1.0
  difficulty:              "Beginner" | "Intermediate" | "Advanced";
  featured:                boolean;
  isNew:                   boolean;
  installCount:            number;
  estimatedConversations:  number;    // per month
  recommendedKnowledge:    string[];
  capabilities:            string[];
  limitations:             string[];
  exampleConversations:    ExampleConversation[];
}
