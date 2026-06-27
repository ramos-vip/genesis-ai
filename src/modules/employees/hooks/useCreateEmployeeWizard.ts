"use client";

import { createContext, useCallback, useContext, useReducer } from "react";
import type { Employee, WizardData } from "../types";
import { TOTAL_STEPS } from "../constants";
import { INITIAL_WIZARD_DATA } from "../types";

/* ─── Validation ─────────────────────────────────────────────────────────── */

type FieldErrors = Partial<Record<keyof WizardData, string>>;

function validateStep(step: number, data: WizardData): FieldErrors {
  const errors: FieldErrors = {};

  if (step === 0) {
    const name = data.name.trim();
    if (!name)               errors.name = "Name is required.";
    else if (name.length < 2) errors.name = "Name must be at least 2 characters.";
    else if (name.length > 50) errors.name = "Name must be 50 characters or less.";
  }

  if (step === 1) {
    if (!data.role) errors.role = "Please select a role.";
  }

  // Steps 2, 3, 4 are optional — description encouraged but not required
  return errors;
}

/* ─── State ──────────────────────────────────────────────────────────────── */

interface WizardState {
  step:            number;
  data:            WizardData;
  errors:          FieldErrors;
  isSubmitting:    boolean;
  isSuccess:       boolean;
  createdEmployee: Employee | null;
}

type WizardAction =
  | { type: "SET_FIELD"; field: keyof WizardData; value: WizardData[keyof WizardData] }
  | { type: "SET_ERRORS"; errors: FieldErrors }
  | { type: "CLEAR_ERRORS" }
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "SET_SUBMITTING" }
  | { type: "SET_SUCCESS"; employee: Employee };

const initial: WizardState = {
  step:            0,
  data:            INITIAL_WIZARD_DATA,
  errors:          {},
  isSubmitting:    false,
  isSuccess:       false,
  createdEmployee: null,
};

function reducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        data:   { ...state.data, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: undefined },
      };
    case "SET_ERRORS":
      return { ...state, errors: action.errors };
    case "CLEAR_ERRORS":
      return { ...state, errors: {} };
    case "NEXT":
      return {
        ...state,
        step:   Math.min(state.step + 1, TOTAL_STEPS - 1),
        errors: {},
      };
    case "PREV":
      return {
        ...state,
        step:   Math.max(state.step - 1, 0),
        errors: {},
      };
    case "SET_SUBMITTING":
      return { ...state, isSubmitting: true };
    case "SET_SUCCESS":
      return {
        ...state,
        isSubmitting:    false,
        isSuccess:       true,
        createdEmployee: action.employee,
      };
    default:
      return state;
  }
}

/* ─── Context ────────────────────────────────────────────────────────────── */

export interface WizardContextValue {
  state:      WizardState;
  setField:   <K extends keyof WizardData>(field: K, value: WizardData[K]) => void;
  tryNext:    () => boolean;
  prev:       () => void;
  canGoBack:  boolean;
  isLastStep: boolean;
  progress:   number;
}

export const WizardContext = createContext<WizardContextValue | null>(null);

export function useWizardContext(): WizardContextValue {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizardContext must be used inside CreateEmployeeWizard");
  return ctx;
}

/* ─── Hook ───────────────────────────────────────────────────────────────── */

export function useCreateEmployeeWizard() {
  const [state, dispatch] = useReducer(reducer, initial);

  const setField = useCallback(
    <K extends keyof WizardData>(field: K, value: WizardData[K]) => {
      dispatch({ type: "SET_FIELD", field, value });
    },
    []
  );

  const tryNext = useCallback((): boolean => {
    const errors = validateStep(state.step, state.data);
    if (Object.keys(errors).length > 0) {
      dispatch({ type: "SET_ERRORS", errors });
      return false;
    }
    dispatch({ type: "NEXT" });
    return true;
  }, [state.step, state.data]);

  const prev = useCallback(() => dispatch({ type: "PREV" }), []);

  const submitDispatch = useCallback((employee: Employee) => {
    dispatch({ type: "SET_SUCCESS", employee });
  }, []);

  const setSubmitting = useCallback(() => dispatch({ type: "SET_SUBMITTING" }), []);

  return {
    state,
    setField,
    tryNext,
    prev,
    setSubmitting,
    submitDispatch,
    canGoBack:  state.step > 0,
    isLastStep: state.step === TOTAL_STEPS - 1,
    progress:   Math.round(((state.step + 1) / TOTAL_STEPS) * 100),
  };
}
