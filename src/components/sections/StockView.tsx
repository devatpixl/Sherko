"use client";

import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Container, Reveal, Section, SectionHead } from "@/components/ui";
import { useLocale, type Bi } from "@/lib/i18n";

/* ═══════════════════════════════════════════════════════════════════
   STOCK VIEW — the light product UI, sitting in a browser window on
   the dark page. One idea: the thing we are selling, shown as itself.

   Everything inside the window is the portal's own light palette
   (adm-*). Page tokens (fg / canvas / accent) stop at the window
   frame. All figures are invented demo data for a fictional tenant.
   ═══════════════════════════════════════════════════════════════════ */

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* The portal is Norwegian software. Its own chrome reads the same to an
   English visitor as to a Norwegian one — a screenshot does not translate.
   This wrapper marks a string as deliberately untranslated rather than
   forgotten, and keeps every visible string a Bi resolved by locale. */
const sameInBoth = (s: string): Bi => ({ no: s, en: s });

/** Norwegian thousands grouping, done by hand so server and client agree. */
function group(n: number): string {
  /* \u00A0 — non-breaking, so a figure never wraps mid-number. */
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0");
}

/* ── Marketing copy (this part translates) ────────────────────────── */

const head = {
  eyebrow: { no: "Lager", en: "Inventory" } satisfies Bi,
  title: {
    no: "Alt på lager, i sanntid",
    en: "Everything in stock, in real time",
  } satisfies Bi,
  body: {
    no: "Samme system tar imot ordren og holder styr på beholdningen. Ingen telling i regneark, ingen tall som er en uke gamle.",
    en: "The same system that takes the order keeps track of the stock. No counting in spreadsheets, no numbers that are a week old.",
  } satisfies Bi,
};

const caption: Bi = {
  no: "Nordre Admin · demodata",
  en: "Nordre Admin · demo data",
};

/* ── The portal's own labels ──────────────────────────────────────── */

const APP = {
  url: sameInBoth("app.nordre.no/lager/oversikt"),
  tenant: sameInBoth("Fjordvik Engros"),
  crumb: sameInBoth("Lager"),
  heading: sameInBoth("Lageroversikt"),
  sub: sameInBoth("Sanntidsoversikt over beholdning og etterfyllingsbehov"),
  showAll: sameInBoth("Vis alle produkter"),
  stocktake: sameInBoth("Start varetelling"),
  byCategory: sameInBoth("Beholdning per kategori"),
  lowStock: sameInBoth("Lavt lager — anbefalt etterfylling"),
  products: sameInBoth("produkter"),
  units: sameInBoth("stk"),
  currency: sameInBoth("kr"),
  onHand: sameInBoth("På lager"),
  reorderPoint: sameInBoth("Bestillingspunkt"),
};

/* ── Tints ────────────────────────────────────────────────────────── */

type Tint = "blue" | "amber" | "red";

const TINT: Record<Tint, string> = {
  blue: "bg-adm-blue-bg text-adm-blue",
  amber: "bg-adm-amber-bg text-adm-amber",
  red: "bg-adm-red/10 text-adm-red",
};

/* ── Glyphs — hairline, drawn, never an icon font ─────────────────── */

const GLYPHS: Record<string, ReactNode> = {
  /* A case, seen in three-quarter — one SKU on the shelf. */
  onShelf: (
    <>
      <path d="M12 3.4 19.8 7v10L12 20.6 4.2 17V7z" />
      <path d="M4.2 7 12 10.6 19.8 7M12 10.6v10" />
    </>
  ),
  /* A bin filled to a low line. */
  low: (
    <>
      <rect x="5" y="4.6" width="14" height="14.8" rx="1.8" />
      <path d="M5 14.4h14" />
    </>
  ),
  /* The one that needs a human today. */
  critical: (
    <>
      <path d="M12 4.4 21 19.6H3z" />
      <path d="M12 10v4.1M12 16.8v.01" />
    </>
  ),
  /* Nothing left. */
  out: (
    <>
      <circle cx="12" cy="12" r="7.7" />
      <path d="M6.6 6.6 17.4 17.4" />
    </>
  ),
  /* Coming in off a purchase order. */
  incoming: (
    <>
      <path d="M12 3.8v8.6" />
      <path d="M8.4 9 12 12.6 15.6 9" />
      <path d="M4.6 15.4v3.1a1.4 1.4 0 0 0 1.4 1.4h12a1.4 1.4 0 0 0 1.4-1.4v-3.1" />
    </>
  ),
};

