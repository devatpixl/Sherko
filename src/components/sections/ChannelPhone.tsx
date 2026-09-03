"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { PhoneSim } from "@/components/hero/PhoneSim";
import { DraftPanel } from "@/components/hero/DraftPanel";
import { Container } from "@/components/ui";
import { useSimulation } from "@/lib/useSimulation";
import { useLocale, type Bi } from "@/lib/i18n";
import { cta } from "@/lib/content";
import { DEMO_URL } from "@/lib/config";

/* Two numbered steps with the conversation between them.
 *
 * The formats used to run down the page as one tall vertical list, which is
 * why the section read as three unrelated stacks with nothing tying them
 * together. Numbering the two sides and putting a moving arrow between each
 * makes the direction explicit: everything on the left goes in, one structured
 * order comes out on the right.
 *
 * The approval note under the draft is not decoration. It is the guarantee the
 * Kontroll section spends a whole page on, said at the exact moment the draft
 * appears, which is when a reader would otherwise start worrying about it.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

type Inbound = { file: string; label: string; note: Bi };

/* Official brand files, backgrounds already flood-filled out. One mark per
   row: Outlook and Gmail sat side by side in a single "E-post" row and read as
   a stacked pair rather than a logo, so they each get their own line. */
const INBOUND: Inbound[] = [
  { file: "whatsapp.svg", label: "WhatsApp", note: { no: "Tekst, tale, bilde, dokument", en: "Text, voice, image, document" } },
  { file: "outlook.svg", label: "Outlook", note: { no: "Videresendt eller sendt direkte", en: "Forwarded or sent direct" } },
  { file: "gmail.png", label: "Gmail", note: { no: "E-post fra kjøkkensjefen", en: "Email from the head chef" } },
  { file: "excel.svg", label: "Excel", note: { no: "Hvilket som helst oppsett", en: "Any layout at all" } },
  { file: "pdf.png", label: "PDF", note: { no: "Digital eller skannet", en: "Digital or scanned" } },
  { file: "foto.png", label: "Foto", note: { no: "Håndskrift, tavle, kvittering", en: "Handwriting, whiteboard, receipt" } },
  { file: "sms.png", label: "SMS", note: { no: "Korte bestillinger fra butikk", en: "Short orders from a shop" } },
  { file: "googlesheets.png", label: "Google Sheets", note: { no: "Delt ark mellom kunde og selger", en: "A sheet shared with your customer" } },
  { file: "word.png", label: "Word", note: { no: "Bestillingsmal som dokument", en: "An order template as a document" } },
  { file: "csv.png", label: "CSV", note: { no: "Eksport fra kundens eget system", en: "An export from their own system" } },
  { file: "voice.png", label: "Talemelding", note: { no: "Transkribert og forstått", en: "Transcribed and understood" } },
  { file: "scan.png", label: "Skannet ark", note: { no: "Faks eller skann fra papir", en: "A fax or scan from paper" } },
];

const copy = {
  stepIn: { no: "Inn kommer ordren fra", en: "The order comes in from" } as Bi,
  stepOut: { no: "Ut kommer en strukturert ordre", en: "A structured order comes out" } as Bi,
  waiting: { no: "Venter på din godkjenning", en: "Waiting for your approval" } as Bi,
  waitingBody: {
    no: "Ingenting sendes før et menneske har sett over. Du åpner utkastet, retter om du vil, og godkjenner.",
    en: "Nothing is sent until a person has looked it over. You open the draft, correct it if you want, and approve.",
  } as Bi,
};

