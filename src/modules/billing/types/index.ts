import type { ID, ISODate, Timestamps } from "@/shared/types";

export type PlanId       = "starter" | "pro" | "scale" | "enterprise";
export type BillingCycle = "monthly" | "annual";
export type InvoiceStatus = "paid" | "open" | "void" | "uncollectible";

export interface Plan {
  id:           PlanId;
  name:         string;
  price:        Record<BillingCycle, number>; // USD cents
  limits: {
    employees:   number | "unlimited";
    tasks:       number | "unlimited";
    knowledgeMb: number | "unlimited";
    seats:       number | "unlimited";
  };
  features:     string[];
}

export interface Subscription extends Timestamps {
  id:             ID;
  organizationId: ID;
  planId:         PlanId;
  status:         "active" | "trialing" | "past_due" | "canceled" | "paused";
  billingCycle:   BillingCycle;
  currentPeriodStart: ISODate;
  currentPeriodEnd:   ISODate;
  trialEndsAt?:       ISODate;
  cancelAtPeriodEnd:  boolean;
}

export interface Invoice extends Timestamps {
  id:             ID;
  organizationId: ID;
  status:         InvoiceStatus;
  amountDue:      number; // USD cents
  amountPaid:     number;
  currency:       string;
  periodStart:    ISODate;
  periodEnd:      ISODate;
  pdfUrl?:        string;
  hostedUrl?:     string;
}

export interface UsageRecord {
  metric:  "tasks" | "employees" | "knowledge_mb";
  used:    number;
  limit:   number | "unlimited";
  period:  { start: ISODate; end: ISODate };
}
