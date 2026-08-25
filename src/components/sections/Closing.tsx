"use client";

import { motion } from "motion/react";
import { ButtonPrimary, Container, Reveal, Section, SectionHead } from "@/components/ui";
import { closing, cta } from "@/lib/content";
import { useLocale, type Bi } from "@/lib/i18n";

/* The ask, shaped like the thing we do: a drop-zone for an order.
   Not a form — the whole promise is that you don't fill anything in. */

const formats: Bi<string[]> = {
  no: ["WhatsApp-melding", "PDF eller Excel", "Bilde av en lapp"],
  en: ["WhatsApp message", "PDF or Excel", "Photo of a note"],
};

export function Closing() {
  const { locale } = useLocale();

  return (
    <Section id="kontakt" className="grain relative isolate overflow-hidden bg-canvas">
      {/* ── Atmosphere — a quieter echo of the hero, never louder ──── */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-substrate mask-radial absolute inset-0 opacity-60" />
        <div className="aurora aurora-drift absolute top-[22%] left-1/2 h-[560px] w-[900px] -translate-x-1/2 opacity-40" />
      </div>

      <Container>
        <SectionHead
          align="center"
          eyebrow={closing.eyebrow[locale]}
          title={closing.title[locale]}
          body={closing.body[locale]}
        />

        <Reveal delay={0.18}>
          <div className="mx-auto mt-14 max-w-2xl rounded-3xl border border-dashed border-line-2 bg-surface/40 px-8 py-10 text-center md:mt-16 md:px-12 md:py-12">
            {/* An order dropping into a sheet. Hairline, no fill, no colour. */}
            <svg
              viewBox="0 0 56 56"
              className="mx-auto h-14 w-14 text-fg-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              {/* The sheet, deliberately open at the top */}
              <path d="M23 18h-7a2 2 0 0 0-2 2v28a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2V20a2 2 0 0 0-2-2h-7" />
              <path d="M20 34h16M20 40h16M20 46h9" opacity="0.4" />
              {/* The order, arriving */}
              <motion.g
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              >
                <path d="M28 5v15" />
                <path d="m23.5 15.5 4.5 4.5 4.5-4.5" />
              </motion.g>
            </svg>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
              {formats[locale].map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-line px-3 py-1.5 font-mono text-[11px] tracking-[0.14em] text-fg-3 uppercase"
                >
                  {label}
                </span>
              ))}
            </div>

            <div className="mt-10">
              <ButtonPrimary href="mailto:hei@nordre.no">{cta.primary[locale]}</ButtonPrimary>
            </div>

            <p className="mt-6 font-mono text-[11px] tracking-[0.14em] text-fg-3 uppercase">
              {closing.reassure[locale]}
            </p>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
