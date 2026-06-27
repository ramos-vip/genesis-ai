interface SectionHeaderProps {
  label?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export default function SectionHeader({
  label,
  title,
  subtitle,
  centered = true,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`${centered ? "text-center" : ""} mb-16 ${className}`}>
      {label && (
        <p className="mb-4 text-xs font-semibold tracking-[0.2em] uppercase text-accent">
          {label}
        </p>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.1]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-5 text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
