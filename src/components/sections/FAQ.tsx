import AnimateIn from "@/components/ui/AnimateIn";
import SectionHeader from "@/components/ui/SectionHeader";
import FAQList from "@/components/ui/FAQList";
import { ROUTES } from "@/shared/constants";

const faqs = [
  {
    question: "What is Project Genesis?",
    answer:
      "Project Genesis is an AI workforce platform that lets you create, deploy, and manage AI employees for sales, support, content, SEO, email, and operations — all from one dashboard. Each AI is purpose-built for its role and continuously improves over time.",
  },
  {
    question: "How quickly can I get started?",
    answer:
      "You can have your first AI employee deployed in under 5 minutes. No coding required. Just sign up, pick a role, configure your preferences, and your AI starts working immediately. Most teams see results within the first 24 hours.",
  },
  {
    question: "Can I customize my AI employees?",
    answer:
      "Absolutely. Each AI employee can be fine-tuned with your brand voice, tone guidelines, business rules, and specific workflows. You can upload documents, past examples, and custom instructions. Your AI learns from every interaction.",
  },
  {
    question: "What integrations are available?",
    answer:
      "We integrate with Slack, Salesforce, HubSpot, Gmail, Google Analytics, Shopify, Notion, Linear, Jira, and 100+ other tools via native integrations and our public REST API. Webhooks and Zapier are also supported on Pro and Scale plans.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. We're SOC 2 Type II compliant and GDPR ready. All data is encrypted at rest (AES-256) and in transit (TLS 1.3). Your data is never used to train our models without your explicit consent. We maintain full audit logs of all AI actions.",
  },
  {
    question: "Can I cancel at any time?",
    answer:
      "Yes, you can cancel your subscription at any time with no cancellation fees or lock-in periods. Your AI employees will continue working until the end of your current billing period, and you can export your data at any time.",
  },
];

export default function FAQ() {
  return (
    <section className="py-24 sm:py-32 bg-surface">
      <div className="max-w-3xl mx-auto px-6">
        <AnimateIn>
          <SectionHeader
            label="FAQ"
            title="Frequently asked questions"
            subtitle="Everything you need to know about Project Genesis."
          />
        </AnimateIn>

        <AnimateIn delay={100}>
          <FAQList items={faqs} />
        </AnimateIn>

        <AnimateIn delay={150}>
          <p className="mt-12 text-center text-sm text-zinc-500">
            Still have questions?{" "}
            <a href={ROUTES.AUTH.SIGNUP} className="text-accent hover:text-violet-400 transition-colors">
              Talk to our team →
            </a>
          </p>
        </AnimateIn>
      </div>
    </section>
  );
}
