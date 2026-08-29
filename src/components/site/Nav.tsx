"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Wordmark } from "@/components/site/Wordmark";
import { DEMO_ENABLED, DEMO_URL } from "@/lib/config";
import { cta, nav } from "@/lib/content";
import { useLocale } from "@/lib/i18n";

/* A floating capsule rather than a full-width bar: it sits over the page with
   air on all sides, so the dark hero reads as one uninterrupted stage. */

function LocaleToggle() {
  const { locale, setLocale } = useLocale();
  return (
    <div className="relative flex items-center rounded-full bg-surface/70 p-[3px]" role="group" aria-label="Language">
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
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Scroll-spy: highlight whichever section owns the upper third of the
     viewport. Set from the observer callback, never synchronously in an effect. */
  useEffect(() => {
    const els = nav
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (!visible.length) return;
        const top = visible.reduce((a, b) =>
          a.boundingClientRect.top <= b.boundingClientRect.top ? a : b,
        );
        setActive(top.target.id);
      },
      { rootMargin: "-22% 0px -68% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
        <div className="mx-auto w-full max-w-[1240px] px-4 pt-3 md:px-6 md:pt-4">
          <nav
            aria-label="Primary"
            className={`pointer-events-auto flex items-center gap-3 rounded-full border py-2 pr-2 pl-4 transition-[background-color,border-color,box-shadow] duration-500 md:pl-5 ${
              scrolled
                ? "border-line-2/80 bg-canvas/80 shadow-[0_16px_40px_-14px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
                : "border-line/70 bg-canvas/45 backdrop-blur-xl"
            }`}
          >
            <Wordmark />

            {/* Links, centred, with the active one carrying a soft pill */}
            <div className="mx-auto hidden items-center gap-1 lg:flex">
              {nav.map((n) => {
                const on = active === n.id;
                return (
                  <a
                    key={n.id}
                    href={`#${n.id}`}
                    aria-current={on ? "true" : undefined}
                    className={`relative rounded-full px-3.5 py-2 text-[0.875rem] tracking-tight transition-colors duration-300 ${
                      on ? "text-fg" : "text-fg-2 hover:text-fg"
                    }`}
                  >
                    {on && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full bg-surface"
                        transition={{ type: "spring", stiffness: 380, damping: 34 }}
                      />
                    )}
                    <span className="relative">{n.label[locale]}</span>
                  </a>
                );
              })}
            </div>

            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              {/* The live demo is the strongest proof we have, so it gets a
                  permanent home rather than living only behind the animations. */}
              {DEMO_ENABLED && (
                <a
                  href={DEMO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-[0.875rem] tracking-tight text-fg-2 transition-colors duration-300 hover:bg-surface hover:text-fg md:inline-flex"
                >
                  {cta.demo[locale]}
                  <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden>
                    <path
                      d="M6 3h7v7M13 3 4 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              )}
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
                className="grid h-9 w-9 place-items-center rounded-full border border-line-2 text-fg-2 transition-colors hover:text-fg lg:hidden"
              >
                <span className="relative block h-[10px] w-[16px]">
                  <span className={`absolute inset-x-0 top-0 h-[1.5px] rounded bg-current transition-transform duration-300 ${open ? "translate-y-[4.5px] rotate-45" : ""}`} />
                  <span className={`absolute inset-x-0 bottom-0 h-[1.5px] rounded bg-current transition-transform duration-300 ${open ? "-translate-y-[4px] -rotate-45" : ""}`} />
                </span>
              </button>
            </div>
          </nav>
        </div>
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
            <div className="flex h-full flex-col justify-between px-6 pt-[108px] pb-10">
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
              <div className="flex flex-col gap-4">
                {DEMO_ENABLED && (
                  <a
                    href={DEMO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-line-2 px-5 py-3.5 text-[0.9375rem] font-medium text-fg-2"
                  >
                    {cta.demo[locale]}
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
                      <path
                        d="M6 3h7v7M13 3 4 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                )}
                <div className="flex items-center justify-between gap-4">
                  <LocaleToggle />
                  <a
                    href="#kontakt"
                    onClick={() => setOpen(false)}
                    className="inline-flex flex-1 items-center justify-center rounded-full bg-fg px-5 py-3.5 text-[0.9375rem] font-medium text-canvas"
                  >
                    {cta.primary[locale]}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
