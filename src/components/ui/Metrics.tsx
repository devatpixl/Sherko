"use client";

import { useCallback, useEffect, useRef } from "react";
import { animate, motion, useInView } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/useSimulation";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * A figure that counts up when it scrolls into view, the way zapier.com runs
 * its headline number.
 *
 * Driven off rAF rather than a state-per-tick interval, and it eases out so it
 * decelerates into the final value instead of stopping dead. Under
 * prefers-reduced-motion it simply renders the number.
 */
export function CountUp({
  to,
  suffix = "",
  prefix = "",
  decimals = 0,
  duration = 1.6,
  className = "",
  /** locale-aware grouping, so 13426 reads as 13 426 in Norwegian */
  group = true,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
  group?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { margin: "-12% 0px" });
  const reduced = usePrefersReducedMotion();

  const format = useCallback(
    (n: number) =>
      n.toLocaleString("nb-NO", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        useGrouping: group,
      }),
    [decimals, group],
  );

  /* Written straight to the DOM node rather than held in state: a count-up
     re-renders on every frame otherwise, and none of those renders change
     anything but one text node. */
  useEffect(() => {
    const el = numRef.current;
    if (!el) return;
    if (!inView) {
      el.textContent = format(0);
      return;
    }
    if (reduced) {
      el.textContent = format(to);
      return;
    }
    const controls = animate(0, to, {
      /* A small target has few distinct integers to show, so the easing has to
         spread them evenly instead of front-loading them. */
      duration: to <= 20 ? duration * 1.35 : duration,
      ease: [0.33, 0.02, 0.24, 1],
      onUpdate: (v) => {
        el.textContent = format(v);
      },
    });
    return () => controls.stop();
  }, [inView, to, duration, reduced, format]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <span ref={numRef} className="tabular-nums">
        {format(0)}
      </span>
      {suffix}
    </span>
  );
}

/**
 * A line that draws itself upward as it enters view, with the area beneath it
 * filling in behind — zapier.com's "and counting" chart.
 *
 * The shape is a fixed series, not live data, and it is labelled as such
 * wherever it is used. Nothing here asserts a measured result.
 */
export function RisingLine({
  points = [6, 9, 8, 14, 13, 20, 26, 24, 34, 46, 58, 76, 92],
  className = "",
}: {
  points?: number[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-12% 0px" });
  const reduced = usePrefersReducedMotion();

  const W = 300;
  const H = 110;
  const max = Math.max(...points);
  const step = W / (points.length - 1);
  const coords = points.map((p, i) => [i * step, H - (p / max) * (H - 10) - 4] as const);
  const line = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${line} L${W} ${H} L0 ${H} Z`;

  return (
    <div ref={ref} className={className}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full overflow-visible" aria-hidden>
        <defs>
          <linearGradient id="rise-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>

        <motion.path
          d={area}
          fill="url(#rise-fill)"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: reduced ? 0 : 0.5, ease: EASE }}
        />
        <motion.path
          d={line}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: reduced ? 0 : 1.4, ease: EASE }}
        />
        {/* the head of the line, arriving as it lands */}
        <motion.circle
          cx={coords[coords.length - 1][0]}
          cy={coords[coords.length - 1][1]}
          r="3.5"
          fill="var(--color-accent)"
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.35, delay: reduced ? 0 : 1.25, ease: EASE }}
          style={{ transformOrigin: `${coords[coords.length - 1][0]}px ${coords[coords.length - 1][1]}px` }}
        />
      </svg>
    </div>
  );
}
