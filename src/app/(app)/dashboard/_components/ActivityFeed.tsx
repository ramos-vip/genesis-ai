import { formatRelativeTime } from "@/shared/utils";
import Skeleton from "@/components/ui/Skeleton";
import type { ActivityEvent, ActivityType } from "@/server/actions/dashboard";

/* ─── Type icons & colors ─────────────────────────────────────────────────── */

const typeConfig: Record<ActivityType, { icon: React.ReactNode; color: string; bg: string }> = {
  employee_created: {
    color: "text-violet-400",
    bg:    "bg-violet-500/10 border-violet-500/20",
    icon: (
      <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5" aria-hidden>
        <path strokeLinecap="round" d="M9.5 6a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM2 12.5a5 5 0 0110 0" />
      </svg>
    ),
  },
  knowledge_added: {
    color: "text-blue-400",
    bg:    "bg-blue-500/10 border-blue-500/20",
    icon: (
      <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 2.5h3.5v9H2.5zM8 2.5h3.5v9H8zM6 2.5v9" />
      </svg>
    ),
  },
  conversation_started: {
    color: "text-emerald-400",
    bg:    "bg-emerald-500/10 border-emerald-500/20",
    icon: (
      <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7a5 5 0 01-5 5 4.95 4.95 0 01-2.39-.61L2 12.5 3 10a5 5 0 114.5 7H7a5 5 0 005-5V7z" />
      </svg>
    ),
  },
  knowledge_linked: {
    color: "text-cyan-400",
    bg:    "bg-cyan-500/10 border-cyan-500/20",
    icon: (
      <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 9l-1.5 1.5A2.12 2.12 0 006.5 13.5L8 12M9 5l1.5-1.5A2.12 2.12 0 007.5.5L6 2M5 9l4-4" />
      </svg>
    ),
  },
};

export function ActivityFeedSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 space-y-4">
      <Skeleton variant="rect" width={120} height={12} className="rounded" />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3">
          <Skeleton variant="circle" width={28} height={28} />
          <div className="flex-1 space-y-1.5">
            <Skeleton variant="rect" width="70%" height={12} className="rounded" />
            <Skeleton variant="rect" width="40%" height={10} className="rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ActivityFeed({ events }: { events: ActivityEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-8 text-center">
        <p className="text-sm font-medium text-text-secondary mb-1">No activity yet</p>
        <p className="text-xs text-text-muted">Events will appear here as your AI workforce gets to work.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-sm font-semibold text-text-primary">Recent Activity</h3>
      </div>

      <ul className="divide-y divide-border">
        {events.map((event) => {
          const cfg = typeConfig[event.type];
          return (
            <li key={event.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-surface-elevated transition-colors">
              {/* Icon */}
              <div
                className={`w-7 h-7 rounded-lg border ${cfg.bg} ${cfg.color} flex items-center justify-center shrink-0 mt-0.5`}
              >
                {cfg.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary font-medium leading-tight">{event.label}</p>
                {event.meta && (
                  <p className="text-xs text-text-muted truncate mt-0.5">{event.meta}</p>
                )}
              </div>

              {/* Timestamp */}
              <time
                dateTime={event.timestamp}
                className="text-[10px] text-text-muted shrink-0 mt-0.5 tabular-nums"
              >
                {formatRelativeTime(new Date(event.timestamp))}
              </time>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
