"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { PhoneSim } from "@/components/hero/PhoneSim";
import { DraftPanel } from "@/components/hero/DraftPanel";
import { ButtonGhost, ButtonPrimary, Container } from "@/components/ui";
import { cta, hero } from "@/lib/content";
import { useLocale } from "@/lib/i18n";
import { useSimulation } from "@/lib/useSimulation";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const { locale } = useLocale();
  const stageRef = useRef<HTMLDivElement>(null);
  // Pause the loop when the hero scrolls away — no point animating off-screen.
  const inView = useInView(stageRef, { margin: "-15% 0px -15% 0px" });
  const { view, composerText, composerDone } = useSimulation(inView);

  const t = <T,>(pair: { no: T; en: T }) => pair[locale];

  return (
    <section className="grain relative overflow-hidden pt-24 pb-16 md:pt-32 lg:pt-44 lg:pb-28">
      {/* ── Atmosphere ─────────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-substrate mask-radial absolute inset-0 opacity-70" />
        <div className="aurora aurora-drift absolute -top-[24%] left-[6%] h-[900px] w-[1100px] opacity-60" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-linear-to-b from-transparent to-canvas" />
      </div>

      <Container>
        {/*
          Mobile reads heading → device → copy, so the demo is the second thing
          you see rather than sitting under eight lines of body text. On lg the
          copy re-collapses into a single left column beside the device.

          `contents` lets the two copy blocks become direct flex children on
          mobile (so `order` applies to them), then `lg:block` puts them back
          into one grid cell.
        */}
        <div className="flex flex-col gap-9 sm:gap-10 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10 xl:gap-16">
          <div className="contents lg:block lg:max-w-[32rem] xl:max-w-[28rem]">
            {/* ── The claim ──────────────────────────────────────── */}
            <div className="order-1">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
                className="inline-flex items-center gap-2.5 rounded-full border border-line-2 bg-surface/60 py-1.5 pr-4 pl-1.5 backdrop-blur-sm"
              >
                <span className="rounded-full bg-accent/12 px-2.5 py-1 font-mono text-[10px] font-medium tracking-[0.14em] text-accent uppercase">
                  Beta
                </span>
                <span className="text-[13px] tracking-tight text-fg-2">{t(hero.eyebrow)}</span>
              </motion.div>

              <h1 className="display mt-6 text-[clamp(2.5rem,6.4vw,4.75rem)] md:mt-8">
                <motion.span
                  className="block text-fg"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.85, delay: 0.08, ease: EASE }}
                >
                  {t(hero.headline.l1)}
                </motion.span>
                <motion.span
                  className="aurora-text block pb-[0.08em]"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.85, delay: 0.16, ease: EASE }}
                >
                  {t(hero.headline.l2)}
                </motion.span>
              </h1>
            </div>

            {/* ── The explanation, after the proof on mobile ─────── */}
            <div className="order-3 lg:mt-7">
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.28, ease: EASE }}
                className="lede text-[1.0625rem] leading-relaxed text-fg-2 md:text-[1.125rem]"
              >
                {t(hero.lede)} <span className="font-medium text-fg">{t(hero.ledeEmphasis)}</span>
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.38, ease: EASE }}
                className="mt-8 flex flex-wrap items-center gap-3 md:mt-10"
              >
                <ButtonPrimary href="#kontakt">{t(cta.primary)}</ButtonPrimary>
                <ButtonGhost href="#hvordan">{t(cta.secondary)}</ButtonGhost>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mt-6 font-mono text-[11.5px] tracking-tight text-fg-4"
              >
                {t(hero.footnote)}
              </motion.p>
            </div>
          </div>

          {/* ── The proof ────────────────────────────────────────── */}
          <div
            ref={stageRef}
            className="relative order-2 flex justify-center lg:order-none lg:justify-end"
          >
            <motion.div
              initial={{ opacity: 0, y: 40, rotateX: 8, rotateY: -10 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, rotateY: 0 }}
              transition={{ duration: 1.1, delay: 0.18, ease: EASE }}
              style={{ perspective: 1600 }}
              className="relative"
            >
              {/* Light pooling behind the device */}
              <div className="pointer-events-none absolute -inset-24 -z-10">
                <div className="absolute inset-0 rounded-full bg-accent/12 blur-[100px]" />
                <div className="absolute inset-x-10 top-1/3 bottom-0 rounded-full bg-violet/12 blur-[90px]" />
              </div>

              {/* The order form fills itself in alongside the device. Below xl
                  there is no room for a second column, so it's absent. */}
              <DraftPanel
                form={view.form}
                className="absolute top-[118px] -left-[330px] hidden w-[300px] xl:block"
              />

              <div className="relative z-10 -mb-[159px] origin-top scale-[0.78] sm:-mb-[72px] sm:scale-90 lg:-mb-[101px] lg:scale-[0.86] xl:mb-0 xl:scale-100">
                <PhoneSim view={view} composerText={composerText} composerDone={composerDone} />
              </div>
            </motion.div>
          </div>
        </div>
      </Container>

      {/* Legend: tells the viewer the cards are the machine, not decoration */}
      <Container className="mt-16 hidden xl:block">
        <div className="flex items-center gap-3 font-mono text-[10.5px] tracking-[0.16em] text-fg-4 uppercase">
          <span className="h-px w-8 bg-line-2" />
          {locale === "no"
            ? "Kunden skriver en melding. Nordre fyller ut ordren."
            : "The customer writes a message. Nordre fills in the order."}
        </div>
      </Container>
    </section>
  );
}
