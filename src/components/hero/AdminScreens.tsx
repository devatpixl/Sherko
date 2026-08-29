"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  ChevronDown,
  Download,
  Play,
  Plus,
  Save,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Field, Panel } from "@/components/hero/AdminChrome";
import { Button } from "@/components/admin-ui/button";
import { StatusPill, type StatusPillVariant } from "@/components/admin-ui/status-pill";
import {
  customers,
  kr,
  lineTotal,
  orderRows,
  orderTotal,
  products,
  statusLabel,
  type AdminState,
} from "@/lib/adminScript";
import { useLocale, type Bi } from "@/lib/i18n";

const EASE = [0.16, 1, 0.3, 1] as const;
const T = (no: string, en: string): Bi => ({ no, en });

/* ── Small pieces ─────────────────────────────────────────────────── */

/* Maps our order statuses onto the real StatusPill's variants. Note the real
   component keeps the pill neutral and colours only the DOT for success/info —
   my earlier rebuild tinted the whole pill, which was wrong. */
const PILL_VARIANT: Record<keyof typeof statusLabel, StatusPillVariant> = {
  godkjent: "success",
  behandling: "info",
  venter: "warning",
};

function OrderStatus({ status }: { status: keyof typeof statusLabel }) {
  const { locale } = useLocale();
  return (
    <StatusPill variant={PILL_VARIANT[status]} size="sm">
      {statusLabel[status][locale]}
    </StatusPill>
  );
}

