"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Cursor, useSimCursor } from "@/components/hero/SimCursor";
import { Boxes, PackageX, TrendingDown, TriangleAlert, Truck } from "lucide-react";
import { KPICard } from "@/components/admin-ui/kpi-card";
import { StatusPill, type StatusPillVariant } from "@/components/admin-ui/status-pill";
import { SimEndCard } from "@/components/hero/SimEndCard";
import { Container, Reveal, Section, SectionHead } from "@/components/ui";
import {
  categories,
  foldStock,
  lagerKpis,
  oversiktKpis,
  refill,
  soldOut,
  statusText,
  stockLength,
  stockRows,
  stockScript,
  type StockState,
  type StockStatus,
} from "@/lib/stockScript";
import { tenant } from "@/lib/adminScript";
import { useLocale, type Bi } from "@/lib/i18n";
import { usePrefersReducedMotion } from "@/lib/useSimulation";

/* The inventory side of the portal, driven by the same cursor engine.
   All data invented — see the privacy note in stockScript.ts. */

const CANVAS_W = 1280;
const CANVAS_H = 762;
const MIN_SCALE = 0.66;
const EASE = [0.16, 1, 0.3, 1] as const;

const copy = {
  eyebrow: { no: "Lager", en: "Inventory" } as Bi,
  title: { no: "Alt på lager, i sanntid", en: "Everything in stock, in real time" } as Bi,
  body: {
    no: "Samme system holder styr på beholdningen. Ingen telling i regneark, ingen tall som er en uke gamle.",
    en: "The same system keeps track of the stock. No counting in spreadsheets, no numbers that are a week old.",
  } as Bi,
  caption: { no: "Sherko Admin · demodata", en: "Sherko Admin · demo data" } as Bi,
};

const TONE = {
  ink: "text-adm-ink",
  green: "text-adm-green",
  amber: "text-adm-amber",
  red: "text-adm-red",
  blue: "text-adm-blue",
} as const;

/* Stock levels onto the real StatusPill's variants. */
const STOCK_VARIANT: Record<StockStatus, StatusPillVariant> = {
  ok: "success",
  lavt: "info",
  kritisk: "warning",
};

/* Icons for the KPI tiles, matching the real inventory page. */
const KPI_ICON = [Boxes, TrendingDown, TriangleAlert, PackageX, Truck] as const;

function Counter({ value, run }: { value: number; run: boolean }) {
  const reduced = usePrefersReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    // Reduced motion is handled by deriving the value during render instead,
    // so nothing sets state synchronously inside the effect.
    if (!run || reduced) return;
    let raf = 0;
    let t0 = 0;
    const dur = 800;
    const tick = (t: number) => {
      if (!t0) t0 = t;
      const p = Math.min(1, (t - t0) / dur);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, run, reduced]);

  return <>{reduced ? value : run ? n : 0}</>;
}

/* ── Sub-tabs ─────────────────────────────────────────────────────── */

function SubTabs({ view }: { view: StockState["view"] }) {
  const { locale } = useLocale();
  const tabs: { key: string; label: Bi; cur?: string }[] = [
    { key: "lager", label: { no: "Lager", en: "Stock" }, cur: "tab-lager" },
    { key: "oversikt", label: { no: "Lageroversikt", en: "Overview" }, cur: "tab-oversikt" },
    { key: "bev", label: { no: "Bevegelser", en: "Movements" } },
    { key: "best", label: { no: "Bestillingspunkter", en: "Reorder points" } },
    { key: "vare", label: { no: "Varetelling", en: "Stocktake" } },
  ];
  return (
    <div className="inline-flex gap-1 rounded-xl bg-adm-bg p-1">
      {tabs.map((t) => (
        <span
          key={t.key}
          data-cur={t.cur}
          className={`rounded-lg px-3.5 py-2 text-[13px] transition-colors ${
            view === t.key ? "bg-adm-panel font-medium text-adm-ink shadow-[0_1px_2px_rgba(16,24,40,0.08)]" : "text-adm-ink-2"
          }`}
        >
          {t.label[locale]}
        </span>
      ))}
    </div>
  );
}

/* ── View: Lager (product table) ──────────────────────────────────── */

