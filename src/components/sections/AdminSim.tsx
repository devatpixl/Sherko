"use client";

import { useInView } from "motion/react";
import { useRef, useState } from "react";
import { LiveDemoFrame, type FrameStep } from "@/components/hero/LiveDemoFrame";
import { SimEndCard } from "@/components/hero/SimEndCard";
import { Container, Reveal, Section, SectionHead } from "@/components/ui";
import { useLocale, type Bi } from "@/lib/i18n";

/* The order desk, shown by running the actual admin portal rather than a
   replica of it. See LiveDemoFrame for how the cursor drives it. */

const FRAME_W = 1440;
const FRAME_H = 900;

const copy = {
  eyebrow: { no: "Systemet", en: "The system" } as Bi,
  title: {
    no: "Og hele ordredesken bak den",
    en: "And the whole order desk behind it",
  } as Bi,
  body: {
    no: "Sherko er ikke bare en bot. Ordren lander i et ekte system — med kunderegister, katalog, priser, lager og godkjenning. Dette er selve appen, ikke et bilde av den.",
    en: "Sherko is not just a bot. The order lands in a real system — customer registry, catalogue, prices, stock and approval. This is the actual app, not a picture of it.",
  } as Bi,
  caption: {
    no: "Sherko Admin · ekte app, oppdiktede tall",
    en: "Sherko Admin · real app, invented figures",
  } as Bi,
};

/* Controls are found by visible text, so this survives markup changes
   upstream — which is the whole reason for framing the real thing.

   The product picker is driven by typing rather than clicking. It opens its
   result list on focus, and focus is the one thing we cannot reliably take:
   Radix hands focus back to the customer combobox as that closes, which
   fires the picker's onBlur and shuts the list again. The field also opens
   on change, so typing gets there without touching focus — and showing the
   catalogue search actually narrowing is the better demo anyway. */
const PICKER = "[data-picker-popover='true'] [role='listbox'] button";

const steps: FrameStep[] = [
  { kind: "wait", ms: 1500 },

  // Orders list → the real new-order form
  { kind: "click", ms: 900, find: { text: "Ny ordre" }, settle: 2400 },

  // Real customer picker, reading the real customer registry
  { kind: "click", ms: 800, find: { text: "Velg kunde" }, settle: 1100 },
  {
    kind: "click",
    ms: 650,
    find: { role: "[role='option']", text: "Brygga Sjømatrestaurant" },
    // The line grid stays disabled until a customer resolves and the
    // catalogue finishes loading, and typing into a disabled input does
    // nothing at all — so wait for it rather than racing it.
    settle: 2600,
  },

  // First line: search the catalogue, take a row, set a quantity
  {
    kind: "type",
    ms: 850,
    find: { role: "input[placeholder='Velg produkt']", nth: 0 },
    text: "laks",
    settle: 800,
  },
  { kind: "click", ms: 600, find: { role: PICKER, text: "Laksefilet" }, settle: 1000 },
  {
    kind: "type",
    ms: 600,
    find: { role: "input[aria-label='Antall']", nth: 0 },
    text: "24",
    perChar: 140,
    settle: 1000,
  },

  // Second line, so the order total visibly moves
  {
    kind: "type",
    ms: 750,
    find: { role: "input[placeholder='Velg produkt']", nth: 1 },
    text: "kaffe",
    settle: 800,
  },
  { kind: "click", ms: 600, find: { role: PICKER, text: "Kaffe" }, settle: 1000 },
  {
    kind: "type",
    ms: 600,
    find: { role: "input[aria-label='Antall']", nth: 1 },
    text: "6",
    perChar: 160,
    settle: 1200,
  },

  { kind: "wait", ms: 2200 },
];

export function AdminSim() {
  const { locale } = useLocale();
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { margin: "-20% 0px -20% 0px" });
  const [done, setDone] = useState(false);
  const [runId, setRunId] = useState(0);

  return (
    <Section id="system" className="bg-canvas">
      <Container>
        <SectionHead eyebrow={copy.eyebrow[locale]} title={copy.title[locale]} body={copy.body[locale]} />

        <Reveal delay={0.14}>
          <div ref={stageRef} className="mt-14 md:mt-16">
            <div className="relative isolate">
              <div className="pointer-events-none absolute inset-x-0 -top-6 bottom-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 rounded-[40px] bg-ice/10 blur-[90px]" />
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/10 shadow-[0_50px_100px_-24px_rgba(0,0,0,0.85)]">
                <div className="flex h-11 items-center gap-2 bg-[#E9EAEE] px-4">
                  <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                  <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
                  <span className="h-3 w-3 rounded-full bg-[#28C840]" />
                  <div className="mx-auto flex items-center gap-2 rounded-md bg-white px-3 py-1">
                    <svg viewBox="0 0 12 12" className="h-3 w-3 text-[#8A93A3]" aria-hidden>
                      <rect x="2.5" y="5.2" width="7" height="5" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.1" />
                      <path d="M4.3 5.2V3.9a1.7 1.7 0 0 1 3.4 0v1.3" fill="none" stroke="currentColor" strokeWidth="1.1" />
                    </svg>
                    <span className="font-mono text-[11px] text-[#8A93A3]">app.sherko.no/salg/ordre</span>
                  </div>
                </div>

                <div className="relative">
                  <LiveDemoFrame
                    key={runId}
                    src="/demo/dashboard/orders"
                    steps={steps}
                    width={FRAME_W}
                    height={FRAME_H}
                    active={inView}
                    onFinished={() => setDone(true)}
                  />
                  {done && (
                    <SimEndCard
                      onReplay={() => {
                        setDone(false);
                        setRunId((n) => n + 1);
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            <p className="mt-6 text-center font-mono text-[10.5px] tracking-[0.16em] text-fg-4 uppercase">
              {copy.caption[locale]}
            </p>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
