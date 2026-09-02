"use client";

import { motion } from "motion/react";
import { Container, Reveal, Section, SectionHead } from "@/components/ui";
import { Mark } from "@/components/site/Wordmark";
import { useLocale, type Bi } from "@/lib/i18n";

/* Modelled on zapier.com's integration diagram: sources on the left, the
   product in the middle, systems it writes to on the right, joined by drawn
   brackets. Their accent is orange and so is ours, so the connectors carry it.

   Every glyph here is drawn, not a downloaded brand file — close enough to be
   recognisable, ours to ship. */

const EASE = [0.16, 1, 0.3, 1] as const;

const copy = {
  eyebrow: { no: "Integrasjoner", en: "Integrations" } as Bi,
  title: { no: "Kobler seg på det du allerede bruker.", en: "Plugs into what you already use." } as Bi,
  body: {
    no: "Ordren kommer inn der kunden allerede skriver. Sherko leser den, slår den opp mot katalogen din, og skriver den til systemene du allerede har.",
    en: "The order arrives where your customer already writes. Sherko reads it, resolves it against your catalogue, and writes it to the systems you already run.",
  } as Bi,
  inbound: { no: "Inn · der kunden skriver", en: "In · where customers write" } as Bi,
  outbound: { no: "Ut · dine systemer", en: "Out · your systems" } as Bi,
  more: { no: "og resten av stacken din", en: "and the rest of your stack" } as Bi,
  appsTitle: { no: "Apper og formater Sherko leser", en: "Apps and formats Sherko reads" } as Bi,
  appsSub: {
    no: "Kunden trenger ikke bytte verktøy. Sherko tar ordren slik den kommer.",
    en: "Your customer does not change tools. Sherko takes the order as it arrives.",
  } as Bi,
};

/* ── brand marks ──────────────────────────────────────────────────── */
/* Real logo files, supplied by the client, backgrounds flood-filled out so
   they sit on the dark surface with no white plate behind them. */

