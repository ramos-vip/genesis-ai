/**
 * Billing Provider Interface
 *
 * Abstracts payment processing behind a single interface.
 * Switch providers by changing BILLING_PROVIDER in .env.local:
 *
 *   BILLING_PROVIDER=mock    (default — no keys needed)
 *   BILLING_PROVIDER=stripe  (requires STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET)
 *   BILLING_PROVIDER=iyzico  (requires IYZICO_API_KEY, IYZICO_SECRET_KEY)
 *
 * Adding a new provider:
 *   1. Create src/server/billing/stripe.ts implementing BillingProvider
 *   2. Add the case in getBillingProvider()
 *   3. Set env vars — zero other changes
 */

/* ─── Plan definitions (source of truth) ─────────────────────────────────── */

export type PlanId = "free" | "pro" | "business";

export interface PlanLimits {
  employees:         number;  // -1 = unlimited
  knowledgeSources:  number;
  messagesPerMonth:  number;
  storageMb:         number;
  apiAccess:         boolean;
  embeddingModels:   number;
  supportTier:       "community" | "email" | "priority";
}

export interface Plan {
  id:          PlanId;
  name:        string;
  description: string;
  price: {
    monthly: number; // USD
    annual:  number; // USD per month (billed annually)
  };
  limits:      PlanLimits;
  highlighted?: boolean;
}

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id:   "free",
    name: "Starter",
    description: "Perfect for exploring Genesis AI and deploying your first AI employee.",
    price: { monthly: 0, annual: 0 },
    limits: {
      employees:        3,
      knowledgeSources: 5,
      messagesPerMonth: 1_000,
      storageMb:        50,
      apiAccess:        false,
      embeddingModels:  1,
      supportTier:      "community",
    },
  },
  pro: {
    id:   "pro",
    name: "Pro",
    description: "For growing teams that need more AI employees and higher message limits.",
    price: { monthly: 49, annual: 39 },
    highlighted: true,
    limits: {
      employees:        20,
      knowledgeSources: 100,
      messagesPerMonth: 50_000,
      storageMb:        5_000,
      apiAccess:        true,
      embeddingModels:  3,
      supportTier:      "email",
    },
  },
  business: {
    id:   "business",
    name: "Business",
    description: "Unlimited scale for enterprises running their full AI workforce.",
    price: { monthly: 199, annual: 159 },
    limits: {
      employees:        -1,
      knowledgeSources: -1,
      messagesPerMonth: 500_000,
      storageMb:        50_000,
      apiAccess:        true,
      embeddingModels:  10,
      supportTier:      "priority",
    },
  },
};

/* ─── Subscription ────────────────────────────────────────────────────────── */

export interface Subscription {
  planId:            PlanId;
  status:            "active" | "trialing" | "past_due" | "canceled";
  currentPeriodEnd:  string; // ISO
  cancelAtPeriodEnd: boolean;
  customerId?:       string;
}

/* ─── Invoice ─────────────────────────────────────────────────────────────── */

export interface Invoice {
  id:        string;
  date:      string; // ISO
  amount:    number; // USD cents
  status:    "paid" | "open" | "void";
  pdfUrl?:   string;
}

/* ─── Provider interface ──────────────────────────────────────────────────── */

export interface BillingProvider {
  readonly name: string;
  getSubscription(clerkUserId: string): Promise<Subscription>;
  getInvoices(clerkUserId: string): Promise<Invoice[]>;
  /** Returns a URL to the hosted checkout page */
  createCheckoutUrl(clerkUserId: string, planId: PlanId): Promise<string>;
  /** Returns a URL to the customer portal (manage plan/payment method) */
  createPortalUrl(clerkUserId: string): Promise<string>;
}

/* ─── Factory ─────────────────────────────────────────────────────────────── */

let _provider: BillingProvider | null = null;

export function getBillingProvider(): BillingProvider {
  if (_provider) return _provider;

  const name = process.env.BILLING_PROVIDER ?? "mock";

  switch (name) {
    case "mock": {
      const { MockBillingProvider } = require("./mock") as typeof import("./mock");
      _provider = new MockBillingProvider();
      return _provider;
    }
    // case "stripe": {
    //   const { StripeBillingProvider } = require("./stripe");
    //   _provider = new StripeBillingProvider(process.env.STRIPE_SECRET_KEY!);
    //   return _provider;
    // }
    // case "iyzico": {
    //   const { IyzicoBillingProvider } = require("./iyzico");
    //   _provider = new IyzicoBillingProvider(process.env.IYZICO_API_KEY!, process.env.IYZICO_SECRET_KEY!);
    //   return _provider;
    // }
    default:
      throw new Error(`Unknown billing provider: "${name}". Set BILLING_PROVIDER in .env.local.`);
  }
}
