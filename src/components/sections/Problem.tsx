"use client";

import { Fragment } from "react";
import { Container, Reveal, Section, SectionHead } from "@/components/ui";
import { SpreadsheetMark } from "@/components/ui/SpreadsheetMark";
import { CountUp } from "@/components/ui/Metrics";
import { problem } from "@/lib/content";
import { useLocale, type Bi } from "@/lib/i18n";

/* ═══════════════════════════════════════════════════════════════════
   PROBLEM — the same order, twice, plotted against a clock.

   The argument is not "manual work is bad", it is the *gap*: the left
   column's six steps are stamped 22:14 → 11:40 the next morning, the
   right column's six are stamped 22:14 → 22:15.

   Both columns are plain hairline-separated rows with the timestamp in
   a chip. An earlier version drew a rail with a dot per step, which
   made two short lists look like two subway maps and pulled the eye to
   the decoration instead of the clock. The timestamps are the whole
   argument, so they are the only thing given any weight.
   ═══════════════════════════════════════════════════════════════════ */

const BEFORE_TIMES = ["22:14", "08:30", "08:52", "09:05", "09:20", "11:40"];
const AFTER_TIMES = ["22:14", "22:14", "22:14", "22:15", "22:15", "22:15"];

const nextMorning: Bi = { no: "neste morgen", en: "next morning" };
const elapsedLabel: Bi = { no: "Fra melding til ordre", en: "Message to order" };
/* Split into a number and its unit so the figure can count up. Both are the
   elapsed times already claimed by the two timelines above, not new claims. */
const beforeCount = 13;
const afterCount = 61;
const beforeUnit: Bi = { no: "t 26min", en: "h 26min" };
const afterUnit: Bi = { no: " sek", en: " sec" };

/* The overnight gap gets a dashed rule across the row: dead time, drawn
   as dead line. It is the only place the two columns differ structurally. */
const DASHED_GAP =
  "repeating-linear-gradient(to right, var(--color-line-2) 0 3px, transparent 3px 8px)";

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
    <li className="border-b border-line last:border-b-0">
      <Reveal delay={delay} className="flex items-center gap-4 py-3.5">
        <span
          className={`shrink-0 rounded-md border px-2 py-[3px] font-mono text-[10.5px] tabular-nums ${
            live ? "border-accent/30 bg-accent/10 text-accent" : "border-line-2 text-fg-4"
          }`}
        >
          {time}
        </span>

        <p
          className={`min-w-0 flex-1 text-[0.9375rem] leading-[1.55] ${
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
    <li className="border-b border-line">
      <Reveal delay={delay} className="flex items-center gap-3 py-3">
        <span className="font-mono text-[10px] tracking-[0.16em] text-fg-4 uppercase">{text}</span>
        <span className="h-px flex-1" style={{ backgroundImage: DASHED_GAP }} />
      </Reveal>
    </li>
  );
}

/* ── Column ───────────────────────────────────────────────────────── */

function Column({
  label,
  rows,
  times,
  count,
  unit,
  totalLabel,
  live,
  overnight,
  mark = false,
  className = "",
}: {
  label: string;
  rows: string[];
  times: string[];
  count: number;
  unit: string;
  totalLabel: string;
  live: boolean;
  overnight?: string;
  /** Show the spreadsheet mark — this is the column that still runs on Excel. */
  mark?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex h-full flex-col ${className}`}>
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

      <ol className="mt-7 border-t border-line">
        {rows.map((text, i) => (
          <Fragment key={i}>
            <TimelineRow time={times[i]} text={text} delay={i * 0.05} live={live} />
            {overnight && i === 0 && <OvernightRow text={overnight} delay={0.05} />}
          </Fragment>
        ))}
      </ol>

      <Reveal delay={0.3} className="mt-auto pt-10">
        <div className="border-t border-line pt-6">
          <p className="font-mono text-[10px] tracking-[0.16em] text-fg-4 uppercase">{totalLabel}</p>
          <CountUp
            to={count}
            suffix={unit}
            prefix={live ? "" : "~"}
            duration={live ? 1.1 : 1.8}
            className={`display mt-2 block text-[clamp(1.9rem,3.4vw,2.9rem)] ${
              live ? "text-accent" : "text-fg-3"
            }`}
          />
        </div>
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

        {/* Two panels rather than two columns sharing a hairline: the claim is
            a comparison, so the sides should look like two things being held up
            against each other. The live one carries the accent border. */}
        <div className="mt-16 grid gap-5 md:mt-20 md:grid-cols-2">
          <Column
            label={problem.before.label[locale]}
            mark
            rows={problem.before.rows.map((r) => r[locale])}
            times={BEFORE_TIMES}
            count={beforeCount}
            unit={beforeUnit[locale]}
            totalLabel={elapsedLabel[locale]}
            overnight={nextMorning[locale]}
            live={false}
            className="rounded-2xl border border-line bg-surface/40 p-6 md:p-8"
          />

          <Column
            label={problem.after.label[locale]}
            rows={problem.after.rows.map((r) => r[locale])}
            times={AFTER_TIMES}
            count={afterCount}
            unit={afterUnit[locale]}
            totalLabel={elapsedLabel[locale]}
            live
            className="rounded-2xl border border-accent/35 bg-surface p-6 md:p-8"
          />
        </div>
      </Container>
    </Section>
  );
}
