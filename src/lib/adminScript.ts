import type { Bi } from "@/lib/i18n";

/* ═══════════════════════════════════════════════════════════════════
   The admin-portal simulation: a person creating an order, with the
   cursor doing the work.

   ⚠️  PRIVACY — every name in this file is invented. The portal brands
   as "Nordre Admin", the tenant is the fictional "Fjordvik Engros"
   (order prefix FE-), and no customer, product, contact or figure is
   traceable to a real client. Keep it that way if you edit this.
   ═══════════════════════════════════════════════════════════════════ */

export const tenant = "Fjordvik Engros";
export const operator = { name: "Ida Hovden", email: "ida@fjordvikengros.no" };

export type Customer = { name: string; org: string };
export type Product = { nr: string; name: string; price: number };
export type Line = { nr: string; name: string; qty: number; price: number; vat: string };

export const customers: Customer[] = [
  { name: "BRYGGEN PIZZERIA AS", org: "918 452 331" },
  { name: "FJELLSTUA RESTAURANT AS", org: "924 118 907" },
  { name: "NORDVEST STORKJØKKEN AS", org: "927 551 460" },
  { name: "HAVNA GRILL AS", org: "931 664 205" },
  { name: "KYSTENS KANTINE AS", org: "916 302 884" },
  { name: "STORGATA BAKERI AS", org: "913 780 552" },
];

export const products: Product[] = [
  { nr: "20354", name: "Revet ost 70/30, 2 kg", price: 191.0 },
  { nr: "20205", name: "Frityrolje 10 L", price: 240.0 },
  { nr: "20106", name: "Maiskorn 2,5 kg", price: 34.16 },
  { nr: "10025", name: "Pizzatopping revet 2 kg", price: 138.0 },
  { nr: "10011", name: "Soyaolje 10 L", price: 220.0 },
  { nr: "20335", name: "Varmmatboks 2-roms, 200 stk", price: 1.1 },
  { nr: "10092", name: "Revet gouda 2 kg", price: 190.0 },
  { nr: "20871", name: "Pizzaeske 33 cm, 25 stk", price: 78.5 },
];

/** The customer and products the simulation picks. */
export const PICK_CUSTOMER = 2; // NORDVEST STORKJØKKEN AS
export const PICK_PRODUCTS = [0, 1]; // Revet ost, Frityrolje
export const QTYS = [12, 4];
export const NEW_ORDER_NO = "FE-2026-0496";

export type OrderRow = {
  no: string;
  company: string;
  org: string;
  status: "godkjent" | "behandling" | "venter";
  date: string;
  amount: string;
};

export const orderRows: OrderRow[] = [
  { no: "FE-2026-0495", company: "BRYGGEN PIZZERIA AS", org: "918 452 331", status: "godkjent", date: "26. aug. 2026, 16:06", amount: "16 421,00" },
  { no: "FE-2026-0494", company: "NORDVEST STORKJØKKEN AS", org: "927 551 460", status: "behandling", date: "26. aug. 2026, 15:10", amount: "261 900,00" },
  { no: "FE-2026-0493", company: "SERVICEGROSSISTEN VEST AS", org: "942 545 258", status: "behandling", date: "26. aug. 2026, 15:09", amount: "124 079,00" },
  { no: "FE-2026-0492", company: "HAVNA GRILL AS", org: "931 664 205", status: "venter", date: "26. aug. 2026, 15:01", amount: "61 405,00" },
  { no: "FE-2026-0491", company: "FJELLSTUA RESTAURANT AS", org: "924 118 907", status: "behandling", date: "26. aug. 2026, 14:05", amount: "11 222,00" },
  { no: "FE-2026-0490", company: "KYSTENS KANTINE AS", org: "916 302 884", status: "venter", date: "26. aug. 2026, 14:01", amount: "9 800,00" },
];

export const statusLabel: Record<OrderRow["status"], Bi> = {
  godkjent: { no: "Godkjent", en: "Approved" },
  behandling: { no: "Under behandling", en: "Processing" },
  venter: { no: "Venter godkjenning", en: "Pending approval" },
};

/* ── Simulation state ─────────────────────────────────────────────── */

export type AdminView = "orders" | "new" | "detail";

export type AdminState = {
  view: AdminView;
  /** Extra tab shown next to "Ordre" once a new order is opened. */
  extraTab: Bi | null;
  customerOpen: boolean;
  customerIdx: number | null;
  /** Row index whose product dropdown is open, or null. */
  productOpen: number | null;
  lines: Line[];
  orderNo: string | null;
  /** Brief pressed state on the Registrer button. */
  registering: boolean;
};