function Glyph({ name }: { name: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-[18px] w-[18px]"
    >
      {GLYPHS[name]}
    </svg>
  );
}

/* ── Demo data ────────────────────────────────────────────────────── */

const KPIS: {
  key: string;
  label: Bi;
  value: number;
  tint: Tint;
  wide?: boolean;
}[] = [
  { key: "onShelf", label: sameInBoth("Produkter på lager"), value: 261, tint: "blue", wide: true },
  { key: "low", label: sameInBoth("Lavt lager"), value: 14, tint: "blue" },
  { key: "critical", label: sameInBoth("Kritisk"), value: 9, tint: "amber" },
  { key: "out", label: sameInBoth("Utsolgt"), value: 3, tint: "red" },
  { key: "incoming", label: sameInBoth("På vei inn"), value: 6, tint: "blue" },
];

const CATEGORIES: { name: Bi; products: number; units: number; value: number; pct: number }[] = [
  { name: sameInBoth("Emballasje"), products: 89, units: 65970, value: 15770030, pct: 100 },
  { name: sameInBoth("Ost"), products: 14, units: 13080, value: 5710631, pct: 36 },
  { name: sameInBoth("Hermetikk"), products: 28, units: 23732, value: 4138653, pct: 26 },
  { name: sameInBoth("Olje"), products: 12, units: 10142, value: 2043409, pct: 13 },
  { name: sameInBoth("Fryst"), products: 4, units: 2058, value: 1122423, pct: 7 },
];

type Status = "critical" | "low";

const STATUS: Record<Status, { label: Bi; cls: string }> = {
  critical: { label: sameInBoth("Kritisk"), cls: "bg-adm-amber-bg text-adm-amber" },
  low: { label: sameInBoth("Lavt"), cls: "bg-adm-blue-bg text-adm-blue" },
};

const REFILL: { art: string; name: Bi; onHand: number; point: number; status: Status }[] = [
  { art: "44700", name: sameInBoth("Falafelmiks 650 g × 18"), onHand: 0, point: 100, status: "critical" },
  { art: "20871", name: sameInBoth("Pizzaeske 33 cm, 25 stk"), onHand: 4, point: 60, status: "critical" },
  { art: "10092", name: sameInBoth("Revet gouda 2 kg"), onHand: 22, point: 40, status: "low" },
  { art: "20205", name: sameInBoth("Frityrolje 10 L"), onHand: 31, point: 45, status: "low" },
];

/* ── Counting figure ──────────────────────────────────────────────── */

function Counter({ value, inView }: { value: number; inView: boolean }) {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView || reduced) return;
    const controls = animate(0, value, {
      duration: 1.1,
      ease: EASE,
      onUpdate: (v) => setCount(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, reduced]);

  /* Derived, never set from an effect: reduced motion lands on the
     final figure, everything else rolls up to it. */
  let display = 0;
  if (reduced) display = value;
  else if (inView) display = count;

  return (
    <>
      {/* The true figure stays in the accessibility tree while digits roll. */}
      <span className="sr-only">{group(value)}</span>
      <span aria-hidden>{group(display)}</span>
    </>
  );
}

/* ── Section ──────────────────────────────────────────────────────── */

