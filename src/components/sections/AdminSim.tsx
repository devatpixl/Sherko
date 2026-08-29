"use client";

import { animate, motion, useInView, useMotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Sidebar, TabStrip, TopBar } from "@/components/hero/AdminChrome";
import { NewOrder, OrderDetail, OrdersList } from "@/components/hero/AdminScreens";
import { SimEndCard } from "@/components/hero/SimEndCard";
import { Container, Reveal, Section, SectionHead } from "@/components/ui";
import { adminLength, adminScript, foldAdmin } from "@/lib/adminScript";
import { useLocale, type Bi } from "@/lib/i18n";
import { usePrefersReducedMotion } from "@/lib/useSimulation";

/* The portal, driven by a cursor. Everything in it is invented data —
   see the privacy note at the top of adminScript.ts. */

const CANVAS_W = 1280;
const CANVAS_H = 944;
/* Below this the app text stops being readable (13px * 0.27 = 3.5px), so the
   window scrolls horizontally instead of shrinking further — and the scroll
   follows the cursor, so the action stays in frame on a phone. */
const MIN_SCALE = 0.66;
const EASE = [0.16, 1, 0.3, 1] as const;

const copy = {
  eyebrow: { no: "Systemet", en: "The system" } as Bi,
  title: {
    no: "Og hele ordredesken bak den",
    en: "And the whole order desk behind it",
  } as Bi,
  body: {
    no: "Sherko er ikke bare en bot. Ordren lander i et ekte system — med kunderegister, katalog, priser, lager og godkjenning. Her er en ordre som blir lagt inn.",
    en: "Sherko is not just a bot. The order lands in a real system — customer registry, catalogue, prices, stock and approval. Here is an order being placed.",
  } as Bi,
  caption: {
    no: "Sherko Admin · demodata",
    en: "Sherko Admin · demo data",
  } as Bi,
};

/* ── The cursor ───────────────────────────────────────────────────── */

