import AnimateIn from "@/components/ui/AnimateIn";
import FAQList   from "@/components/ui/FAQList";
import { ROUTES } from "@/shared/constants";

const faqs = [
  {
    question: "How long does setup take?",
    answer:
      "Under 5 minutes from sign-up to your first AI conversation. Sign up, pick a role, give your employee a name, add a knowledge source, and you're live. No engineers, no lengthy onboarding, no setup fees.",
  },
  {
    question: "Can the AI learn from my documents?",
    answer:
      "Yes — that's the core of Genesis AI. Upload PDFs, paste text, or connect a URL and your AI learns from that content immediately. We use RAG (Retrieval-Augmented Generation) so every answer is grounded in your actual documents, not generic training data.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. Your data is never used to train our models without explicit consent. Every query filters by your user ID — no cross-account data exposure. All content is encrypted at rest and in transit. We're building toward SOC 2 compliance.",
  },
  {
    question: "Which AI models are supported?",
    answer:
      "Genesis AI currently uses Google Gemini 2.5 Flash for chat (fast, affordable, high-quality) and text-embedding-004 for knowledge retrieval. We're building multi-provider support — OpenAI, Anthropic, and local models are on the roadmap.",
  },
  {
    question: "Can I upgrade my plan later?",
    answer:
      "Yes, anytime. Upgrade from the Billing page in your dashboard. Your data, employees, and conversations are preserved. There's no migration, no downtime, and no lock-in. You can also downgrade or cancel in one click.",
  },
  {
    question: "Do I need technical knowledge to use Genesis AI?",
    answer:
      "No. Genesis AI is built for business owners and operators, not engineers. The entire setup — creating employees, uploading knowledge, starting conversations — is point-and-click. If you can use email, you can use Genesis AI.",
  },
];

export default function FAQ() {
  return (
    <section className="py-24 sm:py-32 bg-surface relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)" }}
      />

      <div className="max-w-3xl mx-auto px-6">
        <AnimateIn>
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent/80 mb-4">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-[1.1] mb-4">
              Frequently asked questions
            </h2>
            <p className="text-base text-zinc-400 leading-relaxed">
              Everything you need to know before you deploy your first AI employee.
            </p>
          </div>
        </AnimateIn>

        <AnimateIn delay={80}>
          <div className="rounded-2xl border border-border bg-background overflow-hidden">
            <FAQList items={faqs} />
          </div>
        </AnimateIn>

        <AnimateIn delay={160}>
          <p className="mt-10 text-center text-sm text-text-secondary">
            Still have questions?{" "}
            <a
              href={ROUTES.AUTH.SIGNUP}
              className="text-accent hover:text-violet-400 font-medium transition-colors focus:outline-none focus-visible:underline"
            >
              Talk to our team →
            </a>
          </p>
        </AnimateIn>
      </div>
    </section>
  );
}
