"use client";

import { ContactForm } from "@/components/sections/ContactForm";
import { Container, Reveal, Section, SectionHead } from "@/components/ui";
import { DEMO_ENABLED, DEMO_URL } from "@/lib/config";
import { closing, cta } from "@/lib/content";
import { useLocale, type Bi } from "@/lib/i18n";

/* The ask. The chips stay because they answer the question the form provokes —
   "what do I even send you?" — before anyone has to ask it. */

const formats: Bi<string[]> = {
  no: ["WhatsApp-melding", "PDF eller Excel", "Bilde av en lapp"],
  en: ["WhatsApp message", "PDF or Excel", "Photo of a note"],
};

export function Closing() {
  const { locale } = useLocale();

  return (
    <Section id="kontakt" className="grain relative isolate overflow-hidden bg-canvas">
      {/* ── Atmosphere — a quieter echo of the hero, never louder ──── */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-substrate mask-radial absolute inset-0 opacity-60" />
        <div className="aurora aurora-drift absolute top-[18%] left-1/2 h-[560px] w-[900px] -translate-x-1/2 opacity-40" />
      </div>

      <Container>
        <SectionHead
          align="center"
          eyebrow={closing.eyebrow[locale]}
          title={closing.title[locale]}
          body={closing.body[locale]}
        />

        <Reveal delay={0.12}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-2.5">
            {formats[locale].map((label) => (
              <span
                key={label}
                className="rounded-full border border-line px-3 py-1.5 font-mono text-[11px] tracking-[0.14em] text-fg-3 uppercase"
              >
                {label}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <ContactForm />
        </Reveal>

        <Reveal delay={0.28}>
          <p className="mt-10 text-center font-mono text-[11px] tracking-[0.14em] text-fg-3 uppercase">
            {closing.reassure[locale]}
          </p>
        </Reveal>

        {/* Not everyone is ready to book. Let them poke at the real thing. */}
        {DEMO_ENABLED && (
          <Reveal delay={0.34}>
            <p className="mt-5 text-center text-[0.9375rem] text-fg-3">
              <a
                href={DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-fg underline decoration-line-2 underline-offset-4 transition-colors hover:decoration-accent"
              >
                {cta.demo[locale]}
              </a>{" "}
              — {cta.demoHint[locale]}
            </p>
          </Reveal>
        )}
      </Container>
    </Section>
  );
}
