"use client";

import { motion } from "motion/react";
import { cta } from "@/lib/content";
import { useLocale, type Bi } from "@/lib/i18n";

/* Shown when a simulation finishes instead of looping it forever.

   A demo that restarts on its own leaves the viewer watching a treadmill with
   no way out. This ends the flow, says plainly that the data was invented, and
   hands them the two things they might want next: watch it again, or talk. */

const EASE = [0.16, 1, 0.3, 1] as const;

const copy = {
  eyebrow: { no: "Slik gjøres det", en: "That's how it's done" } as Bi,
  title: { no: "Ditt oppsett blir ditt eget.", en: "Your setup will be your own." } as Bi,
  body: {
    no: "Dette er en demo med oppdiktede kunder og tall. Ditt Sherko settes opp rundt din katalog, dine kunder og dine rutiner.",
    en: "This is a demo with invented customers and figures. Your Sherko is built around your catalogue, your customers and your routines.",
  } as Bi,
  replay: { no: "Spill av igjen", en: "Play it again" } as Bi,
};

export function SimEndCard({ onReplay }: { onReplay: () => void }) {
  const { locale } = useLocale();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="absolute inset-0 z-40 grid place-items-center bg-canvas/72 px-6 backdrop-blur-[3px]"
    >
      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.08, ease: EASE }}
        className="card w-full max-w-[440px] p-7 text-center md:p-8"
      >
        <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-accent/12">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-accent" aria-hidden>
            <motion.path
              d="M5 12.5l4.5 4.5L19 7.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.45, delay: 0.24, ease: EASE }}
            />
          </svg>
        </span>

        <p className="eyebrow mt-5 justify-center">{copy.eyebrow[locale]}</p>
        <h3 className="display mt-3 text-[1.5rem] text-fg">{copy.title[locale]}</h3>
        <p className="lede mx-auto mt-3 max-w-[34ch] text-[0.9375rem] leading-relaxed text-fg-2">
          {copy.body[locale]}
        </p>

        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onReplay}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-line-2 px-5 py-3 text-[0.875rem] font-medium tracking-tight text-fg-2 transition-colors hover:border-fg-4 hover:bg-surface hover:text-fg sm:w-auto"
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-rotate-180" aria-hidden>
              <path
                d="M13.5 8a5.5 5.5 0 1 1-1.7-3.97M13.5 2v3.2h-3.2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {copy.replay[locale]}
          </button>

          <a
            href="#kontakt"
            className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-fg px-5 py-3 text-[0.875rem] font-medium tracking-tight text-canvas transition-transform duration-300 hover:scale-[1.02] sm:w-auto"
          >
            <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-accent via-ice to-violet transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0" />
            <span className="relative">{cta.primary[locale]}</span>
            <svg viewBox="0 0 16 16" className="relative h-3.5 w-3.5" aria-hidden>
              <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
