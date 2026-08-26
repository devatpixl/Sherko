"use client";

import { motion } from "motion/react";
import { Container, Reveal } from "@/components/ui";
import { SpreadsheetMark } from "@/components/ui/SpreadsheetMark";
import { Mark } from "@/components/site/Wordmark";
import { useLocale, type Bi } from "@/lib/i18n";

/* Excel's role on this page is not "another format we accept" — it is the
   thing being retired. Three marks and one line, no paragraph: the sheet
   goes grey and gets struck through, Sherko reads it, the order lands in
   the system. */

const EASE = [0.16, 1, 0.3, 1] as const;

const copy = {
  title: {
    no: "Slutt å lagre ordrene i Excel.",
    en: "Stop keeping your orders in Excel.",
  } as Bi,
  sub: {
    no: "Send den. Sherko legger den rett inn i systemet.",
    en: "Send it. Sherko files it straight into the system.",
  } as Bi,
};

const steps: { label: Bi; note: Bi }[] = [
  {
    label: { no: "Regnearket", en: "The spreadsheet" },
    note: { no: "Til nå", en: "Until now" },
  },
  {
    label: { no: "Sherko", en: "Sherko" },
    note: { no: "Leser og forstår", en: "Reads and understands" },
  },
  {
    label: { no: "Ordren i systemet", en: "The order, in your system" },
    note: { no: "Søkbar. Sporbar.", en: "Searchable. Traceable." },
  },
];

/** A stored, queryable record — the thing that replaces the sheet. */
function SystemMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <ellipse cx="12" cy="6" rx="7.5" ry="3" />
      <path d="M4.5 6v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3V6" />
      <path d="M4.5 12v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6" />
    </svg>
  );
}

function Connector({ delay }: { delay: number }) {
  return (
    <div className="relative flex h-10 w-full items-center justify-center md:h-auto md:w-16">
      <svg viewBox="0 0 64 8" className="hidden w-16 text-fg-4 md:block" aria-hidden>
        <motion.path
          d="M0 4h56M50 1l6 3-6 3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay, ease: EASE }}
        />
      </svg>
      <svg viewBox="0 0 8 40" className="h-10 text-fg-4 md:hidden" aria-hidden>
        <motion.path
          d="M4 0v32M1 26l3 6 3-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay, ease: EASE }}
        />
      </svg>
    </div>
  );
}

export function ExcelSwap() {
  const { locale } = useLocale();

  return (
    <div className="pt-16 md:pt-20">
      <Container>
        <Reveal>
          <p className="display mx-auto max-w-2xl text-center text-[clamp(1.6rem,3.4vw,2.5rem)] text-fg">
            {copy.title[locale]}
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mx-auto mt-4 max-w-lg text-center text-[1rem] text-fg-2">
            {copy.sub[locale]}
          </p>
        </Reveal>

        <Reveal delay={0.14}>
          <div className="mt-11 flex flex-col items-center justify-center md:flex-row md:items-stretch">
            {/* 1 — the sheet, being retired */}
            <div className="relative w-full max-w-[15rem] rounded-2xl border border-line bg-surface/40 p-5 text-center md:w-[15rem]">
              <span className="relative mx-auto grid h-12 w-12 place-items-center">
                <SpreadsheetMark className="h-9 w-9 text-fg-3 opacity-90" />
                {/* Struck through, drawn on scroll */}
                <svg viewBox="0 0 48 48" className="absolute inset-0 h-12 w-12 text-signal" aria-hidden>
                  <motion.path
                    d="M9 39 39 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: 0.3, ease: EASE }}
                  />
                </svg>
              </span>
              <p className="mt-4 text-[0.9375rem] font-medium text-fg-3 line-through decoration-signal/70 decoration-1">
                {steps[0].label[locale]}
              </p>
              <p className="mt-1 font-mono text-[10.5px] tracking-[0.14em] text-fg-4 uppercase">
                {steps[0].note[locale]}
              </p>
            </div>

            <Connector delay={0.45} />

            {/* 2 — Sherko */}
            <div className="relative w-full max-w-[15rem] rounded-2xl border border-line bg-surface/40 p-5 text-center md:w-[15rem]">
              <span className="mx-auto grid h-12 w-12 place-items-center">
                <Mark className="h-10 w-10" />
              </span>
              <p className="mt-4 text-[0.9375rem] font-medium text-fg">{steps[1].label[locale]}</p>
              <p className="mt-1 font-mono text-[10.5px] tracking-[0.14em] text-fg-4 uppercase">
                {steps[1].note[locale]}
              </p>
            </div>

            <Connector delay={0.6} />

            {/* 3 — the record that replaces it */}
            <motion.div
              initial={{ opacity: 0.55 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.75, ease: EASE }}
              className="relative w-full max-w-[15rem] rounded-2xl border border-accent/30 bg-linear-to-b from-surface-2 to-surface p-5 text-center shadow-[0_0_60px_-18px_rgba(92,225,176,0.55)] md:w-[15rem]"
            >
              <span className="mx-auto grid h-12 w-12 place-items-center">
                <SystemMark className="h-8 w-8 text-accent" />
              </span>
              <p className="mt-4 text-[0.9375rem] font-medium text-fg">{steps[2].label[locale]}</p>
              <p className="mt-1 font-mono text-[10.5px] tracking-[0.14em] text-accent/80 uppercase">
                {steps[2].note[locale]}
              </p>
            </motion.div>
          </div>
        </Reveal>
      </Container>
    </div>
  );
}
