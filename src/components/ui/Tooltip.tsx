"use client";

import { ReactNode, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type TooltipSide = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  content:   ReactNode;
  side?:     TooltipSide;
  delay?:    number;
  children:  ReactNode;
  className?: string;
}

const offsetPx = 8;

function getPosition(rect: DOMRect, side: TooltipSide): { top: number; left: number } {
  switch (side) {
    case "top":
      return { top: rect.top - offsetPx, left: rect.left + rect.width / 2 };
    case "bottom":
      return { top: rect.bottom + offsetPx, left: rect.left + rect.width / 2 };
    case "left":
      return { top: rect.top + rect.height / 2, left: rect.left - offsetPx };
    case "right":
      return { top: rect.top + rect.height / 2, left: rect.right + offsetPx };
  }
}

const transformMap: Record<TooltipSide, string> = {
  top:    "translateX(-50%) translateY(-100%)",
  bottom: "translateX(-50%)",
  left:   "translateX(-100%) translateY(-50%)",
  right:  "translateY(-50%)",
};

export default function Tooltip({
  content,
  side    = "top",
  delay   = 300,
  children,
  className = "",
}: TooltipProps) {
  const [visible, setVisible]   = useState(false);
  const [pos, setPos]           = useState({ top: 0, left: 0 });
  const triggerRef              = useRef<HTMLSpanElement>(null);
  const timerRef                = useRef<ReturnType<typeof setTimeout>>(undefined);
  const tooltipId               = useId();

  function show() {
    timerRef.current = setTimeout(() => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPos(getPosition(rect, side));
      setVisible(true);
    }, delay);
  }

  function hide() {
    clearTimeout(timerRef.current);
    setVisible(false);
  }

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        aria-describedby={visible ? tooltipId : undefined}
        className={`inline-flex ${className}`}
      >
        {children}
      </span>

      {visible && typeof document !== "undefined" && createPortal(
        <div
          id={tooltipId}
          role="tooltip"
          className="fixed z-tooltip pointer-events-none animate-fade-in"
          style={{ top: pos.top, left: pos.left, transform: transformMap[side] }}
        >
          <div className="px-2.5 py-1.5 rounded-lg bg-surface-overlay border border-border text-xs text-text-primary shadow-[0_4px_6px_rgba(0,0,0,0.3)] whitespace-nowrap max-w-xs">
            {content}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
