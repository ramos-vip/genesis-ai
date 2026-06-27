import { ReactNode } from "react";

export type AvatarSize   = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type AvatarStatus = "online" | "offline" | "away" | "busy";

interface AvatarProps {
  src?:      string;
  alt?:      string;
  initials?: string;
  size?:     AvatarSize;
  status?:   AvatarStatus;
  icon?:     ReactNode;
  className?: string;
}

const sizeClasses: Record<AvatarSize, { container: string; text: string; status: string }> = {
  xs:  { container: "w-6  h-6",  text: "text-[10px]", status: "w-1.5 h-1.5 -bottom-px -right-px" },
  sm:  { container: "w-8  h-8",  text: "text-xs",     status: "w-2   h-2   bottom-0   right-0" },
  md:  { container: "w-10 h-10", text: "text-sm",     status: "w-2.5 h-2.5 bottom-0   right-0" },
  lg:  { container: "w-12 h-12", text: "text-base",   status: "w-3   h-3   bottom-0   right-0" },
  xl:  { container: "w-16 h-16", text: "text-lg",     status: "w-3.5 h-3.5 bottom-0.5 right-0.5" },
  "2xl": { container: "w-20 h-20", text: "text-2xl",  status: "w-4   h-4   bottom-0.5 right-0.5" },
};

const statusClasses: Record<AvatarStatus, string> = {
  online:  "bg-success  border-background",
  offline: "bg-text-muted border-background",
  away:    "bg-warning   border-background",
  busy:    "bg-danger    border-background",
};

function stringToColor(str: string): string {
  const colors = [
    "bg-violet-700", "bg-blue-700", "bg-indigo-700",
    "bg-emerald-700", "bg-cyan-700", "bg-rose-700", "bg-orange-700",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export default function Avatar({
  src,
  alt      = "",
  initials,
  size     = "md",
  status,
  icon,
  className = "",
}: AvatarProps) {
  const sz = sizeClasses[size];
  const bgColor = initials ? stringToColor(initials) : "bg-surface-elevated";

  return (
    <div className={`relative inline-flex shrink-0 ${sz.container} ${className}`}>
      <div
        className={[
          "w-full h-full rounded-full overflow-hidden flex items-center justify-center",
          "border border-border",
          src ? "" : bgColor,
        ].join(" ")}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} className="w-full h-full object-cover" draggable={false} />
        ) : initials ? (
          <span className={`${sz.text} font-semibold text-white select-none`} aria-hidden>
            {initials.slice(0, 2).toUpperCase()}
          </span>
        ) : icon ? (
          <span className="text-text-muted" aria-hidden>{icon}</span>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-1/2 h-1/2 text-text-muted" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
        )}
      </div>

      {status && (
        <span
          className={[
            "absolute rounded-full border-2",
            sz.status,
            statusClasses[status],
          ].join(" ")}
          aria-label={status}
          role="img"
        />
      )}
    </div>
  );
}
