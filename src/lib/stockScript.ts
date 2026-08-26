import type { Bi } from "@/lib/i18n";

/* ═══════════════════════════════════════════════════════════════════
   Inventory simulation: tabbing between Lager and Lageroversikt, and
   scrolling down to the reorder lists.

   ⚠️  PRIVACY — every product, category and figure is invented. Tenant
   is the fictional "Fjordvik Engros". Keep it that way.
   ═══════════════════════════════════════════════════════════════════ */

export type StockStatus = "ok" | "lavt" | "kritisk";

export type StockRow = {
  nr: string;
  name: string;
  category: string;
  onHand: number;
  reserved: number | null;
  reorder: number;
  status: StockStatus;
};

export const stockRows: StockRow[] = [
  { nr: "44692", name: "Aluform 1/1 gastro 6,7 L, 100 stk", category: "Emballasje", onHand: 1000, reserved: null, reorder: 0, status: "ok" },
  { nr: "44690", name: "Aluform 2-roms 855 ml, 500 stk", category: "Emballasje", onHand: 1002, reserved: null, reorder: 10, status: "ok" },
  { nr: "20317", name: "Aluminiumsfolie 45×100 m, 14 my", category: "Emballasje", onHand: 946, reserved: 24, reorder: 10, status: "ok" },
  { nr: "10092", name: "Revet gouda 2 kg", category: "Ost", onHand: 22, reserved: 6, reorder: 40, status: "lavt" },
  { nr: "20205", name: "Frityrolje 10 L", category: "Olje", onHand: 31, reserved: 4, reorder: 45, status: "lavt" },
  { nr: "20871", name: "Pizzaeske 33 cm, 25 stk", category: "Emballasje", onHand: 4, reserved: null, reorder: 60, status: "kritisk" },
  { nr: "44700", name: "Falafelmiks 650 g × 18", category: "Fryst", onHand: 0, reserved: null, reorder: 10, status: "kritisk" },
  { nr: "20041", name: "Ananas i biter 850 g, 24 stk", category: "Hermetikk", onHand: 0, reserved: null, reorder: 50, status: "kritisk" },
];

export const statusText: Record<StockStatus, Bi> = {
  ok: { no: "OK", en: "OK" },
  lavt: { no: "Lavt", en: "Low" },
  kritisk: { no: "Kritisk", en: "Critical" },
};

/* Figures reconcile across the two tabs: 215 + 23 + 23 = 261. */
export const lagerKpis = [
  { label: { no: "Totalt", en: "Total" } as Bi, value: 261, tone: "ink" as const },
  { label: { no: "OK", en: "OK" } as Bi, value: 215, tone: "green" as const },
  { label: { no: "Lavt / kritisk", en: "Low / critical" } as Bi, value: 23, tone: "amber" as const },
  { label: { no: "Utsolgt", en: "Out of stock" } as Bi, value: 23, tone: "red" as const },
];

export const oversiktKpis = [
  { label: { no: "Produkter på lager", en: "Products in stock" } as Bi, value: 261, tone: "blue" as const },
  { label: { no: "Lavt lager", en: "Low stock" } as Bi, value: 14, tone: "blue" as const },
  { label: { no: "Kritisk", en: "Critical" } as Bi, value: 9, tone: "amber" as const },
  { label: { no: "Utsolgt", en: "Out of stock" } as Bi, value: 23, tone: "red" as const },
  { label: { no: "På vei inn", en: "Inbound" } as Bi, value: 6, tone: "blue" as const },
];

export const categories = [
  { name: "Emballasje", products: 89, units: "65 970", value: "15 770 030", pct: 100 },
  { name: "Ost", products: 14, units: "13 080", value: "5 710 631", pct: 36 },
  { name: "Hermetikk", products: 28, units: "23 732", value: "4 138 653", pct: 26 },
  { name: "Olje", products: 12, units: "10 142", value: "2 043 409", pct: 13 },
  { name: "Fryst", products: 4, units: "2 058", value: "1 122 423", pct: 7 },
];

export const refill = [
  { nr: "44700", name: "Falafelmiks 650 g × 18", onHand: 0, reorder: 100, short: 100 },
  { nr: "20041", name: "Ananas i biter 850 g, 24 stk", onHand: 0, reorder: 50, short: 50 },
  { nr: "20871", name: "Pizzaeske 33 cm, 25 stk", onHand: 4, reorder: 60, short: 56 },
  { nr: "10092", name: "Revet gouda 2 kg", onHand: 22, reorder: 40, short: 18 },
  { nr: "20205", name: "Frityrolje 10 L", onHand: 31, reorder: 45, short: 14 },
];

export const soldOut = [
  { nr: "44700", name: "Falafelmiks 650 g × 18" },
  { nr: "20041", name: "Ananas i biter 850 g, 24 stk" },
  { nr: "50501", name: "Kebabspyd 17×19 cm" },
  { nr: "44709", name: "Pizzapanne 40 cm" },
  { nr: "44710", name: "Pizzapanne 30 cm" },
  { nr: "10061", name: "Vannkastanjer i skiver 3 kg" },
];

/* ── Simulation ───────────────────────────────────────────────────── */

export type StockView = "lager" | "oversikt";

export type StockState = { view: StockView; scroll: number };

export const emptyStock: StockState = { view: "lager", scroll: 0 };

export type StockStep =
  | { kind: "move"; ms: number; to: string }
  | { kind: "click"; ms: number }
  | { kind: "set"; ms: number; patch: Partial<StockState> }
  | { kind: "wait"; ms: number }
  | { kind: "reset"; ms: number };

/* Kept deliberately brisk — the whole loop is ~13s. */
export const stockScript: StockStep[] = [
  { kind: "wait", ms: 1500 },

  /* Lager → Lageroversikt */
  { kind: "move", ms: 700, to: "tab-oversikt" },
  { kind: "click", ms: 240 },
  { kind: "set", ms: 420, patch: { view: "oversikt", scroll: 0 } },
  { kind: "wait", ms: 1600 },

  /* Scroll down to the reorder lists */
  { kind: "set", ms: 1500, patch: { scroll: 214 } },
  { kind: "wait", ms: 2100 },
  { kind: "set", ms: 900, patch: { scroll: 0 } },

  /* Back to the product list */
  { kind: "move", ms: 650, to: "tab-lager" },
  { kind: "click", ms: 240 },
  { kind: "set", ms: 420, patch: { view: "lager" } },
  { kind: "wait", ms: 2400 },

  { kind: "reset", ms: 700 },
];

export const stockLength = stockScript.length;

export function foldStock(upto: number): { state: StockState; target: string | null; clicking: boolean } {
  let state: StockState = { ...emptyStock };
  let target: string | null = null;

  for (let i = 0; i < upto; i++) {
    const s = stockScript[i];
    if (s.kind === "move") target = s.to;
    else if (s.kind === "set") state = { ...state, ...s.patch };
    else if (s.kind === "reset") {
      state = { ...emptyStock };
      target = null;
    }
  }

  const cur = stockScript[upto] ?? null;
  if (cur?.kind === "move") target = cur.to;
  return { state, target, clicking: cur?.kind === "click" };
}
