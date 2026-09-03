"use client";

import { ChannelPhone } from "@/components/sections/ChannelPhone";
import { ExcelSwap } from "@/components/sections/ExcelSwap";
import { Container, Eyebrow, Reveal, Section } from "@/components/ui";
import { channels } from "@/lib/content";
import { useLocale, type Bi } from "@/lib/i18n";

/* How the order reaches us: the twelve inbound formats, the conversation, the
   draft, and the spreadsheet it replaces.

   Split out of BuiltFor so the two halves can be ordered independently. This
   half belongs before the product tour, because the reader needs to see the
   order arrive before they are shown the portal it lands in. */

const copy = {
  /* Deliberately starts with "Og" / "And" — it continues from the section above. */
  line: {
    no: "Og ordren kommer som kunden vil sende den.",
    en: "And the order arrives however the customer sends it.",
  } as Bi,
};

export function Channels() {
  const { locale } = useLocale();

  return (
    <Section className="bg-elev">
    <div id="kanaler" className="scroll-mt-24">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:items-start lg:gap-16">
          <div>
            <Reveal>
              <Eyebrow>{channels.eyebrow[locale]}</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <p className="display mt-6 text-[clamp(1.5rem,3.2vw,2.35rem)] text-fg">
                {copy.line[locale]}
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.12}>
            <p className="lede text-[0.9375rem] leading-relaxed text-fg-2 lg:pt-9">
              {channels.body[locale]}
            </p>
          </Reveal>
        </div>
      </Container>

      <ChannelPhone />

      {/* Excel is not one of the formats — it is the thing being replaced. */}
      <ExcelSwap />
    </div>
    </Section>
  );
}