function StepNumber({ n, tone }: { n: number; tone: "in" | "out" }) {
  return (
    <span
      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border font-mono text-[11px] tabular-nums ${
        tone === "out" ? "border-accent/50 text-accent" : "border-line-2 text-fg-3"
      }`}
    >
      {n}
    </span>
  );
}

function FlowArrow() {
  return (
    /* Points down while the layout is stacked, right once it is a row. The
       nudge is a CSS animation rather than a motion loop: an always-running
       JS animation per arrow was showing up as dropped frames on scroll. */
    <div aria-hidden className="flex shrink-0 items-center justify-center self-center py-1 xl:px-1 xl:py-0">
      <svg viewBox="0 0 24 12" className="flow-arrow h-4 w-6 fill-accent">
        <path d="M0 5h16V1.5L24 6l-8 4.5V7H0z" />
      </svg>
    </div>
  );
}

export function ChannelPhone() {
  const { locale } = useLocale();
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { margin: "-15% 0px -15% 0px" });
  const { view, composerText, composerDone } = useSimulation(inView);

  return (
    <Container>
      {/* All three steps live in one panel now. The row used to be three loose
          columns that added up wider than the container, so the section broke
          the page's own edges. Inside a box, the widths have to add up. */}
      <div
        ref={stageRef}
        className="mt-12 flex flex-col gap-10 rounded-2xl border border-line bg-surface/40 p-6 md:mt-16 md:p-8 xl:flex-row xl:items-start xl:gap-3"
      >
        {/* ① what goes in */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-10% 0px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="min-w-0 xl:w-[23.5rem] xl:shrink-0"
        >
          <p className="flex items-center gap-2.5 text-[0.9375rem] font-medium text-fg">
            <StepNumber n={1} tone="in" />
            {copy.stepIn[locale]}
          </p>

          {/* One reveal for the whole grid, not one per tile.
              Twelve motion elements each with their own observer and their own
              replaying animation is what made this block stutter on every
              scroll past it. The list arrives as a unit now. */}
          <ul className="mt-5 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
            {INBOUND.map((item) => (
              <li
                key={item.label}
                className="flex min-w-0 items-center gap-3 bg-canvas px-4 py-3 transition-colors duration-300 hover:bg-accent/8"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/logos/apps/${item.file}`}
                  alt=""
                  aria-hidden
                  className="h-6 w-6 shrink-0 object-contain"
                />
                <span className="min-w-0">
                  <span className="block truncate text-[0.875rem] font-medium text-fg">
                    {item.label}
                  </span>
                  <span className="block truncate text-[0.75rem] leading-[1.45] text-fg-3">
                    {item.note[locale]}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        <FlowArrow />

        {/* the conversation itself */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-10% 0px" }}
          transition={{ duration: 0.9, delay: 0.08, ease: EASE }}
          className="flex w-full min-w-0 shrink-0 justify-center xl:w-[282px]"
        >
          {/* Scaled down so the whole exchange sits inside one screen. The
              origin is the top, so the section height follows the scale. */}
          <div className="origin-top scale-[0.62] -mb-[300px] sm:scale-[0.72] sm:-mb-[224px] xl:scale-[0.72] xl:-mb-[222px]">
            <PhoneSim view={view} composerText={composerText} composerDone={composerDone} />
          </div>
        </motion.div>

        <FlowArrow />

        {/* ② what comes out */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-10% 0px" }}
          transition={{ duration: 0.7, delay: 0.16, ease: EASE }}
          className="min-w-0 xl:w-[20.5rem] xl:shrink-0"
        >
          <p className="flex items-center gap-2.5 text-[0.9375rem] font-medium text-fg">
            <StepNumber n={2} tone="out" />
            {copy.stepOut[locale]}
          </p>

          <DraftPanel form={view.form} className="mt-5 w-full min-w-0" />

          {/* The approval guarantee, said where the draft appears. */}
          <div className="mt-5 rounded-xl border border-accent/35 bg-accent/8 p-5">
            <p className="flex items-center gap-2.5 text-[0.9375rem] font-medium text-accent">
              <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
              {copy.waiting[locale]}
            </p>
            <p className="mt-2.5 text-[0.875rem] leading-relaxed text-fg-2">
              {copy.waitingBody[locale]}
            </p>
            <a
              href={DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-[0.9375rem] font-medium text-white transition-colors duration-300 hover:bg-accent-dim"
            >
              {cta.demo[locale]}
            </a>
          </div>
        </motion.div>
      </div>
    </Container>
  );
}
