"use client";

import { motion } from "motion/react";
import { Container, Reveal } from "@/components/ui";
import { Mark } from "@/components/site/Wordmark";
import { useLocale, type Bi } from "@/lib/i18n";
import { useAnimGate } from "@/lib/useAnimGate";

/* The core claim of the site: the spreadsheet goes, the system arrives.
 *
 * Structure taken from the earlier version of this page, which said it in
 * three steps rather than in one wide before/after window. The window forced
 * two tables of near-identical rows side by side and the eye had to hunt for
 * what changed. Three steps say it in one read: the sheet, the thing that
 * reads it, the order sitting in the system.
 *
 * The marks advance one at a time, and it loops for as long as the section is
 * on screen, so it is never a still picture you happened to arrive after.
 */

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
};

type Step = { key: string; title: Bi; note: Bi; body: Bi };

const STEPS: Step[] = [
  {
    key: "sheet",
    title: { no: "Regnearket", en: "The spreadsheet" },
    note: { no: "Manuelt · til nå", en: "Manual · until now" },
    body: {
      no: "Én fil, én person som kan den, og ingen historikk på hvem som endret hva.",
      en: "One file, one person who knows it, and no record of who changed what.",
    },
  },
  {
    key: "sherko",
    title: { no: "Sherko", en: "Sherko" },
    note: { no: "Leser og forstår", en: "Reads and understands" },
    body: {
      no: "Leser ordren i formatet den kom i, slår opp varenummer og pris, og lager et utkast.",
      en: "Reads the order in whatever format it arrived, looks up article number and price, and drafts it.",
    },
  },
  {
    key: "system",
    title: { no: "Ordren i systemet", en: "The order in the system" },
    note: { no: "Søkbar · sporbar", en: "Searchable · traceable" },
    body: {
      no: "Du godkjenner. Da ligger ordren i lageret, på kundekortet og i rapportene med én gang.",
      en: "You approve. The order is then in stock, on the customer record and in the reports at once.",
    },
  },
];

/* Excel's own mark with a blade through it: this is the step being retired. */
function SheetMark() {
  return (
    <span className="relative grid h-12 w-12 place-items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logos/apps/excel.svg" alt="" aria-hidden className="h-10 w-10 object-contain opacity-70" />
      <span className="absolute inset-x-[-2px] top-1/2 h-[2px] -translate-y-1/2 rotate-[-32deg] rounded-full bg-accent" />
    </span>
  );
}

function SystemMark() {
  return (
    <span className="grid h-12 w-12 place-items-center text-accent">
      <svg viewBox="0 0 24 24" className="h-8 w-8" aria-hidden>
        <ellipse cx="12" cy="6" rx="7.5" ry="3.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4.5 6v6c0 1.8 3.4 3.2 7.5 3.2s7.5-1.4 7.5-3.2V6" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4.5 12v6c0 1.8 3.4 3.2 7.5 3.2s7.5-1.4 7.5-3.2v-6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </span>
  );
}

const MARKS = [<SheetMark key="a" />, <Mark key="b" className="h-9 w-9 text-accent" />, <SystemMark key="c" />];

/** The travelling pulse between two cards. */
function Connector({ index }: { index: number }) {
  return (
    <div aria-hidden className="relative hidden h-px w-full min-w-[2rem] max-w-[5rem] flex-1 self-center bg-line md:block">
      {/* An arrow head, not a dot: a dot travelling a line says "loading",
          an arrow head says which way the work moves. */}
      <motion.span
        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 text-accent"
        initial={{ left: "0%", opacity: 0 }}
        animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
        transition={{
          duration: 1.1,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 2.2,
          delay: index * 1.1,
        }}
      >
        <svg viewBox="0 0 12 12" className="block h-3 w-3 fill-current" aria-hidden>
          <path d="M1.5 1.2 10.5 6 1.5 10.8 3.2 6z" />
        </svg>
      </motion.span>
    </div>
  );
}

export function ExcelSwap() {
  const { locale } = useLocale();
  const gate = useAnimGate<HTMLDivElement>();

  return (
    <div ref={gate} className="pt-32 md:pt-40 lg:pt-48">
      <Container>
        {/* Left aligned, like every other section on the page. It used to be
            centred, which made the page swing between two alignments. */}
        <Reveal>
          <h2 className="display max-w-[20ch] text-[clamp(2rem,4.6vw,3.6rem)] text-fg">
            {copy.title[locale]}
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="lede mt-6 max-w-[58ch] text-[1.0625rem] leading-relaxed text-fg-2">
            {copy.sub[locale]}
          </p>
        </Reveal>

        <div className="mt-12 flex flex-col items-stretch gap-4 md:mt-16 md:flex-row md:items-stretch md:gap-0">
          {STEPS.map((step, i) => (
            <Fragmentish key={step.key}>
              {i > 0 && <Connector index={i - 1} />}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ margin: "-10% 0px" }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: EASE }}
                className={`card flex flex-1 flex-col gap-4 p-7 ${
                  i === 2 ? "border-accent/45" : ""
                }`}
              >
                {MARKS[i]}
                <span>
                  <span
                    className={`display block text-[1.125rem] ${
                      i === 0 ? "text-fg-3 line-through decoration-accent/60 decoration-2" : "text-fg"
                    }`}
                  >
                    {step.title[locale]}
                  </span>
                  <span className="mt-1.5 block font-mono text-[10.5px] tracking-[0.16em] text-fg-3 uppercase">
                    {step.note[locale]}
                  </span>
                  <span className="mt-3.5 block text-[0.9375rem] leading-relaxed text-fg-2">
                    {step.body[locale]}
                  </span>
                </span>
              </motion.div>
            </Fragmentish>
          ))}
        </div>
      </Container>
    </div>
  );
}

/* Named rather than inline so the connector and the card stay siblings inside
   the flex row instead of being wrapped in a box that breaks the layout. */
function Fragmentish({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
