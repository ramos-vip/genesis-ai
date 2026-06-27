interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
  label?:       string;
  className?:   string;
}

export default function Separator({
  orientation = "horizontal",
  label,
  className   = "",
}: SeparatorProps) {
  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={`w-px self-stretch bg-border shrink-0 ${className}`}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        className={`flex items-center gap-3 ${className}`}
      >
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs font-medium text-text-muted select-none shrink-0">{label}</span>
        <div className="flex-1 h-px bg-border" />
      </div>
    );
  }

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={`h-px w-full bg-border ${className}`}
    />
  );
}
