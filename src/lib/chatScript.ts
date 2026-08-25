import type { Bi } from "@/lib/i18n";

/* ═══════════════════════════════════════════════════════════════════
   The hero simulation script.

   Two acts, one continuous loop:
     Act I  — a plain-text order: preview → customer confirms → draft filed.
     Act II — a photo of a handwritten note: read directly, one line is
              genuinely ambiguous, Nordre asks instead of guessing.

   Act II is the one that sells the product, so Act I is kept tight.

   The runtime folds `script.slice(0, i)` into view state, so every step
   is idempotent and the loop can restart from any index without cleanup.
   ═══════════════════════════════════════════════════════════════════ */

export type Tick = "sent" | "delivered" | "read";

export type OrderLine = {
  name: Bi;
  qty: Bi;
  /** Auto-resolved but worth a second look — renders with a (?) marker. */
  flagged?: boolean;
};

export type ChatItem =
  | { id: string; from: "customer"; kind: "text"; text: Bi; time: string }
  | { id: string; from: "customer"; kind: "photo"; caption: Bi; time: string }
  | { id: string; from: "nordre"; kind: "text"; text: Bi; time: string }
  | {
      id: string;
      from: "nordre";
      kind: "order";
      time: string;
      intro: Bi;
      lines: OrderLine[];
      meta: { label: Bi; value: Bi }[];
      question: Bi;
    }
  | {
      id: string;
      from: "nordre";
      kind: "receipt";
      time: string;
      intro: Bi;
      orderNo: string;
      status: Bi;
      tail: Bi;
    };

export type CardSlot = "customer" | "catalog" | "order";

export type SystemCard = {
  eyebrow: Bi;
  title: Bi;
  detail: Bi;
  /** Drives the left accent bar + icon tint. */
  tone: "accent" | "ice" | "violet" | "signal";
};

export type Step =
  | { kind: "compose"; ms: number; text: Bi; item: ChatItem }
  | { kind: "attach"; ms: number; item: ChatItem }
  | { kind: "push"; ms: number; item: ChatItem }
  | { kind: "typing"; ms: number }
  | { kind: "tick"; ms: number; id: string; to: Tick }
  | { kind: "card"; ms: number; slot: CardSlot; card: SystemCard | null }
  | { kind: "ocr"; ms: number }
  | { kind: "wait"; ms: number }
  | { kind: "reset"; ms: number };

/* ── Act I ────────────────────────────────────────────────────────── */

const m1: ChatItem = {
  id: "m1",
  from: "customer",
  kind: "text",
  time: "22:14",
  text: {
    no: "Hei! Trenger 20 kartonger Kavli mysost 500g til fredag 🙏",
    en: "Hi! Need 20 cases of Kavli mysost 500g by Friday 🙏",
  },
};

const m2: ChatItem = {
  id: "m2",
  from: "nordre",
  kind: "order",
  time: "22:14",
  intro: {
    no: "Hei! Da har jeg dette klart:",
    en: "Hi! Here is what I have:",
  },
  lines: [{ name: { no: "Kavli mysost 500 g", en: "Kavli mysost 500 g" }, qty: { no: "20 kartonger", en: "20 cases" } }],
  meta: [
    { label: { no: "Kunde", en: "Customer" }, value: { no: "Nordby Kafé AS", en: "Nordby Kafé AS" } },
    { label: { no: "Levering", en: "Delivery" }, value: { no: "fre. 29. aug", en: "Fri 29 Aug" } },
  ],
  question: {
    no: "Skal jeg legge den inn slik?",
    en: "Shall I file it like this?",
  },
};

const m3: ChatItem = {
  id: "m3",
  from: "customer",
  kind: "text",
  time: "22:15",
  text: { no: "Ja, kjør på 👍", en: "Yes, go ahead 👍" },
};

const m4: ChatItem = {
  id: "m4",
  from: "nordre",
  kind: "receipt",
  time: "22:15",
  intro: { no: "Lagt inn.", en: "Filed." },
  orderNo: "12048",
  status: { no: "Venter på godkjenning", en: "Pending approval" },
  tail: {
    no: "Du får beskjed så snart den er godkjent.",
    en: "You will hear from us the moment it is approved.",
  },
};

/* ── Act II ───────────────────────────────────────────────────────── */

