"use client";

import Image from "next/image";
import { Container, Reveal } from "@/components/ui";
import { useLocale, type Bi } from "@/lib/i18n";

/* Pixl Media's own delivered projects, in tiles the way zapier.com runs its
   logo row rather than as a flat line of names.

   Real logos, fetched from each live site, each treated for what it actually is.

   Blanket `brightness(0) invert(1)` was tried and was wrong: it fixes dark
   line art but destroys any mark that lives on its own coloured tile, because
   the tile inverts along with everything on it. Pixl Novo and Guardian both
   came out as solid white blocks.

   So `tone` is set per logo:
     "invert"  only AB Marketing, whose wordmark is near-black and otherwise
               invisible on this background
     "lift"    dark but worth keeping in colour, brightened rather than flattened
     "keep"    everything else, in its own colours

   Rabita publishes two official files, a white one and a gold one. Both are
   shipped and the theme picks, rather than filtering the white one to black
   and inventing a colour the brand does not use.

   These are real clients and real live sites, not invented proof. */

const copy: Bi = {
  no: "Systemer vi allerede har levert",
  en: "Systems we have already delivered",
};

type Tone = "invert" | "keep" | "lift";
type Client = {
  name: string; href: string; file: string;
  w: number; h: number; site: string; tone: Tone;
  /** official light-ground variant, shown instead of `file` under the light theme */
  fileLight?: string;
};

const CLIENTS: Client[] = [
  { site: "abmarketing.no", name: "AB Marketing", tone: "invert", /* near-black wordmark */ href: "https://abmarketing.no/", file: "/logos/abmarketing.png", w: 750, h: 197 },
  { site: "norbel.no", name: "Norbel Trading", tone: "lift", /* dark, brightened not whitened */ href: "https://norbel.no/", file: "/logos/norbel.png", w: 430, h: 512 },
  { site: "moenengros.no", name: "Moen Engros", tone: "lift", /* dark, brightened not whitened */ href: "https://www.moenengros.no/", file: "/logos/moenengros.png", w: 511, h: 297 },
  { site: "rabita.no", name: "Rabita", tone: "keep", /* white file for dark, official gold for light */ href: "https://rabita.no/", file: "/logos/rabita.svg", fileLight: "/logos/rabita-color.svg", w: 247, h: 70 },
  { site: "pixlnovo.no", name: "Pixl Novo", tone: "keep", /* white mark on a red tile */ href: "https://pixlnovo.no/", file: "/logos/pixlnovo.svg", w: 64, h: 64 },
  { site: "innocents.no", name: "Innocents Norge", tone: "lift", /* dark navy, needs lifting */ href: "https://innocents.no/", file: "/logos/innocents.png", w: 512, h: 427 },
  { site: "guardian-crm.pixlmedia.no", name: "Guardian CRM", tone: "keep", /* blue shield on a white tile */ href: "https://guardian-crm.pixlmedia.no/", file: "/logos/guardian.svg", w: 64, h: 64 },
  { site: "pixlmedia.no", name: "Pixl Media", tone: "keep", /* red mark, reads on dark */ href: "https://pixlmedia.no/", file: "/logos/pixlmedia.png", w: 152, h: 80 },
];

function Tile({ c, hidden }: { c: Client; hidden?: boolean }) {
  return (
    <li className="px-3">
      <a
        href={c.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={c.name}
        tabIndex={hidden ? -1 : undefined}
        className="group flex h-[164px] w-[280px] flex-col items-center justify-center gap-4 rounded-xl border border-line bg-surface px-8 transition-[transform,translate,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-[0_10px_30px_-12px_rgba(0,0,0,0.22)]"
      >
        <Image
          src={c.file}
          alt={hidden ? "" : c.name}
          width={c.w}
          height={c.h}
          className={`h-auto max-h-[92px] w-auto max-w-[220px] object-contain ${
            c.fileLight ? "only-dark" : ""
          } ${c.tone === "invert" ? "logo-invert" : c.tone === "lift" ? "logo-lift" : ""}`}
          unoptimized
          /* The track is translated horizontally, so the lazy-load observer
             never fires for the duplicated row and half the logos stay blank. */
          loading="eager"
        />
        {c.fileLight && (
          <Image
            src={c.fileLight}
            alt=""
            aria-hidden
            width={c.w}
            height={c.h}
            className="only-light h-auto max-h-[92px] w-auto max-w-[220px] object-contain"
            unoptimized
            loading="eager"
          />
        )}
        <span className="font-mono text-[11px] tracking-[0.12em] text-fg-2 lowercase transition-colors duration-300 group-hover:text-fg">
          {c.site}
        </span>
      </a>
    </li>
  );
}

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {CLIENTS.map((c) => (
        <Tile key={c.name} c={c} hidden={hidden} />
      ))}
    </ul>
  );
}

export function TrustedBy() {
  const { locale } = useLocale();

  return (
    <div className="border-t border-line bg-elev py-16 md:py-20">
      <Container>
        <Reveal>
          <p className="text-center font-mono text-[10.5px] tracking-[0.18em] text-fg-4 uppercase">
            {copy[locale]}
          </p>
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
            style={{ ["--marquee-duration" as string]: "46s" }}
          >
            <Row />
            <Row hidden />
          </div>
        </div>
      </Reveal>
    </div>
  );
}