function BrandImg({ file, name }: { file: string; name: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/logos/apps/${file}`}
      alt=""
      aria-hidden
      title={name}
      className="h-full w-full object-contain"
    />
  );
}

const WhatsApp = () => <BrandImg file="whatsapp.svg" name="WhatsApp" />;
const Gmail = () => <BrandImg file="gmail.png" name="Gmail" />;
const Sheets = () => <BrandImg file="googlesheets.png" name="Google Sheets" />;
const ExcelGlyph = () => <BrandImg file="excel.svg" name="Microsoft Excel" />;
const PdfGlyph = () => <BrandImg file="pdf.png" name="Adobe Acrobat" />;
const OutlookGlyph = () => <BrandImg file="outlook.svg" name="Microsoft Outlook" />;
const WordGlyph = () => <BrandImg file="word.png" name="Microsoft Word" />;
const SmsGlyph = () => <BrandImg file="sms.png" name="SMS" />;
const CsvGlyph = () => <BrandImg file="csv.png" name="CSV" />;
const VoiceGlyph = () => <BrandImg file="voice.png" name="Talemelding" />;
const ScanGlyph = () => <BrandImg file="scan.png" name="Skannet ark" />;
const PhotoGlyph = () => <BrandImg file="foto.png" name="Foto" />;

/* Outbound systems are categories, not products, so these stay drawn. */
function ErpGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <ellipse cx="12" cy="6" rx="7" ry="2.8" />
      <path d="M5 6v6c0 1.55 3.13 2.8 7 2.8s7-1.25 7-2.8V6" />
      <path d="M5 12v6c0 1.55 3.13 2.8 7 2.8s7-1.25 7-2.8v-6" />
    </svg>
  );
}
function TrucksGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M2 7h11v9H2z" />
      <path d="M13 10h4.2l2.8 3v3H13z" />
      <circle cx="6" cy="18" r="1.7" />
      <circle cx="17" cy="18" r="1.7" />
    </svg>
  );
}
function AccountingGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8h8M8 12h4M8 16h6" />
    </svg>
  );
}

type App = { name: string; glyph: React.ReactNode; note?: Bi };

/* zapier.com/apps lists each integration as logo, name, and one line on what
   it does. Same idea here, scoped to what actually reaches an order desk. */
const CATALOGUE: { name: string; glyph: React.ReactNode; note: Bi }[] = [
  {
    name: "WhatsApp",
    glyph: <WhatsApp />,
    note: { no: "Tekst, tale, bilde eller dokument. Den vanligste kanalen.", en: "Text, voice, image or document. The channel most orders arrive on." },
  },
  {
    name: "Gmail",
    glyph: <Gmail />,
    note: { no: "Videresendt e-post fra kjøkkensjefen, med eller uten vedlegg.", en: "A forwarded email from the chef, with or without an attachment." },
  },
  {
    name: "Excel",
    glyph: <ExcelGlyph />,
    note: { no: "Bestillingsarket kunden allerede fyller ut hver uke.", en: "The order sheet your customer already fills in every week." },
  },
  {
    name: "Google Sheets",
    glyph: <Sheets />,
    note: { no: "Delt ark mellom kunde og selger, lest direkte.", en: "A sheet shared between customer and rep, read directly." },
  },
  {
    name: "PDF",
    glyph: <PdfGlyph />,
    note: { no: "Innkjøpsordre eller skannet bestilling, lest som den er.", en: "A purchase order or scanned request, read as it is." },
  },
  {
    name: "Foto",
    glyph: <PhotoGlyph />,
    note: { no: "Bilde av en håndskrevet lapp eller oppslagstavla.", en: "A photo of a handwritten note or the bulletin board." },
  },
  {
    name: "Outlook",
    glyph: <OutlookGlyph />,
    note: { no: "Samme som Gmail, for de som kjører Microsoft.", en: "The same as Gmail, for the ones running Microsoft." },
  },
  {
    name: "SMS",
    glyph: <SmsGlyph />,
    note: { no: "Korte bestillinger fra sjåfør eller butikk.", en: "Short orders from a driver or a shop floor." },
  },
  {
    name: "CSV",
    glyph: <CsvGlyph />,
    note: { no: "Eksport fra kundens eget system, lest linje for linje.", en: "An export from the customer's own system, read line by line." },
  },
  {
    name: "Word",
    glyph: <WordGlyph />,
    note: { no: "Bestillingsmal som dokument, ikke som skjema.", en: "An order template as a document, not as a form." },
  },
  {
    name: "Talemelding",
    glyph: <VoiceGlyph />,
    note: { no: "Talemelding på WhatsApp, transkribert og forstått.", en: "A WhatsApp voice note, transcribed and understood." },
  },
  {
    name: "Skannet ark",
    glyph: <ScanGlyph />,
    note: { no: "Faks eller skann fra en kunde som fortsatt bruker papir.", en: "A fax or scan from a customer who still works on paper." },
  },
];

const INBOUND: App[] = [
  { name: "WhatsApp", glyph: <WhatsApp /> },
  { name: "Gmail", glyph: <Gmail /> },
  { name: "Excel", glyph: <ExcelGlyph /> },
  { name: "Google Sheets", glyph: <Sheets /> },
  { name: "PDF", glyph: <PdfGlyph /> },
];

const OUTBOUND: App[] = [
  { name: "ERP", glyph: <span className="text-fg-2"><ErpGlyph /></span> },
  { name: "Regnskap", glyph: <span className="text-fg-2"><AccountingGlyph /></span> },
  { name: "Lager", glyph: <span className="text-fg-2"><TrucksGlyph /></span> },
];

function AppCard({ app, delay }: { app: App; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: EASE }}
      className="flex items-center gap-3 rounded-lg border border-line bg-surface px-3.5 py-2.5"
    >
      <span className="grid h-7 w-7 shrink-0 place-items-center">{app.glyph}</span>
      <span className="truncate text-[0.875rem] text-fg-2">{app.name}</span>
    </motion.div>
  );
}

/** Zapier's drawn bracket: a vertical spine with a stub into the middle.
 *  Both arms carry a travelling packet, and the whole bracket is mirrored for
 *  the outbound side so flow always reads toward, then away from, the middle. */
function Bracket({ flip = false }: { flip?: boolean }) {
  const ARMS = [
    "M2 14 H22 Q30 14 30 26 V106 Q30 120 40 120 H54",
    "M2 226 H22 Q30 226 30 214 V134 Q30 120 40 120 H54",
    "M2 120 H54",
  ];
  return (
    <div className={`relative hidden w-14 self-stretch md:block ${flip ? "scale-x-[-1]" : ""}`}>
      <svg viewBox="0 0 56 240" preserveAspectRatio="none" className="h-full w-full text-line-2" aria-hidden>
        {ARMS.map((d, i) => (
          <motion.path
            key={`rail-${i}`}
            d={d}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: i * 0.08, ease: EASE }}
          />
        ))}
        {ARMS.map((d, i) => (
          <path
            key={`flow-${i}`}
            d={d}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="1.6"
            strokeDasharray="16 220"
            className="bracket-flow"
            style={{ animationDelay: `${i * 0.45}s` }}
          />
        ))}
      </svg>
    </div>
  );
}

export function Integrations() {
  const { locale } = useLocale();

  return (
    <Section id="integrasjoner" className="bg-canvas">
      <Container>
        <SectionHead
          eyebrow={copy.eyebrow[locale]}
          title={copy.title[locale]}
          body={copy.body[locale]}
        />

        <Reveal delay={0.1}>
          <div className="mt-14 grid items-center gap-6 md:mt-20 md:grid-cols-[minmax(0,1fr)_auto_auto_auto_minmax(0,1fr)]">
            {/* in */}
            <div>
              <p className="mb-3.5 font-mono text-[10px] tracking-[0.16em] text-fg-4 uppercase">
                {copy.inbound[locale]}
              </p>
              <div className="grid gap-2.5">
                {INBOUND.map((a, i) => (
                  <AppCard key={a.name} app={a} delay={i * 0.06} />
                ))}
              </div>
            </div>

            <Bracket />

            {/* the product */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
              className="relative mx-auto w-full max-w-[15rem] rounded-xl border border-accent/40 bg-surface p-6 text-center"
            >
              <Mark className="mx-auto h-9 w-9 text-accent" />
              <p className="mt-4 text-[0.9375rem] font-medium text-fg">Sherko</p>
              <p className="mt-1 font-mono text-[10px] tracking-[0.16em] text-accent uppercase">
                {locale === "no" ? "Leser · slår opp · skriver" : "Reads · resolves · writes"}
              </p>
              {/* zapier animates this plate rather than leaving it flat: the
                  dots drift and breathe, so the middle reads as the thing doing
                  the work instead of a static badge. */}
              <div
                aria-hidden
                className="dot-plate mt-5 h-6 overflow-hidden rounded"
              />
            </motion.div>

            <Bracket flip />

            {/* out */}
            <div>
              <p className="mb-3.5 font-mono text-[10px] tracking-[0.16em] text-fg-4 uppercase">
                {copy.outbound[locale]}
              </p>
              <div className="grid gap-2.5">
                {OUTBOUND.map((a, i) => (
                  <AppCard key={a.name} app={a} delay={0.4 + i * 0.06} />
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6, ease: EASE }}
                  className="rounded-lg border border-accent/45 px-3.5 py-2.5 text-[0.875rem] text-accent"
                >
                  {copy.more[locale]}
                </motion.div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ── the catalogue, zapier.com/apps style ── */}
        <Reveal delay={0.16}>
          <div className="pt-32 md:pt-40 lg:pt-48">
            <h3 className="display text-[clamp(1.4rem,2.4vw,1.9rem)] text-fg">
              {copy.appsTitle[locale]}
            </h3>
            <p className="lede mt-3 max-w-[52ch] text-[1rem] text-fg-2">
              {copy.appsSub[locale]}
            </p>

            <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {CATALOGUE.map((a, i) => (
                <motion.div
                  key={a.name}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (i % 2) * 0.05, ease: EASE }}
                  className="flex gap-4"
                >
                  <span className="mt-0.5 grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-line bg-surface p-2.5 text-fg-3">
                    {a.glyph}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.9375rem] font-medium text-fg">{a.name}</span>
                    <span className="mt-1 block text-[0.875rem] leading-relaxed text-fg-3">
                      {a.note[locale]}
                    </span>
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
