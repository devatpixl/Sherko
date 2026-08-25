"use client";

import type { CSSProperties, ReactNode } from "react";
import { Container, Reveal, Section, SectionHead } from "@/components/ui";
import { channels } from "@/lib/content";
import { useLocale, type Bi, type Locale } from "@/lib/i18n";

/* ═══════════════════════════════════════════════════════════════════
   CHANNEL STRIP — the intake bus.

   Six channels, two full-bleed lanes drifting in opposite directions
   at slightly different speeds so they never phase-lock. The section
   *is* the idea: everything a customer might send, moving, and all of
   it heading to the same place. Nothing here is coloured — the strip
   is plumbing, not the argument.
   ═══════════════════════════════════════════════════════════════════ */

const caption: Bi = {
  no: "Alt havner i samme kø",
  en: "It all lands in the same queue",
};

/* Chips dissolve at both ends rather than getting guillotined by the
   overflow box — the lane should read as continuing past the viewport. */
const EDGE_MASK = "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)";

/* ── Glyphs ───────────────────────────────────────────────────────
   Drawn here, one per channel, on a shared 24-unit grid at 1.5 stroke.
   No icon font, no emoji — the set has to feel like one hand made it. */

const GLYPHS: Record<string, ReactNode> = {
  /* Circular chat bubble with a tail — the WhatsApp silhouette — and a
     handset sitting inside it at half scale (stroke pre-divided by the
     scale factor so the weight still matches the bubble). */
  whatsapp: (
    <>
      <path d="M12 3.5a8.5 8.5 0 0 0-7.3 12.86L3.6 20.4l4.2-1.05A8.5 8.5 0 1 0 12 3.5Z" />
      <g transform="translate(6.22 5.92) scale(.5)" strokeWidth="3">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />
      </g>
    </>
  ),
  /* Envelope, flap creased inward. */
  email: (
    <>
      <rect x="2.75" y="5" width="18.5" height="14" rx="2.4" />
      <path d="m3.7 6.9 7.1 4.98a2.05 2.05 0 0 0 2.4 0l7.1-4.98" />
    </>
  ),
  /* Document with a folded corner and two text rules — a page of lines. */
  pdf: (
    <>
      <path d="M13.4 2.8H7A1.8 1.8 0 0 0 5.2 4.6v14.8A1.8 1.8 0 0 0 7 21.2h10a1.8 1.8 0 0 0 1.8-1.8V8.2Z" />
      <path d="M13.4 2.8v3.6a1.8 1.8 0 0 0 1.8 1.8h3.6" />
      <path d="M8.6 13.6h6.8M8.6 17h4.4" />
    </>
  ),
  /* Table: three columns, three rows. */
  excel: (
    <>
      <rect x="3" y="4.9" width="18" height="14.2" rx="2" />
      <path d="M3 9.63h18M3 14.37h18M9 4.9v14.2M15 4.9v14.2" />
    </>
  ),
  /* Photo frame: sun over a ridge. */
  photo: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.2" />
      <circle cx="8.4" cy="9.8" r="1.35" />
      <path d="m3.4 16.6 3.9-3.9a1.6 1.6 0 0 1 2.26 0l2.74 2.74 1.74-1.74a1.6 1.6 0 0 1 2.26 0l4.1 4.1" />
    </>
  ),
  /* Squared-off bubble with a tail and three dots — a typed message. */
  text: (
    <>
      <path d="M7 4h10a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-6.8L6 19.6 6.9 16A3 3 0 0 1 4 13V7a3 3 0 0 1 3-3Z" />
      <path d="M8.6 10h.01M12 10h.01M15.4 10h.01" strokeWidth="2" />
    </>
  ),
};

function Glyph({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-fg-3"
      aria-hidden
    >
      {children}
    </svg>
  );
}

/* ── Chip ─────────────────────────────────────────────────────────── */

type ChannelItem = (typeof channels.items)[number];

function Chip({ item, locale }: { item: ChannelItem; locale: Locale }) {
  return (
    <div className="card mr-3.5 flex shrink-0 items-center gap-3.5 px-5 py-4">
      <Glyph>{GLYPHS[item.key]}</Glyph>
      <div>
        <p className="text-[0.9375rem] font-medium tracking-tight text-fg">{item.label[locale]}</p>
        <p className="mt-0.5 font-mono text-[11px] whitespace-nowrap text-fg-3">
          {item.note[locale]}
        </p>
      </div>
    </div>
  );
}

/* ── Lane ─────────────────────────────────────────────────────────
   The track holds the six chips twice over; `.marquee` walks it to
   -50%, which lands the second copy exactly where the first started.
   Spacing lives on each chip (mr-*), never on the track — a flex gap
   would put half a gap of drift into the seam. */

function Lane({
  items,
  duration,
  reverse = false,
  silent = false,
}: {
  items: ChannelItem[];
  duration: string;
  reverse?: boolean;
  silent?: boolean;
}) {
  const { locale } = useLocale();

  return (
    <div
      className="relative overflow-hidden py-1"
      style={{ maskImage: EDGE_MASK, WebkitMaskImage: EDGE_MASK }}
      aria-hidden={silent || undefined}
    >
      <div
        className={`marquee flex w-max hover:[animation-play-state:paused] ${
          reverse ? "[animation-direction:reverse]" : ""
        }`}
        style={{ "--marquee-duration": duration } as CSSProperties}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex" aria-hidden={copy === 1 || undefined}>
            {items.map((item) => (
              <Chip key={item.key} item={item} locale={locale} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Section ──────────────────────────────────────────────────────── */

export function ChannelStrip() {
  const { locale } = useLocale();

  /* The second lane starts three channels in, so the two rows never
     show the same chip stacked on itself as they pass. */
  const laneB = [...channels.items.slice(3), ...channels.items.slice(0, 3)];

  return (
    <Section id="kanaler" className="bg-elev border-y border-line">
      <Container>
        <SectionHead
          eyebrow={channels.eyebrow[locale]}
          title={channels.title[locale]}
          body={channels.body[locale]}
        />
      </Container>

      <div className="mt-14 flex flex-col gap-3 md:mt-16">
        <Reveal>
          <Lane items={channels.items} duration="38s" />
        </Reveal>
        <Reveal delay={0.08}>
          <Lane items={laneB} duration="46s" reverse silent />
        </Reveal>
      </div>

      <Container>
        <Reveal delay={0.16}>
          <p className="mt-12 text-center font-mono text-[11px] tracking-[0.16em] text-fg-4 uppercase">
            {caption[locale]}
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
