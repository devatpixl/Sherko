"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Container, Reveal, Section, SectionHead } from "@/components/ui";
import { LiveModule } from "@/components/ui/LiveModule";
import { useLocale, type Bi } from "@/lib/i18n";

/* Real screen recordings of the running admin, tabbed the way cursor.com steps
   through its product. Every figure and customer in them is invented demo data
   from the public demo instance, so nothing here exposes a client.

   Recordings rather than the framed live app: seven views would mean seven
   iframes, and the CEO asked for video. */

const copy = {
  eyebrow: { no: "Systemet", en: "The system" } as Bi,
  title: { no: "Ordre, lager, kunder og innkjøp i ett system.", en: "Orders, stock, customers and purchasing in one system." } as Bi,
  body: {
    no: "Dette er den faktiske portalen, ikke en skisse. Klikk deg gjennom fanene og se ordrehåndtering, varelager, kundeoversikt og innkjøp. Tallene er fra demoinstansen.",
    en: "Orders, stock, customers, purchasing and catalogue in one portal. The figures below are from the demo instance, not from a client.",
  } as Bi,
};

type Tab = { id: string; label: Bi; note: Bi; url: string; route: string; poster: string };

const TABS: Tab[] = [
  {
    id: "rapporter",
    label: { no: "Rapporter", en: "Reports" },
    note: { no: "Omsetning, salg per produktgruppe, snittordre", en: "Revenue, sales per product group, average order" },
    url: "sherko-demo.pixlmedia.no/dashboard/reports",
    route: "/demo/dashboard/reports",
    poster: "/video/rapporter.jpg",
  },
  {
    id: "ordre",
    label: { no: "Ordre", en: "Orders" },
    note: { no: "Alle statuser, kanal og beløp i én liste", en: "Every status, channel and amount in one list" },
    url: "sherko-demo.pixlmedia.no/dashboard/orders",
    route: "/demo/dashboard/orders",
    poster: "/video/ordre.jpg",
  },
  {
    id: "lager",
    label: { no: "Lager", en: "Stock" },
    note: { no: "Beholdning, bevegelser og bestillingspunkter", en: "Balances, movements and reorder points" },
    url: "sherko-demo.pixlmedia.no/dashboard/inventory",
    route: "/demo/dashboard/inventory",
    poster: "/video/lager.jpg",
  },
  {
    id: "kunder",
    label: { no: "Kunder", en: "Customers" },
    note: { no: "Kundekort, prisavtaler og kundegrupper", en: "Customer records, price agreements and groups" },
    url: "sherko-demo.pixlmedia.no/dashboard/customers",
    route: "/demo/dashboard/customers",
    poster: "/video/kunder.jpg",
  },
  {
    id: "innkjop",
    label: { no: "Innkjøp", en: "Purchasing" },
    note: { no: "Innkjøpsordre mot leverandør, med status", en: "Purchase orders to suppliers, with status" },
    url: "sherko-demo.pixlmedia.no/dashboard/purchase-orders",
    route: "/demo/dashboard/purchase-orders",
    poster: "/video/innkjop.jpg",
  },
  {
    id: "brukere",
    label: { no: "Brukere", en: "Users" },
    note: { no: "Roller og tilgang per ansatt", en: "Roles and access per employee" },
    url: "sherko-demo.pixlmedia.no/dashboard/staff",
    route: "/demo/dashboard/staff",
    poster: "/video/brukere.jpg",
  },
  {
    id: "katalog",
    label: { no: "Katalog", en: "Catalogue" },
    note: { no: "Varer, kategorier, merker og MVA", en: "Products, categories, brands and VAT" },
    url: "sherko-demo.pixlmedia.no/dashboard/products",
    route: "/demo/dashboard/products",
    poster: "/video/katalog.jpg",
  },
];

export function DashboardPreview() {
  const { locale } = useLocale();
  const [active, setActive] = useState(TABS[0].id);
  const tab = TABS.find((t) => t.id === active) ?? TABS[0];

  /* The nav still points at #lager. That anchor now lives inside this section,
     so honour it by opening the matching tab instead of silently showing
     Rapporter to someone who asked for stock. */
  useEffect(() => {
    const open = () => {
      const id = window.location.hash.replace("#", "");
      if (TABS.some((t) => t.id === id)) setActive(id);
    };
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, []);

  return (
    <Section id="system" className="bg-elev">
      <Container>
        <SectionHead
          eyebrow={copy.eyebrow[locale]}
          title={copy.title[locale]}
          body={copy.body[locale]}
        />

        <Reveal delay={0.08}>
          {/* second landing point, so the Lager nav item keeps working */}
          <span id="lager" className="block scroll-mt-28" aria-hidden />

          <div
            role="tablist"
            aria-label={copy.eyebrow[locale]}
            className="mt-12 flex flex-wrap gap-2 md:mt-16"
          >
            {TABS.map((t) => {
              const on = t.id === active;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(t.id)}
                  className={`cursor-pointer rounded-full border px-4 py-2 text-[0.875rem] tracking-tight transition-colors duration-200 ${
                    on
                      ? "border-fg bg-fg text-canvas"
                      : "border-line text-fg-2 hover:border-line-2 hover:text-fg"
                  }`}
                >
                  {t.label[locale]}
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={0.14}>
          <motion.div key={tab.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
            <LiveModule
              route={tab.route}
              poster={tab.poster}
              label={tab.url}
              priority={tab.id === TABS[0].id}
              className="mt-7 shadow-[0_40px_120px_-45px_rgba(0,0,0,0.9)]"
            />
            <p className="mt-4 font-mono text-[11px] tracking-[0.12em] text-fg-4 uppercase">
              {tab.note[locale]}
            </p>
          </motion.div>
        </Reveal>
      </Container>
    </Section>
  );
}
