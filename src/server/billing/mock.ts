/**
 * Mock Billing Provider
 *
 * Returns a Free-tier subscription with no invoices.
 * Active by default (BILLING_PROVIDER=mock).
 *
 * Replace with StripeBillingProvider or IyzicoBillingProvider when ready.
 */

import type { BillingProvider, Subscription, Invoice, PlanId } from "./provider";

export class MockBillingProvider implements BillingProvider {
  readonly name = "mock";

  async getSubscription(_clerkUserId: string): Promise<Subscription> {
    return {
      planId:            "free",
      status:            "active",
      currentPeriodEnd:  new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      cancelAtPeriodEnd: false,
    };
  }

  async getInvoices(_clerkUserId: string): Promise<Invoice[]> {
    return []; // Free plan — no invoices
  }

  async createCheckoutUrl(_clerkUserId: string, _planId: PlanId): Promise<string> {
    // Real implementation: create a Stripe/Iyzico checkout session and return the URL
    return "#upgrade";
  }

  async createPortalUrl(_clerkUserId: string): Promise<string> {
    return "#portal";
  }
}
