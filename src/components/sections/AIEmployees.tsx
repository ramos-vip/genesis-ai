import AnimateIn from "@/components/ui/AnimateIn";
import SectionHeader from "@/components/ui/SectionHeader";

interface Employee {
  title: string;
  description: string;
  tag: string;
  icon: React.FC<{ className?: string }>;
  gradient: string;
  delay: number;
}

function TrendingUpIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
    </svg>
  );
}

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
    </svg>
  );
}

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
  );
}

function MagnifyingIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM13.5 10.5h-6M10.5 7.5v6" />
    </svg>
  );
}

function EnvelopeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>
  );
}

function CogIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  );
}

const employees: Employee[] = [
  {
    title: "Sales AI",
    description: "Closes deals while you sleep. Personalized outreach, lead scoring, and follow-ups at scale.",
    tag: "Revenue",
    icon: TrendingUpIcon,
    gradient: "from-violet-600/20 to-violet-600/5",
    delay: 0,
  },
  {
    title: "Support AI",
    description: "Resolves 80% of tickets instantly. Learns from your knowledge base and escalates intelligently.",
    tag: "Retention",
    icon: ChatIcon,
    gradient: "from-blue-600/20 to-blue-600/5",
    delay: 60,
  },
  {
    title: "Content AI",
    description: "Produces blog posts, copy, and creative briefs in your brand voice — in seconds.",
    tag: "Growth",
    icon: PencilIcon,
    gradient: "from-emerald-600/20 to-emerald-600/5",
    delay: 120,
  },
  {
    title: "SEO AI",
    description: "Researches keywords, audits your site, and publishes optimized content that ranks.",
    tag: "Traffic",
    icon: MagnifyingIcon,
    gradient: "from-orange-600/20 to-orange-600/5",
    delay: 0,
  },
  {
    title: "Email AI",
    description: "Writes, personalizes, and sends email campaigns that convert — fully automated.",
    tag: "Engagement",
    icon: EnvelopeIcon,
    gradient: "from-rose-600/20 to-rose-600/5",
    delay: 60,
  },
  {
    title: "Operations AI",
    description: "Automates workflows, summarizes data, and keeps your team moving without friction.",
    tag: "Efficiency",
    icon: CogIcon,
    gradient: "from-cyan-600/20 to-cyan-600/5",
    delay: 120,
  },
];

export default function AIEmployees() {
  return (
    <section id="ai-employees" className="py-24 sm:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <AnimateIn>
          <SectionHeader
            label="AI Workforce"
            title="Meet your AI team"
            subtitle="Six specialized AI employees, each built for a core business function. Ready to work the moment you deploy."
          />
        </AnimateIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map((emp) => {
            const Icon = emp.icon;
            return (
              <AnimateIn key={emp.title} delay={emp.delay}>
                <div className="group relative h-full p-6 rounded-2xl border border-white/[0.06] bg-surface hover:border-white/[0.12] hover:bg-surface-elevated transition-all duration-300 cursor-default">
                  {/* Icon */}
                  <div
                    className={`mb-5 w-10 h-10 rounded-xl bg-gradient-to-br ${emp.gradient} flex items-center justify-center border border-white/[0.08]`}
                  >
                    <Icon className="w-5 h-5 text-zinc-200" />
                  </div>

                  {/* Content */}
                  <h3 className="text-base font-semibold text-white mb-2">{emp.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-5">{emp.description}</p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.07] text-zinc-400">
                      {emp.tag}
                    </span>
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all duration-200"
                    >
                      <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </AnimateIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
