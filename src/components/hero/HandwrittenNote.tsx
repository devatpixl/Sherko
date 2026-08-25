"use client";

import { AnimatePresence, motion } from "motion/react";

/* The "photo" the customer sends in Act II: a real Moen Engros order, written
   in marker on a whiteboard and photographed. Built in DOM rather than shipped
   as a bitmap so the OCR pass can draw detection boxes over real text nodes,
   and so it stays crisp on any display.

   Note line 3 — the writer put a question mark on the board themselves. That is
   the line Nordre refuses to guess, and it is why this photo is the right demo:
   the ambiguity is genuine, not invented for the animation. */

const ROWS = [
  { item: "Jalapeno", qty: "1 Pal." },
  { item: "Champion", qty: "1 PØ" },
  { item: "? Esk - Hvit", qty: "1 PØ" },
  { item: "Serviett", qty: "1 Pal." },
  { item: "Topping", qty: "2 Pal." },
  { item: "Frityr oil", qty: "30 Kn." },
];

/* Row geometry, shared by the handwriting and the OCR boxes so they can never
   drift apart. Percentages of the photo's height. */
const ROW_TOP = 30;
const ROW_STEP = 11.2;
const ROW_H = 9.4;

/* Nobody writes straight. */
const TILT = [-0.9, 0.4, -0.5, 0.7, -0.3, 0.5];

export function HandwrittenNote({ ocr = false }: { ocr?: boolean }) {
  return (
    <div className="relative aspect-6/5 w-full overflow-hidden rounded-[6px] bg-[#14161A]">
      {/* The board, shot slightly off-axis and lit from the upper left */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(115% 85% at 22% 6%, #FCFCFA 0%, #F0F1ED 38%, #DFE1DC 70%, #C7CAC4 100%)",
          transform: "rotate(-0.8deg) scale(1.08)",
        }}
      >
        {/* Aluminium frame catching light along the top edge */}
        <div className="absolute inset-x-0 top-0 h-[4%] bg-linear-to-b from-[#A8ACA6] to-[#CACEC7]" />
        {/* Ghosting from whatever was wiped off last week */}
        <div
          className="absolute inset-0 opacity-[0.045] mix-blend-multiply"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.55' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      {/* The marker writing */}
      <div
        className="absolute inset-0 text-[#B23A2E]"
        style={{ fontFamily: "var(--font-caveat), cursive", transform: "rotate(-0.8deg)" }}
      >
        {/* Heading — the customer's own shorthand for who it's for */}
        <div className="absolute top-[8%] left-1/2 -translate-x-1/2 text-center">
          <span className="text-[15px] leading-none font-bold tracking-wide">Moen</span>
          <span className="mt-[2px] block h-[1.5px] w-full rounded bg-[#B23A2E]/75" />
        </div>

        {ROWS.map((r, i) => (
          <div
            key={r.item}
            className="absolute right-[9%] left-[8%] flex items-baseline gap-[4px] text-[11.5px] leading-none"
            style={{ top: `${ROW_TOP + i * ROW_STEP}%`, transform: `rotate(${TILT[i]}deg)` }}
          >
            <span className="shrink-0 font-bold whitespace-nowrap">{r.item}</span>
            {/* The long marker dash the writer used instead of a column */}
            <span className="mx-[2px] h-[1.5px] grow rounded bg-[#B23A2E]/70" />
            <span className="shrink-0 font-bold whitespace-nowrap">{r.qty}</span>
          </div>
        ))}
      </div>

      {/* Photo grade: glare off the gloss, then a cool falloff bottom-right */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(118deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.10) 16%, transparent 34%), linear-gradient(150deg, transparent 46%, rgba(22,28,36,0.30) 100%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_36px_rgba(18,20,24,0.38)]" />

      {/* ── OCR pass ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {ocr && (
          <motion.div
            key="ocr"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute inset-0 bg-[#5CE1B0]/10" />

            {/* One box per line, landing in reading order. Line 3 lands amber —
                the machine flagging the question mark the human wrote. */}
            {ROWS.map((r, i) => {
              const unsure = i === 2;
              return (
                <motion.div
                  key={r.item}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35 + i * 0.22, duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className={`absolute rounded-[2px] border ${
                    unsure ? "border-signal/90 bg-signal/15" : "border-accent/80 bg-accent/10"
                  }`}
                  style={{
                    left: "6%",
                    right: "6%",
                    top: `${ROW_TOP + i * ROW_STEP - 1.4}%`,
                    height: `${ROW_H}%`,
                  }}
                />
              );
            })}

            {/* The sweep */}
            <div className="absolute inset-x-0 top-0 h-full overflow-hidden">
              <div className="ocr-sweep absolute inset-x-0 h-[20%]">
                <div className="h-full w-full bg-linear-to-b from-transparent via-accent/22 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-px bg-accent shadow-[0_0_12px_2px_rgba(92,225,176,0.75)]" />
              </div>
            </div>

            {/* Corner reticle */}
            <div className="absolute inset-[5%]">
              {(
                [
                  "top-0 left-0 border-t-2 border-l-2",
                  "top-0 right-0 border-t-2 border-r-2",
                  "bottom-0 left-0 border-b-2 border-l-2",
                  "bottom-0 right-0 border-b-2 border-r-2",
                ] as const
              ).map((c) => (
                <span key={c} className={`absolute h-3 w-3 border-accent ${c}`} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