function LagerView({ run }: { run: boolean }) {
  const { locale } = useLocale();
  const cols: Bi[] = [
    { no: "Art.nr", en: "Art. no" },
    { no: "Produkt", en: "Product" },
    { no: "Kategori", en: "Category" },
    { no: "På lager", en: "On hand" },
    { no: "Reservert", en: "Reserved" },
    { no: "Bestillingspunkt", en: "Reorder point" },
    { no: "Status", en: "Status" },
  ];

  return (
    <div>
      <div className="grid grid-cols-4 gap-3">
        {lagerKpis.map((k, i) => (
          <KPICard
            key={k.label.no}
            label={k.label[locale]}
            icon={KPI_ICON[i]}
            value={
              <span className={`tabular-nums ${TONE[k.tone]}`}>
                <Counter value={k.value} run={run} />
              </span>
            }
          />
        ))}
      </div>

      <div className="mt-4 flex gap-3">
        <div className="flex w-[290px] items-center gap-2 rounded-lg border border-adm-line bg-adm-panel px-3 py-2.5">
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-adm-ink-3" aria-hidden>
            <circle cx="7" cy="7" r="4.6" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <path d="m10.6 10.6 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <span className="text-[12.5px] text-adm-ink-3">{locale === "no" ? "Søk navn / art.nr" : "Search name / art. no"}</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-adm-line bg-adm-panel px-3 py-2.5 text-[12.5px] text-adm-ink-2">
          {locale === "no" ? "Alle statuser" : "All statuses"}
          <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden>
            <path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-adm-line bg-adm-panel">
        <div className="grid grid-cols-[86px_minmax(0,1fr)_150px_90px_92px_136px_92px] gap-3 border-b border-adm-line px-5 py-3 font-mono text-[10px] tracking-[0.1em] text-adm-ink-3 uppercase">
          {cols.map((c, i) => (
            <span key={c.no} className={i >= 3 && i <= 5 ? "text-right" : ""}>
              {c[locale]}
            </span>
          ))}
        </div>
        {stockRows.map((r, i) => (
          <motion.div
            key={r.nr}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.05 + i * 0.035, duration: 0.3 }}
            className="grid grid-cols-[86px_minmax(0,1fr)_150px_90px_92px_136px_92px] items-center gap-3 border-b border-adm-line px-5 py-3 last:border-0"
          >
            <span className="font-mono text-[12px] text-adm-ink-3">{r.nr}</span>
            <span className="truncate text-[13px] text-adm-ink">{r.name}</span>
            <span className="truncate text-[12.5px] text-adm-ink-2">{r.category}</span>
            <span className={`text-right font-mono text-[13px] ${r.onHand === 0 ? "font-semibold text-adm-red" : "text-adm-ink"}`}>
              {r.onHand.toLocaleString("nb-NO")}
            </span>
            <span className="text-right font-mono text-[12.5px] text-adm-ink-3">{r.reserved ?? "—"}</span>
            <span className="text-right font-mono text-[12.5px] text-adm-ink-2">{r.reorder}</span>
            <StatusPill variant={STOCK_VARIANT[r.status]} size="sm" className="justify-self-start">
              {statusText[r.status][locale]}
            </StatusPill>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── View: Lageroversikt ──────────────────────────────────────────── */

function OversiktView({ run }: { run: boolean }) {
  const { locale } = useLocale();
  return (
    <div>
      <div className="grid grid-cols-5 gap-3">
        {oversiktKpis.map((k, i) => (
          <KPICard
            key={k.label.no}
            label={k.label[locale]}
            icon={KPI_ICON[i]}
            value={
              <span className={`tabular-nums ${TONE[k.tone]}`}>
                <Counter value={k.value} run={run} />
              </span>
            }
          />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-[1.15fr_1fr] gap-4">
        <div className="rounded-xl border border-adm-line bg-adm-panel p-5">
          <p className="text-[15px] font-semibold text-adm-ink">
            {locale === "no" ? "Beholdning per kategori" : "Stock by category"}
          </p>
          <div className="mt-4 space-y-3.5">
            {categories.map((c, i) => (
              <div key={c.name}>
                <div className="flex items-baseline justify-between">
                  <span className="text-[13.5px] text-adm-ink">{c.name}</span>
                  <span className="text-[12px] text-adm-ink-2">
                    {c.products} {locale === "no" ? "produkter" : "products"} · {c.units} stk ·{" "}
                    <span className="font-semibold text-adm-ink">{c.value} kr</span>
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-adm-line">
                  <motion.div
                    className="h-full origin-left rounded-full bg-adm-blue"
                    initial={{ scaleX: 0 }}
                    animate={run ? { scaleX: c.pct / 100 } : { scaleX: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 + i * 0.07, ease: EASE }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-adm-line bg-adm-panel p-5">
          <p className="text-[15px] font-semibold text-adm-ink">
            {locale === "no" ? "Lagerverdi siste 30 dager" : "Stock value, last 30 days"}
          </p>
          <p className="mt-1 text-[12px] text-adm-ink-3">
            {locale === "no" ? "Estimert verdi basert på bevegelseslogg" : "Estimated from the movement log"}
          </p>
          <svg viewBox="0 0 320 120" className="mt-4 w-full" aria-hidden>
            <defs>
              <linearGradient id="stockfill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2F6BFF" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#2F6BFF" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            {[0, 30, 60, 90].map((yy) => (
              <line key={yy} x1="0" y1={yy + 8} x2="320" y2={yy + 8} stroke="#E6E8EC" strokeDasharray="3 4" />
            ))}
            <motion.path
              d="M0 62 L32 60 L64 63 L96 58 L128 55 L160 57 L192 48 L224 45 L256 42 L288 38 L320 36 L320 112 L0 112 Z"
              fill="url(#stockfill)"
              initial={{ opacity: 0 }}
              animate={run ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            />
            <motion.path
              d="M0 62 L32 60 L64 63 L96 58 L128 55 L160 57 L192 48 L224 45 L256 42 L288 38 L320 36"
              fill="none"
              stroke="#2F6BFF"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={run ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
            />
          </svg>
        </div>
      </div>

      {/* Below the fold — revealed by the simulated scroll */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-adm-line bg-adm-panel p-5">
          <p className="flex items-center gap-2 text-[15px] font-semibold text-adm-ink">
            <span className="text-adm-amber">⚠</span>
            {locale === "no" ? "Lavt lager — anbefalt etterfylling" : "Low stock — suggested refill"}
          </p>
          <div className="mt-3">
            {refill.map((r) => (
              <div key={r.nr} className="flex items-center justify-between border-b border-adm-line py-2.5 last:border-0">
                <div>
                  <p className="text-[13px] text-adm-ink">
                    <span className="font-mono text-[11.5px] text-adm-ink-3">{r.nr}</span> {r.name}
                  </p>
                  <p className="text-[11.5px] text-adm-ink-3">
                    {locale === "no" ? "På lager" : "On hand"}: <span className="font-semibold text-adm-ink">{r.onHand}</span> ·{" "}
                    {locale === "no" ? "Bestillingspunkt" : "Reorder"}: {r.reorder}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-adm-amber-bg px-2.5 py-1 text-[11px] font-medium text-adm-amber">
                  {locale === "no" ? `Mangler ${r.short}` : `Short ${r.short}`}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-adm-line bg-adm-panel p-5">
          <p className="text-[15px] font-semibold text-adm-ink">{locale === "no" ? "Helt utsolgt" : "Out of stock"}</p>
          <div className="mt-3">
            {soldOut.map((r) => (
              <div key={r.nr} className="flex items-center justify-between border-b border-adm-line py-2.5 last:border-0">
                <p className="text-[13px] text-adm-ink">
                  <span className="font-mono text-[11.5px] text-adm-ink-3">{r.nr}</span> {r.name}
                </p>
                <span className="shrink-0 rounded-full bg-adm-red/10 px-2.5 py-1 text-[11px] font-medium text-adm-red">0 stk</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Section ──────────────────────────────────────────────────────── */

export function StockSim() {
  const { locale } = useLocale();
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { margin: "-20% 0px -20% 0px" });
  const reduced = usePrefersReducedMotion();

  const [i, setI] = useState(0);
  const [scale, setScale] = useState(0.7);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(Math.max(entry.contentRect.width / CANVAS_W, MIN_SCALE)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* Stops at the end rather than wrapping — see SimEndCard. */
  const done = i >= stockLength;

  useEffect(() => {
    if (!inView || done) return;
    const step = stockScript[i];
    const ms = reduced ? Math.min(step.ms, 350) : step.ms;
    const t = window.setTimeout(() => setI((n) => n + 1), ms);
    return () => window.clearTimeout(t);
  }, [i, inView, reduced, done]);

  const { state, target, clicking } = foldStock(i);
  const { x, y } = useSimCursor({
    canvasRef,
    scrollRef: wrapRef,
    target,
    canvasW: CANVAS_W,
    reduced,
    deps: [state.view],
    start: { x: CANVAS_W * 0.42, y: 230 },
  });

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
                    <span className="font-mono text-[11px] text-[#8A93A3]">
                      app.sherko.no/lager/{state.view === "lager" ? "produkter" : "oversikt"}
                    </span>
                  </div>
                </div>

                <div className="relative">
                <div
                  ref={wrapRef}
                  className="w-full overflow-x-auto overscroll-x-contain bg-adm-bg [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  style={{ height: CANVAS_H * scale }}
                >
                  <div className="relative" style={{ width: CANVAS_W * scale, height: CANVAS_H * scale }}>
                    <div
                      ref={canvasRef}
                      className="absolute top-0 left-0 origin-top-left overflow-hidden"
                      style={{ width: CANVAS_W, height: CANVAS_H, transform: `scale(${scale})` }}
                    >
                      {/* The page scrolls under a fixed header, as it would in the real app */}
                      <motion.div
                        className="px-7 pt-7 font-sans text-adm-ink"
                        style={
                          {
                            "--font-sans": "var(--font-geist)",
                            "--font-mono": "var(--font-geist-mono)",
                          } as React.CSSProperties
                        }
                        animate={{ y: -state.scroll }}
                        transition={{ duration: reduced ? 0 : 1.1, ease: EASE }}
                      >
                        <p className="font-mono text-[11px] tracking-[0.16em] text-adm-ink-3 uppercase">
                          {tenant} / {locale === "no" ? "Lager" : "Inventory"}
                        </p>
                        <div className="mt-1.5 flex items-start justify-between">
                          <div>
                            <h3 className="font-mono text-[24px] leading-none font-semibold tracking-tight text-adm-ink">
                              {state.view === "lager"
                                ? locale === "no" ? "Lager" : "Stock"
                                : locale === "no" ? "Lageroversikt" : "Stock overview"}
                            </h3>
                            <p className="mt-2 text-[13px] text-adm-ink-2">
                              {state.view === "lager"
                                ? locale === "no"
                                  ? "Alle produkter med lagerbeholdning."
                                  : "Every product with stock on hand."
                                : locale === "no"
                                  ? "Sanntidsoversikt over beholdning og etterfyllingsbehov."
                                  : "Live view of stock and refill needs."}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <span className="rounded-lg border border-adm-line bg-adm-panel px-3 py-2 text-[12.5px] text-adm-ink-2">
                              {locale === "no" ? "Vis alle produkter" : "All products"}
                            </span>
                            <span className="rounded-lg bg-adm-ink px-3 py-2 text-[12.5px] font-medium text-white">
                              {locale === "no" ? "Start varetelling" : "Start stocktake"}
                            </span>
                          </div>
                        </div>

                        <div className="mt-5">
                          <SubTabs view={state.view} />
                        </div>

                        <div className="mt-5 pb-8">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={state.view}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              transition={{ duration: 0.28, ease: EASE }}
                            >
                              {state.view === "lager" ? <LagerView run={inView} /> : <OversiktView run={inView} />}
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      </motion.div>

                      {!reduced && <Cursor x={x} y={y} clicking={clicking} />}
                    </div>
                  </div>
                </div>
                  {done && <SimEndCard onReplay={() => setI(0)} />}
                </div>
              </div>
            </div>

            <p className="mt-6 text-center font-mono text-[10.5px] tracking-[0.16em] text-fg-4 uppercase">
              <span className="lg:hidden">{locale === "no" ? "Sveip for å se hele · " : "Swipe to explore · "}</span>
              {copy.caption[locale]}
            </p>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
