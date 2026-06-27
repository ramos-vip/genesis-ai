"use client";

import { ComponentPropsWithoutRef, ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

interface ModalProps {
  open:      boolean;
  onClose:   () => void;
  size?:     ModalSize;
  title?:    string;
  children:  ReactNode;
  showClose?: boolean;
  /** Prevent closing on backdrop click */
  persistent?: boolean;
}

const sizeClasses: Record<ModalSize, string> = {
  sm:   "max-w-sm",
  md:   "max-w-md",
  lg:   "max-w-lg",
  xl:   "max-w-xl",
  full: "max-w-none w-full h-full rounded-none",
};

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), ' +
  'textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" aria-hidden>
      <path d="M3 3l10 10M13 3L3 13" strokeLinecap="round" />
    </svg>
  );
}

function ModalContent({ open, onClose, size = "md", title, children, showClose = true, persistent = false }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef   = useRef<HTMLDivElement>(null);

  /* Lock body scroll */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  /* Focus trap + Escape */
  useEffect(() => {
    if (!open) return;
    const modal = modalRef.current;
    if (!modal) return;

    const focusables = Array.from(modal.querySelectorAll<HTMLElement>(FOCUSABLE));
    const first = focusables[0];
    const last  = focusables[focusables.length - 1];

    // Move focus into modal
    setTimeout(() => first?.focus(), 0);

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !persistent) { onClose(); return; }
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first?.focus(); }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, persistent]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-modal flex items-center justify-center p-4"
      role="presentation"
      onClick={(e) => {
        if (!persistent && e.target === overlayRef.current) onClose();
      }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        aria-hidden
      />

      {/* Panel */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        className={[
          "relative z-10 w-full bg-surface border border-border rounded-2xl shadow-[0_20px_25px_rgba(0,0,0,0.5)]",
          "animate-scale-in",
          sizeClasses[size],
        ].join(" ")}
      >
        {(title || showClose) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            {title && (
              <h2 id="modal-title" className="text-base font-semibold text-text-primary">
                {title}
              </h2>
            )}
            {showClose && (
              <button
                onClick={onClose}
                className="ml-auto p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/[0.05] transition-all duration-150 focus-ring"
                aria-label="Close dialog"
              >
                <CloseIcon />
              </button>
            )}
          </div>
        )}

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default function Modal(props: ModalProps) {
  if (typeof document === "undefined") return null;
  return createPortal(<ModalContent {...props} />, document.body);
}
