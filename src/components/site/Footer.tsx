"use client";

import { Wordmark } from "@/components/site/Wordmark";
import { Container } from "@/components/ui";
import { brand, footer } from "@/lib/content";
import { useLocale, type Bi } from "@/lib/i18n";

const builtIn: Bi = { no: "Bygget i Norge", en: "Built in Norway" };

export function Footer() {
  const { locale } = useLocale();

  return (
    <footer className="relative overflow-hidden border-t border-line bg-canvas">
      {/* One flourish: the name, half sunk below the edge of the page. */}
      <span
        aria-hidden
        className="display pointer-events-none absolute -bottom-[0.18em] left-1/2 -translate-x-1/2 text-[clamp(6rem,20vw,16rem)] whitespace-nowrap select-none footer-ghost"
      >
        {brand.name.toUpperCase()}
      </span>

      <div className="relative z-10">
        <Container>
          <div className="grid gap-12 py-16 md:grid-cols-[minmax(0,1fr)_auto] md:py-20">
            {/* ── Left: who this is ─────────────────────────────── */}
            <div>
              <Wordmark />
              <p className="mt-4 max-w-xs text-[0.9375rem] text-fg-2">{footer.tagline[locale]}</p>
              <p className="mt-6 font-mono text-[11px] text-fg-4">
                {footer.builtBy[locale]} <span className="text-fg-3">{brand.parent}</span>
              </p>
            </div>

            {/* ── Right: where to go ────────────────────────────── */}
            <div className="flex gap-16">
              {footer.columns.map((col) => (
                <div key={col.title.no}>
                  <p className="mb-4 font-mono text-[10.5px] tracking-[0.16em] text-fg-4 uppercase">
                    {col.title[locale]}
                  </p>
                  <ul className="space-y-3">
                    {col.links.map((link) => (
                      <li key={link.label.no}>
                        <a
                          href={link.href}
                          className="-my-1 inline-block py-2 text-[0.9375rem] text-fg-2 transition-colors hover:text-fg"
                        >
                          {link.label[locale]}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Container>

        <div className="border-t border-line">
          <Container>
            <div className="flex flex-wrap items-center justify-between gap-4 py-6">
              <p className="text-[13px] text-fg-4">
                © 2026 {brand.name}. {footer.rights[locale]}
              </p>
              <p className="font-mono text-[11px] tracking-[0.14em] text-fg-4 uppercase">
                {builtIn[locale]}
              </p>
            </div>
          </Container>
        </div>
      </div>
    </footer>
  );
}