function Cursor({ x, y, clicking }: { x: ReturnType<typeof useMotionValue<number>>; y: ReturnType<typeof useMotionValue<number>>; clicking: boolean }) {
  return (
    <motion.div style={{ x, y }} className="pointer-events-none absolute top-0 left-0 z-50" aria-hidden>
      {/* Click ripple */}
      {clicking && (
        <motion.span
          key={Math.round(x.get()) + "-" + Math.round(y.get())}
          initial={{ scale: 0.2, opacity: 0.7 }}
          animate={{ scale: 2.6, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute -top-4 -left-4 h-8 w-8 rounded-full bg-[#2F6BFF]/50"
        />
      )}
      <motion.svg
        viewBox="0 0 24 24"
        width="26"
        height="26"
        animate={{ scale: clicking ? 0.82 : 1 }}
        transition={{ duration: 0.14 }}
        className="drop-shadow-[0_3px_6px_rgba(16,24,40,0.45)]"
      >
        <path d="M5 2.5 19 12l-6.1 1.1L10.4 19 5 2.5Z" fill="#fff" stroke="#101828" strokeWidth="1.4" strokeLinejoin="round" />
      </motion.svg>
    </motion.div>
  );
}

/* ── The simulation ───────────────────────────────────────────────── */

export function AdminSim() {
  const { locale } = useLocale();
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { margin: "-20% 0px -20% 0px" });
  const reduced = usePrefersReducedMotion();

  const [i, setI] = useState(0);
  const [scale, setScale] = useState(0.7);

  const x = useMotionValue(CANVAS_W * 0.5);
  const y = useMotionValue(CANVAS_H * 0.72);

  /* Fit the fixed-size canvas to whatever width the container has. */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) =>
      setScale(Math.max(entry.contentRect.width / CANVAS_W, MIN_SCALE)),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* Step clock */
  /* The clock stops at the end rather than wrapping — a demo that restarts
     forever gives the viewer no way out. `i === adminLength` means finished. */
  const done = i >= adminLength;

  useEffect(() => {
    if (!inView || done) return;
    const step = adminScript[i];
    const ms = reduced ? Math.min(step.ms, 400) : step.ms;
    const t = window.setTimeout(() => setI((n) => n + 1), ms);
    return () => window.clearTimeout(t);
  }, [i, inView, reduced, done]);

  const { state, target, clicking } = foldAdmin(i);

  /* Drive the cursor to whatever the current step points at. Targets are
     resolved by name from the DOM, so nothing breaks when the layout moves. */
  useEffect(() => {
    if (!target || !canvasRef.current) return;
    const el = canvasRef.current.querySelector<HTMLElement>(`[data-cur="${target}"]`);
    if (!el) return;
    const c = canvasRef.current.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const s = c.width / CANVAS_W || 1;
    // Convert viewport px back into unscaled canvas coordinates.
    const cx = (r.left - c.left) / s + r.width / s / 2;
    const cy = (r.top - c.top) / s + r.height / s / 2;
    const opts = { duration: reduced ? 0 : 0.62, ease: EASE };
    const a = animate(x, cx, opts);
    const b = animate(y, cy, opts);

    const wrap = wrapRef.current;
    if (wrap && wrap.scrollWidth > wrap.clientWidth + 2) {
      wrap.scrollTo({
        left: Math.max(0, cx * s - wrap.clientWidth / 2),
        behavior: reduced ? "auto" : "smooth",
      });
    }
    return () => {
      a.stop();
      b.stop();
    };
  }, [target, state.view, state.customerOpen, state.productOpen, x, y, reduced]);

  return (
    <Section id="system" className="bg-canvas">
      <Container>
        <SectionHead eyebrow={copy.eyebrow[locale]} title={copy.title[locale]} body={copy.body[locale]} />

        <Reveal delay={0.14}>
          <div ref={stageRef} className="mt-14 md:mt-16">
            {/* Light pooling under the machine */}
            <div className="relative isolate">
              <div className="pointer-events-none absolute inset-x-0 -top-6 bottom-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 rounded-[40px] bg-ice/10 blur-[90px]" />
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/10 shadow-[0_50px_100px_-24px_rgba(0,0,0,0.85)]">
                {/* Browser chrome */}
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

                {/* Scaled app canvas */}
                <div className="relative">
                <div
                  ref={wrapRef}
                  className="w-full overflow-x-auto overscroll-x-contain bg-adm-bg [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  style={{ height: CANVAS_H * scale }}
                >
                  <div className="relative" style={{ width: CANVAS_W * scale, height: CANVAS_H * scale }}>
                  <div
                    ref={canvasRef}
                    className="absolute top-0 left-0 origin-top-left"
                    style={{ width: CANVAS_W, height: CANVAS_H, transform: `scale(${scale})` }}
                  >
                    {/* Rebind the font vars for the whole canvas: the real
                        portal is set in Geist, so every font-sans/font-mono
                        inside resolves to it without touching each element. */}
                    <div
                      className="flex h-full w-full bg-adm-bg font-sans text-adm-ink"
                      style={
                        {
                          "--font-sans": "var(--font-geist)",
                          "--font-mono": "var(--font-geist-mono)",
                        } as React.CSSProperties
                      }
                    >
                      <Sidebar />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <TopBar />
                        <TabStrip extra={state.extraTab} />
                        <div className="relative min-h-0 flex-1 overflow-hidden">
                          {state.view === "orders" && <OrdersList />}
                          {state.view === "new" && <NewOrder state={state} />}
                          {state.view === "detail" && <OrderDetail state={state} />}
                        </div>
                      </div>
                    </div>

                    {!reduced && <Cursor x={x} y={y} clicking={clicking} />}
                  </div>
                  </div>
                </div>
                  {done && <SimEndCard onReplay={() => setI(0)} />}
                </div>
              </div>
            </div>

            <p className="mt-6 text-center font-mono text-[10.5px] tracking-[0.16em] text-fg-4 uppercase">
              <span className="lg:hidden">
                {locale === "no" ? "Sveip for å se hele · " : "Swipe to explore · "}
              </span>
              {copy.caption[locale]}
            </p>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
