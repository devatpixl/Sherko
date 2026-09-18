"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll reveals, all sharing one observer and animated by CSS.
 *
 * Every Reveal used to be its own motion component with its own
 * IntersectionObserver, and because they replay on the way back they were
 * animating in and out on every pass. On a page this long that is around a
 * hundred JavaScript animations competing with the scroll. Measured on a
 * throttled CPU it was roughly half the main-thread blocking time.
 *
 * One observer for the whole page, and the animation itself is a CSS
 * transition on opacity and translate, which the compositor handles without
 * touching the main thread. Behaviour is unchanged: blocks still reset when
 * they leave and play again when they come back.
 */
let shared: IntersectionObserver | null = null;

function observer() {
  if (shared) return shared;
  shared = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        entry.target.classList.toggle("is-in", entry.isIntersecting);
      }
    },
    /* Matches the old margin, so a block does not reset under something the
       reader is still looking at. */
    { rootMargin: "-12% 0px -12% 0px" },
  );
  return shared;
}

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = observer();
    io.observe(el);
    return () => io.unobserve(el);
  }, []);
  return ref;
}
