"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Container, Reveal, Section, SectionHead } from "@/components/ui";
import { faq } from "@/lib/content";
import { useLocale } from "@/lib/i18n";

const EASE = [0.16, 1, 0.3, 1] as const;

/* Hairline rows, not boxed cards. The only moving part is the answer
   panel and the vertical stroke of the plus — everything else holds still. */

export function FAQ() {
  const { locale } = useLocale();
  // First question is open on arrival; -1 means every row is closed.
  const [open, setOpen] = useState(0);

  return (
    <Section id="sporsmal" className="border-y border-line bg-elev">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-20">
          {/* ── Left: the header, parked while the answers scroll ──── */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHead eyebrow={faq.eyebrow[locale]} title={faq.title[locale]} />
          </div>

          {/* ── Right: the accordion ───────────────────────────────── */}
          <div>
            {faq.items.map((item, i) => {
              const isOpen = open === i;
              const panelId = `faq-panel-${i}`;
              const buttonId = `faq-trigger-${i}`;
              const last = i === faq.items.length - 1;

              return (
                <Reveal
                  key={item.q.no}
                  delay={i * 0.06}
                  className={`border-t border-line ${last ? "border-b" : ""}`}
                >
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="group flex w-full items-start justify-between gap-8 py-6 text-left"
                  >
                    <span
                      className={`text-[1.0625rem] font-medium tracking-tight transition-colors duration-300 md:text-[1.125rem] ${
                        isOpen ? "text-fg" : "text-fg-2 group-hover:text-fg"
                      }`}
                    >
                      {item.q[locale]}
                    </span>

                    {/* Plus → minus, built from two hairlines so it turns
                        rather than swapping glyphs. */}
                    <span
                      aria-hidden
                      className={`relative mt-[0.45rem] h-3.5 w-3.5 shrink-0 transition-colors duration-300 ${
                        isOpen ? "text-accent" : "text-fg-3 group-hover:text-accent"
                      }`}
                    >
                      <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-current" />
                      <span
                        className={`absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-current transition duration-[380ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          isOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
                        }`}
                      />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="panel"
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.38, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="pr-10 pb-6 text-justify text-[0.9375rem] leading-relaxed text-fg-2 hyphens-auto md:text-[1rem]">
                          {item.a[locale]}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}