const m5: ChatItem = {
  id: "m5",
  from: "customer",
  kind: "photo",
  time: "22:16",
  caption: { no: "Og resten av uka — tok bilde av lappen", en: "And the rest of the week — photo of the note" },
};

const m6: ChatItem = {
  id: "m6",
  from: "nordre",
  kind: "order",
  time: "22:16",
  intro: { no: "Fikk ut dette av lappen:", en: "Here is what I got off the note:" },
  lines: [
    { name: { no: "Tine lettmelk 1 L", en: "Tine lettmelk 1 L" }, qty: { no: "24 stk", en: "24 units" } },
    { name: { no: "Gilde kjøttdeig 400 g", en: "Gilde kjøttdeig 400 g" }, qty: { no: "15 stk", en: "15 units" } },
    { name: { no: "Q Kremfløte", en: "Q Kremfløte" }, qty: { no: "6 stk", en: "6 units" }, flagged: true },
  ],
  meta: [{ label: { no: "Kunde", en: "Customer" }, value: { no: "Nordby Kafé AS", en: "Nordby Kafé AS" } }],
  question: {
    no: "Linje 3 var utydelig — mente du 1/2 L eller 3 dl?",
    en: "Line 3 was unclear — did you mean 1/2 L or 3 dl?",
  },
};

const m7: ChatItem = {
  id: "m7",
  from: "customer",
  kind: "text",
  time: "22:17",
  text: { no: "1/2 liter", en: "1/2 litre" },
};

const m8: ChatItem = {
  id: "m8",
  from: "nordre",
  kind: "receipt",
  time: "22:17",
  intro: { no: "Perfekt — alle tre linjene er inne.", en: "Perfect — all three lines are in." },
  orderNo: "12049",
  status: { no: "Venter på godkjenning", en: "Pending approval" },
  tail: {
    no: "Ha en fin kveld 👋",
    en: "Have a good evening 👋",
  },
};

/* ── Side cards: the machine view next to the chat ────────────────── */

const cardCustomer: SystemCard = {
  eyebrow: { no: "Kunde slått opp", en: "Customer resolved" },
  title: { no: "Nordby Kafé AS", en: "Nordby Kafé AS" },
  detail: { no: "Org. 918 273 641 · Kunde siden 2021", en: "Org. 918 273 641 · Customer since 2021" },
  tone: "ice",
};

const cardCatalogA: SystemCard = {
  eyebrow: { no: "Katalogtreff", en: "Catalogue match" },
  title: { no: "1 av 1 linje matchet", en: "1 of 1 line matched" },
  detail: { no: "Art. 40219 · Kavli mysost 500 g · kartong", en: "Art. 40219 · Kavli mysost 500 g · case" },
  tone: "accent",
};

const cardCatalogB: SystemCard = {
  eyebrow: { no: "Katalogtreff", en: "Catalogue match" },
  title: { no: "2 av 3 linjer matchet", en: "2 of 3 lines matched" },
  detail: { no: "Linje 3 tvetydig — spør heller enn å gjette", en: "Line 3 ambiguous — asking rather than guessing" },
  tone: "signal",
};

const cardCatalogC: SystemCard = {
  eyebrow: { no: "Katalogtreff", en: "Catalogue match" },
  title: { no: "3 av 3 linjer matchet", en: "3 of 3 lines matched" },
  detail: { no: "Art. 20841 · Q Kremfløte 1/2 L", en: "Art. 20841 · Q Kremfløte 1/2 L" },
  tone: "accent",
};

const cardOrderA: SystemCard = {
  eyebrow: { no: "Ordre opprettet", en: "Order created" },
  title: { no: "#12048 · Utkast", en: "#12048 · Draft" },
  detail: { no: "Venter på godkjenning · Lager urørt", en: "Pending approval · Stock untouched" },
  tone: "violet",
};

const cardOrderB: SystemCard = {
  eyebrow: { no: "Ordre opprettet", en: "Order created" },
  title: { no: "#12049 · Utkast", en: "#12049 · Draft" },
  detail: { no: "Venter på godkjenning · Lager urørt", en: "Pending approval · Stock untouched" },
  tone: "violet",
};

const cardReading: SystemCard = {
  eyebrow: { no: "Leser vedlegg", en: "Reading attachment" },
  title: { no: "Håndskrevet lapp", en: "Handwritten note" },
  detail: { no: "Bildet leses direkte — ingen mal", en: "Image read directly — no template" },
  tone: "ice",
};

