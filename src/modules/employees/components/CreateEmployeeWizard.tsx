"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { WizardContext, useCreateEmployeeWizard } from "../hooks/useCreateEmployeeWizard";
import { useCreateEmployee } from "../hooks/useEmployees";
import { WIZARD_STEPS, TOTAL_STEPS } from "../constants";
import { ROUTES } from "@/shared/constants";
import Stepper   from "@/components/ui/Stepper";
import ProgressBar from "@/components/ui/ProgressBar";
import Button    from "@/components/ui/Button";
import Spinner   from "@/components/ui/Spinner";
import Step1Name        from "./steps/Step1Name";
import Step2Role        from "./steps/Step2Role";
import Step3Description from "./steps/Step3Description";
import Step4Knowledge   from "./steps/Step4Knowledge";
import Step5Review      from "./steps/Step5Review";
import type { EmployeeRole } from "../types";

/* ─── Success Screen ─────────────────────────────────────────────────────── */

function SuccessScreen({ name, role }: { name: string; role: string }) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.push(ROUTES.APP.DASHBOARD), 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-scale-in">
      {/* Check icon */}
      <div className="mb-6 w-20 h-20 rounded-full bg-success/10 border border-success/20 flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-10 h-10 text-success"
          aria-hidden
        >
          <path d="M4 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-white mb-2">
        {name} has been created!
      </h2>
      <p className="text-text-secondary text-sm mb-2">
        Your {role} AI is ready to work.
      </p>
      <p className="text-text-muted text-xs mb-8">
        Redirecting to dashboard in 3 seconds…
      </p>

      <Button variant="primary" href={ROUTES.APP.DASHBOARD}>
        Go to Dashboard
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" aria-hidden>
          <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Button>
    </div>
  );
}

/* ─── Step registry ──────────────────────────────────────────────────────── */

const STEP_COMPONENTS = [
  Step1Name,
  Step2Role,
  Step3Description,
  Step4Knowledge,
  Step5Review,
] as const;

/* ─── Wizard ─────────────────────────────────────────────────────────────── */

export default function CreateEmployeeWizard() {
  const wizard  = useCreateEmployeeWizard();
  const { mutateAsync: createEmployee } = useCreateEmployee();

  const { state, tryNext, prev, setSubmitting, submitDispatch } = wizard;
  const StepComponent = STEP_COMPONENTS[state.step];

  const contextValue = {
    state,
    setField:   wizard.setField,
    tryNext,
    prev,
    canGoBack:  wizard.canGoBack,
    isLastStep: wizard.isLastStep,
    progress:   wizard.progress,
  };

  async function handleNext() {
    if (!tryNext()) return;
  }

  async function handleCreate() {
    setSubmitting();
    try {
      const employee = await createEmployee({
        name:             state.data.name.trim(),
        role:             state.data.role as EmployeeRole,
        description:      state.data.description.trim(),
        knowledgeSources: state.data.knowledgeSources,
      });
      submitDispatch(employee);
    } catch {
      // Error handling will be added when real API is connected (Sprint 6)
    }
  }

  if (state.isSuccess && state.createdEmployee) {
    const { name, role } = state.createdEmployee;
    const roleLabel      = role.charAt(0).toUpperCase() + role.slice(1);
    return <SuccessScreen name={name} role={roleLabel} />;
  }

  const progress = Math.round(((state.step) / TOTAL_STEPS) * 100);

  return (
    <WizardContext.Provider value={contextValue}>
      <div className="flex flex-col gap-8">
        {/* Progress header */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-text-muted">
              Step {state.step + 1} of {TOTAL_STEPS}
            </span>
            <span className="text-xs text-text-muted">
              {progress}% complete
            </span>
          </div>
          <ProgressBar value={progress} className="mb-6" />
          <Stepper
            steps={WIZARD_STEPS.map((s) => ({ label: s.label }))}
            currentStep={state.step}
          />
        </div>

        {/* Step content */}
        <div className="min-h-[340px]">
          <StepComponent />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <Button
            variant="ghost"
            size="md"
            onClick={prev}
            disabled={!wizard.canGoBack || state.isSubmitting}
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" aria-hidden>
              <path d="M13 8H3M7 12l-4-4 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </Button>

          {wizard.isLastStep ? (
            <Button
              variant="primary"
              size="lg"
              onClick={handleCreate}
              disabled={state.isSubmitting}
            >
              {state.isSubmitting ? (
                <>
                  <Spinner size="sm" color="white" />
                  Creating…
                </>
              ) : (
                <>
                  Create Employee
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" aria-hidden>
                    <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </Button>
          ) : (
            <Button variant="primary" size="md" onClick={handleNext}>
              Continue
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" aria-hidden>
                <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Button>
          )}
        </div>
      </div>
    </WizardContext.Provider>
  );
}