export const emptyAdmin: AdminState = {
  view: "orders",
  extraTab: null,
  customerOpen: false,
  customerIdx: null,
  productOpen: null,
  lines: [],
  orderNo: null,
  registering: false,
};

export type AdminStep =
  | { kind: "move"; ms: number; to: string }
  | { kind: "click"; ms: number }
  | { kind: "set"; ms: number; patch: Partial<AdminState> }
  | { kind: "wait"; ms: number }
  | { kind: "reset"; ms: number };

const line = (i: number, qty: number): Line => ({
  nr: products[PICK_PRODUCTS[i]].nr,
  name: products[PICK_PRODUCTS[i]].name,
  price: products[PICK_PRODUCTS[i]].price,
  qty,
  vat: "15 %",
});

const L1 = line(0, QTYS[0]);
const L2 = line(1, QTYS[1]);

/* ── The timeline ─────────────────────────────────────────────────── */

export const adminScript: AdminStep[] = [
  { kind: "wait", ms: 1400 },

  /* Open a new order from the orders list */
  { kind: "move", ms: 1050, to: "new-order" },
  { kind: "click", ms: 320 },
  { kind: "set", ms: 650, patch: { view: "new", extraTab: { no: "Ny ordre", en: "New order" } } },

  /* Pick the customer */
  { kind: "move", ms: 850, to: "customer-select" },
  { kind: "click", ms: 300 },
  { kind: "set", ms: 500, patch: { customerOpen: true } },
  { kind: "move", ms: 780, to: `cust-${PICK_CUSTOMER}` },
  { kind: "click", ms: 300 },
  { kind: "set", ms: 620, patch: { customerOpen: false, customerIdx: PICK_CUSTOMER } },

  /* First line */
  { kind: "move", ms: 900, to: "product-0" },
  { kind: "click", ms: 300 },
  { kind: "set", ms: 480, patch: { productOpen: 0 } },
  { kind: "move", ms: 720, to: `prod-${PICK_PRODUCTS[0]}` },
  { kind: "click", ms: 300 },
  { kind: "set", ms: 700, patch: { productOpen: null, lines: [L1] } },

  /* Second line */
  { kind: "move", ms: 820, to: "product-1" },
  { kind: "click", ms: 300 },
  { kind: "set", ms: 480, patch: { productOpen: 1 } },
  { kind: "move", ms: 720, to: `prod-${PICK_PRODUCTS[1]}` },
  { kind: "click", ms: 300 },
  { kind: "set", ms: 800, patch: { productOpen: null, lines: [L1, L2] } },

  /* Register it */
  { kind: "move", ms: 1000, to: "register" },
  { kind: "click", ms: 300 },
  { kind: "set", ms: 520, patch: { registering: true } },
  {
    kind: "set",
    ms: 900,
    patch: {
      registering: false,
      view: "detail",
      orderNo: NEW_ORDER_NO,
      extraTab: { no: `${NEW_ORDER_NO}`, en: `${NEW_ORDER_NO}` },
    },
  },

  { kind: "wait", ms: 3600 },
  { kind: "reset", ms: 900 },
];

export const adminLength = adminScript.length;

/** Fold steps [0, upto) into state. Pure — safe to re-run. */
export function foldAdmin(upto: number): { state: AdminState; target: string | null; clicking: boolean } {
  let state: AdminState = { ...emptyAdmin, lines: [] };
  let target: string | null = null;

  for (let i = 0; i < upto; i++) {
    const s = adminScript[i];
    if (s.kind === "move") target = s.to;
    else if (s.kind === "set") state = { ...state, ...s.patch };
    else if (s.kind === "reset") {
      state = { ...emptyAdmin, lines: [] };
      target = null;
    }
  }

  const cur = adminScript[upto] ?? null;
  if (cur?.kind === "move") target = cur.to;
  return { state, target, clicking: cur?.kind === "click" };
}

/* ── Formatting ───────────────────────────────────────────────────── */

export function kr(n: number): string {
  return n.toLocaleString("nb-NO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function lineTotal(l: Line): number {
  return l.qty * l.price;
}

export function orderTotal(lines: Line[]): number {
  return lines.reduce((sum, l) => sum + lineTotal(l), 0);
}
