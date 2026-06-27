"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";

interface ErrorProps {
  error:  Error & { digest?: string };
  reset:  () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to error reporting service in production (Sentry, etc.)
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-danger-bg border border-danger-border flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-danger" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>

        <h1 className="text-xl font-bold text-white mb-2">Something went wrong</h1>
        <p className="text-sm text-text-secondary mb-8 leading-relaxed">
          An unexpected error occurred. Our team has been notified.
          {error.digest && (
            <span className="block mt-2 font-mono text-xs text-text-muted">
              Error ID: {error.digest}
            </span>
          )}
        </p>

        <div className="flex items-center justify-center gap-3">
          <Button variant="primary" onClick={reset}>
            Try again
          </Button>
          <Button variant="secondary" href="/">
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}
