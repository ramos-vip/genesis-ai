"use client";

import { useLocalStorage } from "@/shared/hooks";

type Theme    = "dark" | "light" | "system";
type Language = "en"   | "tr";

const THEMES: { id: Theme; label: string; desc: string; preview: string; disabled?: boolean }[] = [
  {
    id: "dark", label: "Dark", desc: "Easy on the eyes.",
    preview: "bg-[#07070a] border-accent/30",
  },
  {
    id: "light", label: "Light", desc: "Classic and bright.", disabled: true,
    preview: "bg-white border-border",
  },
  {
    id: "system", label: "System", desc: "Follows your OS.", disabled: true,
    preview: "bg-gradient-to-br from-[#07070a] to-white border-border",
  },
];

const LANGUAGES: { id: Language; label: string; flag: string; disabled?: boolean }[] = [
  { id: "en", label: "English",  flag: "🇬🇧" },
  { id: "tr", label: "Türkçe",   flag: "🇹🇷", disabled: true },
];

export default function AppearanceSection() {
  const [theme,    setTheme]    = useLocalStorage<Theme>("genesis:settings:appearance", "dark");
  const [language, setLanguage] = useLocalStorage<Language>("genesis:settings:language", "en");

  return (
    <>
      {/* Appearance */}
      <div className="rounded-2xl border border-border bg-surface overflow-hidden" id="appearance">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-white">Appearance</h3>
          <p className="text-xs text-text-muted mt-0.5">Choose how Genesis AI looks for you.</p>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => !t.disabled && setTheme(t.id)}
              disabled={t.disabled}
              className={[
                "relative flex flex-col items-start gap-3 p-4 rounded-xl border text-left transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                theme === t.id ? "border-accent/40 bg-accent/[0.04]" : "border-border hover:border-border-hover",
                t.disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-surface-elevated",
              ].join(" ")}
              aria-pressed={theme === t.id}
            >
              {/* Preview swatch */}
              <div className={`w-full h-16 rounded-lg border-2 ${t.preview}`} aria-hidden />

              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-text-primary">{t.label}</p>
                  {theme === t.id && (
                    <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 text-accent" aria-hidden>
                      <path d="M1.5 5l2.5 2.5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {t.disabled && <span className="text-[10px] text-text-muted border border-border rounded-full px-1.5 py-0.5 font-semibold">Soon</span>}
                </div>
                <p className="text-xs text-text-muted">{t.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Language */}
      <div className="rounded-2xl border border-border bg-surface overflow-hidden" id="language">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-white">Language</h3>
          <p className="text-xs text-text-muted mt-0.5">Choose your preferred display language.</p>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {LANGUAGES.map((l) => (
            <button
              key={l.id}
              onClick={() => !l.disabled && setLanguage(l.id)}
              disabled={l.disabled}
              className={[
                "flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                language === l.id ? "border-accent/40 bg-accent/[0.04]" : "border-border hover:border-border-hover",
                l.disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-surface-elevated",
              ].join(" ")}
              aria-pressed={language === l.id}
            >
              <span className="text-2xl" aria-hidden>{l.flag}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-text-primary">{l.label}</p>
                  {language === l.id && (
                    <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 text-accent" aria-hidden>
                      <path d="M1.5 5l2.5 2.5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {l.disabled && <span className="text-[10px] text-text-muted border border-border rounded-full px-1.5 py-0.5 font-semibold">Soon</span>}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
