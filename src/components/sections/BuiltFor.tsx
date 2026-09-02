"use client";

import { motion } from "motion/react";
import { ChannelPhone } from "@/components/sections/ChannelPhone";
import { CountUp } from "@/components/ui/Metrics";
import { ExcelSwap } from "@/components/sections/ExcelSwap";
import { Container, Eyebrow, Reveal, Section } from "@/components/ui";
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
    no: "Sherko er ikke en generell AI du må lære opp. Den kan bransjen din fra første dag, og forstår ordren slik kundene dine faktisk skriver den.",
    en: "Sherko is not a general AI you have to train. It knows your trade from day one, and reads an order the way your customers actually write it.",
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
    <Section id="grossister" className="relative overflow-hidden bg-elev">
      <div className="grid-substrate mask-radial pointer-events-none absolute inset-0 -z-10 opacity-50" />

      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-center lg:gap-16">
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
            {/* Zapier leads a claim like this with figures, then the detail
                underneath. The numbers here are capability facts about how the
                system is built, not measured customer results: six formats it
                reads, two languages it speaks, zero orders it approves itself. */}
            <div className="mt-6 grid grid-cols-3 gap-4 border-y border-line py-6">
              {[
                { n: 6, unit: "", label: { no: "Formater inn", en: "Inbound formats" } },
                { n: 2, unit: "", label: { no: "Språk", en: "Languages" } },
                { n: 0, unit: "", label: { no: "Auto-godkjent", en: "Auto-approved" } },
              ].map((f, i) => (
                <div key={i}>
                  <CountUp
                    to={f.n}
                    suffix={f.unit}
                    duration={1.1 + i * 0.15}
                    className="display block text-[clamp(1.75rem,3.2vw,2.5rem)] text-accent"
                  />
                  <p className="mt-1.5 font-mono text-[10px] leading-[1.4] tracking-[0.14em] text-fg-4 uppercase">
                    {f.label[locale]}
                  </p>
                </div>
              ))}
            </div>

            <dl className="mt-2">
              {proof.map((item, i) => (
                <Reveal key={item.no} delay={0.2 + i * 0.05}>
                  <div className="group grid grid-cols-[auto_1fr] items-baseline gap-x-5 border-b border-line py-4">
                    <dt className="font-mono text-[10.5px] tracking-[0.16em] text-fg-4 tabular-nums uppercase">
                      {String(i + 1).padStart(2, "0")}
                    </dt>
                    <dd className="flex items-baseline justify-between gap-4">
                      <span className="text-[0.9375rem] text-fg">{item[locale]}</span>
                      <motion.span
                        aria-hidden
                        className="font-mono text-[10.5px] tracking-[0.16em] text-fg-4 uppercase transition-colors duration-300 group-hover:text-accent"
                        initial={{ opacity: 0, x: -6 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.3 + i * 0.05, ease: EASE }}
                      >
                        {locale === "no" ? "Innebygd" : "Built in"}
                      </motion.span>
                    </dd>
                  </div>
                </Reveal>
              ))}
            </dl>
            <Reveal delay={0.56}>
              <p className="mt-5 font-mono text-[11px] tracking-tight text-fg-4">
                {locale === "no"
                  ? `${brand.name} snakker grossist. Ikke chatbot.`
                  : `${brand.name} speaks wholesale. Not chatbot.`}
              </p>
            </Reveal>
          </div>
        </div>
      </Container>

      {/* The same argument, continued: how the order gets here. */}
      <div id="kanaler" className="scroll-mt-24 pt-32 md:pt-40 lg:pt-48">
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

        <ChannelPhone />

        {/* Excel is not one of the formats — it is the thing being replaced. */}
        <ExcelSwap />
      </div>
    </Section>
  );
}
