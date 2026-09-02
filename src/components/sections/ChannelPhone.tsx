"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { PhoneSim } from "@/components/hero/PhoneSim";
import { DraftPanel } from "@/components/hero/DraftPanel";
import { Container } from "@/components/ui";
import { useSimulation } from "@/lib/useSimulation";
import { useLocale, type Bi } from "@/lib/i18n";

/* The phone used to open the page. It belongs here instead: by this point the
   reader knows what the system is, so watching a message turn into an order
   reads as evidence rather than as "we built a chatbot".

   The left column leads with the formats an order actually arrives in, each
   carrying the real brand mark rather than a dot, so the column reads top to
   bottom as the claim itself: anything on this list goes in, one order draft
   comes out. */

const EASE = [0.16, 1, 0.3, 1] as const;

type Inbound = { file: string; label: string; note: Bi };

/* Official brand files, backgrounds already flood-filled out. One mark per
   row: Outlook and Gmail sat side by side in a single "E-post" row and read as
   a stacked pair rather than a logo, so they each get their own line. */
const INBOUND: Inbound[] = [
  {
    file: "whatsapp.svg",
    label: "WhatsApp",
    note: { no: "Tekst, tale, bilde, dokument", en: "Text, voice, image, document" },
  },
  {
    file: "outlook.svg",
    label: "Outlook",
    note: { no: "Videresendt eller sendt direkte", en: "Forwarded or sent direct" },
  },
  {
    file: "gmail.png",
    label: "Gmail",
    note: { no: "E-post fra kjøkkensjefen", en: "Email from the head chef" },
  },
  {
    file: "excel.svg",
    label: "Excel",
    note: { no: "Hvilket som helst oppsett", en: "Any layout at all" },
  },
  {
    file: "pdf.png",
    label: "PDF",
    note: { no: "Digital eller skannet", en: "Digital or scanned" },
  },
  {
    file: "foto.png",
    label: "Foto",
    note: { no: "Håndskrift, tavle, kvittering", en: "Handwriting, whiteboard, receipt" },
  },
  {
    file: "sms.png",
    label: "SMS",
    note: { no: "Korte bestillinger fra butikk", en: "Short orders from a shop" },
  },
  {
    file: "googlesheets.png",
    label: "Google Sheets",
    note: { no: "Delt ark mellom kunde og selger", en: "A sheet shared with your customer" },
  },
  {
    file: "word.png",
    label: "Word",
    note: { no: "Bestillingsmal som dokument", en: "An order template as a document" },
  },
  {
    file: "csv.png",
    label: "CSV",
    note: { no: "Eksport fra kundens eget system", en: "An export from their own system" },
  },
  {
    file: "voice.png",
    label: "Talemelding",
    note: { no: "Transkribert og forstått", en: "Transcribed and understood" },
  },
  {
    file: "scan.png",
    label: "Skannet ark",
    note: { no: "Faks eller skann fra papir", en: "A fax or scan from paper" },
  },
];

export function ChannelPhone() {
  const { locale } = useLocale();
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { margin: "-15% 0px -15% 0px" });
  const { view, composerText, composerDone } = useSimulation(inView);

  return (
    <Container>
      <div
        ref={stageRef}
        className="mt-14 grid items-start gap-10 md:mt-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16"
      >
        {/* what goes in, and what comes out */}
        <div className="order-2 lg:order-none">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-10% 0px" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <p className="font-mono text-[10.5px] tracking-[0.16em] text-fg-3 uppercase">
              {locale === "no" ? "Dette går inn" : "This goes in"}
            </p>

            <ul className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line">
              {INBOUND.map((item, i) => (
                <motion.li
                  key={item.label}
                  className="flex items-center gap-3 bg-surface px-4 py-3.5 transition-colors duration-300 hover:bg-accent/8"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ margin: "-8% 0px" }}
                  transition={{ duration: 0.5, delay: 0.04 + i * 0.04, ease: EASE }}
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
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* the single thing all of them turn into */}
          <motion.div
            className="mt-7"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-10% 0px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          >
            {/* Drawn as a connector rather than a second heading: the panel
                already carries its own label, and two mono captions stacked
                28px apart read like a mistake. */}
            <div className="flex items-center gap-3 pl-4">
              <span className="h-8 w-px bg-linear-to-b from-accent/60 to-accent/10" />
              <span className="font-mono text-[10.5px] tracking-[0.16em] text-fg-3 uppercase">
                {locale === "no" ? "Ut som én ordre" : "Out as one order"}
              </span>
            </div>
            <DraftPanel form={view.form} className="mt-4 w-full max-w-[460px]" />
          </motion.div>
        </div>

        {/* the conversation it is reading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-10% 0px" }}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          className="order-1 flex justify-center lg:order-none"
        >
          {/* Scaled down so the whole exchange sits inside one screen. The
              origin is the top, so the section height follows the scale. */}
          <div className="origin-top scale-[0.62] -mb-[300px] sm:scale-[0.72] sm:-mb-[224px] lg:scale-[0.78] lg:-mb-[176px] xl:scale-[0.84] xl:-mb-[128px]">
            <PhoneSim view={view} composerText={composerText} composerDone={composerDone} />
          </div>
        </motion.div>
      </div>
    </Container>
  );
}
