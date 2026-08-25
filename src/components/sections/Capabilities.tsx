"use client";

import type { ReactNode } from "react";
import { Container, Reveal, Section, SectionHead } from "@/components/ui";
import { capabilities } from "@/lib/content";
import { useLocale } from "@/lib/i18n";

/* Bento spans on a 6-column grid. The large tile is 4 wide × 2 tall, which
   leaves a 2-wide column beside it for exactly two small tiles; the three
   remaining tiles then close the last row (2 + 2 + 2 = 6). No orphan cells. */
const SPAN: Record<string, string> = {
  lg: "md:col-span-4 md:row-span-2",
  md: "md:col-span-2",
  sm: "md:col-span-2",
};

/* ── Tile visuals ────────────────────────────────────────────────────
   Hairlines and token colours only, at most one coloured mark per tile.
   The four drawn ones share a 260 × 64 viewBox that stretches to the tile
   width; `non-scaling-stroke` keeps every line a true 1px hairline at any
   scale, so the geometry grows but the drawing never fattens. */

const ART = {
  viewBox: "0 0 260 64",
  width: "100%",
  fill: "none",
} as const;

const HAIR = {
  strokeWidth: 1,
  vectorEffect: "non-scaling-stroke",
} as const;

/* The large tile: message → draft order. The whole product in one glance. */
function IntakeVisual() {
  const widths = ["w-3/5", "w-4/5", "w-2/5"];
  return (
    <div aria-hidden className="my-auto flex w-full items-center gap-4 py-10 sm:gap-6">
      {/* what the customer sends */}
      <div className="flex w-[38%] max-w-[240px] flex-col gap-2.5">
        {widths.map((w, i) => (
          <div key={i} className="rounded-lg rounded-bl-sm border border-line px-3 py-2.5">
            <span className="block h-px w-full bg-line-2" />
            <span className={`mt-2 block h-px bg-line-2 ${w}`} />
          </div>
        ))}
      </div>

      {/* the hand-off */}
      <div className="flex flex-1 items-center">
        <span className="h-px flex-1 bg-line-2" />
        <svg width="8" height="10" viewBox="0 0 8 10" fill="none" className="shrink-0">
          <path
            d="M1 1l5 4-5 4"
            stroke="var(--color-line-2)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* what lands in the system — a draft, still waiting */}
      <div className="w-[38%] max-w-[250px] rounded-xl border border-line-2 bg-canvas/50 p-3.5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-[6px] w-[6px]">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-50 [animation-duration:2.8s]" />
            <span className="relative inline-flex h-[6px] w-[6px] rounded-full bg-signal" />
          </span>
          <span className="font-mono text-[11px] tracking-[0.08em] text-fg-2">#12048</span>
        </div>
        <span className="mt-3.5 block h-px w-full bg-line" />
        <span className="mt-2.5 block h-px w-4/5 bg-line" />
        <span className="mt-2.5 block h-px w-3/5 bg-line" />
      </div>
    </div>
  );
}

/* Three sheets, fanned. The front one has a folded corner. */
function DocumentsVisual() {
  return (
    <svg aria-hidden {...ART}>
      <rect
        x="66" y="6" width="44" height="54" rx="3"
        fill="var(--color-surface)" stroke="var(--color-line-2)"
        transform="rotate(-9 88 33)" {...HAIR}
      />
      <rect
        x="100" y="5" width="44" height="55" rx="3"
        fill="var(--color-surface)" stroke="var(--color-line-2)"
        transform="rotate(-3 122 32)" {...HAIR}
      />
      <g transform="rotate(6 156 32)">
        <path
          d="M134 4h32l12 12v44h-44z"
          fill="var(--color-surface)" stroke="var(--color-line-2)"
          strokeLinejoin="round" {...HAIR}
        />
        <path d="M166 4v12h12" stroke="var(--color-line-2)" strokeLinejoin="round" {...HAIR} />
        <path d="M142 32h26M142 42h26M142 52h16" stroke="var(--color-fg-4)" strokeLinecap="round" {...HAIR} />
      </g>
    </svg>
  );
}

/* Two columns of candidates. One pair resolves — one is still an open
   question, which is the point: it asks instead of guessing. */