/* ── The timeline ─────────────────────────────────────────────────── */

export const script: Step[] = [
  { kind: "wait", ms: 900 },

  /* — Act I: a plain text order — */
  { kind: "compose", ms: 2600, text: m1.kind === "text" ? m1.text : { no: "", en: "" }, item: m1 },
  { kind: "tick", ms: 320, id: "m1", to: "sent" },
  { kind: "tick", ms: 360, id: "m1", to: "delivered" },
  { kind: "tick", ms: 500, id: "m1", to: "read" },

  { kind: "card", ms: 700, slot: "customer", card: cardCustomer },
  { kind: "typing", ms: 1100 },
  { kind: "card", ms: 800, slot: "catalog", card: cardCatalogA },
  { kind: "push", ms: 3000, item: m2 },

  { kind: "compose", ms: 1300, text: m3.kind === "text" ? m3.text : { no: "", en: "" }, item: m3 },
  { kind: "tick", ms: 300, id: "m3", to: "sent" },
  { kind: "tick", ms: 450, id: "m3", to: "read" },

  { kind: "typing", ms: 900 },
  { kind: "card", ms: 600, slot: "order", card: cardOrderA },
  { kind: "push", ms: 2800, item: m4 },

  /* — Act II: a photo of a handwritten note — */
  { kind: "attach", ms: 1500, item: m5 },
  { kind: "tick", ms: 320, id: "m5", to: "sent" },
  { kind: "tick", ms: 420, id: "m5", to: "read" },

  { kind: "card", ms: 400, slot: "customer", card: cardReading },
  { kind: "ocr", ms: 2600 },
  { kind: "card", ms: 500, slot: "customer", card: cardCustomer },
  { kind: "typing", ms: 900 },
  { kind: "card", ms: 700, slot: "catalog", card: cardCatalogB },
  { kind: "push", ms: 3800, item: m6 },

  { kind: "compose", ms: 1200, text: m7.kind === "text" ? m7.text : { no: "", en: "" }, item: m7 },
  { kind: "tick", ms: 320, id: "m7", to: "sent" },
  { kind: "tick", ms: 420, id: "m7", to: "read" },

  { kind: "card", ms: 600, slot: "catalog", card: cardCatalogC },
  { kind: "typing", ms: 900 },
  { kind: "card", ms: 600, slot: "order", card: cardOrderB },
  { kind: "push", ms: 3600, item: m8 },

  { kind: "wait", ms: 2600 },
  { kind: "reset", ms: 700 },
];

/* ── Folded view state ────────────────────────────────────────────── */

export type ChatView = {
  items: ChatItem[];
  ticks: Record<string, Tick>;
  cards: Record<CardSlot, SystemCard | null>;
  typing: boolean;
  ocr: boolean;
  /** The message currently being typed into the composer, if any. */
  composing: Bi | null;
};

export const emptyView: ChatView = {
  items: [],
  ticks: {},
  cards: { customer: null, catalog: null, order: null },
  typing: false,
  ocr: false,
  composing: null,
};

/**
 * Fold steps [0, upto) into view state, then apply the *current* step's
 * transient flags (typing / ocr / composing). Pure, so re-running it is
 * always safe — StrictMode double-invocation cannot corrupt it.
 */
export function foldScript(upto: number): ChatView {
  const items: ChatItem[] = [];
  const ticks: Record<string, Tick> = {};
  const cards: ChatView["cards"] = { customer: null, catalog: null, order: null };

  for (let i = 0; i < upto; i++) {
    const s = script[i];
    switch (s.kind) {
      case "compose":
      case "attach":
      case "push":
        if (!items.some((it) => it.id === s.item.id)) items.push(s.item);
        break;
      case "tick":
        ticks[s.id] = s.to;
        break;
      case "card":
        cards[s.slot] = s.card;
        break;
      case "reset":
        items.length = 0;
        for (const k of Object.keys(ticks)) delete ticks[k];
        cards.customer = null;
        cards.catalog = null;
        cards.order = null;
        break;
      default:
        break;
    }
  }

  const cur = script[upto] ?? null;
  return {
    items,
    ticks,
    cards,
    typing: cur?.kind === "typing",
    ocr: cur?.kind === "ocr",
    composing: cur?.kind === "compose" ? cur.text : null,
  };
}

export const scriptLength = script.length;
