"use client";

import { useEffect, useRef } from "react";

/**
 * Marks a block paused while it is off screen.
 *
 * A looping CSS animation keeps ticking and keeps repainting when nobody can
 * see it, and this page runs thirteen of them at once: the marquee, the
 * bracket pulses, the dot plate, the typing dots, the OCR sweep. Measured on a
 * 4x-throttled CPU they were the single biggest source of dropped frames while
 * scrolling, 13.1% down to 2.7% with them off.
 *
 * The pause is driven by a data attribute rather than by unmounting anything,
 * so nothing changes visually: the moment a block is back within 200px of the
 * viewport its animations resume exactly where they were.
 */
export function useAnimGate<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        el.dataset.anim = entry.isIntersecting ? "running" : "paused";
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return ref;
}
