"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Container, Reveal } from "@/components/ui";
import { facts } from "@/lib/content";
import { useLocale } from "@/lib/i18n";

/* ═══════════════════════════════════════════════════════════════════
   FACTS — a hairline band of capability numbers. No invented results:
   every figure here is a property of how the system is built.
   ═══════════════════════════════════════════════════════════════════ */

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Only a plain integer counts up. Anything else ("24/7") renders as written. */
function parseCount(raw: string): number | null {
  const t = raw.trim();
  return /^\d+$/.test(t) ? Number(t) : null;
}

function FactValue({
  value,
  inView,
  accent = false,
}: {
  value: string;
  inView: boolean;
  accent?: boolean;
}) {
  const target = parseCount(value);
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === null || !inView || reduced) return;
    const controls = animate(0, target, {
      duration: 1.1,
      ease: EASE,
      onUpdate: (v) => setCount(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, target, reduced]);

  /* Derived, never set in an effect: unparseable values render as written,
     reduced motion lands on the final figure, everything else rolls. */
  let display: string;
  if (target === null) display = value;
  else if (reduced) display = String(target);
  else if (!inView) display = "0";
  else display = String(count);

  return (
    <p
      className={`display text-[clamp(2.5rem,5vw,4rem)] tabular-nums ${
        accent ? "aurora-text" : "text-fg"
      }`}
    >
      {/* The true value stays in the accessibility tree while the digits roll. */}
      <span className="sr-only">{value}</span>
      <span aria-hidden>{display}</span>
    </p>
  );
}

export function Facts() {
  const { locale } = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px -15% 0px" });

  return (
    <div ref={ref} className="border-y border-line bg-canvas py-16 md:py-20">
      <Container>
        <div className="grid gap-y-10 md:grid-cols-4 md:gap-y-0 md:divide-x md:divide-line">
          {facts.map((f, i) => (
            <Reveal
              key={f.value}
              delay={0.06 * i}
              className="px-6 py-4 text-center md:text-left"
            >
              {/* Zero auto-approved orders is the number this page is about. */}
              <FactValue value={f.value} inView={inView} accent={f.value === "0"} />
              <p className="mt-2 text-[0.9375rem] text-fg-2">{f.label[locale]}</p>
              <p className="mt-1 font-mono text-[11px] text-fg-4">{f.note[locale]}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </div>
  );
}
