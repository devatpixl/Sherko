"use client";

import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, useState } from "react";
import { Container, Reveal, Section, SectionHead } from "@/components/ui";
import { how } from "@/lib/content";
import { useLocale, type Bi } from "@/lib/i18n";

/* Copy that belongs to this component only — everything else comes from
   content.ts. */
const HUMAN_BADGE: Bi = {
  no: "← Her tar du over",
  en: "← This one is yours",
};

const PROMISE: Bi = {
  no: "Nordre skriver aldri en ordre du ikke har sett først.",
  en: "Nordre never writes an order you have not seen first.",
};

/* The pipeline draws itself from 0 → 1 as the section crosses the viewport.
   A node lights the moment the drawn line reaches it, so the lighting is a
   consequence of the draw rather than a second, unrelated animation. */
const LIT_AT = [0.02, 0.35, 0.68, 0.97];

/* The mint → ice → violet ramp, split across the three gaps of the vertical
   rail so the stacked layout still reads as one continuous run of colour. */
const RAIL = [
  "bg-linear-to-b from-accent to-ice",
  "bg-linear-to-b from-ice to-violet",
  "bg-violet",
];

/* One gap of the mobile rail. Sits inside its step and reaches down to the
   top of the next node, so it never needs to measure anything. */
function RailSegment({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const scaleY = useTransform(progress, [index / 3, (index + 1) / 3], [0, 1], { clamp: true });
  return (
    <div aria-hidden className="pointer-events-none absolute top-[50px] -bottom-12 left-[21.5px] w-px lg:hidden">
      <div className="absolute inset-0 bg-line-2 opacity-45" />
      <motion.div style={{ scaleY }} className={`absolute inset-0 origin-top ${RAIL[index]}`} />
    </div>
  );
}

export function HowItWorks() {
  const { locale } = useLocale();
  const pipeRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: pipeRef,
    offset: ["start 75%", "end 60%"],
  });

  const [lit, setLit] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    let n = 0;
    for (const t of LIT_AT) if (v >= t) n += 1;
    setLit((prev) => (prev === n ? prev : n));
  });

  return (
    <Section id="hvordan" className="bg-elev border-y border-line">
      <Container>
        <SectionHead eyebrow={how.eyebrow[locale]} title={how.title[locale]} />

        <div ref={pipeRef} className="relative mt-16 md:mt-20 lg:mt-24">
          {/* Desktop connector. Runs from the centre of node 01 to the centre
              of node 04: 3 × (column + gap) = 75% of the row + 24px at a
              32px gap. The undrawn part stays visible as a hairline. */}
          <svg
            aria-hidden
            viewBox="0 0 100 2"
            preserveAspectRatio="none"
            fill="none"
            height={2}
            style={{ width: "calc(75% + 24px)" }}
            className="pointer-events-none absolute top-[21px] left-[22px] hidden lg:block"
          >
            <defs>
              <linearGradient id="nordre-pipeline" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="var(--color-accent)" />
                <stop offset="50%" stopColor="var(--color-ice)" />
                <stop offset="100%" stopColor="var(--color-violet)" />
              </linearGradient>
            </defs>
            <path d="M0 1H100" stroke="var(--color-line-2)" strokeWidth={1} />
            <motion.path
              d="M0 1H100"
              stroke="url(#nordre-pipeline)"
              strokeWidth={1.5}
              style={{ pathLength: scrollYProgress }}
            />
          </svg>

          <ol className="grid gap-y-12 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-0">
            {how.steps.map((step, i) => {
              const isLit = i < lit;
              const isHuman = i === how.steps.length - 1;
              return (
                <li key={step.key} className="relative pl-[68px] lg:pl-0">
                  {i < how.steps.length - 1 && <RailSegment index={i} progress={scrollYProgress} />}

                  <div
                    className={`absolute top-0 left-0 z-10 flex h-11 w-11 items-center justify-center rounded-full border bg-surface transition-colors duration-500 lg:relative ${
                      isLit ? "border-accent" : "border-line-2"
                    }`}
                  >
                    {isHuman && (
                      <span
                        aria-hidden
                        className="pointer-events-none absolute -inset-[5px] rounded-full border border-accent/25"
                      />
                    )}
                    <span
                      className={`font-mono text-[12px] transition-colors duration-500 ${
                        isLit ? "text-accent" : "text-fg-3"
                      }`}
                    >
                      {step.n}
                    </span>
                  </div>

                  <Reveal delay={i * 0.06} className="lg:mt-7">
                    <h3 className="display text-[1.375rem] text-fg">{step.title[locale]}</h3>
                    <p className="lede mt-3 text-[0.9375rem] leading-relaxed text-fg-2">{step.body[locale]}</p>
                    {isHuman && (
                      <p className="mt-4 font-mono text-[11px] tracking-[0.14em] text-accent uppercase">
                        {HUMAN_BADGE[locale]}
                      </p>
                    )}
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>

        <Reveal delay={0.1}>
          <div className="card mt-16 p-6 md:mt-20 md:p-8">
            <p className="display text-[1.25rem] text-fg md:text-[1.5rem]">{PROMISE[locale]}</p>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
