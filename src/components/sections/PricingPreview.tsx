import AnimateIn from "@/components/ui/AnimateIn";
import Button from "@/components/ui/Button";
import SectionHeader from "@/components/ui/SectionHeader";

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "Perfect for exploring Genesis and running your first AI employee.",
    features: [
      "1 AI employee",
      "1,000 tasks / month",
      "Email support",
      "Core integrations",
    ],
    cta: "Start for free",
    ctaVariant: "secondary" as const,
    featured: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/ month",
    description: "For growing teams that need more power and flexibility.",
    features: [
      "10 AI employees",
      "50,000 tasks / month",
      "Priority support",
      "All integrations",
      "Custom training",
      "Analytics dashboard",
    ],
    cta: "Get started",
    ctaVariant: "primary" as const,
    featured: true,
  },
  {
    name: "Scale",
    price: "$199",
    period: "/ month",
    description: "For enterprises that need unlimited scale and dedicated support.",
    features: [
      "Unlimited AI employees",
      "500,000 tasks / month",
      "Dedicated success manager",
      "Custom integrations",
      "SSO & SAML",
      "SLA guarantee",
    ],
    cta: "Contact sales",
    ctaVariant: "secondary" as const,
    featured: false,
  },
];

const checkIcon = (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="w-4 h-4 text-accent shrink-0"
  >
    <path d="M2 8l4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function PricingPreview() {
  return (
    <section id="pricing" className="py-24 sm:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <AnimateIn>
          <SectionHeader
            label="Pricing"
            title="Simple, transparent pricing"
            subtitle="Start free. Scale when you're ready. No hidden fees, ever."
          />
        </AnimateIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {plans.map((plan, i) => (
            <AnimateIn key={plan.name} delay={i * 80}>
              <div
                className={`relative h-full flex flex-col p-8 rounded-2xl border transition-all duration-300 ${
                  plan.featured
                    ? "border-accent/40 bg-accent/[0.04] shadow-[0_0_60px_rgba(124,58,237,0.08)]"
                    : "border-white/[0.06] bg-surface hover:border-white/[0.12]"
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-accent text-white">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <p className="text-sm font-semibold text-zinc-400 mb-1">{plan.name}</p>
                  <div className="flex items-end gap-1 mb-3">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    {plan.period && (
                      <span className="text-zinc-500 mb-1">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">{plan.description}</p>
                </div>

                <ul className="flex-1 space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 text-sm text-zinc-300">
                      {checkIcon}
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button variant={plan.ctaVariant} href="#" className="w-full">
                  {plan.cta}
                </Button>
              </div>
            </AnimateIn>
          ))}
        </div>

        <AnimateIn delay={200}>
          <p className="mt-10 text-center text-sm text-zinc-500">
            All plans include a 14-day free trial. No credit card required.{" "}
            <a href="#" className="text-accent hover:text-violet-400 transition-colors">
              See full feature comparison →
            </a>
          </p>
        </AnimateIn>
      </div>
    </section>
  );
}
