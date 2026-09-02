"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { useLocale, type Bi } from "@/lib/i18n";
import { usePrefersReducedMotion } from "@/lib/useSimulation";

/* Zapier's rising-line treatment, plotted on the only numbers this page can
   honestly plot: the two timelines printed directly above it.
 *
 * X is minutes elapsed from the moment the message lands. Y is how many of the
 * six steps are done. Both series are read straight from the timestamps in the
 * columns above, so the chart is a restatement of the copy rather than a new
 * claim. No growth curve, no invented customer results.
 *
 * The axis is linear on purpose. Sherko finishing inside the first minute of a
 * 13-hour span *should* look like a wall against a long shallow crawl, and
 * rescaling to make the orange line more gradual would flatter it into a lie.
 *
 * Both lines are drawn in the accent: the today line at low opacity, the Sherko
 * line at full strength. One colour family, two weights, so the eye reads them
 * as the same measurement rather than as two unrelated charts.
 *
 * Everything re-runs whenever the chart re-enters view, so the draw is never
 * something you have to reload the page to see again. */

const EASE = [0.16, 1, 0.3, 1] as const;

/** Minutes after 22:14, matching BEFORE_TIMES / AFTER_TIMES in Problem.tsx. */
const TODAY = [0, 616, 638, 651, 666, 806]; // 22:14 → 08:30 → … → 11:40 next day
const SHERKO = [0, 0.05, 0.3, 0.7, 0.9, 1.02]; // 22:14 → 22:15, 61 seconds end to end

const copy = {
  title: { no: "Samme ordre, to tidslinjer", en: "The same order, two timelines" } as Bi,
  note: {
    no: "Minutter fra meldingen lander til ordren ligger i systemet. Punktene er de samme seks stegene som står over.",
    en: "Minutes from the message landing to the order being in the system. The points are the same six steps listed above.",
  } as Bi,
  today: { no: "I dag", en: "Today" } as Bi,
  withUs: { no: "Med Sherko", en: "With Sherko" } as Bi,
  start: { no: "22:14 søndag", en: "22:14 Sunday" } as Bi,
  end: { no: "11:40 mandag", en: "11:40 Monday" } as Bi,
  todayTotal: { no: "13t 26min", en: "13h 26min" } as Bi,
  usTotal: { no: "61 sek", en: "61 sec" } as Bi,
};

const W = 720;
const H = 240;
const PAD_L = 8;
const PAD_R = 108;
const PAD_T = 16;
const PAD_B = 34;
const MAX_X = 806;
const STEPS = 6;

const x = (min: number) => PAD_L + (min / MAX_X) * (W - PAD_L - PAD_R);
const y = (step: number) => H - PAD_B - (step / STEPS) * (H - PAD_T - PAD_B);

/** Stepped path: time passes flat, then a step completes. */
function steppedPath(mins: number[]) {
  let d = `M${x(0)} ${y(0)}`;
  mins.forEach((m, i) => {
    d += ` L${x(m).toFixed(1)} ${y(i)}`;
    d += ` L${x(m).toFixed(1)} ${y(i + 1)}`;
  });
  return d;
}

function areaPath(mins: number[]) {
  return `${steppedPath(mins)} L${x(mins[mins.length - 1]).toFixed(1)} ${y(0)} Z`;
}

export function ElapsedChart() {
  const { locale } = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-12% 0px" });
  const reduced = usePrefersReducedMotion();
  const dur = reduced ? 0 : 1;

  return (
    <div ref={ref} className="mt-5 rounded-2xl border border-line bg-surface/40 p-6 md:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h3 className="display text-[1.125rem] text-fg">{copy.title[locale]}</h3>
        <div className="flex items-center gap-5 font-mono text-[10.5px] tracking-[0.14em] uppercase">
          <span className="flex items-center gap-2 text-fg-3">
            <span className="h-px w-5 bg-accent/35" />
            {copy.today[locale]}
          </span>
          <span className="flex items-center gap-2 text-accent">
            <span className="h-px w-5 bg-accent" />
            {copy.withUs[locale]}
          </span>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-6 w-full overflow-visible" role="img"
        aria-label={`${copy.title[locale]}. ${copy.note[locale]}`}>
        <defs>
          <linearGradient id="elapsed-accent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="elapsed-today" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* one gridline per completed step */}
        {Array.from({ length: STEPS + 1 }, (_, i) => (
          <line key={i} x1={PAD_L} x2={W - PAD_R} y1={y(i)} y2={y(i)}
            stroke="currentColor" className="text-line" strokeWidth="1" />
        ))}

        {/* today: the long crawl */}
        <motion.path d={areaPath(TODAY)} fill="url(#elapsed-today)"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: dur * 0.55, ease: EASE }} />
        <motion.path d={steppedPath(TODAY)} fill="none" stroke="var(--color-accent)"
          strokeOpacity="0.38" strokeWidth="2" strokeLinejoin="round"
          initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: dur * 1.6, ease: EASE }} />

        {/* sherko: done inside the first minute */}
        <motion.path d={areaPath(SHERKO)} fill="url(#elapsed-accent)"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: dur * 0.35, ease: EASE }} />
        <motion.path d={steppedPath(SHERKO)} fill="none" stroke="var(--color-accent)"
          strokeWidth="2.4" strokeLinejoin="round"
          initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: dur * 0.7, ease: EASE }} />

        {/* endpoints, labelled with the totals the columns already state */}
        <motion.g initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: dur * 0.75, ease: EASE }}>
          <circle cx={x(SHERKO[5])} cy={y(STEPS)} r="4" fill="var(--color-accent)" />
          <text x={x(SHERKO[5]) + 12} y={y(STEPS) + 4} className="fill-accent"
            style={{ font: "500 13px var(--font-mono)" }}>
            {copy.usTotal[locale]}
          </text>
        </motion.g>

        <motion.g initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: dur * 1.5, ease: EASE }}>
          <circle cx={x(TODAY[5])} cy={y(STEPS)} r="4" fill="var(--color-accent)" fillOpacity="0.45" />
          <text x={x(TODAY[5]) + 12} y={y(STEPS) + 4} className="fill-current text-fg-3"
            style={{ font: "500 13px var(--font-mono)" }}>
            {copy.todayTotal[locale]}
          </text>
        </motion.g>

        <text x={PAD_L} y={H - 10} className="fill-current text-fg-4"
          style={{ font: "400 11px var(--font-mono)" }}>
          {copy.start[locale]}
        </text>
        <text x={x(MAX_X)} y={H - 10} textAnchor="end" className="fill-current text-fg-4"
          style={{ font: "400 11px var(--font-mono)" }}>
          {copy.end[locale]}
        </text>
      </svg>

      <p className="mt-5 max-w-[62ch] text-[0.875rem] leading-relaxed text-fg-3">
        {copy.note[locale]}
      </p>
    </div>
  );
}
