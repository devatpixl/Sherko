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

/* Locators are by visible text, so they keep working when the app's markup
   changes — which is the whole reason for framing the real thing. */
const steps: FrameStep[] = [
  { kind: "wait", ms: 2200 },
  { kind: "click", ms: 900, find: { text: "Ny ordre" }, settle: 3000 },
  { kind: "wait", ms: 2600 },
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
