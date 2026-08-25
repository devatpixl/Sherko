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

/** One line of the agent's work log, shown beside the phone. */
export type TraceLine = {
  id: string;
  /** Machine verbs stay in English on purpose — this is a log, not prose. */
  verb: string;
  time: string;
  detail: Bi;
  tone?: "accent" | "signal";
};

export type Step =
  | { kind: "compose"; ms: number; text: Bi; item: ChatItem }
  | { kind: "attach"; ms: number; item: ChatItem }
  | { kind: "push"; ms: number; item: ChatItem }
  | { kind: "typing"; ms: number }
  | { kind: "tick"; ms: number; id: string; to: Tick }
  | { kind: "trace"; ms: number; line: TraceLine }
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
  lines: [{ name: { no: "Kavli mysost 500 g", en: "Kavli mysost 500 g" }, qty: { no: "20 kartonger", en: "20 cases" } }],
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
  caption: { no: "Tok bilde av tavla", en: "Photo of the board" },
};

const m6: ChatItem = {
  id: "m6",
  from: "nordre",
  kind: "order",
  time: "22:16",
  intro: { no: "Fikk ut dette av tavla:", en: "Here is what I got off the board:" },
  lines: [
    { name: { no: "Jalapeño", en: "Jalapeño" }, qty: { no: "1 pall", en: "1 pallet" } },
    { name: { no: "Champignon", en: "Champignon" }, qty: { no: "1 PØ", en: "1 PØ" } },
    { name: { no: "«? Esk – Hvit»", en: "“? Esk – Hvit”" }, qty: { no: "1 PØ", en: "1 PØ" }, flagged: true },
    { name: { no: "Serviett", en: "Napkins" }, qty: { no: "1 pall", en: "1 pallet" } },
    { name: { no: "Topping", en: "Topping" }, qty: { no: "2 pall", en: "2 pallets" } },
    { name: { no: "Frityrolje", en: "Frying oil" }, qty: { no: "30 kanner", en: "30 cans" } },
  ],
  meta: [{ label: { no: "Kunde", en: "Customer" }, value: { no: "Nordby Kafé AS", en: "Nordby Kafé AS" } }],
  question: {
    no: "Linje 3 står det «? Esk – Hvit» på tavla. Mente du hvite esker 1/1 eller 1/2?",
    en: "Line 3 just says “? Esk – Hvit” on the board. Did you mean white boxes 1/1 or 1/2?",
  },
};

const m7: ChatItem = {
  id: "m7",
  from: "customer",
  kind: "text",
  time: "22:17",
  text: { no: "1/1, takk", en: "1/1, thanks" },
};

const m8: ChatItem = {
  id: "m8",
  from: "nordre",
  kind: "receipt",
  time: "22:17",
  intro: { no: "Perfekt — alle seks linjene er inne.", en: "Perfect — all six lines are in." },
  orderNo: "12049",
  status: { no: "Venter på godkjenning", en: "Pending approval" },
  tail: {
    no: "Ha en fin kveld 👋",
    en: "Have a good evening 👋",
  },
};

/* ── The work log beside the chat ─────────────────────────────────── */

const T = (
  id: string, time: string, verb: string, no: string, en: string,
  tone?: "accent" | "signal",
): TraceLine => ({ id, time, verb, detail: { no, en }, tone });

const trace = {
  /* Act I */
  inbound1: T("t1", "22:14:03", "inbound", "whatsapp · +47 ••• 41 22", "whatsapp · +47 ••• 41 22"),
  customer: T("t2", "22:14:03", "customer", "Nordby Kafé AS · 918 273 641", "Nordby Kafé AS · 918 273 641"),
  search1: T("t3", "22:14:04", "search", "kavli mysost 500g → 3 treff", "kavli mysost 500g → 3 hits"),
  match1: T("t4", "22:14:05", "match", "art. 40219 · kartong · 0.94", "art. 40219 · case · 0.94"),
  preview1: T("t5", "22:14:06", "preview", "sendt — venter på svar", "sent — awaiting reply"),
  confirm1: T("t6", "22:15:02", "confirm", "kunde sa ja", "customer said yes"),
  draft1: T("t7", "22:15:03", "draft", "#12048 · pending_approval", "#12048 · pending_approval", "accent"),
  stock1: T("t8", "22:15:03", "stock", "urørt", "untouched"),

  /* Act II */
  inbound2: T("t9", "22:16:11", "inbound", "whatsapp · bilde (jpeg)", "whatsapp · image (jpeg)"),
  vision: T("t10", "22:16:14", "vision", "tavle · 6 linjer lest", "whiteboard · 6 lines read"),
  match2: T("t11", "22:16:16", "match", "5 av 6 · linje 3 tvetydig", "5 of 6 · line 3 ambiguous", "signal"),
  ask: T("t12", "22:16:17", "ask", "spør — gjetter ikke", "asking — not guessing", "signal"),
  resolve: T("t13", "22:17:08", "resolve", "eske hvit 1/1 · art. 20841", "white box 1/1 · art. 20841"),
  draft2: T("t14", "22:17:09", "draft", "#12049 · pending_approval", "#12049 · pending_approval", "accent"),
};

