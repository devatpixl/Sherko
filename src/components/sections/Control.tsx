"use client";

import type { ReactNode } from "react";
import { Container, Reveal, Section, SectionHead } from "@/components/ui";
import { control } from "@/lib/content";
import { useLocale, type Bi } from "@/lib/i18n";

/* ═══════════════════════════════════════════════════════════════════
   CONTROL — the safety interlock panel.

   These six are not features, they are guarantees, so each card ends
   in an assertion the way a system spec does: a claim in prose, and
   the line of the contract that enforces it.
   ═══════════════════════════════════════════════════════════════════ */

/* The foot of each card. Identical in both locales on purpose — these
   are code, and code does not translate. */
const ASSERTIONS: Record<string, string> = {
  draft: 'status = "pending_approval"',
  stock: "auto_approve = false",
  ask: "ambiguous → ask(), never guess()",
  grounded: "every fact ← tool result",
  honest: "is_ai() → true",
  destructive: "confirm = true required",
};

const statement: Bi = {
  no: "Den siste avgjørelsen er alltid et menneske.",
  en: "The last decision is always a human.",
};

/* ── Glyphs ───────────────────────────────────────────────────────── */

const GLYPHS: Record<string, ReactNode> = {
  /* A draft: a document whose outline has not been committed yet. */
  draft: (
    <>
      <path d="M6.5 3.5h7l4 4v13h-11z" strokeDasharray="3 2.6" />
      <path d="M13.5 3.5v4h4" />
      <path d="M9 12.5h6M9 16h4" />
    </>
  ),
  /* A pallet, struck through: nothing moves. */
  stock: (
    <>
      <path d="M7 6.5h10v9H7z" />
      <path d="M3.5 17.5h17" />
      <path d="M6.5 20.5v-3M17.5 20.5v-3" />
      <path d="M4 20 20 4" />
    </>
  ),
  /* A question, asked out loud. */
  ask: (
    <>
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v6A2.5 2.5 0 0 1 17.5 15H12l-4.5 4v-4H6.5A2.5 2.5 0 0 1 4 12.5z" />
      <path d="M10.3 8.3a1.9 1.9 0 1 1 2.2 2.2v.9" />
      <path d="M12.5 13.1v.01" />
    </>
  ),
  /* Every claim traced back to a lookup. */
  grounded: (
    <>
      <ellipse cx="10.5" cy="6.2" rx="5.5" ry="2.4" />
      <path d="M5 6.2v5.6c0 1.32 2.46 2.4 5.5 2.4" />
      <path d="M16 6.2v3" />
      <circle cx="15.4" cy="14.4" r="3.9" />
      <path d="M18.2 17.2 20.8 19.8" />
    </>
  ),
  /* It looks like a machine because it says it is one. */
  honest: (
    <>
      <rect x="4.5" y="7.5" width="15" height="11" rx="3" />
      <path d="M12 4.2v3.3" />
      <path d="M9.4 12v.01M14.6 12v.01" />
      <path d="M9.6 15.4h4.8" />
    </>
  ),
  /* A switch that only moves after someone confirms it. */
  destructive: (
    <>
      <rect x="3" y="7.5" width="18" height="9" rx="4.5" />
      <circle cx="16.5" cy="12" r="2.4" />
      <path d="M6.2 12l1.5 1.6 3.1-3.4" />
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
      className="h-[22px] w-[22px] text-fg-2"
    >
      {GLYPHS[name]}
    </svg>
  );
}

/* ── Section ──────────────────────────────────────────────────────── */

export function Control() {
  const { locale } = useLocale();

  return (
    <Section id="kontroll" className="border-y border-line bg-elev">
      <Container>
        <SectionHead
          eyebrow={control.eyebrow[locale]}
          title={control.title[locale]}
          body={control.body[locale]}
        />

        {/* The whole section in one line, before the six that prove it. */}
        <Reveal delay={0.18} className="mt-14">
          <div className="card p-6 md:p-8">
            <span
              aria-hidden
              className="absolute inset-y-5 left-0 w-[2px] rounded-r-full bg-accent"
            />
            <p className="display pl-5 text-[1.375rem] text-fg md:pl-6 md:text-[1.75rem]">
              {statement[locale]}
            </p>
          </div>
        </Reveal>

        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {control.guarantees.map((g, i) => (
            <Reveal key={g.key} delay={0.06 * i} className="h-full">
              <article className="card flex h-full flex-col p-6">
                <div className="grow">
                  <Glyph name={g.key} />
                  <h3 className="display mt-4 text-[1.125rem] text-fg">{g.title[locale]}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-fg-2">
                    {g.body[locale]}
                  </p>
                </div>
                <p className="mt-5 flex items-start gap-2 border-t border-line pt-4 font-mono text-[11px] tracking-tight text-fg-3">
                  <span aria-hidden className="text-accent">
                    ✓
                  </span>
                  <span>{ASSERTIONS[g.key]}</span>
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