function MatchingVisual() {
  const rows = [0, 24, 48];
  return (
    <svg aria-hidden {...ART}>
      {rows.map((y) => (
        <g key={y}>
          <rect x="1" y={y} width="70" height="16" rx="8" stroke="var(--color-line-2)" {...HAIR} />
          <path d={`M15 ${y + 8}h28`} stroke="var(--color-line)" strokeLinecap="round" {...HAIR} />
          <rect x="189" y={y} width="70" height="16" rx="8" stroke="var(--color-line-2)" {...HAIR} />
          <path d={`M203 ${y + 8}h28`} stroke="var(--color-line)" strokeLinecap="round" {...HAIR} />
        </g>
      ))}

      <path d="M71 8C110 8 150 32 189 32" stroke="var(--color-accent)" strokeLinecap="round" {...HAIR} />
      <circle cx="189" cy="32" r="2" fill="var(--color-accent)" stroke="none" />

      <path d="M71 56h28" stroke="var(--color-line-2)" strokeDasharray="2 4" strokeLinecap="round" {...HAIR} />
      <circle cx="105" cy="56" r="3" stroke="var(--color-line-2)" {...HAIR} />
    </svg>
  );
}

/* Seven columns — the shape of a week, read straight off the data. */
function StatsVisual() {
  const bars = [18, 28, 22, 38, 30, 50, 34];
  const peak = bars.indexOf(Math.max(...bars));
  return (
    <svg aria-hidden {...ART}>
      <path d="M0 63.5h260" stroke="var(--color-line)" {...HAIR} />
      {bars.map((h, i) => {
        const isPeak = i === peak;
        return (
          <rect
            key={i}
            x={i * 37 + 1}
            y={63 - h}
            width="21"
            height={h}
            rx="2"
            stroke={isPeak ? "var(--color-accent)" : "var(--color-line-2)"}
            fill={isPeak ? "var(--color-accent)" : "none"}
            fillOpacity={isPeak ? 0.12 : 0}
            {...HAIR}
          />
        );
      })}
    </svg>
  );
}

/* The last three things that happened on the desk. */
function FeedVisual() {
  const rows = [
    { y: 0, dot: "var(--color-accent)", w: 118 },
    { y: 23, dot: "var(--color-fg-4)", w: 88 },
    { y: 46, dot: "var(--color-fg-4)", w: 142 },
  ];
  return (
    <svg aria-hidden {...ART}>
      {rows.map((r) => (
        <g key={r.y}>
          <rect x="1" y={r.y} width="258" height="18" rx="7" stroke="var(--color-line)" {...HAIR} />
          <circle cx="15" cy={r.y + 9} r="2.5" fill={r.dot} stroke="none" />
          <path d={`M29 ${r.y + 9}h${r.w}`} stroke="var(--color-line-2)" strokeLinecap="round" {...HAIR} />
        </g>
      ))}
    </svg>
  );
}

/* Two languages, one conversation. */
function BilingualVisual() {
  return (
    <div aria-hidden className="mt-auto flex items-center gap-6 pt-8">
      <span className="display text-[3.25rem] leading-none text-fg opacity-[0.13]">NO</span>
      <span className="h-14 w-px bg-line-2" />
      <span className="display text-[3.25rem] leading-none text-fg opacity-[0.13]">EN</span>
    </div>
  );
}

function Visual({ tileKey }: { tileKey: string }) {
  if (tileKey === "intake") return <IntakeVisual />;
  if (tileKey === "bilingual") return <BilingualVisual />;

  let art: ReactNode = null;
  if (tileKey === "documents") art = <DocumentsVisual />;
  else if (tileKey === "matching") art = <MatchingVisual />;
  else if (tileKey === "stats") art = <StatsVisual />;
  else if (tileKey === "feed") art = <FeedVisual />;
  if (!art) return null;

  return <div className="mt-auto pt-8">{art}</div>;
}

export function Capabilities() {
  const { locale } = useLocale();

  return (
    <Section id="kapasiteter" className="bg-canvas">
      <Container>
        <SectionHead
          eyebrow={capabilities.eyebrow[locale]}
          title={capabilities.title[locale]}
          body={capabilities.body[locale]}
        />

        <div className="mt-16 grid gap-4 md:mt-20 md:auto-rows-[minmax(220px,auto)] md:grid-cols-6">
          {capabilities.tiles.map((tile, i) => (
            <Reveal key={tile.key} delay={i * 0.05} className={SPAN[tile.span]}>
              <article className="card flex h-full flex-col p-6 transition-colors hover:border-line-2 md:p-7">
                <h3 className="display text-[1.25rem] text-fg">{tile.title[locale]}</h3>
                <p className="lede mt-3 text-[0.9375rem] leading-relaxed text-fg-2">{tile.body[locale]}</p>
                <Visual tileKey={tile.key} />
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
