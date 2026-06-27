"use client";

import Modal from "@/components/ui/Modal";
import type { MarketplaceTemplate } from "../types";
import { CATEGORY_LABELS } from "../types";

interface TemplateModalProps {
  template:     MarketplaceTemplate | null;
  isInstalled:  boolean;
  isInstalling: boolean;
  onInstall:    () => void;
  onClose:      () => void;
}

export default function TemplateModal({
  template, isInstalled, isInstalling, onInstall, onClose,
}: TemplateModalProps) {
  if (!template) return null;

  return (
    <Modal open={!!template} onClose={onClose} size="lg" title={`${template.name} — ${CATEGORY_LABELS[template.category]}`}>
      <div className="flex flex-col gap-6">
        {/* Hero */}
        <div className="flex items-start gap-4 p-4 rounded-xl bg-surface-elevated border border-border">
          <div
            className={`w-14 h-14 rounded-xl bg-gradient-to-br ${template.avatar.gradient} border border-white/[0.08] flex items-center justify-center text-base font-bold text-white/80 shrink-0`}
          >
            {template.avatar.initials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-white mb-1">{template.name}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{template.longDescription}</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Monthly installs",      value: template.installCount.toLocaleString() },
            { label: "Est. conversations/mo",  value: template.estimatedConversations.toLocaleString() },
            { label: "Default temperature",    value: template.temperature.toFixed(1) },
          ].map(({ label, value }) => (
            <div key={label} className="p-3 rounded-xl border border-border bg-surface text-center">
              <p className="text-lg font-bold text-white tabular-nums">{value}</p>
              <p className="text-[10px] text-text-muted mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Capabilities */}
        <div>
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Capabilities</h4>
          <ul className="flex flex-col gap-2">
            {template.capabilities.map((cap) => (
              <li key={cap} className="flex items-center gap-2.5 text-sm text-text-secondary">
                <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 text-success shrink-0" aria-hidden>
                  <path d="M1.5 5l2.5 2.5 5-5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {cap}
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended knowledge */}
        <div>
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Recommended Knowledge Sources</h4>
          <div className="flex flex-wrap gap-2">
            {template.recommendedKnowledge.map((kn) => (
              <span key={kn} className="text-xs px-3 py-1.5 rounded-full border border-border bg-surface-elevated text-text-secondary">
                📄 {kn}
              </span>
            ))}
          </div>
        </div>

        {/* Example conversations */}
        <div>
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Example Conversation</h4>
          <div className="flex flex-col gap-2 p-4 rounded-xl border border-border bg-surface">
            {template.exampleConversations.map((ex, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex gap-2 items-start flex-row-reverse">
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[8px] text-white/50 shrink-0 mt-0.5">U</div>
                  <div className="max-w-[80%] px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs text-white/60 leading-relaxed">
                    {ex.user}
                  </div>
                </div>
                <div className="flex gap-2 items-start">
                  <div className="w-5 h-5 rounded-full bg-violet-600/40 flex items-center justify-center text-[8px] font-bold text-violet-300 shrink-0 mt-0.5">AI</div>
                  <div className="max-w-[80%] px-3 py-2 rounded-xl bg-violet-600/[0.1] border border-violet-500/20 text-xs text-white/80 leading-relaxed whitespace-pre-line">
                    {ex.ai}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Limitations */}
        <div>
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Limitations</h4>
          <ul className="flex flex-col gap-2">
            {template.limitations.map((lim) => (
              <li key={lim} className="flex items-start gap-2.5 text-xs text-text-muted">
                <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3 text-warning shrink-0 mt-0.5" aria-hidden>
                  <path strokeLinecap="round" d="M5 1L5.94 6.25M5 8.5v.5"/>
                  <circle cx="5" cy="5" r="4.25"/>
                </svg>
                {lim}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <button
          onClick={onInstall}
          disabled={isInstalled || isInstalling}
          className={[
            "w-full h-11 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2",
            isInstalled
              ? "bg-success/10 border border-success/30 text-success cursor-default"
              : "bg-accent hover:bg-accent-hover text-white shadow-[0_0_20px_rgba(124,58,237,0.2)] hover:shadow-[0_0_28px_rgba(124,58,237,0.35)] disabled:opacity-60 disabled:cursor-wait",
          ].join(" ")}
        >
          {isInstalling ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <circle cx="8" cy="8" r="6" strokeOpacity="0.2"/>
                <path d="M14 8a6 6 0 0 0-6-6" strokeLinecap="round"/>
              </svg>
              Installing {template.name}…
            </>
          ) : isInstalled ? (
            `✓ ${template.name} is installed`
          ) : (
            `Install ${template.name}`
          )}
        </button>
      </div>
    </Modal>
  );
}
