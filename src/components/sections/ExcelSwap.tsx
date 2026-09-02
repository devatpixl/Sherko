"use client";

import { motion } from "motion/react";
import { Container, Reveal } from "@/components/ui";
import { SpreadsheetMark } from "@/components/ui/SpreadsheetMark";
import { useLocale, type Bi } from "@/lib/i18n";

/* The core claim of the whole site, so it is staged like cursor.com stages
   theirs: one centred sentence, two actions, then a single large window that
   shows the product doing the thing. No icon row, no three-step diagram.

   The left side carries Microsoft's own Excel mark with an orange blade cut
   through it; the record that replaces it is live on the right. */

const EASE = [0.16, 1, 0.3, 1] as const;

const copy = {
  title: {
    no: "Lagersystemet som erstatter regnearket.",
    en: "The warehouse system that replaces the spreadsheet.",
  } as Bi,
  sub: {
    no: "Skreddersydd for grossister. Sherko tar over det manuelle arbeidet, ordrene, lageret og oversikten, og legger det i ett system i stedet for i Excel.",
    en: "Built for wholesalers. Sherko takes over the manual work, the orders, the stock and the overview, and puts it in one system instead of in Excel.",
  } as Bi,
  before: { no: "Regnearket", en: "The spreadsheet" } as Bi,
  beforeNote: { no: "Manuelt · til nå", en: "Manual · until now" } as Bi,
  after: { no: "Sherko", en: "Sherko" } as Bi,
  afterNote: { no: "Søkbart · sporbart", en: "Searchable · traceable" } as Bi,
  win: { no: "Lager", en: "Stock" } as Bi,
};

/* Rows on both sides say the same thing, so the eye reads it as one record
   moving across rather than two unrelated tables. */
const ROWS: { art: string; name: Bi; qty: string }[] = [
  { art: "20354", name: { no: "Revet ost 70/30, 2 kg", en: "Grated cheese 70/30, 2 kg" }, qty: "612" },
  { art: "20205", name: { no: "Frityrolje 10 L", en: "Frying oil 10 L" }, qty: "31" },
  { art: "10877", name: { no: "Kavli mysost 500 g", en: "Kavli brown cheese 500 g" }, qty: "148" },
  { art: "30112", name: { no: "Laksefilet 1,2 kg", en: "Salmon fillet 1.2 kg" }, qty: "24" },
];

export function ExcelSwap() {
  const { locale } = useLocale();

  return (
    <div className="pt-32 md:pt-40 lg:pt-48">
      <Container>
        {/* ── the claim ── */}
        <Reveal>
          <h2 className="display mx-auto max-w-[18ch] text-center text-[clamp(2rem,4.6vw,3.6rem)] text-fg">
            {copy.title[locale]}
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="lede mx-auto mt-6 max-w-[58ch] text-center text-[1.0625rem] leading-relaxed text-fg-2">
            {copy.sub[locale]}
          </p>
        </Reveal>
        {/* ── one window, the swap happening inside it ── */}
        <Reveal delay={0.2}>
          <div className="mt-14 overflow-hidden rounded-2xl border border-line bg-surface md:mt-20">
            {/* window chrome */}
            <div className="flex items-center gap-[7px] border-b border-line px-4 py-3">
              {/* macOS traffic lights, in their real colours */}
              <span className="h-[11px] w-[11px] rounded-full bg-[#FF5F57]" />
              <span className="h-[11px] w-[11px] rounded-full bg-[#FEBC2E]" />
              <span className="h-[11px] w-[11px] rounded-full bg-[#28C840]" />
              <span className="ml-3 font-mono text-[10.5px] tracking-[0.16em] text-fg-3 uppercase">
                {copy.win[locale]}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr]">
              {/* left: the sheet, retired */}
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center">
                    <SpreadsheetMark className="h-9 w-9" cut />
                  </span>
                  <span>
                    <span className="block text-[0.9375rem] font-medium text-fg-3 line-through decoration-fg-4 decoration-1">
                      {copy.before[locale]}
                    </span>
                    <span className="mt-0.5 block font-mono text-[10px] tracking-[0.16em] text-fg-4 uppercase">
                      {copy.beforeNote[locale]}
                    </span>
                  </span>
                </div>

                <div className="mt-6 space-y-px opacity-45">
                  {ROWS.map((r) => (
                    <div
                      key={r.art}
                      className="grid grid-cols-[3.4rem_1fr_2.6rem] items-center gap-3 border-b border-line/60 py-2.5 font-mono text-[11.5px] text-fg-3"
                    >
                      <span className="text-fg-4">{r.art}</span>
                      <span className="truncate">{r.name[locale]}</span>
                      <span className="text-right">{r.qty}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* the hand-off */}
              <div className="relative flex items-center justify-center px-6 py-2 md:px-0 md:py-8">
                <span className="hidden h-full w-px bg-line md:block" />
                <span className="absolute grid h-9 w-9 place-items-center rounded-full border border-line bg-elev text-accent">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 rotate-90 md:rotate-0" fill="none" aria-hidden>
                    <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>

              {/* right: the same stock, now a live record */}
              <div className="border-t border-line p-6 md:border-t-0 md:p-8">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-accent/40 text-accent">
                    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                      <ellipse cx="12" cy="6" rx="7.5" ry="3" />
                      <path d="M4.5 6v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3V6" />
                      <path d="M4.5 12v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6" />
                    </svg>
                  </span>
                  <span>
                    <span className="block text-[0.9375rem] font-medium text-fg">{copy.after[locale]}</span>
                    <span className="mt-0.5 block font-mono text-[10px] tracking-[0.16em] text-fg-4 uppercase">
                      {copy.afterNote[locale]}
                    </span>
                  </span>
                </div>

                <div className="mt-6 space-y-px">
                  {ROWS.map((r, i) => (
                    <motion.div
                      key={r.art}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.5 + i * 0.07, ease: EASE }}
                      className="grid grid-cols-[3.4rem_1fr_2.6rem] items-center gap-3 border-b border-line py-2.5 font-mono text-[11.5px] text-fg-2"
                    >
                      <span className="text-fg-3">{r.art}</span>
                      <span className="truncate text-fg">{r.name[locale]}</span>
                      <span className="text-right text-accent">{r.qty}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </div>
  );
}
