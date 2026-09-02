"use client";

import { motion } from "motion/react";
import { ButtonGhost, ButtonPrimary, Container } from "@/components/ui";
import { ProductVideo } from "@/components/ui/ProductVideo";
import { cta, hero } from "@/lib/content";
import { useLocale } from "@/lib/i18n";
import { DEMO_URL } from "@/lib/config";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Centred hero, the way cursor.com builds theirs: one claim, one line of
 * explanation, two actions, and then a single large window showing the real
 * product below the fold line.
 *
 * The phone conversation used to live here. It now has its own section further
 * down (ChannelPhone), because leading with a chat window sold the messaging
 * rather than the system, and the system is the product.
 */
export function Hero() {
  const { locale } = useLocale();
  const t = <T,>(pair: { no: T; en: T }) => pair[locale];

  return (
    <section className="grain relative overflow-hidden pt-28 pb-16 md:pt-32 lg:pt-36 lg:pb-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-substrate mask-radial absolute inset-0 opacity-60" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-linear-to-b from-transparent to-canvas" />
      </div>

      <Container>
        <div className="mx-auto flex max-w-[52rem] flex-col items-center text-center">
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

          <h1 className="display mt-7 text-[clamp(2.4rem,5.6vw,4.2rem)] [overflow-wrap:break-word] md:mt-9">
            <motion.span
              className="block text-fg"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.08, ease: EASE }}
            >
              {t(hero.headline.l1)}
            </motion.span>
            <motion.span
              className="block pb-[0.08em] text-fg"
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
            className="lede mt-7 max-w-[46ch] text-[1.0625rem] leading-relaxed text-fg-2 md:text-[1.125rem]"
          >
            {t(hero.lede)} <span className="font-medium text-fg">{t(hero.ledeEmphasis)}</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.38, ease: EASE }}
            className="mt-9 flex flex-wrap items-center justify-center gap-3"
          >
            <ButtonPrimary href={DEMO_URL} external>{t(cta.demo)}</ButtonPrimary>
            <ButtonGhost href="#kontakt">{t(cta.bookDemo)}</ButtonGhost>
          </motion.div>
        </div>

        {/* ── the product, full width under the claim ── */}
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: EASE }}
          className="mt-14 md:mt-20"
        >
          <ProductVideo
            priority
            src="/video/rapporter.mp4"
            label="sherko-demo.pixlmedia.no/dashboard/rapporter"
            className="mx-auto max-w-[1100px] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]"
          />
        </motion.div>
      </Container>
    </section>
  );
}