/* ── The timeline ─────────────────────────────────────────────────── */

export const script: Step[] = [
  { kind: "wait", ms: 900 },

  /* — Act I: a plain text order — */
  { kind: "compose", ms: 2600, text: m1.kind === "text" ? m1.text : { no: "", en: "" }, item: m1 },
  { kind: "tick", ms: 300, id: "m1", to: "sent" },
  { kind: "trace", ms: 260, line: trace.inbound1 },
  { kind: "tick", ms: 300, id: "m1", to: "delivered" },
  { kind: "tick", ms: 380, id: "m1", to: "read" },
  { kind: "trace", ms: 620, line: trace.customer },
  { kind: "typing", ms: 700 },
  { kind: "trace", ms: 620, line: trace.search1 },
  { kind: "trace", ms: 640, line: trace.match1 },
  { kind: "trace", ms: 420, line: trace.preview1 },
  { kind: "push", ms: 3000, item: m2 },

  { kind: "compose", ms: 1300, text: m3.kind === "text" ? m3.text : { no: "", en: "" }, item: m3 },
  { kind: "tick", ms: 300, id: "m3", to: "sent" },
  { kind: "tick", ms: 400, id: "m3", to: "read" },
  { kind: "trace", ms: 520, line: trace.confirm1 },
  { kind: "typing", ms: 700 },
  { kind: "trace", ms: 560, line: trace.draft1 },
  { kind: "trace", ms: 420, line: trace.stock1 },
  { kind: "push", ms: 2800, item: m4 },

  /* — Act II: a photo of a handwritten whiteboard — */
  { kind: "attach", ms: 1400, item: m5 },
  { kind: "tick", ms: 300, id: "m5", to: "sent" },
  { kind: "trace", ms: 300, line: trace.inbound2 },
  { kind: "tick", ms: 380, id: "m5", to: "read" },
  { kind: "ocr", ms: 3200 },
  { kind: "trace", ms: 700, line: trace.vision },
  { kind: "typing", ms: 700 },
  { kind: "trace", ms: 660, line: trace.match2 },
  { kind: "trace", ms: 520, line: trace.ask },
  { kind: "push", ms: 4800, item: m6 },

  { kind: "compose", ms: 1200, text: m7.kind === "text" ? m7.text : { no: "", en: "" }, item: m7 },
  { kind: "tick", ms: 300, id: "m7", to: "sent" },
  { kind: "tick", ms: 380, id: "m7", to: "read" },
  { kind: "trace", ms: 620, line: trace.resolve },
  { kind: "typing", ms: 700 },
  { kind: "trace", ms: 560, line: trace.draft2 },
  { kind: "push", ms: 3600, item: m8 },

  { kind: "wait", ms: 2600 },
  { kind: "reset", ms: 700 },
];

/* ── Folded view state ────────────────────────────────────────────── */

export type ChatView = {
  items: ChatItem[];
  ticks: Record<string, Tick>;
  trace: TraceLine[];
  typing: boolean;
  ocr: boolean;
  /** The message currently being typed into the composer, if any. */
  composing: Bi | null;
};

export const emptyView: ChatView = {
  items: [],
  ticks: {},
  trace: [],
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
  const trace: TraceLine[] = [];

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
      case "trace":
        if (!trace.some((l) => l.id === s.line.id)) trace.push(s.line);
        break;
      case "reset":
        items.length = 0;
        for (const k of Object.keys(ticks)) delete ticks[k];
        trace.length = 0;
        break;
      default:
        break;
    }
  }

  const cur = script[upto] ?? null;
  return {
    items,
    ticks,
    trace,
    typing: cur?.kind === "typing",
    ocr: cur?.kind === "ocr",
    composing: cur?.kind === "compose" ? cur.text : null,
  };
}

export const scriptLength = script.length;
