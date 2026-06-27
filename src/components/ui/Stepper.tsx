export interface StepDefinition {
  label: string;
  description?: string;
}

interface StepperProps {
  steps:       StepDefinition[];
  /** 0-indexed */
  currentStep: number;
  className?:  string;
}

export default function Stepper({ steps, currentStep, className = "" }: StepperProps) {
  return (
    <nav aria-label="Progress" className={className}>
      <ol className="flex items-center gap-1">
        {steps.map((step, i) => {
          const isCompleted = i < currentStep;
          const isActive    = i === currentStep;

          return (
            <li key={i} className="flex items-center gap-1 flex-1 min-w-0">
              {/* Step circle */}
              <div className="flex flex-col items-center shrink-0">
                <div
                  aria-current={isActive ? "step" : undefined}
                  className={[
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200",
                    isCompleted
                      ? "bg-accent text-white"
                      : isActive
                      ? "bg-accent/20 text-accent border-2 border-accent"
                      : "bg-surface-elevated text-text-muted border border-border",
                  ].join(" ")}
                >
                  {isCompleted ? (
                    <svg
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-3 h-3"
                      aria-hidden
                    >
                      <path d="M1.5 6l3 3 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>

                {/* Label — hidden on mobile */}
                <span
                  className={[
                    "hidden sm:block mt-1.5 text-[10px] font-medium text-center whitespace-nowrap",
                    isActive
                      ? "text-accent"
                      : isCompleted
                      ? "text-text-secondary"
                      : "text-text-muted",
                  ].join(" ")}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line — not after last step */}
              {i < steps.length - 1 && (
                <div
                  className={[
                    "flex-1 h-px mt-0 sm:-mt-5 transition-colors duration-300",
                    isCompleted ? "bg-accent" : "bg-border",
                  ].join(" ")}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
