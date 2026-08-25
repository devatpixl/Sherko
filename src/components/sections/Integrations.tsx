"use client";

import type { ReactNode } from "react";
import { Container, Reveal, Section, SectionHead } from "@/components/ui";
import { integrations } from "@/lib/content";
import { useLocale, type Bi } from "@/lib/i18n";

/* ═══════════════════════════════════════════════════════════════════
   INTEGRATIONS — a spec sheet, not a logo wall. We have no right to
   anybody's marks, so the grid itself does the work: one bordered
   plate, hairline cells, drawn glyphs.
   ═══════════════════════════════════════════════════════════════════ */

const outro: Bi = {
  no: "Ser du ikke systemet ditt her? Vi bygger koblingen.",
  en: "Not seeing your system? We build the connector.",
};

/* ── Glyphs ───────────────────────────────────────────────────────── */

const GLYPHS: Record<string, ReactNode> = {
  /* A conversation with a handset in it. */
  whatsapp: (
    <>
      <path d="M3.5 6.5A2.5 2.5 0 0 1 6 4h12a2.5 2.5 0 0 1 2.5 2.5v7A2.5 2.5 0 0 1 18 16h-6l-4.5 4v-4H6a2.5 2.5 0 0 1-2.5-2.5z" />
      <path d="M9.4 8.6a.9.9 0 0 1 .9-.9h1l.8 1.9-.9.8a4.8 4.8 0 0 0 2.3 2.3l.8-.9 1.9.8v1a.9.9 0 0 1-.9.9 6.5 6.5 0 0 1-5.9-5.9z" />
    </>
  ),
  /* Mail, with a window pane beside it. */
  outlook: (
    <>
      <rect x="2.5" y="4.5" width="13" height="9" rx="1.6" />
      <path d="M2.9 5.4 9 9.8 15.1 5.4" />
      <rect x="14" y="14" width="7.5" height="7.5" rx="1.3" />
      <path d="M17.75 14v7.5M14 17.75h7.5" />
    </>
  ),
  /* Stacked stores — the system of record. */
  erp: (
    <>
      <ellipse cx="12" cy="5.4" rx="7" ry="2.6" />
      <path d="M5 5.4v13.2c0 1.44 3.13 2.6 7 2.6s7-1.16 7-2.6V5.4" />
      <path d="M5 9.8c0 1.44 3.13 2.6 7 2.6s7-1.16 7-2.6" />
      <path d="M5 14.2c0 1.44 3.13 2.6 7 2.6s7-1.16 7-2.6" />
    </>
  ),
  /* A catalogue: many lines, one resolved. */
  catalog: (
    <>
      <rect x="3.5" y="3.5" width="5.4" height="5.4" rx="1" />
      <rect x="9.8" y="3.5" width="5.4" height="5.4" rx="1" />
      <rect x="16.1" y="3.5" width="5.4" height="5.4" rx="1" />
      <rect x="3.5" y="9.8" width="5.4" height="5.4" rx="1" />
      <rect x="9.8" y="9.8" width="5.4" height="5.4" rx="1" fill="currentColor" />
      <rect x="16.1" y="9.8" width="5.4" height="5.4" rx="1" />
      <rect x="3.5" y="16.1" width="5.4" height="5.4" rx="1" />
      <rect x="9.8" y="16.1" width="5.4" height="5.4" rx="1" />
      <rect x="16.1" y="16.1" width="5.4" height="5.4" rx="1" />
    </>
  ),
  /* A document carrying the generic currency mark — no flag, no symbol. */
  accounting: (
    <>
      <path d="M6.4 3.4h6.7l4.5 4.5v12.7H6.4z" />
      <path d="M13.1 3.4v4.5h4.5" />
      <circle cx="12" cy="14.4" r="2.5" />
      <path d="M9.9 12.3 8.7 11.1M14.1 12.3l1.2-1.2M9.9 16.5l-1.2 1.2M14.1 16.5l1.2 1.2" />
    </>
  ),
  /* Whatever you have, over the wire. */
  api: (
    <>
      <path d="M8.6 8 4 12l4.6 4" />
      <path d="M15.4 8 20 12l-4.6 4" />
      <path d="M13.4 5.8 10.6 18.2" />
    </>
  ),
};

function Glyph({ name }: { name: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-7 w-7 text-fg-3"
    >
      {GLYPHS[name]}
    </svg>
  );
}

/* ── Section ──────────────────────────────────────────────────────── */

export function Integrations() {
  const { locale } = useLocale();

  return (
    <Section id="integrasjoner" className="bg-canvas">
      <Container>
        <SectionHead
          eyebrow={integrations.eyebrow[locale]}
          title={integrations.title[locale]}
          body={integrations.body[locale]}
        />

        <Reveal delay={0.18} className="mt-14">
          {/* One plate. The grid runs 1px past the plate on the right and
              bottom, so the trailing cell borders are clipped away and only
              the interior hairlines survive — no doubled edges at any
              column count. */}
          <div className="overflow-hidden rounded-2xl border border-line">
            <div className="-mr-px -mb-px grid sm:grid-cols-2 lg:grid-cols-3">
              {integrations.items.map((item) => (
                <div
                  key={item.key}
                  className="border-r border-b border-line p-6 transition-colors hover:bg-surface md:p-7"
                >
                  <Glyph name={item.key} />
                  <p className="mt-4 text-[1rem] font-medium text-fg">{item.name[locale]}</p>
                  <p className="mt-1.5 font-mono text-[11px] text-fg-3">{item.note[locale]}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.26}>
          <p className="mt-8 text-center text-[0.9375rem] text-fg-3">{outro[locale]}</p>
        </Reveal>
      </Container>
    </Section>
  );
}
