import AnimateIn from "@/components/ui/AnimateIn";
import SectionHeader from "@/components/ui/SectionHeader";

const steps = [
  {
    number: "01",
    title: "Create your workspace",
    description:
      "Sign up in seconds. Set up your team, connect your tools, and invite collaborators — no credit card required to start.",
  },
  {
    number: "02",
    title: "Configure your AI",
    description:
      "Choose a role, set your preferences, upload knowledge base files, and define workflows. Your AI learns your business.",
  },
  {
    number: "03",
    title: "Watch it scale",
    description:
      "Your AI workforce starts working immediately — handling tasks, generating reports, and learning to improve over time.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 sm:py-32 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <AnimateIn>
          <SectionHeader
            label="How it works"
            title="From zero to AI workforce in 3 steps"
            subtitle="No engineers needed. No months-long setup. Just results."
          />
        </AnimateIn>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {/* Connecting line (desktop only) */}
          <div
            aria-hidden
            className="hidden md:block absolute top-8 left-[calc(33.33%+1rem)] right-[calc(33.33%+1rem)] h-px bg-gradient-to-r from-accent/20 via-accent/40 to-accent/20"
          />

          {steps.map((step, i) => (
            <AnimateIn key={step.number} delay={i * 100}>
              <div className="relative flex flex-col gap-5">
                {/* Step number bubble */}
                <div className="relative flex items-center gap-4 md:flex-col md:items-start">
                  <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-surface border border-white/[0.08] text-2xl font-bold text-white font-[--font-geist-mono] shrink-0">
                    <span className="text-accent">{step.number}</span>
                    {/* Glow dot */}
                    <div
                      aria-hidden
                      className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-accent"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{step.description}</p>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
