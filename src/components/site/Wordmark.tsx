"use client";

import { brand } from "@/lib/content";

/* Sherko is the order desk's own name — the colleague customers message.
   The mark keeps the aurora bands; the logotype is set plainly, and the
   whole word takes the gradient on hover rather than a clever split. */

export function Mark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <defs>
        <linearGradient id="sherko-mark" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#5CE1B0" />
          <stop offset="52%" stopColor="#4CC9F0" />
          <stop offset="100%" stopColor="#7C6BF5" />
        </linearGradient>
      </defs>
      <rect x="0.75" y="0.75" width="30.5" height="30.5" rx="9" fill="#0F1318" stroke="#262D35" strokeWidth="1.5" />
      {/* Three aurora bands sweeping across the tile */}
      <path d="M5 23c5-11 17-15 22-17" stroke="url(#sherko-mark)" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.95" />
      <path d="M5 27c6-9 15-13 22-14" stroke="url(#sherko-mark)" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.55" />
      <path d="M6 18c4-8 12-12 20-13" stroke="url(#sherko-mark)" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.3" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <a href="#top" className={`group inline-flex items-center gap-2.5 ${className}`} aria-label="Sherko">
      <Mark className="h-7 w-7 shrink-0 transition-transform duration-500 group-hover:rotate-6" />
      <span className="font-display text-[1.0625rem] font-semibold tracking-[-0.02em] text-fg transition-all duration-500 group-hover:[background:linear-gradient(100deg,#5CE1B0,#4CC9F0_46%,#7C6BF5)] group-hover:bg-clip-text group-hover:text-transparent">
        {brand.name}
      </span>
    </a>
  );
}
