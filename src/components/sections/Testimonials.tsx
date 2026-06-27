import AnimateIn from "@/components/ui/AnimateIn";
import SectionHeader from "@/components/ui/SectionHeader";

const testimonials = [
  {
    quote:
      "Project Genesis transformed how we handle customer support. Our AI resolved 78% of tickets in the first week — without a single human touch.",
    name: "Sarah K.",
    role: "VP of Operations",
    company: "TechCorp",
    initials: "SK",
    color: "bg-violet-700",
  },
  {
    quote:
      "We tripled our content output in the first month. The Content AI writes in our exact brand voice. I honestly can't tell the difference anymore.",
    name: "Marcus R.",
    role: "Head of Marketing",
    company: "GrowthCo",
    initials: "MR",
    color: "bg-indigo-700",
  },
  {
    quote:
      "The ROI was immediate. Our Sales AI books demos while we sleep. We went from 12 demos a week to 47 in the first month.",
    name: "Elena V.",
    role: "CEO",
    company: "SaasCo",
    initials: "EV",
    color: "bg-blue-700",
  },
];

const stats = [
  { value: "500+", label: "Companies" },
  { value: "4.2M+", label: "Tasks automated" },
  { value: "78%", label: "Ticket resolution" },
  { value: "3.8×", label: "Avg ROI" },
];

export default function Testimonials() {
  return (
    <section className="py-24 sm:py-32 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <AnimateIn>
          <SectionHeader
            label="Social proof"
            title="Loved by teams worldwide"
            subtitle="Thousands of companies trust Genesis to run their most critical operations."
          />
        </AnimateIn>

        {/* Stats row */}
        <AnimateIn delay={100}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="p-6 rounded-2xl border border-white/[0.06] bg-background text-center"
              >
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-zinc-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </AnimateIn>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <AnimateIn key={t.name} delay={i * 80}>
              <div className="h-full flex flex-col gap-5 p-7 rounded-2xl border border-white/[0.06] bg-background hover:border-white/[0.12] transition-colors duration-300">
                {/* Stars */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <svg
                      key={j}
                      viewBox="0 0 12 12"
                      fill="currentColor"
                      className="w-3.5 h-3.5 text-accent"
                    >
                      <path d="M6 .5L7.4 4H11l-2.9 2.1 1.1 3.4L6 7.5 2.8 9.5l1.1-3.4L0 4h3.6L6 .5z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <p className="flex-1 text-[15px] text-zinc-300 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-2 border-t border-white/[0.06]">
                  <div
                    className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center text-xs font-semibold text-white shrink-0`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{t.name}</p>
                    <p className="text-xs text-zinc-500">
                      {t.role}, {t.company}
                    </p>
                  </div>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
