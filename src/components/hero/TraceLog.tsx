"use client";

import { AnimatePresence, motion } from "motion/react";
import type { TraceLine } from "@/lib/chatScript";
import { useLocale } from "@/lib/i18n";

/* The machine view: what Nordre is actually doing while the customer only
   sees a chat bubble. Deliberately frameless — no card, no border, no glow.
   It is a log, so it should look like one: a hairline rule, monospace, and
   the newest line the brightest thing in the column. */

/** How many lines stay on screen before the oldest rolls off the top. */
const WINDOW = 9;

function Line({ line, age }: { line: TraceLine; age: number }) {
  const { locale } = useLocale();
  const newest = age === 0;

  // Older lines recede rather than disappear — the trail is the point.
  const opacity = Math.max(0.16, 1 - age * 0.13);

  const verbTone =
    line.tone === "accent" ? "text-accent" : line.tone === "signal" ? "text-signal" : "text-fg-3";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
      className="flex gap-2 font-mono text-[10.5px] leading-[15px] whitespace-nowrap"
    >
      <span
        className={`w-[8px] shrink-0 ${newest ? "text-accent" : "text-transparent"}`}
        aria-hidden
      >
        ▸
      </span>
      <span className="w-[46px] shrink-0 tabular-nums text-fg-4">{line.time}</span>
      <span className={`w-[52px] shrink-0 ${verbTone}`}>{line.verb}</span>
      <span className={`min-w-0 truncate ${newest ? "text-fg" : "text-fg-2"}`}>
        {line.detail[locale]}
      </span>
    </motion.div>
  );
}

export function TraceLog({ lines, className = "" }: { lines: TraceLine[]; className?: string }) {
  const { locale } = useLocale();
  const visible = lines.slice(-WINDOW);
  const live = lines.length > 0;

  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden>
      {/* Header rule */}
      <div className="flex items-center gap-2.5">
        <span className="font-mono text-[9.5px] tracking-[0.22em] text-fg-4 uppercase">
          {locale === "no" ? "Nordre · logg" : "Nordre · trace"}
        </span>
        <span className="h-px flex-1 bg-line" />
        <span className="relative flex h-[5px] w-[5px]">
          {live && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
          )}
          <span
            className={`relative inline-flex h-[5px] w-[5px] rounded-full ${live ? "bg-accent" : "bg-line-2"}`}
          />
        </span>
      </div>

      {/* The stream. Fades out at the top so lines dissolve rather than clip. */}
      <div className="mt-3.5 min-h-[150px]">
        <div className="flex flex-col gap-[5px] [mask-image:linear-gradient(to_bottom,transparent,#000_18%)]">
          <AnimatePresence initial={false} mode="popLayout">
            {visible.map((l, i) => (
              <Line key={l.id} line={l} age={visible.length - 1 - i} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
