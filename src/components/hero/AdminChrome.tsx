"use client";

import type { ReactNode } from "react";
import { operator, tenant } from "@/lib/adminScript";
import { useLocale, type Bi } from "@/lib/i18n";

/* The static shell of the simulated portal: sidebar, top bar, tab strip.
   Light UI on purpose — a light app inside the dark page is the whole point. */

function Caret({ open = false }: { open?: boolean }) {
  return (
    <svg viewBox="0 0 12 12" className={`h-3 w-3 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden>
      <path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const NAV: { label: Bi; children?: Bi[] }[] = [
  { label: { no: "Oversikt", en: "Overview" } },
  {
    label: { no: "Salg", en: "Sales" },
    children: [
      { no: "Ordre", en: "Orders" },
      { no: "Hurtigordre", en: "Quick orders" },
      { no: "Prisavtaler", en: "Price agreements" },
      { no: "Kundegrupper", en: "Customer groups" },
    ],
  },
  { label: { no: "Kunder", en: "Customers" } },
  { label: { no: "Lager", en: "Inventory" } },
  { label: { no: "Innkjøp", en: "Purchasing" } },
  { label: { no: "Katalog", en: "Catalogue" } },
  { label: { no: "Innstillinger", en: "Settings" } },
];

export function Sidebar() {
  const { locale } = useLocale();
  return (
    <aside className="flex w-[232px] shrink-0 flex-col border-r border-adm-line bg-adm-panel">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-linear-to-br from-[#5CE1B0] to-[#2E9E77]">
          <span className="text-[15px] font-semibold text-[#041710]">N</span>
        </div>
        <div className="leading-tight">
          <p className="font-mono text-[11px] tracking-[0.18em] text-adm-ink">SHERKO</p>
          <p className="font-mono text-[11px] tracking-[0.18em] text-adm-ink-3">ADMIN</p>
        </div>
      </div>

      <nav className="mt-1 flex-1 px-3">
        {NAV.map((item) => {
          const isSales = item.children != null;
          return (
            <div key={item.label.no}>
              <div
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-[13.5px] ${
                  isSales ? "bg-adm-blue-bg font-medium text-adm-ink" : "text-adm-ink-2"
                }`}
              >
                <span>{item.label[locale]}</span>
                <Caret open={isSales} />
              </div>
              {item.children && (
                <div className="mt-0.5 mb-1 space-y-0.5 pl-3">
                  {item.children.map((c, i) => (
                    <div
                      key={c.no}
                      className={`rounded-lg px-3 py-2 text-[13px] ${
                        i === 0
                          ? "bg-adm-blue-bg font-medium text-adm-blue ring-1 ring-adm-blue/30"
                          : "text-adm-ink-2"
                      }`}
                    >
                      {c[locale]}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="flex items-center gap-2.5 border-t border-adm-line px-5 py-4">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-adm-ink text-[11px] font-medium text-white">
          IH
        </span>
        <span className="truncate text-[12px] text-adm-ink-2">{operator.email}</span>
      </div>
    </aside>
  );
}

export function TopBar() {
  const { locale } = useLocale();
  return (
    <div className="flex h-[58px] shrink-0 items-center gap-4 border-b border-adm-line bg-adm-panel px-6">
      <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13.5px] font-medium text-adm-ink">
        {tenant} · 2026
        <Caret />
      </div>
      <div className="ml-auto flex w-[360px] items-center gap-2 rounded-lg border border-adm-line bg-adm-bg px-3 py-2">
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-adm-ink-3" aria-hidden>
          <circle cx="7" cy="7" r="4.6" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path d="m10.6 10.6 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <span className="text-[12.5px] text-adm-ink-3">
          {locale === "no" ? "Søk i hele admin…" : "Search all of admin…"}
        </span>
      </div>
      <svg viewBox="0 0 20 20" className="h-4.5 w-4.5 text-adm-ink-2" aria-hidden>
        <path d="M10 3a5 5 0 0 0-5 5v3l-1.5 2.5h13L15 11V8a5 5 0 0 0-5-5Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M8 16a2 2 0 0 0 4 0" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      <span className="grid h-8 w-8 place-items-center rounded-full bg-adm-ink text-[12px] font-medium text-white">IH</span>
    </div>
  );
}

export function TabStrip({ extra }: { extra: Bi | null }) {
  const { locale } = useLocale();
  const base: Bi[] = [
    { no: "Hjem", en: "Home" },
    { no: "Ordre", en: "Orders" },
  ];
  const rest: Bi[] = [
    { no: "Produkter", en: "Products" },
    { no: "Innkjøpsordre", en: "Purchase orders" },
    { no: "Lageroversikt", en: "Stock" },
    { no: "Rapporter", en: "Reports" },
  ];
  const tabs = extra ? [...base, extra, ...rest] : [...base, ...rest];
  const activeIdx = extra ? 2 : 1;

  return (
    <div className="flex h-[42px] shrink-0 items-stretch gap-0 border-b border-adm-line bg-adm-panel px-6">
      {tabs.map((t, i) => (
        <div
          key={`${t.no}-${i}`}
          className={`flex items-center gap-2 border-b-2 px-4 text-[13px] whitespace-nowrap ${
            i === activeIdx
              ? "border-adm-ink font-medium text-adm-ink"
              : "border-transparent text-adm-ink-2"
          }`}
        >
          {t[locale]}
          {i === activeIdx && (
            <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-adm-ink-3" aria-hidden>
              <path d="m3 3 6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

export function Field({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return (
    <div>
      <p className="text-[12.5px] text-adm-ink-2">{label}</p>
      <div className="mt-1.5 rounded-lg border border-adm-line bg-adm-panel px-3 py-2.5">
        <span className={`text-[13px] ${muted ? "text-adm-ink-3" : "text-adm-ink"}`}>{value}</span>
      </div>
    </div>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-adm-line bg-adm-panel ${className}`}>{children}</div>
  );
}
