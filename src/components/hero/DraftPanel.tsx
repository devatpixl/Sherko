"use client";

import { AnimatePresence, motion } from "motion/react";
import type { FormState } from "@/lib/chatScript";
import { useLocale, type Bi } from "@/lib/i18n";

/* The order form, filling itself in as the conversation happens.

   This is the row a person would otherwise have typed into a spreadsheet, so
   it is deliberately in plain language — the reader is a wholesale owner, not
   an engineer. Empty fields show their label and a dashed rule, so you can see
   what is *about* to be filled before it is. */

const FIELDS: { key: keyof FormState; label: Bi }[] = [
  { key: "kunde", label: { no: "Kunde", en: "Customer" } },
  { key: "varer", label: { no: "Varer", en: "Items" } },
  { key: "levering", label: { no: "Levering", en: "Delivery" } },
  { key: "ordre", label: { no: "Ordrenr", en: "Order no" } },
];

const EASE = [0.16, 1, 0.3, 1] as const;

function Row({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="relative flex items-start gap-4 border-b border-line py-3">
      <span className="w-[74px] shrink-0 pt-px text-[12.5px] text-fg-3">{label}</span>

      <div className="min-w-0 flex-1">
        <AnimatePresence mode="wait" initial={false}>
          {value ? (
            <motion.div
              key={value}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="flex items-start gap-2"
            >
              <span className="min-w-0 flex-1 text-[14px] leading-[19px] text-fg">{value}</span>
              <motion.svg
                viewBox="0 0 16 16"
                className="mt-[3px] h-3.5 w-3.5 shrink-0 text-accent"
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.18, duration: 0.32, ease: EASE }}
                aria-hidden
              >
                <path
                  d="M3 8.5l3.2 3.2L13 5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            </motion.div>
          ) : (
            <motion.span
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-[9px] block h-px w-2/3 bg-line-2 [mask-image:repeating-linear-gradient(to_right,#000_0_5px,transparent_5px_10px)]"
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function DraftPanel({ form, className = "" }: { form: FormState; className?: string }) {
  const { locale } = useLocale();
  const t = (b: Bi | null) => (b ? b[locale] : null);

  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden>
      {/* Heading */}
      <div className="flex items-center gap-3 pb-1">
        <span className="font-mono text-[10px] tracking-[0.2em] text-fg-4 uppercase">
          {locale === "no" ? "Ordreutkast" : "Draft order"}
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>

      {FIELDS.map((f) => (
        <Row key={f.key} label={f.label[locale]} value={t(form[f.key])} />
      ))}

      {/* Amber aside — shown only while something is genuinely unresolved */}
      <AnimatePresence>
        {form.note && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.36, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="flex items-start gap-2.5 pt-3">
              <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
              <span className="text-[12.5px] leading-[17px] text-signal">{t(form.note)}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The point of the whole page: it stops here and waits for a human */}
      <AnimatePresence>
        {form.status && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.44, ease: EASE }}
            className="mt-4 flex items-center gap-2.5 rounded-full border border-signal/25 bg-signal/8 py-2 pr-4 pl-3"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
            </span>
            <span className="text-[12.5px] font-medium text-signal">{t(form.status)}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
