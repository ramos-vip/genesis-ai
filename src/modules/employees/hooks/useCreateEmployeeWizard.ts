"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import type { Employee, WizardData } from "../types";
import { INITIAL_WIZARD_DATA } from "../types";
import { TOTAL_STEPS } from "../constants";

/* ─── Session storage ─────────────────────────────────────────────────────── */

const WIZARD_SESSION_KEY = "genesis:wizard:employee:v1";

/* ─── Validation ──────────────────────────────────────────────────────────── */

type FieldErrors = Partial<Record<keyof WizardData, string>>;

function validateStep(step: number, data: WizardData): FieldErrors {
  const errors: FieldErrors = {};

  if (step === 0) {
    const name = data.name.trim();
    if (!name)              errors.name = "Name is required.";
    else if (name.length < 2) errors.name = "Name must be at least 2 characters.";
    else if (name.length > 50) errors.name = "Name must be 50 characters or less.";
  }

  if (step === 1) {
    if (!data.role) errors.role = "Please select a role.";
  }

  return errors;
}

/* ─── State ───────────────────────────────────────────────────────────────── */

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
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "JUMP_TO_STEP"; step: number }
  | { type: "RESTORE"; state: WizardState }
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
    case "NEXT":
      return { ...state, step: Math.min(state.step + 1, TOTAL_STEPS - 1), errors: {} };
    case "PREV":
      return { ...state, step: Math.max(state.step - 1, 0), errors: {} };
    case "JUMP_TO_STEP":
      return {
        ...state,
        step:   Math.min(Math.max(0, action.step), TOTAL_STEPS - 1),
        errors: {},
      };
    case "RESTORE":
      return { ...action.state, isSubmitting: false };
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

/* ─── Context ─────────────────────────────────────────────────────────────── */

export interface WizardContextValue {
  state:        WizardState;
  setField:     <K extends keyof WizardData>(field: K, value: WizardData[K]) => void;
  tryNext:      () => boolean;
  prev:         () => void;
  jumpToStep:   (step: number) => void;
  canGoBack:    boolean;
  isLastStep:   boolean;
  progress:     number;
}

export const WizardContext = createContext<WizardContextValue | null>(null);

export function useWizardContext(): WizardContextValue {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizardContext must be used inside CreateEmployeeWizard");
  return ctx;
}

/* ─── Hook ────────────────────────────────────────────────────────────────── */

export function useCreateEmployeeWizard() {
  // Start from stable initial state on both server and client (no SSR mismatch)
  const [state, dispatch] = useReducer(reducer, initial);

  /* Restore from sessionStorage after hydration — runs once on mount */
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(WIZARD_SESSION_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as WizardState;
      if (!parsed.isSuccess) {
        dispatch({ type: "RESTORE", state: parsed });
      }
    } catch { /* silent — corrupt storage */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Persist on every state change; clear on success */
  useEffect(() => {
    if (state.isSuccess) {
      sessionStorage.removeItem(WIZARD_SESSION_KEY);
      return;
    }
    try {
      sessionStorage.setItem(WIZARD_SESSION_KEY, JSON.stringify(state));
    } catch { /* QuotaExceededError */ }
  }, [state]);

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

  const prev       = useCallback(() => dispatch({ type: "PREV" }), []);
  const jumpToStep = useCallback((step: number) => dispatch({ type: "JUMP_TO_STEP", step }), []);

  const setSubmitting  = useCallback(() => dispatch({ type: "SET_SUBMITTING" }), []);
  const submitDispatch = useCallback(
    (employee: Employee) => dispatch({ type: "SET_SUCCESS", employee }),
    []
  );

  return {
    state,
    setField,
    tryNext,
    prev,
    jumpToStep,
    setSubmitting,
    submitDispatch,
    canGoBack:  state.step > 0,
    isLastStep: state.step === TOTAL_STEPS - 1,
    progress:   Math.round((state.step / TOTAL_STEPS) * 100),
  };
}