export function StockView() {
  const { locale } = useLocale();
  const reduced = useReducedMotion();
  const appRef = useRef<HTMLDivElement>(null);
  const inView = useInView(appRef, { once: true, margin: "-12% 0px -18% 0px" });

  return (
    <Section id="lager" className="border-y border-line bg-elev">
      <Container>
        <SectionHead
          eyebrow={head.eyebrow[locale]}
          title={head.title[locale]}
          body={head.body[locale]}
        />

        <Reveal delay={0.18} className="mt-14">
          {/* ── Browser window ──────────────────────────────────── */}
          <div className="overflow-hidden rounded-xl border border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)]">
            {/* Chrome. Traffic lights are the OS's colours, not ours. */}
            <div className="flex h-10 items-center gap-2 bg-[#E9EAEE] px-4">
              <span aria-hidden className="h-3 w-3 rounded-full bg-[#FF5F57]" />
              <span aria-hidden className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
              <span aria-hidden className="h-3 w-3 rounded-full bg-[#28C840]" />
              <div className="flex min-w-0 flex-1 justify-center">
                <span className="truncate rounded-md bg-white px-3 py-1 text-[11px] text-adm-ink-3">
                  {APP.url[locale]}
                </span>
              </div>
            </div>

            {/* ── App body (light) ──────────────────────────────── */}
            <div ref={appRef} className="bg-adm-bg p-6 md:p-8">
              {/* Page heading row */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-adm-ink-3">
                    {APP.tenant[locale]}
                    <span aria-hidden className="px-1.5 text-adm-line-2">
                      /
                    </span>
                    {APP.crumb[locale]}
                  </p>
                  <p className="mt-1.5 text-[22px] font-semibold text-adm-ink">
                    {APP.heading[locale]}
                  </p>
                  <p className="mt-1 text-[13px] text-adm-ink-2">{APP.sub[locale]}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                  <span className="rounded-lg border border-adm-line bg-adm-panel px-3 py-2 text-[12.5px] text-adm-ink">
                    {APP.showAll[locale]}
                  </span>
                  <span className="rounded-lg bg-adm-ink px-3 py-2 text-[12.5px] text-white">
                    {APP.stocktake[locale]}
                  </span>
                </div>
              </div>

              {/* KPI tiles */}
              <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-5">
                {KPIS.map((k) => (
                  <div
                    key={k.key}
                    className={`relative rounded-xl border border-adm-line bg-adm-panel p-4 ${
                      k.wide ? "col-span-2 md:col-span-1" : ""
                    }`}
                  >
                    <p className="min-h-[2.7em] pr-10 font-mono text-[10px] uppercase leading-[1.35] tracking-[0.14em] text-adm-ink-3">
                      {k.label[locale]}
                    </p>
                    <p className="mt-2 text-[28px] font-semibold tabular-nums text-adm-ink">
                      <Counter value={k.value} inView={inView} />
                    </p>
                    <span
                      aria-hidden
                      className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg ${TINT[k.tint]}`}
                    >
                      <Glyph name={k.key} />
                    </span>
                  </div>
                ))}
              </div>

              {/* Panels */}
              <div className="mt-4 grid gap-4 lg:grid-cols-[1.15fr_1fr]">
                {/* Left — value by category */}
                <div className="rounded-xl border border-adm-line bg-adm-panel p-5">
                  <p className="text-[13px] font-semibold text-adm-ink">
                    {APP.byCategory[locale]}
                  </p>
                  <div className="mt-4 space-y-3.5">
                    {CATEGORIES.map((c, i) => (
                      <div key={c.name.no}>
                        <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
                          <span className="text-[13.5px] text-adm-ink">{c.name[locale]}</span>
                          <span className="text-left text-[12.5px] tabular-nums text-adm-ink-2 sm:text-right">
                            {c.products} {APP.products[locale]} · {group(c.units)}{" "}
                            {APP.units[locale]} ·{" "}
                            <span className="font-semibold text-adm-ink">
                              {group(c.value)} {APP.currency[locale]}
                            </span>
                          </span>
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-adm-line">
                          <motion.div
                            className="h-full origin-left rounded-full bg-adm-blue"
                            style={{ width: `${c.pct}%` }}
                            initial={{ scaleX: 0 }}
                            animate={inView ? { scaleX: 1 } : undefined}
                            transition={{
                              duration: reduced ? 0 : 0.9,
                              delay: reduced ? 0 : 0.24 + 0.07 * i,
                              ease: EASE,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right — what to reorder */}
                <div className="rounded-xl border border-adm-line bg-adm-panel p-5">
                  <p className="text-[13px] font-semibold text-adm-ink">{APP.lowStock[locale]}</p>
                  <div className="mt-1 divide-y divide-adm-line">
                    {REFILL.map((r) => (
                      <div
                        key={r.art}
                        className="flex items-center justify-between gap-3 py-3 last:pb-0"
                      >
                        <div className="min-w-0">
                          <p className="flex items-baseline gap-1.5">
                            <span className="font-mono text-[11px] text-adm-ink-3">{r.art}</span>
                            <span className="min-w-0 truncate text-[13px] text-adm-ink">
                              {r.name[locale]}
                            </span>
                          </p>
                          <p className="mt-0.5 text-[11.5px] tabular-nums text-adm-ink-3">
                            {APP.onHand[locale]}: {r.onHand} · {APP.reorderPoint[locale]}:{" "}
                            {r.point}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                            STATUS[r.status].cls
                          }`}
                        >
                          {STATUS[r.status].label[locale]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Say it plainly: these figures are illustrative. */}
          <p className="mt-6 text-center font-mono text-[10.5px] uppercase tracking-[0.16em] text-fg-4">
            {caption[locale]}
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
