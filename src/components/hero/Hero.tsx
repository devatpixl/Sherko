"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { PhoneSim } from "@/components/hero/PhoneSim";
import { SystemCardSlot } from "@/components/hero/SystemCards";
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
    <section className="grain relative overflow-hidden pt-32 pb-20 md:pt-40 lg:pt-44 lg:pb-28">
      {/* ── Atmosphere ─────────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-substrate mask-radial absolute inset-0 opacity-70" />
        <div className="aurora aurora-drift absolute -top-[24%] left-[6%] h-[900px] w-[1100px] opacity-60" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-linear-to-b from-transparent to-canvas" />
      </div>

      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-10 xl:gap-16">
          {/* ── Left: the argument ───────────────────────────────── */}
          <div className="max-w-[34rem]">
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

            <h1 className="display mt-8 text-[clamp(2.75rem,6.4vw,4.75rem)]">
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

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.28, ease: EASE }}
              className="lede mt-7 text-[1.0625rem] leading-relaxed text-fg-2 md:text-[1.125rem]"
            >
              {t(hero.lede)}{" "}
              <span className="font-medium text-fg">{t(hero.ledeEmphasis)}</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.38, ease: EASE }}
              className="mt-10 flex flex-wrap items-center gap-3"
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

          {/* ── Right: the proof ─────────────────────────────────── */}
          <div ref={stageRef} className="relative flex justify-center lg:justify-end">
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

              {/* Machine view sits BEHIND the device and slides out from under it,
                  so it never covers the conversation it is annotating. */}
              <div className="pointer-events-none absolute inset-0 z-0 hidden xl:block">
                <SystemCardSlot slot="customer" card={view.cards.customer} className="top-[76px] -left-[200px]" />
                <SystemCardSlot slot="catalog" card={view.cards.catalog} className="top-[300px] -left-[218px]" />
                <SystemCardSlot slot="order" card={view.cards.order} className="top-[520px] -left-[196px]" />
              </div>

              <div className="relative z-10 -mb-[130px] origin-top scale-[0.82] sm:-mb-[72px] sm:scale-90 lg:-mb-[101px] lg:scale-[0.86] xl:mb-0 xl:scale-100">
                <PhoneSim view={view} composerText={composerText} composerDone={composerDone} />
              </div>
            </motion.div>

            {/* Machine view — below xl: stacked under the device */}
            <div className="pointer-events-none absolute -bottom-4 left-1/2 w-[268px] -translate-x-1/2 xl:hidden">
              <SystemCardSlot slot="order" card={view.cards.order ?? view.cards.catalog} className="inset-x-0 bottom-0" />
            </div>
          </div>
        </div>
      </Container>

      {/* Legend: tells the viewer the cards are the machine, not decoration */}
      <Container className="mt-16 hidden xl:block">
        <div className="flex items-center gap-3 font-mono text-[10.5px] tracking-[0.16em] text-fg-4 uppercase">
          <span className="h-px w-8 bg-line-2" />
          {locale === "no"
            ? "Kunden ser bare samtalen. Kortene er det Nordre gjør imens."
            : "The customer only sees the chat. The cards are what Nordre is doing meanwhile."}
        </div>
      </Container>
    </section>
  );
}
