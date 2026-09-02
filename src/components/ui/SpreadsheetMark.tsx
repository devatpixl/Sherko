"use client";

import { motion } from "motion/react";

/* Microsoft's own Excel mark, from the file the client supplied, with an
   orange blade drawn across it.

   Earlier versions of this were our own drawing of a spreadsheet. That was a
   deliberate trademark dodge, but it never read as Excel, which is the whole
   point of the section: we name the product in order to say we replace it.

   `cut` draws the blade and parts the mark either side of it, so it reads as
   cut rather than merely crossed out. */

const EASE = [0.16, 1, 0.3, 1] as const;

export function SpreadsheetMark({
  className = "",
  cut = false,
  delay = 0.3,
}: {
  className?: string;
  cut?: boolean;
  delay?: number;
}) {
  if (!cut) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/logos/apps/excel.svg" alt="" aria-hidden className={`object-contain ${className}`} />
    );
  }

  return (
    <span className={`relative inline-block ${className}`}>
      {/* upper-left half, pushed away from the blade */}
      <motion.span
        className="absolute inset-0"
        style={{ clipPath: "polygon(-20% -20%, 120% -20%, -20% 120%)" }}
        initial={{ x: 0, y: 0 }}
        whileInView={{ x: -1.5, y: -1.5 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: delay + 0.3, ease: EASE }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logos/apps/excel.svg" alt="" aria-hidden className="h-full w-full object-contain" />
      </motion.span>

      {/* lower-right half */}
      <motion.span
        className="absolute inset-0"
        style={{ clipPath: "polygon(120% -20%, 120% 120%, -20% 120%)" }}
        initial={{ x: 0, y: 0 }}
        whileInView={{ x: 1.5, y: 1.5 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: delay + 0.3, ease: EASE }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logos/apps/excel.svg" alt="" aria-hidden className="h-full w-full object-contain" />
      </motion.span>

      {/* the blade */}
      <svg viewBox="0 0 32 32" className="absolute inset-0 h-full w-full" aria-hidden>
        <motion.path
          d="M2 30 30 2"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2.2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay, ease: EASE }}
        />
      </svg>
    </span>
  );
}
