"use client";

import { AnimatePresence, motion } from "motion/react";
import type { CardSlot, SystemCard } from "@/lib/chatScript";
import { useLocale } from "@/lib/i18n";

/* The "machine view" — what Nordre is doing while the customer only sees a
   chat. Showing the reasoning beside the conversation is what separates this
   from a chat mockup: the phone is the surface, these are the mechanism. */

const TONE = {
  accent: { bar: "bg-accent", text: "text-accent", glow: "shadow-[0_0_50px_-14px_rgba(92,225,176,0.55)]" },
  ice: { bar: "bg-ice", text: "text-ice", glow: "shadow-[0_0_50px_-14px_rgba(76,201,240,0.55)]" },
  violet: { bar: "bg-violet", text: "text-violet", glow: "shadow-[0_0_50px_-14px_rgba(124,107,245,0.55)]" },
  signal: { bar: "bg-signal", text: "text-signal", glow: "shadow-[0_0_50px_-14px_rgba(240,184,73,0.55)]" },
} as const;

function Card({ card }: { card: SystemCard }) {
  const { locale } = useLocale();
  const tone = TONE[card.tone];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      className={`card glass w-[240px] p-[13px] pl-[15px] ${tone.glow}`}
    >
      <span className={`absolute inset-y-[13px] left-0 w-[2px] rounded-r ${tone.bar}`} />

      <div className="flex items-center gap-[7px]">
        <span className={`relative flex h-[5px] w-[5px] ${tone.text}`}>
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
          <span className="relative inline-flex h-[5px] w-[5px] rounded-full bg-current" />
        </span>
        <p className={`font-mono text-[10px] font-medium tracking-[0.16em] uppercase ${tone.text}`}>
          {card.eyebrow[locale]}
        </p>
      </div>

      <p className="mt-[7px] text-[15px] leading-[19px] font-medium tracking-tight text-fg">
        {card.title[locale]}
      </p>
      <p className="mt-[3px] font-mono text-[10.5px] leading-[14px] text-balance text-fg-3">
        {card.detail[locale]}
      </p>
    </motion.div>
  );
}

export function SystemCardSlot({
  card,
  slot,
  className = "",
}: {
  card: SystemCard | null;
  slot: CardSlot;
  className?: string;
}) {
  return (
    <div className={`pointer-events-none absolute ${className}`}>
      <AnimatePresence mode="wait">
        {card && <Card key={`${slot}-${card.title.no}`} card={card} />}
      </AnimatePresence>
    </div>
  );
}
