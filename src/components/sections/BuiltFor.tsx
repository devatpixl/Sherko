"use client";

import { motion } from "motion/react";
import { ChannelLanes } from "@/components/sections/ChannelStrip";
import { ExcelSwap } from "@/components/sections/ExcelSwap";
import { Container, Eyebrow, Reveal, Rule, Section } from "@/components/ui";
import { brand, channels } from "@/lib/content";
import { useLocale, type Bi } from "@/lib/i18n";

/* The positioning statement. Sherko is a vertical product and the narrowness
   is the selling point, so it is said out loud — and then proved with the
   vocabulary only someone in the trade would bother to support. */

const EASE = [0.16, 1, 0.3, 1] as const;

const copy = {
  eyebrow: { no: "Vertikal, ikke generell", en: "Vertical, not general" } as Bi,
  l1: { no: "Bygget for", en: "Built for" } as Bi,
  l2: { no: "grossister.", en: "wholesalers." } as Bi,
  l3: { no: "Ingen andre.", en: "Nobody else." } as Bi,
  body: {
    no: "Sherko er ikke en generell AI du må lære opp. Den kan bransjen din fra første dag — og forstår ordren slik kundene dine faktisk skriver den.",
    en: "Sherko is not a general AI you have to train. It knows your trade from day one — and reads an order the way your customers actually write it.",
  } as Bi,
  proofLabel: {
    no: "Forstår dette uten opplæring",
    en: "Understands these out of the box",
  } as Bi,
  /* Deliberately starts with "Og" / "And" — it continues the sentence above. */
  channelsLine: {
    no: "Og ordren kommer som kunden vil sende den.",
    en: "And the order arrives however the customer sends it.",
  } as Bi,
};

const proof: Bi[] = [
  { no: "D-pak, kolli og pall", en: "Cases, units and pallets" },
  { no: "Varenummer og EAN", en: "Article numbers and EAN" },
  { no: "Prisavtaler per kunde", en: "Per-customer price agreements" },
  { no: "MVA 15 % og 25 %", en: "VAT at 15 % and 25 %" },
  { no: "Bestillingspunkter", en: "Reorder points" },
  { no: "Restordre og delleveranser", en: "Backorders and part deliveries" },
];

export function BuiltFor() {
  const { locale } = useLocale();

  return (
    <Section id="grossister" className="relative overflow-hidden border-y border-line bg-elev">
      <div className="grid-substrate mask-radial pointer-events-none absolute inset-0 -z-10 opacity-50" />

      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end lg:gap-16">
          <div>
            <Reveal>
              <Eyebrow>{copy.eyebrow[locale]}</Eyebrow>
            </Reveal>

            <h2 className="display mt-7 text-[clamp(2.25rem,5.4vw,4rem)]">
              {[copy.l1, copy.l2, copy.l3].map((line, i) => (
                <Reveal key={line.no} delay={0.06 + i * 0.07}>
                  <span className={`block ${i === 1 ? "aurora-text pb-[0.06em]" : "text-fg"}`}>
                    {line[locale]}
                  </span>
                </Reveal>
              ))}
            </h2>

            <Reveal delay={0.28}>
              <p className="lede mt-7 max-w-xl text-[1.0625rem] leading-relaxed text-fg-2">
                {copy.body[locale]}
              </p>
            </Reveal>
          </div>

          {/* The proof: trade vocabulary a general assistant would fumble. */}
          <div>
            <Reveal delay={0.2}>
              <p className="font-mono text-[10.5px] tracking-[0.16em] text-fg-4 uppercase">
                {copy.proofLabel[locale]}
              </p>
            </Reveal>
            <ul className="mt-5 space-y-0">
              {proof.map((item, i) => (
                <Reveal key={item.no} delay={0.24 + i * 0.05}>
                  <li className="flex items-center gap-3 border-b border-line py-3.5 first:border-t">
                    <motion.svg
                      viewBox="0 0 16 16"
                      className="h-3.5 w-3.5 shrink-0 text-accent"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: 0.3 + i * 0.05, ease: EASE }}
                      aria-hidden
                    >
                      <motion.path
                        d="M3 8.5l3.2 3.2L13 5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                    <span className="text-[0.9375rem] text-fg">{item[locale]}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
            <Reveal delay={0.56}>
              <p className="mt-5 font-mono text-[11px] tracking-tight text-fg-4">
                {locale === "no"
                  ? `${brand.name} snakker grossist. Ikke chatbot.`
                  : `${brand.name} speaks wholesale. Not chatbot.`}
              </p>
            </Reveal>
          </div>
        </div>

        {/* ── The same argument, continued: how the order gets here ──── */}
        <Reveal delay={0.1}>
          <Rule className="mt-20 md:mt-24" />
        </Reveal>
      </Container>

      <div id="kanaler" className="scroll-mt-24 pt-16 md:pt-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:items-start lg:gap-16">
            <div>
              <Reveal>
                <Eyebrow>{channels.eyebrow[locale]}</Eyebrow>
              </Reveal>
              <Reveal delay={0.06}>
                <p className="display mt-6 text-[clamp(1.5rem,3.2vw,2.35rem)] text-fg">
                  {copy.channelsLine[locale]}
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.12}>
              <p className="lede text-[0.9375rem] leading-relaxed text-fg-2 lg:pt-9">
                {channels.body[locale]}
              </p>
            </Reveal>
          </div>
        </Container>

        <ChannelLanes />

        {/* Excel is not one of the formats — it is the thing being replaced. */}
        <ExcelSwap />
      </div>
    </Section>
  );
}
