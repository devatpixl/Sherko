"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { foldScript, script, scriptLength, type ChatView } from "@/lib/chatScript";
import { useLocale } from "@/lib/i18n";

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeMotion(onChange: () => void) {
  const mq = window.matchMedia(MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/** Read the OS motion preference as an external store — no state, no effect. */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia(MOTION_QUERY).matches,
    () => false, // server render: assume motion is fine, the client corrects it
  );
}

/**
 * Drives the hero conversation.
 *
 * View state is *folded* from the script rather than accumulated, so every
 * render is a pure function of the step index. React StrictMode can double-
 * invoke the effect without corrupting anything, and the loop restarts from
 * index 0 with no teardown.
 *
 * Typewriter progress is likewise derived: the interval only ever pushes a
 * (step, chars) pair forward, and everything else falls out during render.
 */
export function useSimulation(active: boolean) {
  const { locale } = useLocale();
  const reduced = usePrefersReducedMotion();
  const [i, setI] = useState(0);
  const [progress, setProgress] = useState({ step: -1, chars: 0 });

  /* Step clock */
  useEffect(() => {
    if (!active) return;
    const step = script[i];
    // Reduced motion still tells the story, just without the dwell time.
    const ms = reduced ? Math.min(step.ms, 500) : step.ms;
    const t = window.setTimeout(() => setI((n) => (n + 1) % scriptLength), ms);
    return () => window.clearTimeout(t);
  }, [i, active, reduced]);

  /* Composer typewriter — only runs while the current step is a `compose` */
  useEffect(() => {
    const step = script[i];
    if (step.kind !== "compose" || reduced || !active) return;
    const total = step.text[locale].length;
    const per = Math.max(14, (step.ms * 0.78) / total);
    let n = 0;
    const id = window.setInterval(() => {
      // Type in small bursts — a steady one-char metronome reads robotic.
      n = Math.min(total, n + (Math.random() < 0.22 ? 2 : 1));
      setProgress({ step: i, chars: n });
      if (n >= total) window.clearInterval(id);
    }, per);
    return () => window.clearInterval(id);
  }, [i, locale, reduced, active]);

  const view: ChatView = useMemo(() => foldScript(i), [i]);

  const full = view.composing ? view.composing[locale] : "";
  const typed = !view.composing
    ? 0
    : reduced || !active
      ? full.length
      : progress.step === i
        ? progress.chars
        : 0;

  return {
    view,
    composerText: full.slice(0, typed),
    composerDone: Boolean(view.composing) && typed >= full.length,
    step: i,
    reduced,
  };
}
