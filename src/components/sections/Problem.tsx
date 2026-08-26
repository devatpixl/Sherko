"use client";

import { Fragment } from "react";
import { Container, Reveal, Rule, Section, SectionHead } from "@/components/ui";
import { SpreadsheetMark } from "@/components/ui/SpreadsheetMark";
import { problem } from "@/lib/content";
import { useLocale, type Bi } from "@/lib/i18n";

/* ═══════════════════════════════════════════════════════════════════
   PROBLEM — the same order, twice, plotted against a clock.

   The argument is not "manual work is bad", it is the *gap*: the left
   column's six steps are stamped 22:14 → 11:40 the next morning, the
   right column's six are stamped 22:14 → 22:15. Both are drawn as one
   timeline so the two clocks sit in the same column of type and the
   reader compares timestamps, not adjectives. Everything else — the
   rail, the dots, the totals — exists to make that comparison legible.
   ═══════════════════════════════════════════════════════════════════ */

const BEFORE_TIMES = ["22:14", "08:30", "08:52", "09:05", "09:20", "11:40"];
const AFTER_TIMES = ["22:14", "22:14", "22:14", "22:15", "22:15", "22:15"];

const nextMorning: Bi = { no: "— neste morgen —", en: "— next morning —" };
const elapsedLabel: Bi = { no: "Fra melding til ordre", en: "Message to order" };
const beforeTotal: Bi = { no: "~13t 26min", en: "~13h 26min" };
const afterTotal: Bi = { no: "61 sek", en: "61 sec" };

/* The rail goes dashed across the overnight gap — dead time, drawn as
   dead line. It is the only place the two columns differ structurally. */
const DASHED_RAIL =
  "repeating-linear-gradient(to bottom, var(--color-line-2) 0 3px, transparent 3px 8px)";

/* Geometry, shared by both columns so the timestamps line up across the
   divider: 3rem gutter · 1rem gap · 1px rail · 1rem gap · row text. */
const RAIL_X = "left-16";

/* ── Rows ─────────────────────────────────────────────────────────── */

function TimelineRow({
  time,
  text,
  delay,
  live,
}: {
  time: string;
  text: string;
  delay: number;
  live: boolean;
}) {
  return (
    <li>
      <Reveal delay={delay} className="flex gap-4">
        <span
          className={`w-12 shrink-0 pt-4 pb-3 text-right font-mono text-[11px] tabular-nums ${
            live ? "text-accent" : "text-fg-4"
          }`}
        >
          {time}
        </span>

        {/* Rail segment. The "before" column paints its own so the
            overnight gap can break it; the "after" column leaves this
            transparent and runs one continuous gradient behind. */}
        <span className={`relative w-px shrink-0 ${live ? "" : "bg-line-2"}`}>
          <span
            className={`absolute top-5 left-1/2 h-[7px] w-[7px] -translate-x-1/2 rounded-full ${
              live
                ? "bg-accent shadow-[0_0_10px_-2px_var(--color-accent)] ring-4 ring-accent/10"
                : "bg-line-2"
            }`}
          />
        </span>

        <p
          className={`min-w-0 flex-1 py-3 text-[0.9375rem] leading-[1.6] ${
            live ? "text-fg" : "text-fg-3"
          }`}
        >
          {text}
        </p>
      </Reveal>
    </li>
  );
}

function OvernightRow({ text, delay }: { text: string; delay: number }) {
  return (
    <li>
      <Reveal delay={delay} className="flex gap-4">
        <span className="w-12 shrink-0" />
        <span className="w-px shrink-0" style={{ backgroundImage: DASHED_RAIL }} />
        <span className="py-4 font-mono text-[10px] tracking-[0.14em] text-fg-4 uppercase">
          {text}
        </span>
      </Reveal>
    </li>
  );
}

/* ── Column ───────────────────────────────────────────────────────── */

function Column({
  label,
  rows,
  times,
  total,
  totalLabel,
  live,
  overnight,
  mark = false,
  className = "",
}: {
  label: string;
  rows: string[];
  times: string[];
  total: string;
  totalLabel: string;
  live: boolean;
  overnight?: string;
  /** Show the spreadsheet mark — this is the column that still runs on Excel. */
  mark?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <Reveal>
        <span
          className={`inline-flex items-center rounded-full border px-3 py-1.5 font-mono text-[10px] font-medium tracking-[0.16em] uppercase ${
            live ? "border-accent/30 bg-accent/10 text-accent" : "border-line-2 text-fg-3"
          }`}
        >
          {mark && <SpreadsheetMark className="mr-2 -ml-0.5 h-3.5 w-3.5 text-fg-2" />}
          {label}
        </span>
      </Reveal>

      <ol className="relative mt-8">
        {live && (
          <span
            className={`absolute inset-y-0 ${RAIL_X} w-px bg-linear-to-b from-accent/70 to-accent/10`}
            aria-hidden
          />
        )}

        {rows.map((text, i) => (
          <Fragment key={i}>
            <TimelineRow time={times[i]} text={text} delay={i * 0.05} live={live} />
            {overnight && i === 0 && <OvernightRow text={overnight} delay={0.05} />}
          </Fragment>
        ))}
      </ol>

      <Reveal delay={0.3} className="mt-9">
        <p className="font-mono text-[10px] tracking-[0.16em] text-fg-4 uppercase">{totalLabel}</p>
        <p
          className={`mt-3 inline-flex items-center rounded-2xl border px-4 py-2.5 font-mono text-[0.9375rem] tracking-tight ${
            live
              ? "border-accent/30 bg-linear-to-b from-surface-2 to-surface text-accent shadow-[0_0_40px_-18px_var(--color-accent)]"
              : "border-line-2 text-fg-3"
          }`}
        >
          {total}
        </p>
      </Reveal>
    </div>
  );
}

/* ── Section ──────────────────────────────────────────────────────── */

export function Problem() {
  const { locale } = useLocale();

  return (
    <Section id="problem" className="bg-canvas">
      <Container>
        <SectionHead
          eyebrow={problem.eyebrow[locale]}
          title={problem.title[locale]}
          body={problem.body[locale]}
        />

        {/* The negative inset cancels the container padding, so each
            column can carry its own px-10 and the hairline between them
            lands dead centre while the type stays on the outer grid. */}
        <div className="mt-16 grid gap-y-10 md:-mx-10 md:mt-20 md:grid-cols-2 md:gap-0">
          <Column
            label={problem.before.label[locale]}
            mark
            rows={problem.before.rows.map((r) => r[locale])}
            times={BEFORE_TIMES}
            total={beforeTotal[locale]}
            totalLabel={elapsedLabel[locale]}
            overnight={nextMorning[locale]}
            live={false}
            className="md:px-10"
          />

          <Rule className="md:hidden" />

          <Column
            label={problem.after.label[locale]}
            rows={problem.after.rows.map((r) => r[locale])}
            times={AFTER_TIMES}
            total={afterTotal[locale]}
            totalLabel={elapsedLabel[locale]}
            live
            className="md:border-l md:border-line md:px-10"
          />
        </div>
      </Container>
    </Section>
  );
}
