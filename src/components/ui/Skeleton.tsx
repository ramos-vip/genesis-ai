export type SkeletonVariant = "text" | "circle" | "rect";

interface SkeletonProps {
  variant?:   SkeletonVariant;
  width?:     string | number;
  height?:    string | number;
  lines?:     number;
  className?: string;
}

const base = "animate-shimmer rounded bg-surface-elevated";

function px(v: string | number): string {
  return typeof v === "number" ? `${v}px` : v;
}

export default function Skeleton({
  variant   = "rect",
  width,
  height,
  lines     = 1,
  className = "",
}: SkeletonProps) {
  if (variant === "text" && lines > 1) {
    return (
      <div className={`flex flex-col gap-2 ${className}`} aria-busy="true" aria-label="Loading">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={[base, "h-4 rounded"].join(" ")}
            style={{
              width: i === lines - 1 && lines > 1 ? "75%" : (width ? px(width) : "100%"),
            }}
            aria-hidden
          />
        ))}
      </div>
    );
  }

  const shapeClass = {
    text:   "h-4 rounded",
    circle: "rounded-full",
    rect:   "rounded-lg",
  }[variant];

  return (
    <div
      className={[base, shapeClass, className].join(" ")}
      style={{
        width:  width  ? px(width)  : variant === "circle" ? "40px" : "100%",
        height: height ? px(height) : variant === "circle" ? "40px" : "16px",
      }}
      aria-busy="true"
      aria-label="Loading"
    />
  );
}
