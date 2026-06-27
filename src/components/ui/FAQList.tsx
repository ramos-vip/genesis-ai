"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQList({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-white/[0.06]">
      {items.map((item, i) => (
        <div key={i} className="py-5">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 text-left group"
            aria-expanded={open === i}
          >
            <span className="text-base font-medium text-white group-hover:text-zinc-200 transition-colors">
              {item.question}
            </span>
            <span
              className={`shrink-0 flex items-center justify-center w-6 h-6 rounded-full border border-white/10 text-zinc-500 transition-all duration-300 ${
                open === i ? "rotate-45 border-accent/40 text-accent" : ""
              }`}
            >
              <svg
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="w-3 h-3"
              >
                <path d="M6 1v10M1 6h10" strokeLinecap="round" />
              </svg>
            </span>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              open === i ? "max-h-96 mt-4" : "max-h-0"
            }`}
          >
            <p className="text-zinc-400 leading-relaxed pr-10">{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
