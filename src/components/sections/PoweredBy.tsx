"use client";

import { Container, Reveal } from "@/components/ui";
import { useLocale, type Bi } from "@/lib/i18n";

/* The logo carousel under the hero, built the way cursor.com and zapier.com
   run theirs: recognisable marks in tiles, one line of type above, links out.
 *
 * What it shows is the technology Sherko is built on, not a customer list.
 * That distinction is the whole reason the heading reads "bygget på" rather
 * than "trusted by": Anthropic and NVIDIA are the stack, and saying otherwise
 * would put words in their mouth that neither company has agreed to.
 *
 * Each mark is the official brand file in the official brand colour, pulled
 * from simple-icons. Two of them are black wordmarks, so those ship a white
 * variant too and the theme picks (see .only-light / .only-dark). */

const copy = {
  label: {
    no: "Bygget med teknologi og verktøy fra",
    en: "Built with technology and tools from",
  } as Bi,
};

type Tech = {
  name: string;
  file: string;
  href: string;
  site: string;
  /** official light-on-dark variant, for marks that are black by default */
  fileDark?: string;
};

const TECH: Tech[] = [
  { name: "Claude", file: "claude.svg", site: "anthropic.com", href: "https://www.anthropic.com/claude" },
  { name: "NVIDIA", file: "nvidia.svg", site: "nvidia.com", href: "https://www.nvidia.com/" },
  { name: "Google Gemini", file: "googlegemini.svg", site: "gemini.google.com", href: "https://gemini.google.com/" },
  { name: "Google Cloud", file: "googlecloud.svg", site: "cloud.google.com", href: "https://cloud.google.com/" },
  { name: "Stripe", file: "stripe.svg", site: "stripe.com", href: "https://stripe.com/" },
  { name: "Datadog", file: "datadog.svg", site: "datadoghq.com", href: "https://www.datadoghq.com/" },
  { name: "Linear", file: "linear.svg", site: "linear.app", href: "https://linear.app/" },
  { name: "Figma", file: "figma.svg", site: "figma.com", href: "https://www.figma.com/" },
  { name: "Adobe", file: "adobe.png", site: "adobe.com", href: "https://www.adobe.com/" },
  { name: "PostgreSQL", file: "postgresql.svg", site: "postgresql.org", href: "https://www.postgresql.org/" },
  { name: "Python", file: "python.svg", site: "python.org", href: "https://www.python.org/" },
  { name: "Next.js", file: "nextdotjs.svg", fileDark: "nextdotjs-white.svg", site: "nextjs.org", href: "https://nextjs.org/" },
  { name: "Vercel", file: "vercel.svg", fileDark: "vercel-white.svg", site: "vercel.com", href: "https://vercel.com/" },
];

function Tile({ t, hidden }: { t: Tech; hidden?: boolean }) {
  const imgClass = "h-[42px] w-[42px] shrink-0 object-contain";
  return (
    <li className="px-3">
      <a
        href={t.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t.name}
        tabIndex={hidden ? -1 : undefined}
        className="group flex h-[172px] w-[292px] flex-col items-center justify-center gap-4 rounded-xl border border-line bg-surface px-7 transition-[transform,translate,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-[0_10px_30px_-12px_rgba(0,0,0,0.22)]"
      >
        <span className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/logos/tech/${t.file}`}
            alt=""
            aria-hidden
            className={`${imgClass} ${t.fileDark ? "only-light" : ""}`}
            /* The track is translated horizontally, so a lazy-load observer
               never fires for the duplicated row and half the marks stay blank. */
            loading="eager"
          />
          {t.fileDark && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`/logos/tech/${t.fileDark}`}
              alt=""
              aria-hidden
              className={`${imgClass} only-dark`}
              loading="eager"
            />
          )}
          <span className="display text-[1.625rem] leading-none tracking-[-0.015em] text-fg">
            {hidden ? "" : t.name}
          </span>
        </span>
        <span className="font-mono text-[11px] tracking-[0.12em] text-fg-3 lowercase transition-colors duration-300 group-hover:text-fg">
          {t.site}
        </span>
      </a>
    </li>
  );
}

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {TECH.map((t) => (
        <Tile key={t.name} t={t} hidden={hidden} />
      ))}
    </ul>
  );
}

export function PoweredBy() {
  const { locale } = useLocale();

  return (
    <div className="border-t border-line bg-elev py-16 md:py-20">
      <Container>
        <Reveal>
          <p className="text-center text-[0.9375rem] text-fg-2 italic">{copy.label[locale]}</p>
        </Reveal>
      </Container>

      {/* One track duplicated and walked -50%: seamless either way. Edges fade
          so tiles do not pop in against the hairline. */}
      <Reveal delay={0.08}>
        <div /* py-4 is load-bearing: the track sits flush against this box, and
             overflow-hidden was clipping the top 4px off every card the
             moment it lifted on hover, taking the top border with it. */
          className="relative mt-5 overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]">
          <div
            className="marquee flex w-max hover:[animation-play-state:paused]"
            style={{ ["--marquee-duration" as string]: "62s" }}
          >
            <Row />
            <Row hidden />
          </div>
        </div>
      </Reveal>
    </div>
  );
}
