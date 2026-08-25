"use client";

import { AnimatePresence, motion } from "motion/react";
import { useLocale } from "@/lib/i18n";

/* The "photo" the customer sends in Act II. Built in DOM rather than shipped
   as a bitmap so the OCR pass can draw real detection boxes over real text
   nodes — and so it stays crisp on any display. */

const LINES = {
  no: [
    { item: "Lettmelk 1L", qty: "24" },
    { item: "Kjøttdeig 400g", qty: "15" },
    { item: "Q kremfløte", qty: "6" },
  ],
  en: [
    { item: "Lettmelk 1L", qty: "24" },
    { item: "Kjøttdeig 400g", qty: "15" },
    { item: "Q kremfløte", qty: "6" },
  ],
};

export function HandwrittenNote({ ocr = false }: { ocr?: boolean }) {
  const { locale } = useLocale();
  const lines = LINES[locale];

  return (
    <div className="relative aspect-4/5 w-full overflow-hidden rounded-[6px] bg-[#171310]">
      {/* Photographed paper: warm, slightly off-axis, lit from the top-left */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 25% 8%, #FBF4E4 0%, #EFE4CC 46%, #DCCDAF 78%, #C6B492 100%)",
          transform: "rotate(-1.6deg) scale(1.1)",
        }}
      >
        {/* Ruled lines */}
        <div
          className="absolute inset-0 opacity-45"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0 21px, rgba(90,110,140,0.30) 21px 22px)",
            backgroundPosition: "0 34px",
          }}
        />
        {/* Left margin rule */}
        <div className="absolute inset-y-0 left-[13%] w-px bg-[rgba(190,90,90,0.35)]" />

        {/* Paper fibre */}
        <div
          className="absolute inset-0 opacity-[0.16] mix-blend-multiply"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      {/* The handwriting itself */}
      <div
        className="absolute inset-0 px-[15%] py-[9%] text-[#1E3A5F]"
        style={{
          fontFamily: "var(--font-caveat), cursive",
          transform: "rotate(-1.6deg)",
        }}
      >
        <div className="text-[13px] leading-tight font-bold tracking-wide">Nordby Kafé</div>
        <div className="mt-[1px] text-[10px] leading-tight text-[#2E4A6B]/80">resten av uka</div>
        <div className="mt-[3px] h-px w-[62%] bg-[#1E3A5F]/45" />

        <ul className="mt-[9%] space-y-[9%]">
          {lines.map((l, i) => (
            <li
              key={l.item}
              data-ocr-line={i}
              className="flex items-baseline justify-between gap-2 text-[11.5px] leading-none"
              /* Each line sits at a slightly different angle — nobody writes straight */
              style={{ transform: `rotate(${[-0.7, 0.5, -0.3][i]}deg)` }}
            >
              <span>{l.item}</span>
              <span className="grow border-b border-dotted border-[#1E3A5F]/35" />
              <span className="font-bold">{l.qty}</span>
            </li>
          ))}
        </ul>

        {/* A smudge on the last line — this is the one Nordre refuses to guess */}
        <div className="pointer-events-none absolute right-[16%] bottom-[27%] h-[13px] w-[34%] rounded-full bg-[#5B6B80]/20 blur-[3px]" />
      </div>

      {/* Photo grade: vignette + a cool shadow across the lower right */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(130% 100% at 20% 5%, rgba(255,250,235,0.16) 0%, transparent 42%), linear-gradient(145deg, transparent 40%, rgba(20,26,34,0.34) 100%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_40px_rgba(20,16,10,0.45)]" />

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
            {/* Cool wash so the scan reads as "machine looking at it" */}
            <div className="absolute inset-0 bg-[#5CE1B0]/8" />

            {/* Detection boxes, landing one after another */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45 + i * 0.42, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="absolute rounded-[2px] border border-accent/80 bg-accent/10"
                style={{
                  left: "12%",
                  right: "11%",
                  top: `${47 + i * 13.5}%`,
                  height: "11%",
                }}
              >
                <span className="absolute -top-[1px] -left-[1px] h-[5px] w-[5px] border-t border-l border-accent" />
                <span className="absolute -top-[1px] -right-[1px] h-[5px] w-[5px] border-t border-r border-accent" />
                <span className="absolute -bottom-[1px] -left-[1px] h-[5px] w-[5px] border-b border-l border-accent" />
                <span className="absolute -right-[1px] -bottom-[1px] h-[5px] w-[5px] border-r border-b border-accent" />
              </motion.div>
            ))}

            {/* The sweep */}
            <div className="absolute inset-x-0 top-0 h-full overflow-hidden">
              <div className="ocr-sweep absolute inset-x-0 h-[22%]">
                <div className="h-full w-full bg-linear-to-b from-transparent via-accent/22 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-px bg-accent shadow-[0_0_12px_2px_rgba(92,225,176,0.75)]" />
              </div>
            </div>

            {/* Corner reticle */}
            <div className="absolute inset-[6%]">
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
