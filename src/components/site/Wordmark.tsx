"use client";

import { brand } from "@/lib/content";

/* Sherko is the order desk's own name — the colleague customers message.
   The mark is a theta: a closed ring with a bar across it.

   Motion copies cursor.com's own logo exactly. Theirs is a 1.52s clip that
   sits paused on frame 0 (loop=false, autoplay=false) and plays once when you
   hover it: the mark turns a full revolution on its Y axis, going edge-on
   halfway through. So this one is static until hover, then spins once.

   The crossbar rides along, collapsing to the centre and opening back out on
   the same 1.52s clock, so the inside of the mark moves with the spin rather
   than being a rigid decal on it. */

export function Mark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={`theta-mark ${className}`} aria-hidden fill="none">
      <ellipse cx="16" cy="16" rx="8.4" ry="11.6" stroke="currentColor" strokeWidth="2.6" />
      <line className="theta-bar" x1="9.4" y1="16" x2="22.6" y2="16" stroke="currentColor" strokeWidth="2.6" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <a href="#top" className={`group -my-2 inline-flex items-center gap-2.5 py-2 ${className}`} aria-label="Sherko">
      {/* perspective lives on the wrapper so the spin foreshortens like a solid */}
      <span className="theta-stage inline-block h-7 w-7 shrink-0">
        <Mark className="h-7 w-7 text-fg transition-colors duration-300 group-hover:text-accent" />
      </span>
      <span className="font-display text-[1.0625rem] font-medium tracking-[-0.02em] text-fg transition-colors duration-300 group-hover:text-accent">
        {brand.name}
      </span>
    </a>
  );
}
