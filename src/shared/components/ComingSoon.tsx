interface ComingSoonProps {
  title:        string;
  description:  string;
  features?:    string[];
  eta?:         string;
}

export default function ComingSoon({
  title,
  description,
  features,
  eta,
}: ComingSoonProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      {/* Header banner */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" aria-hidden />
          <span className="text-sm font-medium text-text-secondary">In development</span>
        </div>
        {eta && (
          <span className="text-xs font-semibold tracking-wider uppercase text-text-muted border border-border rounded-full px-3 py-1">
            {eta}
          </span>
        )}
      </div>

      <div className="p-8">
        <div className="max-w-lg">
          <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
          <p className="text-sm text-text-secondary leading-relaxed mb-6">{description}</p>

          {features && features.length > 0 && (
            <div className="flex flex-col gap-2.5">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-3 text-sm text-text-muted">
                  <div className="w-5 h-5 rounded-full border border-border flex items-center justify-center shrink-0">
                    <svg
                      viewBox="0 0 10 10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="w-2.5 h-2.5 text-accent"
                      aria-hidden
                    >
                      <path d="M1.5 5l2.5 2.5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  {feature}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