function PageHead({
  crumb,
  title,
  subtitle,
  right,
}: {
  crumb: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <p className="font-mono text-[11.5px] text-adm-ink-3">{crumb}</p>
        <h3 className="mt-1.5 font-mono text-[26px] leading-none font-semibold tracking-tight text-adm-ink">
          {title}
        </h3>
        {subtitle && <p className="mt-2 text-[13px] text-adm-ink-2">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

/* ── 1. Orders list ───────────────────────────────────────────────── */

export function OrdersList() {
  const { locale } = useLocale();
  /* All seven, in the real page's order — mine was missing Levert/Kansellert. */
  const filters = [
    T("Alle statuser", "All statuses"),
    T("Venter godkjenning", "Pending approval"),
    T("Godkjent", "Approved"),
    T("Under behandling", "Processing"),
    T("Sendt", "Sent"),
    T("Levert", "Delivered"),
    T("Kansellert", "Cancelled"),
  ];

  return (
    <div className="p-7">
      <PageHead
        crumb={locale === "no" ? "Ordre" : "Orders"}
        title={locale === "no" ? "Ordre" : "Orders"}
        subtitle={
          locale === "no"
            ? "Paginert liste fra API (50 per side). Godkjenn eller avvis fra detaljsiden."
            : "Paginated list from the API (50 per page). Approve or reject from the detail page."
        }
        right={
          <Button data-cur="new-order" size="lg">
            <Plus />
            {locale === "no" ? "Ny ordre" : "New order"}
          </Button>
        }
      />

      <div className="mt-6 flex gap-6 border-b border-adm-line">
        {filters.map((f, i) => (
          <span
            key={f.no}
            className={`-mb-px border-b-2 pb-3 text-[13px] ${
              i === 0 ? "border-adm-ink font-medium text-adm-ink" : "border-transparent text-adm-ink-2"
            }`}
          >
            {f[locale]}
          </span>
        ))}
      </div>

      {/* Filter row — the real page has search, an advanced-filter toggle, a
          company lookup and a channel select. It was missing entirely. */}
      <div className="mt-4 flex items-center gap-3">
        <div className="flex w-[300px] items-center gap-2 rounded-lg border border-adm-line bg-adm-panel px-3 py-2">
          <Search className="h-3.5 w-3.5 text-adm-ink-3" strokeWidth={1.75} />
          <span className="text-[13px] text-adm-ink-3">
            {locale === "no" ? "Søk ordre, kunde, e-post…" : "Search order, customer, email…"}
          </span>
        </div>
        <span className="grid h-9 w-9 place-items-center rounded-lg border border-adm-line bg-adm-panel">
          <SlidersHorizontal className="h-3.5 w-3.5 text-adm-ink-2" strokeWidth={1.75} />
        </span>
        <div className="w-[240px] rounded-lg border border-adm-line bg-adm-panel px-3 py-2 text-[13px] text-adm-ink-3">
          {locale === "no" ? "Bedrift (navn eller UUID)" : "Company (name or UUID)"}
        </div>
        <div className="flex w-[170px] items-center justify-between rounded-lg border border-adm-line bg-adm-panel px-3 py-2 text-[13px] text-adm-ink">
          {locale === "no" ? "Alle kanaler" : "All channels"}
          <ChevronDown className="h-3.5 w-3.5 text-adm-ink-2" strokeWidth={1.75} />
        </div>
      </div>

      {/* Table styling taken from the real Table primitive: a zinc-50 header
          with UPPERCASE zinc-500 labels, zinc-100 row rules, px-4 py-3.5 cells.
          I had previously set these sentence-case off the page source, without
          checking what the component actually renders. */}
      <div className="mt-4 overflow-hidden rounded-xl border border-adm-line bg-adm-panel">
        <table className="w-full border-separate border-spacing-0 text-left">
          <thead className="bg-adm-subtle">
            <tr>
              {[
                T("Ordrenummer", "Order no"),
                T("Bedrift", "Company"),
                T("Status", "Status"),
                T("Kanal", "Channel"),
                T("Dato", "Date"),
                T("Beløp eks. mva", "Amount ex. VAT"),
              ].map((h, i) => (
                <th
                  key={h.no}
                  className={`border-b border-adm-muted px-4 py-3.5 align-middle text-[12px] font-medium whitespace-nowrap text-adm-ink-2 uppercase ${
                    i === 5 ? "text-right" : ""
                  }`}
                >
                  {h[locale]}
                </th>
              ))}
              <th className="w-[86px] border-b border-adm-muted" />
            </tr>
          </thead>
          <tbody>
            {orderRows.map((r) => (
              <tr key={r.no} className="transition-colors hover:bg-adm-muted/40">
                <td className="border-b border-adm-muted px-4 py-3.5 align-middle font-mono text-[12px] text-adm-ink">
                  {r.no}
                </td>
                <td className="border-b border-adm-muted px-4 py-3.5 align-middle">
                  <p className="text-[13px] font-medium text-adm-ink">{r.company}</p>
                  <p className="text-[11.5px] text-adm-ink-2">{r.org}</p>
                </td>
                <td className="border-b border-adm-muted px-4 py-3.5 align-middle">
                  <OrderStatus status={r.status} />
                </td>
                <td className="border-b border-adm-muted px-4 py-3.5 align-middle">
                  <span className="inline-flex items-center rounded-md bg-adm-muted px-2 py-0.5 text-[11.5px] font-medium text-adm-ink">
                    {r.channel}
                  </span>
                </td>
                <td className="border-b border-adm-muted px-4 py-3.5 align-middle text-[13px] text-adm-ink-2">
                  {r.date}
                </td>
                <td className="border-b border-adm-muted px-4 py-3.5 text-right align-middle font-mono text-[13px] text-adm-ink tabular-nums">
                  {r.amount} kr
                </td>
                <td className="border-b border-adm-muted px-4 py-3.5 text-right align-middle">
                  {/* Borderless, like the real ghost button */}
                  <span className="inline-flex items-center gap-1 text-[13px] text-adm-ink-2">
                    {locale === "no" ? "Åpne" : "Open"}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── 2. New order ─────────────────────────────────────────────────── */

function LinesTable({ state }: { state: AdminState }) {
  const { locale } = useLocale();
  const headers = [
    T("Produkt", "Product"),
    T("Tekst", "Text"),
    T("Enhet", "Unit"),
    T("Antall", "Qty"),
    T("Pris ekskl. mva.", "Price ex. VAT"),
    T("Mva-kode", "VAT"),
    T("Sum", "Total"),
  ];
  const emptyIdx = state.lines.length;

  return (
    <Panel className="mt-5 p-5">
      <p className="text-[15px] font-semibold text-adm-ink">{locale === "no" ? "Linjer" : "Lines"}</p>

      <div className="mt-4 grid grid-cols-[minmax(0,2.1fr)_minmax(0,1.6fr)_74px_72px_106px_78px_104px] gap-x-3 font-mono text-[10.5px] tracking-[0.08em] text-adm-ink-3 uppercase">
        {headers.map((h, i) => (
          <span key={h.no} className={i >= 3 ? "text-right" : ""}>
            {h[locale]}
          </span>
        ))}
      </div>
      <div className="mt-2 h-px bg-adm-line" />

      <div className="relative">
        {state.lines.map((l) => (
          <motion.div
            key={l.nr}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="grid grid-cols-[minmax(0,2.1fr)_minmax(0,1.6fr)_74px_72px_106px_78px_104px] items-center gap-x-3 border-b border-adm-line py-2.5"
          >
            <div className="rounded-lg border border-adm-line bg-adm-panel px-2.5 py-2">
              <p className="truncate text-[12.5px] text-adm-ink">
                {l.nr} — {l.name}
              </p>
              <p className="font-mono text-[10px] text-adm-ink-3">Art.nr {l.nr}</p>
            </div>
            <div className="truncate rounded-lg border border-adm-line bg-adm-bg px-2.5 py-2.5 text-[12.5px] text-adm-ink-2">
              {l.name}
            </div>
            <div className="rounded-lg border border-adm-line px-2 py-2.5 text-center text-[12px] text-adm-ink-2">D-Pak</div>
            <div className="rounded-lg border border-adm-line px-2 py-2.5 text-right font-mono text-[12.5px] text-adm-ink">
              {l.qty},00
            </div>
            <div className="rounded-lg border border-adm-line px-2 py-2.5 text-right font-mono text-[12.5px] text-adm-ink">
              {kr(l.price)}
            </div>
            <div className="rounded-lg border border-adm-line px-2 py-2.5 text-right text-[12px] text-adm-ink-2">{l.vat}</div>
            <div className="text-right font-mono text-[12.5px] font-semibold text-adm-ink">{kr(lineTotal(l))} kr</div>
          </motion.div>
        ))}

        {/* The empty row waiting for the next product */}
        <div className="grid grid-cols-[minmax(0,2.1fr)_minmax(0,1.6fr)_74px_72px_106px_78px_104px] items-center gap-x-3 py-2.5">
          <button
            type="button"
            data-cur={`product-${emptyIdx}`}
            className={`rounded-lg border bg-adm-panel px-2.5 py-3 text-left text-[12.5px] ${
              state.productOpen === emptyIdx
                ? "border-adm-blue text-adm-ink ring-2 ring-adm-blue/20"
                : "border-adm-line text-adm-ink-3"
            }`}
          >
            {locale === "no" ? "Velg produkt" : "Select product"}
          </button>
          <div className="rounded-lg border border-adm-line bg-adm-bg px-2.5 py-3" />
          <div className="rounded-lg border border-adm-line px-2 py-3 text-center text-[12px] text-adm-ink-3">D-Pak</div>
          <div className="rounded-lg border border-adm-line px-2 py-3 text-right font-mono text-[12.5px] text-adm-ink-3">1,00</div>
          <div className="rounded-lg border border-adm-line px-2 py-3 text-right font-mono text-[12.5px] text-adm-ink-3">0,00</div>
          <div className="rounded-lg border border-adm-line px-2 py-3 text-right text-[12px] text-adm-ink-3">25 %</div>
          <div className="text-right text-[12.5px] text-adm-ink-3">—</div>
        </div>

        {/* Product picker */}
        <AnimatePresence>
          {state.productOpen !== null && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="absolute left-0 z-30 w-[430px] overflow-hidden rounded-xl border border-adm-line bg-adm-panel shadow-[0_18px_40px_-12px_rgba(16,24,40,0.28)]"
              style={{ top: state.productOpen * 60 + 52 }}
            >
              <div className="grid grid-cols-[64px_1fr_80px] gap-2 border-b border-adm-line px-3 py-2 font-mono text-[10.5px] tracking-[0.08em] text-adm-ink-3 uppercase">
                <span>Nr</span>
                <span>{locale === "no" ? "Navn" : "Name"}</span>
                <span className="text-right">{locale === "no" ? "Pris" : "Price"}</span>
              </div>
              <div className="max-h-[228px] overflow-hidden">
                {products.map((p, i) => (
                  <div
                    key={p.nr}
                    data-cur={`prod-${i}`}
                    className={`grid grid-cols-[64px_1fr_80px] gap-2 px-3 py-2.5 ${
                      i === 0 ? "bg-adm-blue-bg" : ""
                    }`}
                  >
                    <span className="font-mono text-[11.5px] text-adm-ink-3">{p.nr}</span>
                    <span className="truncate text-[12.5px] text-adm-ink">{p.name}</span>
                    <span className="text-right font-mono text-[12px] text-adm-ink">{kr(p.price)}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex justify-end">
        <div className="w-[280px] rounded-lg bg-adm-bg px-4 py-3">
          <div className="flex items-baseline justify-between">
            <span className="text-[12.5px] text-adm-ink-2">
              {locale === "no" ? "Sum eks. mva" : "Total ex. VAT"}
            </span>
            <motion.span
              key={state.lines.length}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-mono text-[15px] font-semibold text-adm-ink"
            >
              {kr(orderTotal(state.lines))} kr
            </motion.span>
          </div>
        </div>
      </div>
    </Panel>
  );
}

export function NewOrder({ state }: { state: AdminState }) {
  const { locale } = useLocale();
  const chosen = state.customerIdx !== null ? customers[state.customerIdx] : null;

  return (
    <div className="p-7">
      <PageHead
        crumb={locale === "no" ? "Salg › Ordre › Ny ordre" : "Sales › Orders › New order"}
        title={locale === "no" ? "Ny ordre" : "New order"}
        right={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="lg">
              <Save />
              {locale === "no" ? "Lagre kladd" : "Save draft"}
            </Button>
            <motion.div
              animate={{ scale: state.registering ? 0.95 : 1 }}
              transition={{ duration: 0.18 }}
            >
              <Button data-cur="register" size="lg">
                {locale === "no" ? "Registrer" : "Register"}
              </Button>
            </motion.div>
          </div>
        }
      />

      <div className="mt-5 grid grid-cols-[300px_minmax(0,1fr)] gap-5">
        {/* Customer */}
        <Panel className="relative p-5">
          <p className="text-[15px] font-semibold text-adm-ink">{locale === "no" ? "Kunde" : "Customer"}</p>

          {chosen ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
              <p className="text-[14px] font-semibold text-adm-ink">{chosen.name}</p>
              <p className="font-mono text-[11.5px] text-adm-ink-3">Org.nr {chosen.org}</p>
              <div className="mt-4 space-y-2.5">
                {[
                  [locale === "no" ? "Kontakt" : "Contact", "Ida Hovden"],
                  [locale === "no" ? "E-post" : "Email", "post@nordvest-storkjokken.no"],
                  [locale === "no" ? "Telefon" : "Phone", "+47 71 40 22 18"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-[11px] text-adm-ink-3">{k}</p>
                    <p className="text-[12.5px] text-adm-ink">{v}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <button
              type="button"
              data-cur="customer-select"
              className={`mt-4 flex w-[150px] items-center justify-between rounded-lg border bg-adm-panel px-3 py-2.5 text-[13px] ${
                state.customerOpen
                  ? "border-adm-blue text-adm-ink ring-2 ring-adm-blue/20"
                  : "border-adm-line text-adm-ink-2"
              }`}
            >
              {locale === "no" ? "Velg kunde" : "Select customer"}
              <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden>
                <path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}

          <AnimatePresence>
            {state.customerOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.2, ease: EASE }}
                className="absolute top-[92px] left-5 z-30 w-[330px] overflow-hidden rounded-xl border border-adm-line bg-adm-panel shadow-[0_18px_40px_-12px_rgba(16,24,40,0.28)]"
              >
                <div className="flex items-center gap-2 border-b border-adm-line px-3 py-2.5">
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-adm-ink-3" aria-hidden>
                    <circle cx="7" cy="7" r="4.6" fill="none" stroke="currentColor" strokeWidth="1.4" />
                    <path d="m10.6 10.6 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                  <span className="text-[12.5px] text-adm-ink-3">
                    {locale === "no" ? "Søk navn eller org.nr…" : "Search name or org. no…"}
                  </span>
                </div>
                {customers.map((c, i) => (
                  <div
                    key={c.org}
                    data-cur={`cust-${i}`}
                    className={`px-3 py-2.5 ${i === 0 ? "bg-adm-blue-bg" : ""}`}
                  >
                    <p className="text-[12.5px] font-medium text-adm-ink">{c.name}</p>
                    <p className="font-mono text-[11px] text-adm-ink-3">Org.nr {c.org}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </Panel>

        {/* Details */}
        <Panel className="p-5">
          <div className="flex gap-7 border-b border-adm-line pb-3">
            {[T("Detaljer", "Details"), T("Levering & faktura", "Delivery & invoice"), T("Notat", "Note"), T("Dokumenter", "Documents")].map(
              (t, i) => (
                <span
                  key={t.no}
                  className={`-mb-3.5 border-b-2 pb-3 text-[13px] ${
                    i === 0 ? "border-adm-ink font-medium text-adm-ink" : "border-transparent text-adm-ink-2"
                  }`}
                >
                  {t[locale]}
                </span>
              ),
            )}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4">
            <Field label={locale === "no" ? "Ordredato" : "Order date"} value="26. aug. 2026" />
            <Field label={locale === "no" ? "Leveringsdato" : "Delivery date"} value={locale === "no" ? "Valgfri" : "Optional"} muted />
            <Field label={locale === "no" ? "Kanal" : "Channel"} value="Lager" />
            <Field label={locale === "no" ? "Vår referanse" : "Our reference"} value="ida@fjordvikengros.no" />
            <Field label={locale === "no" ? "Deres referanse" : "Their reference"} value={locale === "no" ? "PO-nummer" : "PO number"} muted />
            <Field label={locale === "no" ? "Kundeordrenummer" : "Customer order no"} value={locale === "no" ? "Valgfri" : "Optional"} muted />
          </div>
        </Panel>
      </div>

      <LinesTable state={state} />
    </div>
  );
}

/* ── 3. Order detail ──────────────────────────────────────────────── */

export function OrderDetail({ state }: { state: AdminState }) {
  const { locale } = useLocale();
  const chosen = state.customerIdx !== null ? customers[state.customerIdx] : customers[0];
  const steps = [
    T("Til godkjenning", "To approve"),
    T("Godkjent", "Approved"),
    T("Behandles", "Processing"),
    T("Sendt", "Sent"),
    T("Levert", "Delivered"),
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE }} className="p-7">
      <PageHead
        crumb={locale === "no" ? `Salg › Ordre › ${state.orderNo}` : `Sales › Orders › ${state.orderNo}`}
        title={`${locale === "no" ? "Ordrenummer." : "Order no."} ${state.orderNo}`}
        right={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="lg">
              <Download />
              {locale === "no" ? "Last ned PDF" : "Download PDF"}
            </Button>
            <Button size="lg">
              <Play />
              {locale === "no" ? "Start behandling" : "Start processing"}
            </Button>
          </div>
        }
      />

      <div className="mt-4 flex items-center gap-3">
        <OrderStatus status="godkjent" />
        <span className="rounded-full bg-adm-bg px-2.5 py-1 text-[11.5px] text-adm-ink-2">Lager</span>
        <span className="text-[12.5px] text-adm-ink-2">26. aug. 2026, 16:35</span>
        <span className="font-mono text-[13px] font-semibold text-adm-ink">
          {kr(orderTotal(state.lines))} kr
        </span>
      </div>

      {/* Stepper */}
      <Panel className="mt-5 px-6 py-5">
        <div className="flex items-center">
          {steps.map((s, i) => (
            <div key={s.no} className="flex flex-1 items-center last:flex-none">
              <div className="flex items-center gap-2.5">
                <motion.span
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.09, duration: 0.35, ease: EASE }}
                  className={`grid h-7 w-7 place-items-center rounded-full text-[11.5px] font-medium ${
                    i === 0
                      ? "bg-adm-ink text-white"
                      : i === 1
                        ? "border-2 border-adm-ink text-adm-ink"
                        : "border border-adm-line-2 text-adm-ink-3"
                  }`}
                >
                  {i === 0 ? "✓" : i + 1}
                </motion.span>
                <span className={`text-[13px] ${i <= 1 ? "font-medium text-adm-ink" : "text-adm-ink-3"}`}>
                  {s[locale]}
                </span>
              </div>
              {i < steps.length - 1 && (
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.26 + i * 0.09, duration: 0.4, ease: EASE }}
                  className={`mx-4 h-px flex-1 origin-left ${i === 0 ? "bg-adm-ink" : "bg-adm-line"}`}
                />
              )}
            </div>
          ))}
        </div>
      </Panel>

      <div className="mt-5 grid grid-cols-[300px_minmax(0,1fr)] gap-5">
        <Panel className="p-5">
          <p className="text-[15px] font-semibold text-adm-ink">{locale === "no" ? "Kunde" : "Customer"}</p>
          <p className="mt-3 text-[14px] font-semibold text-adm-ink">{chosen.name}</p>
          <p className="font-mono text-[11.5px] text-adm-ink-3">Org.nr {chosen.org}</p>
        </Panel>

        <Panel className="p-5">
          <p className="text-[15px] font-semibold text-adm-ink">{locale === "no" ? "Linjer" : "Lines"}</p>
          <div className="mt-3">
            {state.lines.map((l) => (
              <div key={l.nr} className="flex items-center justify-between border-b border-adm-line py-2.5 last:border-0">
                <div>
                  <p className="text-[13px] text-adm-ink">{l.name}</p>
                  <p className="font-mono text-[11px] text-adm-ink-3">Art.nr {l.nr}</p>
                </div>
                <div className="flex items-center gap-8">
                  <span className="font-mono text-[12.5px] text-adm-ink-2">{l.qty} × {kr(l.price)}</span>
                  <span className="w-[104px] text-right font-mono text-[13px] font-semibold text-adm-ink">
                    {kr(lineTotal(l))} kr
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </motion.div>
  );
}
