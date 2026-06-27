"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useReducer,
} from "react";

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id:           string;
  type:         ToastType;
  title:        string;
  description?: string;
  /** Duration in ms. 0 = persistent until manually dismissed. Default: 4000 */
  duration?:    number;
}

type ToastInput = Omit<Toast, "id">;

interface ToastContextValue {
  toasts:     Toast[];
  /** Show a toast. Returns the generated id. */
  toast:      (input: ToastInput) => string;
  dismiss:    (id: string) => void;
  dismissAll: () => void;
}

/* ─── Convenience helpers attached to toast() ────────────────────────────── */

interface ToastFn {
  (input: ToastInput): string;
  success: (title: string, description?: string) => string;
  error:   (title: string, description?: string) => string;
  warning: (title: string, description?: string) => string;
  info:    (title: string, description?: string) => string;
}

/* ─── Reducer ────────────────────────────────────────────────────────────── */

type Action =
  | { type: "ADD";    toast: Toast }
  | { type: "REMOVE"; id: string }
  | { type: "CLEAR" };

function reducer(state: Toast[], action: Action): Toast[] {
  switch (action.type) {
    case "ADD":    return [action.toast, ...state].slice(0, 5); // max 5 visible
    case "REMOVE": return state.filter((t) => t.id !== action.id);
    case "CLEAR":  return [];
  }
}

/* ─── Context ────────────────────────────────────────────────────────────── */

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

/* ─── Icons ──────────────────────────────────────────────────────────────── */

const icons: Record<ToastType, ReactNode> = {
  success: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-success" aria-hidden>
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-danger" aria-hidden>
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-warning" aria-hidden>
      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-info" aria-hidden>
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
    </svg>
  ),
};

const borderColors: Record<ToastType, string> = {
  success: "border-success-border",
  error:   "border-danger-border",
  warning: "border-warning-border",
  info:    "border-info-border",
};

/* ─── Provider ───────────────────────────────────────────────────────────── */

let idCounter = 0;

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, dispatch] = useReducer(reducer, []);

  const dismiss = useCallback((id: string) => {
    dispatch({ type: "REMOVE", id });
  }, []);

  const dismissAll = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  const addToast = useCallback((input: ToastInput): string => {
    const id = `toast-${++idCounter}`;
    const toast: Toast = { duration: 4000, ...input, id };
    dispatch({ type: "ADD", toast });

    if (toast.duration && toast.duration > 0) {
      setTimeout(() => dispatch({ type: "REMOVE", id }), toast.duration);
    }
    return id;
  }, []);

  // Attach convenience methods
  const toastFn = addToast as ToastFn;
  toastFn.success = (title, description) => addToast({ type: "success", title, description });
  toastFn.error   = (title, description) => addToast({ type: "error",   title, description });
  toastFn.warning = (title, description) => addToast({ type: "warning", title, description });
  toastFn.info    = (title, description) => addToast({ type: "info",    title, description });

  return (
    <ToastContext.Provider value={{ toasts, toast: toastFn, dismiss, dismissAll }}>
      {children}

      {/* Toast viewport */}
      {toasts.length > 0 && (
        <div
          aria-live="assertive"
          aria-atomic="false"
          className="fixed bottom-4 right-4 z-toast flex flex-col gap-2 w-full max-w-sm pointer-events-none"
        >
          {toasts.map((t) => (
            <div
              key={t.id}
              role="status"
              className={[
                "pointer-events-auto flex items-start gap-3 p-4",
                "rounded-xl border bg-surface-elevated shadow-[0_10px_15px_rgba(0,0,0,0.4)]",
                "animate-slide-up",
                borderColors[t.type],
              ].join(" ")}
            >
              <span className="shrink-0 mt-0.5">{icons[t.type]}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary">{t.title}</p>
                {t.description && (
                  <p className="mt-0.5 text-xs text-text-secondary">{t.description}</p>
                )}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss"
                className="shrink-0 p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/[0.05] transition-colors"
              >
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3" aria-hidden>
                  <path d="M2 2l8 8M10 2l-8 8" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}
