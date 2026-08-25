"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Wordmark } from "@/components/site/Wordmark";
import { Container } from "@/components/ui";
import { cta, nav } from "@/lib/content";
import { useLocale } from "@/lib/i18n";

function LocaleToggle({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useLocale();
  return (
    <div
      className={`relative flex items-center rounded-full border border-line-2 bg-surface/60 p-[3px] ${compact ? "" : "backdrop-blur-sm"}`}
      role="group"
      aria-label="Language"
    >
      {(["no", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
          className={`relative rounded-full px-2.5 py-1 font-mono text-[10.5px] font-medium tracking-[0.12em] uppercase transition-colors duration-300 ${
            locale === l ? "text-canvas" : "text-fg-3 hover:text-fg-2"
          }`}
        >
          {locale === l && (
            <motion.span
              layoutId="locale-pill"
              className="absolute inset-0 rounded-full bg-fg"
              transition={{ type: "spring", stiffness: 460, damping: 36 }}
            />
          )}
          <span className="relative">{l}</span>
        </button>
      ))}
    </div>
  );
}

export function Nav() {
  const { locale } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the page while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "glass border-b border-line/80" : "border-b border-transparent"
        }`}
      >
        <Container>
          <div className="flex h-[68px] items-center justify-between gap-6">
            <Wordmark />

            <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
              {nav.map((n) => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  className="rounded-full px-3.5 py-2 text-[0.875rem] tracking-tight text-fg-2 transition-colors duration-300 hover:bg-surface hover:text-fg"
                >
                  {n.label[locale]}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <LocaleToggle />
              </div>
              <a
                href="#kontakt"
                className="hidden rounded-full bg-fg px-4.5 py-2.5 text-[0.875rem] font-medium tracking-tight text-canvas transition-opacity duration-300 hover:opacity-88 sm:inline-flex"
              >
                {cta.primary[locale]}
              </a>

              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                className="grid h-10 w-10 place-items-center rounded-full border border-line-2 text-fg-2 transition-colors hover:text-fg lg:hidden"
              >
                <span className="relative block h-[10px] w-[16px]">
                  <span
                    className={`absolute inset-x-0 top-0 h-[1.5px] rounded bg-current transition-transform duration-300 ${open ? "translate-y-[4.5px] rotate-45" : ""}`}
                  />
                  <span
                    className={`absolute inset-x-0 bottom-0 h-[1.5px] rounded bg-current transition-transform duration-300 ${open ? "-translate-y-[4px] -rotate-45" : ""}`}
                  />
                </span>
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-canvas/96 backdrop-blur-xl lg:hidden"
          >
            <div className="flex h-full flex-col justify-between px-6 pt-[100px] pb-10">
              <nav className="flex flex-col" aria-label="Mobile">
                {nav.map((n, i) => (
                  <motion.a
                    key={n.id}
                    href={`#${n.id}`}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="display border-b border-line py-5 text-[2rem] text-fg"
                  >
                    {n.label[locale]}
                  </motion.a>
                ))}
              </nav>
              <div className="flex items-center justify-between gap-4">
                <LocaleToggle compact />
                <a
                  href="#kontakt"
                  onClick={() => setOpen(false)}
                  className="inline-flex flex-1 items-center justify-center rounded-full bg-fg px-5 py-3.5 text-[0.9375rem] font-medium text-canvas"
                >
                  {cta.primary[locale]}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
