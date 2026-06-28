"use client";

import { useState, useEffect } from "react";
import type { Integration, IntegrationConnection, ConnectionStatus, Environment, AuthField } from "../types";

/* ─── Auth type labels ────────────────────────────────────────────────────── */

const AUTH_LABEL: Record<string, string> = {
  oauth:   "OAuth 2.0",
  api_key: "API Key",
  webhook: "Webhook",
  basic:   "Basic Auth",
};

/* ─── Field component ─────────────────────────────────────────────────────── */

function FieldInput({ field, value, onChange }: { field: AuthField; value: string; onChange: (v: string) => void }) {
  const [visible, setVisible] = useState(false);
  const inputCls = "w-full h-10 rounded-xl border border-border bg-surface-elevated px-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-border-focus focus:ring-1 focus:ring-accent/30 transition-all";

  if (field.type === "select") {
    return (
      <select
        className={`${inputCls} cursor-pointer appearance-none pr-8`}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%2371717a' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "10px" }}
      >
        {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  }

  if (field.type === "password") {
    return (
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          className={`${inputCls} pr-10`}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={field.placeholder}
        />
        <button
          type="button"
          onClick={() => setVisible(v => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
          aria-label={visible ? "Hide" : "Show"}
        >
          {visible ? (
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" aria-hidden>
              <path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5Z"/>
              <circle cx="8" cy="8" r="2"/>
              <path d="M3 3l10 10" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" aria-hidden>
              <path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5Z"/>
              <circle cx="8" cy="8" r="2"/>
            </svg>
          )}
        </button>
      </div>
    );
  }

  return (
    <input
      type={field.type}
      className={inputCls}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={field.placeholder}
    />
  );
}

/* ─── Connection flow steps ───────────────────────────────────────────────── */

type Step = "overview" | "configure" | "connecting" | "connected";

/* ─── Main drawer ─────────────────────────────────────────────────────────── */

interface ConnectionDrawerProps {
  integration:   Integration | null;
  connection:    IntegrationConnection | null;
  onSave:        (config: IntegrationConnection) => void;
  onDisconnect:  () => void;
  onClose:       () => void;
}

export default function ConnectionDrawer({ integration, connection, onSave, onDisconnect, onClose }: ConnectionDrawerProps) {
  const [step,   setStep]   = useState<Step>("overview");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [env,    setEnv]    = useState<Environment>("production");

  const isConnected = connection?.status === "connected";

  // Reset state when the drawer opens for a new integration
  useEffect(() => {
    if (!integration) return;
    setStep(isConnected ? "connected" : "overview");
    setFields(connection?.config ?? {});
    setEnv(connection?.environment ?? "production");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [integration?.id]);

  if (!integration) return null;

  function handleConnect() {
    if (integration!.authType === "oauth") {
      setStep("connecting");
      setTimeout(() => {
        setStep("connected");
        onSave({ status: "connected", config: fields, environment: env, connectedAt: new Date().toISOString() });
      }, 1800);
    } else {
      setStep("connecting");
      setTimeout(() => {
        setStep("connected");
        onSave({ status: "connected", config: fields, environment: env, connectedAt: new Date().toISOString() });
      }, 900);
    }
  }

  function handleDisconnect() {
    setStep("overview");
    setFields({});
    onDisconnect();
  }

  const allRequired = integration.authFields
    .filter(f => f.required && integration.authType !== "oauth")
    .every(f => (fields[f.key] ?? "").trim().length > 0);

  /* ── Overlay + drawer ── */
  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal aria-label={`${integration.name} connection`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden />

      {/* Drawer */}
      <aside className="relative ml-auto w-full max-w-md h-full bg-surface border-l border-border flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-4 px-6 py-5 border-b border-border shrink-0">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${integration.color} border border-white/[0.08] flex items-center justify-center text-2xl shrink-0`}>
            {integration.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-white truncate">{integration.name}</h2>
            <p className="text-[10px] text-text-muted">{AUTH_LABEL[integration.authType]}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors"
            aria-label="Close"
          >
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" aria-hidden>
              <path d="M2 2l8 8M10 2L2 10" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* ── Step: Overview ── */}
          {step === "overview" && (
            <div className="flex flex-col gap-5">
              <p className="text-sm text-text-secondary leading-relaxed">{integration.longDesc}</p>

              {/* Features */}
              <div>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-3">What you can do</p>
                <div className="flex flex-col gap-2">
                  {integration.features.map(f => (
                    <div key={f} className="flex items-start gap-2.5">
                      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3 text-accent shrink-0 mt-0.5" aria-hidden>
                        <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-xs text-text-secondary">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Auth type banner */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-accent/20 bg-accent/[0.05]">
                <div className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center shrink-0">
                  {integration.authType === "oauth"   && <span className="text-accent text-xs" aria-hidden>🔐</span>}
                  {integration.authType === "api_key" && <span className="text-accent text-xs" aria-hidden>🔑</span>}
                  {integration.authType === "webhook" && <span className="text-accent text-xs" aria-hidden>🔗</span>}
                  {integration.authType === "basic"   && <span className="text-accent text-xs" aria-hidden>👤</span>}
                </div>
                <div>
                  <p className="text-xs font-semibold text-accent">{AUTH_LABEL[integration.authType]}</p>
                  <p className="text-[10px] text-text-muted mt-0.5">
                    {integration.authType === "oauth"   && "You'll be redirected to authorize Genesis AI."}
                    {integration.authType === "api_key" && "Paste your API credentials to connect."}
                    {integration.authType === "webhook" && "Provide a webhook URL to start receiving data."}
                    {integration.authType === "basic"   && "Provide your username and password."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── Step: Configure ── */}
          {step === "configure" && (
            <div className="flex flex-col gap-5">
              <div>
                <h3 className="text-sm font-semibold text-white mb-0.5">Configuration</h3>
                <p className="text-xs text-text-muted">Fill in your credentials to connect {integration.name}.</p>
              </div>

              {/* Auth fields */}
              <div className="flex flex-col gap-4">
                {integration.authFields.map(field => (
                  <div key={field.key}>
                    <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                      {field.label}{field.required && <span className="text-danger ml-1" aria-label="required">*</span>}
                    </label>
                    <FieldInput
                      field={field}
                      value={fields[field.key] ?? ""}
                      onChange={v => setFields(prev => ({ ...prev, [field.key]: v }))}
                    />
                  </div>
                ))}
              </div>

              {/* Environment toggle */}
              <div>
                <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">Environment</p>
                <div className="flex gap-2">
                  {(["production", "sandbox"] as Environment[]).map(e => (
                    <button
                      key={e}
                      onClick={() => setEnv(e)}
                      className={[
                        "flex-1 py-2 rounded-xl border text-xs font-medium capitalize transition-all",
                        env === e
                          ? "border-accent/50 bg-accent/[0.06] text-accent"
                          : "border-border bg-surface-elevated text-text-muted hover:text-text-secondary hover:border-border-hover",
                      ].join(" ")}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              {/* Security note */}
              <div className="flex items-start gap-2.5 px-3 py-3 rounded-xl bg-surface-elevated border border-border">
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 text-text-muted shrink-0 mt-0.5" aria-hidden>
                  <path d="M6 1L1 3.5V6c0 2.5 2.5 4.5 5 5 2.5-.5 5-2.5 5-5V3.5L6 1Z"/>
                </svg>
                <p className="text-[10px] text-text-muted leading-relaxed">
                  Credentials are encrypted at rest and never exposed to client code. You can revoke access at any time.
                </p>
              </div>
            </div>
          )}

          {/* ── Step: Connecting ── */}
          {step === "connecting" && (
            <div className="flex flex-col items-center justify-center py-12 gap-5 text-center">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-2 border-accent/20 animate-ping" aria-hidden />
                <div className="relative w-16 h-16 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-2xl">
                  {integration.icon}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-white mb-1">
                  {integration.authType === "oauth" ? "Authorizing…" : "Verifying credentials…"}
                </p>
                <p className="text-xs text-text-muted">
                  {integration.authType === "oauth"
                    ? "Complete the authorization in the browser window."
                    : "Validating your API credentials with the provider."}
                </p>
              </div>
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" style={{ animationDelay: `${i * 200}ms` }} aria-hidden />
                ))}
              </div>
            </div>
          )}

          {/* ── Step: Connected ── */}
          {step === "connected" && (
            <div className="flex flex-col gap-5">
              {/* Success banner */}
              <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-success/[0.06] border border-success/25">
                <div className="w-8 h-8 rounded-full bg-success/15 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-success" aria-hidden>
                    <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-success">Connected successfully</p>
                  <p className="text-[10px] text-success/70 mt-0.5">
                    {connection?.connectedAt
                      ? `Since ${new Date(connection.connectedAt).toLocaleDateString()}`
                      : "Just connected"}
                    {env === "sandbox" && " · Sandbox mode"}
                  </p>
                </div>
              </div>

              {/* Credentials summary */}
              {Object.keys(fields).length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-3">Configuration</p>
                  <div className="flex flex-col gap-2">
                    {integration.authFields.map(f => (
                      <div key={f.key} className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-border bg-surface-elevated">
                        <span className="text-[10px] text-text-muted">{f.label}</span>
                        <span className="text-[10px] font-mono text-text-secondary">
                          {f.type === "password"
                            ? "••••••••"
                            : (fields[f.key] ?? "").slice(0, 20) + ((fields[f.key] ?? "").length > 20 ? "…" : "")}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-border bg-surface-elevated">
                      <span className="text-[10px] text-text-muted">Environment</span>
                      <span className="text-[10px] font-medium capitalize text-text-secondary">{env}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Reconfigure */}
              <button
                onClick={() => setStep("configure")}
                className="w-full h-10 rounded-xl border border-border bg-surface-elevated text-sm font-medium text-text-secondary hover:text-text-primary hover:border-border-hover transition-all"
              >
                Edit configuration
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border shrink-0 flex items-center justify-between gap-3">
          {/* Left actions */}
          <div>
            {(step === "connected" || isConnected) && (
              <button
                onClick={handleDisconnect}
                className="text-xs font-medium text-danger/70 hover:text-danger transition-colors"
              >
                Disconnect
              </button>
            )}
            {step === "configure" && (
              <button onClick={() => setStep("overview")} className="text-xs text-text-muted hover:text-text-secondary transition-colors">
                ← Back
              </button>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {step === "overview" && (
              <>
                {integration.authType === "oauth" ? (
                  <button
                    onClick={handleConnect}
                    className="h-9 px-5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-all shadow-[0_0_12px_rgba(124,58,237,0.2)]"
                  >
                    Continue with {integration.name}
                  </button>
                ) : (
                  <button
                    onClick={() => setStep("configure")}
                    className="h-9 px-5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-all shadow-[0_0_12px_rgba(124,58,237,0.2)]"
                  >
                    Configure →
                  </button>
                )}
              </>
            )}

            {step === "configure" && (
              <button
                onClick={handleConnect}
                disabled={!allRequired && integration.authType !== "oauth"}
                className="h-9 px-5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-all shadow-[0_0_12px_rgba(124,58,237,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Connect {integration.name}
              </button>
            )}

            {step === "connected" && (
              <button onClick={onClose} className="h-9 px-5 rounded-xl border border-border bg-surface-elevated text-sm font-medium text-text-secondary hover:text-text-primary transition-all">
                Done
              </button>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
