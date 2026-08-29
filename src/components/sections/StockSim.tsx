"use client";

import { useInView } from "motion/react";
import { useRef, useState } from "react";
import { LiveDemoFrame, type FrameStep } from "@/components/hero/LiveDemoFrame";
import { SimEndCard } from "@/components/hero/SimEndCard";
import { Container, Reveal, Section, SectionHead } from "@/components/ui";
import { useLocale, type Bi } from "@/lib/i18n";

/* The inventory side, shown by running the actual portal. Same approach as
   AdminSim — see LiveDemoFrame. */

const FRAME_W = 1440;
const FRAME_H = 900;

const copy = {
  eyebrow: { no: "Lager", en: "Inventory" } as Bi,
  title: { no: "Alt på lager, i sanntid", en: "Everything in stock, in real time" } as Bi,
  body: {
    no: "Samme system holder styr på beholdningen. Ingen telling i regneark, ingen tall som er en uke gamle.",
    en: "The same system keeps track of the stock. No counting in spreadsheets, no numbers that are a week old.",
  } as Bi,
  caption: {
    no: "Sherko Admin · ekte app, oppdiktede tall",
    en: "Sherko Admin · real app, invented figures",
  } as Bi,
};

const steps: FrameStep[] = [
  { kind: "wait", ms: 2200 },
  { kind: "click", ms: 900, find: { text: "Lageroversikt" }, settle: 3200 },
  { kind: "wait", ms: 3000 },
];

export function StockSim() {
  const { locale } = useLocale();
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { margin: "-20% 0px -20% 0px" });
  const [done, setDone] = useState(false);
  const [runId, setRunId] = useState(0);

  return (
    <Section id="lager" className="border-y border-line bg-elev">
      <Container>
        <SectionHead eyebrow={copy.eyebrow[locale]} title={copy.title[locale]} body={copy.body[locale]} />

        <Reveal delay={0.14}>
          <div ref={stageRef} className="mt-14 md:mt-16">
            <div className="relative isolate">
              <div className="pointer-events-none absolute inset-x-0 -top-6 bottom-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 rounded-[40px] bg-accent/8 blur-[90px]" />
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/10 shadow-[0_50px_100px_-24px_rgba(0,0,0,0.85)]">
                <div className="flex h-11 items-center gap-2 bg-[#E9EAEE] px-4">
                  <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                  <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
                  <span className="h-3 w-3 rounded-full bg-[#28C840]" />
                  <div className="mx-auto rounded-md bg-white px-3 py-1">
                    <span className="font-mono text-[11px] text-[#8A93A3]">app.sherko.no/lager</span>
                  </div>
                </div>

                <div className="relative">
                  <LiveDemoFrame
                    key={runId}
                    src="/demo/dashboard/inventory/lager"
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
