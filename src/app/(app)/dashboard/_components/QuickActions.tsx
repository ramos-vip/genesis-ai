import Link from "next/link";
import { ROUTES } from "@/shared/constants";

interface QuickAction {
  label:       string;
  description: string;
  href:        string;
  icon:        React.ReactNode;
  accent:      string;
  external?:   boolean;
}

function getActions(firstEmployeeId: string | null): QuickAction[] {
  return [
    {
      label:       "Create AI Employee",
      description: "Add a new specialist to your team",
      href:        ROUTES.APP.EMPLOYEES.NEW,
      accent:      "text-violet-400 bg-violet-500/10 border-violet-500/20",
      icon: (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden>
          <path strokeLinecap="round" d="M11 7a3 3 0 11-6 0 3 3 0 016 0zM2 14a6 6 0 0112 0" />
          <path strokeLinecap="round" d="M13 3v4M11 5h4" />
        </svg>
      ),
    },
    {
      label:       "Upload Knowledge",
      description: "Add content for your AI to learn from",
      href:        ROUTES.APP.KNOWLEDGE.ROOT,
      accent:      "text-blue-400 bg-blue-500/10 border-blue-500/20",
      icon: (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10V12.5h10V10M8 2v7M5.5 4.5l2.5-2.5 2.5 2.5" />
        </svg>
      ),
    },
    {
      label:       "Open AI Chat",
      description: firstEmployeeId ? "Chat with your AI employee" : "Create an employee first",
      href:        firstEmployeeId
        ? `${ROUTES.APP.EMPLOYEES.DETAIL(firstEmployeeId)}/chat`
        : ROUTES.APP.EMPLOYEES.NEW,
      accent:      "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      icon: (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 9.5A6 6 0 012 9.5c0-2.4 1.4-4.5 3.5-5.5M14 9.5L12 12l-1-2.5" />
          <circle cx="11.5" cy="4.5" r="2" />
        </svg>
      ),
    },
    {
      label:       "View Analytics",
      description: "Track performance and usage",
      href:        ROUTES.APP.ANALYTICS,
      accent:      "text-orange-400 bg-orange-500/10 border-orange-500/20",
      icon: (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2 12l3-4 3 3 3-5 3 2.5" />
        </svg>
      ),
    },
  ];
}

export default function QuickActions({ firstEmployeeId }: { firstEmployeeId: string | null }) {
  const actions = getActions(firstEmployeeId);

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-sm font-semibold text-text-primary">Quick Actions</h3>
      </div>

      <div className="p-3 grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="flex flex-col gap-2.5 p-4 rounded-xl border border-border hover:border-white/[0.12] hover:bg-surface-elevated transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent group"
          >
            <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${action.accent}`}>
              {action.icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary group-hover:text-white transition-colors leading-tight">
                {action.label}
              </p>
              <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
