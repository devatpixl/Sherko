"use client";

import { animate, motion, useMotionValue } from "motion/react";
import { useEffect, type RefObject } from "react";
import { paced } from "@/lib/pace";

/* Shared cursor for the portal simulations.

   Targets are resolved by NAME from the DOM (`data-cur="…"`) rather than by
   pixel coordinates, so the choreography survives any layout change. */

const EASE = [0.16, 1, 0.3, 1] as const;

export type CursorValues = {
  x: ReturnType<typeof useMotionValue<number>>;
  y: ReturnType<typeof useMotionValue<number>>;
};

export function Cursor({
  x,
  y,
  clicking,
}: CursorValues & { clicking: boolean }) {
  return (
    <motion.div style={{ x, y }} className="pointer-events-none absolute top-0 left-0 z-50" aria-hidden>
      {clicking && (
        <motion.span
          key={`${Math.round(x.get())}-${Math.round(y.get())}`}
          initial={{ scale: 0.2, opacity: 0.7 }}
          animate={{ scale: 2.6, opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="absolute -top-4 -left-4 h-8 w-8 rounded-full bg-[#2F6BFF]/50"
        />
      )}
      <motion.svg
        viewBox="0 0 24 24"
        width="26"
        height="26"
        animate={{ scale: clicking ? 0.82 : 1 }}
        transition={{ duration: 0.13 }}
        className="drop-shadow-[0_3px_6px_rgba(16,24,40,0.45)]"
      >
        <path d="M5 2.5 19 12l-6.1 1.1L10.4 19 5 2.5Z" fill="#fff" stroke="#101828" strokeWidth="1.4" strokeLinejoin="round" />
      </motion.svg>
    </motion.div>
  );
}

/**
 * Drives the cursor to the named target inside `canvasRef`, and — when the
 * frame is horizontally scrollable (mobile) — keeps the action in frame.
 *
 * `deps` should contain whatever state can move the target's position, so the
 * cursor re-resolves after the UI changes underneath it.
 */
export function useSimCursor({
  canvasRef,
  scrollRef,
  target,
  canvasW,
  reduced,
  deps = [],
  start,
}: {
  canvasRef: RefObject<HTMLDivElement | null>;
  scrollRef?: RefObject<HTMLDivElement | null>;
  target: string | null;
  canvasW: number;
  reduced: boolean;
  deps?: unknown[];
  start: { x: number; y: number };
}): CursorValues {
  const x = useMotionValue(start.x);
  const y = useMotionValue(start.y);

  useEffect(() => {
    if (!target || !canvasRef.current) return;
    const el = canvasRef.current.querySelector<HTMLElement>(`[data-cur="${target}"]`);
    if (!el) return;

    const c = canvasRef.current.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const s = c.width / canvasW || 1;
    // Back out of the CSS scale into unscaled canvas coordinates.
    const cx = (r.left - c.left) / s + r.width / s / 2;
    const cy = (r.top - c.top) / s + r.height / s / 2;

    const opts = { duration: reduced ? 0 : paced(550) / 1000, ease: EASE };
    const a = animate(x, cx, opts);
    const b = animate(y, cy, opts);

    const wrap = scrollRef?.current;
    if (wrap && wrap.scrollWidth > wrap.clientWidth + 2) {
      wrap.scrollTo({
        left: Math.max(0, cx * s - wrap.clientWidth / 2),
        behavior: reduced ? "auto" : "smooth",
      });
    }

    return () => {
      a.stop();
      b.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, canvasW, reduced, x, y, ...deps]);

  return { x, y };
}
