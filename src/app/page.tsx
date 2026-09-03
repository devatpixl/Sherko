import { Hero } from "@/components/hero/Hero";
import { BuiltFor } from "@/components/sections/BuiltFor";
import { Channels } from "@/components/sections/Channels";
import { Closing } from "@/components/sections/Closing";
import { DashboardPreview } from "@/components/sections/DashboardPreview";
import { Control } from "@/components/sections/Control";
import { FAQ } from "@/components/sections/FAQ";
import { Integrations } from "@/components/sections/Integrations";
import { Problem } from "@/components/sections/Problem";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top" className="relative">
        {/* The pitch */}
        <Hero />
        {/* Why it hurts today. The cost lands first: nothing below matters
            until the reader recognises the 13 hours as their own week. */}
        <Problem />
        {/* How the order actually reaches us, before the portal it lands in */}
        <Channels />
        {/* The system the order lands in, and the stock it keeps */}
        <DashboardPreview />
        {/* Who this is for, and how the order reaches us. Sits after the tour:
            by here the reader has seen the portal, so "built for wholesalers,
            nobody else" reads as a conclusion rather than a claim. */}
        <BuiltFor />
        {/* The trust argument */}
        <Control />
        {/* Where it plugs in */}
        <Integrations />
        {/* Objections */}
        <FAQ />
        {/* Ask */}
        <Closing />
      </main>
      <Footer />
    </>
  );
}
