"use client";

import { Container, Reveal } from "@/components/ui";
import { useLocale, type Bi } from "@/lib/i18n";

/* The logo strip that runs under the hero, the way cursor.com and zapier.com
   both open: recognisable marks, tiles, one line of type above.
 *
 * What it shows is the honest version of that slot. Sherko has no customer
 * logos to display yet, and borrowing famous ones would read as proof we do
 * not have. These are the tools an order actually arrives in, each linked to
 * the product's own site, so the strip carries a claim we can stand behind:
 * the customer keeps their tool, we take the order out of it.
 *
 * Replaced the Pixl Media project strip, which showed our own delivered sites.
 * That component still lives at sections/TrustedBy.tsx for when it comes back. */

const copy = {
  label: {
    no: "Ordren kan komme fra hvilket som helst av disse",
    en: "The order can arrive from any of these",
  } as Bi,
};

type App = { name: string; file: string; site: string; href: string };

/* Official brand files, backgrounds already flood-filled out. */
const APPS: App[] = [
  { name: "WhatsApp", file: "whatsapp.svg", site: "whatsapp.com", href: "https://www.whatsapp.com/" },
  { name: "Gmail", file: "gmail.png", site: "gmail.com", href: "https://mail.google.com/" },
  { name: "Microsoft Outlook", file: "outlook.svg", site: "outlook.com", href: "https://outlook.com/" },
  { name: "Microsoft Excel", file: "excel.svg", site: "microsoft.com/excel", href: "https://www.microsoft.com/microsoft-365/excel" },
  { name: "Google Sheets", file: "googlesheets.png", site: "sheets.google.com", href: "https://sheets.google.com/" },
  { name: "Microsoft Word", file: "word.png", site: "microsoft.com/word", href: "https://www.microsoft.com/microsoft-365/word" },
  { name: "Adobe Acrobat", file: "pdf.png", site: "adobe.com/acrobat", href: "https://www.adobe.com/acrobat.html" },
  { name: "SMS", file: "sms.png", site: "meldinger", href: "#kanaler" },
];

function Tile({ a, hidden }: { a: App; hidden?: boolean }) {
  return (
    <li className="px-3">
      <a
        href={a.href}
        {...(a.href.startsWith("#") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
        aria-label={a.name}
        tabIndex={hidden ? -1 : undefined}
        className="group flex h-[152px] w-[240px] flex-col items-center justify-center gap-4 rounded-xl border border-line bg-surface px-8 transition-colors duration-300 hover:border-line-2"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/logos/apps/${a.file}`}
          alt={hidden ? "" : a.name}
          className="h-[52px] w-auto max-w-[150px] object-contain opacity-90 transition-opacity duration-300 group-hover:opacity-100"
          /* The track is translated horizontally, so a lazy-load observer
             never fires for the duplicated row and half the marks stay blank. */
          loading="eager"
        />
        <span className="font-mono text-[11px] tracking-[0.12em] text-fg-3 lowercase transition-colors duration-300 group-hover:text-fg">
          {a.site}
        </span>
      </a>
    </li>
  );
}

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {APPS.map((a) => (
        <Tile key={a.name} a={a} hidden={hidden} />
      ))}
    </ul>
  );
}

export function WorksWith() {
  const { locale } = useLocale();

  return (
    <div className="border-y border-line bg-elev py-14 md:py-20">
      <Container>
        <Reveal>
          <p className="text-center text-[0.9375rem] text-fg-2 italic">{copy.label[locale]}</p>
        </Reveal>
      </Container>

      {/* One track duplicated and walked -50%: seamless either way. Edges fade
          so tiles do not pop in against the hairline. */}
      <Reveal delay={0.08}>
        <div className="relative mt-9 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]">
          <div
            className="marquee flex w-max hover:[animation-play-state:paused]"
            style={{ ["--marquee-duration" as string]: "44s" }}
          >
            <Row />
            <Row hidden />
          </div>
        </div>
      </Reveal>
    </div>
  );
}
