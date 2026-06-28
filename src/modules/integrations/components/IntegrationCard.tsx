import type { Integration, ConnectionStatus } from "../types";

interface IntegrationCardProps {
  integration: Integration;
  status:      ConnectionStatus;
  onConnect:   () => void;
  onSettings:  () => void;
}

const STATUS_STYLE: Record<ConnectionStatus, { dot: string; label: string; color: string }> = {
  disconnected: { dot: "bg-text-muted",   label: "Not connected",  color: "text-text-muted" },
  connecting:   { dot: "bg-warning animate-pulse", label: "Connecting…",   color: "text-warning" },
  connected:    { dot: "bg-success",      label: "Connected",      color: "text-success" },
  error:        { dot: "bg-danger",       label: "Connection error", color: "text-danger" },
};

export default function IntegrationCard({ integration: i, status, onConnect, onSettings }: IntegrationCardProps) {
  const ss    = STATUS_STYLE[status];
  const isConnected = status === "connected";

  return (
    <div className="group flex flex-col h-full rounded-2xl border border-border bg-surface hover:border-white/[0.12] hover:bg-surface-elevated transition-all duration-200 overflow-hidden">
      {/* Header */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between mb-4">
          {/* Icon */}
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${i.color} border border-white/[0.08] flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform duration-200`}
          >
            {i.icon}
          </div>

          {/* Badges */}
          <div className="flex flex-col gap-1.5 items-end">
            {i.popular && (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-accent text-white">Popular</span>
            )}
            {i.isNew && (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-success/20 text-success border border-success/30">New</span>
            )}
            {i.region && (
              <span className="text-[9px] font-medium px-2 py-0.5 rounded-full border border-border text-text-muted">{i.region}</span>
            )}
          </div>
        </div>

        <h3 className="text-sm font-bold text-white mb-1">{i.name}</h3>
        <p className="text-xs text-text-muted leading-relaxed line-clamp-2">{i.description}</p>
      </div>

      {/* Features */}
      <div className="px-5 pb-4 flex-1">
        <div className="flex flex-wrap gap-1">
          {i.features.slice(0, 3).map(f => (
            <span key={f} className="text-[9px] px-2 py-0.5 rounded-full border border-border bg-surface-elevated text-text-muted">
              {f}
            </span>
          ))}
          {i.features.length > 3 && (
            <span className="text-[9px] px-2 py-0.5 rounded-full border border-border bg-surface-elevated text-text-muted">
              +{i.features.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3.5 border-t border-border flex items-center justify-between gap-3">
        {/* Status */}
        <div className="flex items-center gap-1.5 min-w-0">
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${ss.dot}`} aria-hidden />
          <span className={`text-[10px] font-medium truncate ${ss.color}`}>{ss.label}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {i.docsUrl && (
            <a
              href={i.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-7 px-2 rounded-lg text-[10px] font-medium text-text-muted hover:text-text-secondary border border-border hover:border-border-hover transition-all"
              title="Documentation"
              aria-label={`${i.name} documentation`}
            >
              Docs
            </a>
          )}
          <button
            onClick={isConnected ? onSettings : onConnect}
            className={[
              "h-7 px-3 rounded-lg text-[10px] font-semibold transition-all",
              isConnected
                ? "border border-border bg-surface-elevated text-text-secondary hover:text-text-primary hover:border-border-hover"
                : "bg-accent hover:bg-accent-hover text-white shadow-[0_0_10px_rgba(124,58,237,0.15)]",
            ].join(" ")}
          >
            {isConnected ? "Settings" : "Connect"}
          </button>
        </div>
      </div>
    </div>
  );
}
