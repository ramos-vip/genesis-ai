import { ReactNode } from "react";

interface PageHeaderProps {
  title:        string;
  description?: string;
  badge?:       ReactNode;
  actions?:     ReactNode;
  breadcrumb?:  { label: string; href?: string }[];
  className?:   string;
}

export default function PageHeader({
  title,
  description,
  badge,
  actions,
  breadcrumb,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={`mb-8 ${className}`}>
      {breadcrumb && breadcrumb.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-3">
          <ol className="flex items-center gap-1.5 text-xs text-text-muted">
            {breadcrumb.map((crumb, i) => (
              <li key={i} className="flex items-center gap-1.5">
                {i > 0 && (
                  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3" aria-hidden>
                    <path d="M4.5 2l3 4-3 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {crumb.href && i < breadcrumb.length - 1 ? (
                  <a href={crumb.href} className="hover:text-text-primary transition-colors">
                    {crumb.label}
                  </a>
                ) : (
                  <span className={i === breadcrumb.length - 1 ? "text-text-secondary" : ""}>
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-text-primary truncate">
              {title}
            </h1>
            {badge}
          </div>
          {description && (
            <p className="text-sm text-text-secondary leading-relaxed max-w-xl">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
