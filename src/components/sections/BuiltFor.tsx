"use client";

import { Container, Eyebrow, Reveal, Section } from "@/components/ui";
import { useLocale, type Bi } from "@/lib/i18n";

/* The positioning statement. Sherko is a vertical product and the narrowness
   is the selling point, so it is said out loud — and then proved with the
   vocabulary only someone in the trade would bother to support. */


const copy = {
  eyebrow: { no: "Vertikal, ikke generell", en: "Vertical, not general" } as Bi,
  l1: { no: "Bygget for", en: "Built for" } as Bi,
  l2: { no: "grossister.", en: "wholesalers." } as Bi,
  l3: { no: "Ingen andre.", en: "Nobody else." } as Bi,
  body: {
    no: "Vi bygger lagersystemet rundt din drift, ikke omvendt. Sherko kan grossistvokabularet fra dag én: pall, D-pak, kolli, varenummer, EAN og prisavtaler per kunde.",
    en: "We build the warehouse system around how you run, not the other way round. Sherko knows the wholesale vocabulary from day one: pallets, cases, units, article numbers, EAN and per-customer price agreements.",
  } as Bi,
  rawLabel: { no: "Slik kunden skriver det", en: "How the customer writes it" } as Bi,
  raw: {
    no: "«2 pall jalapeño, 1 D-pak servietter 33, og 30 kn frityrolje til fredag»",
    en: "«2 pallets jalapeño, 1 case of 33cm napkins, and 30 cans of fryer oil for Friday»",
  } as Bi,
  parsedLabel: { no: "Slik Sherko leser det", en: "How Sherko reads it" } as Bi,
  terms: {
    no: "Pall, D-pak og kolli er ikke gjettet. Sherko slår opp varenummer og EAN i din egen katalog, bruker prisavtalen som gjelder den kunden, og skiller MVA på 15 % og 25 % uten at du sier fra.",
    en: "Pallets, cases and units are not guessed. Sherko looks up article numbers and EAN in your own catalogue, applies that customer's price agreement, and separates 15 % and 25 % VAT without being told.",
  } as Bi,
  /* Deliberately starts with "Og" / "And" — it continues the sentence above. */
  channelsLine: {
    no: "Og ordren kommer som kunden vil sende den.",
    en: "And the order arrives however the customer sends it.",
  } as Bi,
};

/* One order line as a customer would send it, and the same line resolved.
   Article numbers match the demo catalogue used elsewhere on the site. */
const PARSED = [
  { art: "20354", name: "Jalapeño, hel", qty: "2 pall" },
  { art: "20205", name: "Servietter 33 cm", qty: "1 D-pak" },
  { art: "20811", name: "Frityrolje 10 L", qty: "30 kanner" },
];

export function BuiltFor() {
  const { locale } = useLocale();

  return (
    <Section id="grossister" className="relative overflow-hidden bg-elev">
      <div className="grid-substrate mask-radial pointer-events-none absolute inset-0 -z-10 opacity-50" />

      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-center lg:gap-16">
          <div>
            <Reveal>
              <Eyebrow>{copy.eyebrow[locale]}</Eyebrow>
            </Reveal>

            <h2 className="display mt-7 text-[clamp(2.25rem,5.4vw,4rem)]">
              {[copy.l1, copy.l2, copy.l3].map((line, i) => (
                <Reveal key={line.no} delay={0.06 + i * 0.07}>
                  <span className={`block ${i === 1 ? "aurora-text pb-[0.06em]" : "text-fg"}`}>
                    {line[locale]}
                  </span>
                </Reveal>
              ))}
            </h2>

            <Reveal delay={0.28}>
              <p className="lede mt-7 max-w-xl text-[1.0625rem] leading-relaxed text-fg-2">
                {copy.body[locale]}
              </p>
            </Reveal>
          </div>

          {/* The proof, shown rather than listed.
              This was a 6 / 2 / 0 stat band over a numbered 01-06 list. Both
              are shapes a generated page reaches for by default, and neither
              proved anything: a reader cannot check "6 formats", and a
              numbered list of nouns is just nouns. So the panel does the thing
              instead. One real line the way a customer types it, and under it
              the same line resolved against a catalogue. Every term the old
              list named still appears, doing its job. */}
          <div className="rounded-2xl border border-line bg-surface/60 p-6 md:p-7">
            <Reveal delay={0.16}>
              <p className="font-mono text-[10.5px] tracking-[0.16em] text-fg-3 uppercase">
                {copy.rawLabel[locale]}
              </p>
              <p className="mt-3 text-[1.0625rem] leading-relaxed text-fg">{copy.raw[locale]}</p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="my-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-line" />
                <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-accent" aria-hidden>
                  <path
                    d="M8 2v11M4 9l4 4 4-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="h-px flex-1 bg-line" />
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <p className="font-mono text-[10.5px] tracking-[0.16em] text-fg-3 uppercase">
                {copy.parsedLabel[locale]}
              </p>
            </Reveal>

            <div className="mt-3">
              {PARSED.map((row, i) => (
                <Reveal key={row.art} delay={0.34 + i * 0.06}>
                  <div className="flex items-baseline gap-4 border-t border-line py-2.5">
                    <span className="w-14 shrink-0 font-mono text-[11.5px] text-fg-4 tabular-nums">
                      {row.art}
                    </span>
                    <span className="min-w-0 flex-1 text-[0.9375rem] text-fg">{row.name}</span>
                    <span className="shrink-0 font-mono text-[12px] whitespace-nowrap text-accent">
                      {row.qty}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.56}>
              <p className="mt-6 border-t border-line pt-5 text-[0.875rem] leading-relaxed text-fg-2">
                {copy.terms[locale]}
              </p>
            </Reveal>
          </div>
        </div>
      </Container>

    </Section>
  );
}
