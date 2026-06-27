"use client";

import Badge from "@/components/ui/Badge";
import type { MarketplaceTemplate } from "../types";
import { CATEGORY_LABELS } from "../types";

interface TemplateCardProps {
  template:    MarketplaceTemplate;
  isInstalled: boolean;
  isInstalling: boolean;
  onInstall:   () => void;
  onDetails:   () => void;
}

const difficultyColor = {
  Beginner:     "text-success bg-success/10 border-success/20",
  Intermediate: "text-warning bg-warning/10 border-warning/20",
  Advanced:     "text-danger bg-danger/10 border-danger/20",
} as const;

function formatCount(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

export default function TemplateCard({
  template, isInstalled, isInstalling, onInstall, onDetails,
}: TemplateCardProps) {
  return (
    <div className="group relative flex flex-col h-full rounded-2xl border border-border bg-surface hover:border-white/[0.12] hover:bg-surface-elevated transition-all duration-250 overflow-hidden animate-in-element animate-in-visible">
      {/* Featured / New badges */}
      {(template.featured || template.isNew) && (
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
          {template.featured && (
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-accent text-white shadow-[0_0_10px_rgba(124,58,237,0.4)]">
              FEATURED
            </span>
          )}
          {template.isNew && (
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-success/20 text-success border border-success/30">
              NEW
            </span>
          )}
        </div>
      )}

      {/* Header */}
      <div className="p-5 pb-4">
        <div className="flex items-start gap-3 mb-4">
          {/* Avatar */}
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${template.avatar.gradient} border border-white/[0.08] flex items-center justify-center text-sm font-bold text-white/80 shrink-0 group-hover:scale-105 transition-transform duration-200`}
          >
            {template.avatar.initials}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <h3 className="text-base font-bold text-white leading-tight">{template.name}</h3>
              <span
                className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${difficultyColor[template.difficulty]}`}
              >
                {template.difficulty}
              </span>
            </div>
            <p className="text-[10px] font-medium text-text-muted">
              {CATEGORY_LABELS[template.category]}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 mb-4">
          {template.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {template.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-surface-elevated border border-border text-text-muted"
            >
              {tag}
            </span>
          ))}
          {template.tags.length > 3 && (
            <span className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-surface-elevated border border-border text-text-muted">
              +{template.tags.length - 3}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 py-3 border-t border-border">
          {[
            { label: "Installs",  value: formatCount(template.installCount) },
            { label: "Conv/mo",   value: formatCount(template.estimatedConversations) },
            { label: "Temp",      value: template.temperature.toFixed(1) },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-xs font-bold text-white tabular-nums">{value}</p>
              <p className="text-[9px] text-text-muted">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto p-4 pt-0 flex items-center gap-2">
        <button
          onClick={onInstall}
          disabled={isInstalled || isInstalling}
          className={[
            "flex-1 h-9 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center justify-center gap-2",
            isInstalled
              ? "bg-success/10 border border-success/30 text-success cursor-default"
              : "bg-accent hover:bg-accent-hover text-white shadow-[0_0_12px_rgba(124,58,237,0.2)] hover:shadow-[0_0_18px_rgba(124,58,237,0.35)] disabled:opacity-60 disabled:cursor-wait",
          ].join(" ")}
        >
          {isInstalling ? (
            <>
              <svg className="animate-spin w-3 h-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <circle cx="8" cy="8" r="6" strokeOpacity="0.2"/>
                <path d="M14 8a6 6 0 0 0-6-6" strokeLinecap="round"/>
              </svg>
              Installing…
            </>
          ) : isInstalled ? (
            <>
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3" aria-hidden>
                <path d="M1.5 6l3 3 6-6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Installed
            </>
          ) : (
            "Install"
          )}
        </button>

        <button
          onClick={onDetails}
          className="h-9 px-3 rounded-lg border border-border bg-surface-elevated text-xs font-medium text-text-secondary hover:text-text-primary hover:border-border-hover transition-all"
        >
          Details
        </button>
      </div>
    </div>
  );
}
