import { Hero } from "@/components/hero/Hero";
import { BuiltFor } from "@/components/sections/BuiltFor";
import { Closing } from "@/components/sections/Closing";
import { DashboardPreview } from "@/components/sections/DashboardPreview";
import { Control } from "@/components/sections/Control";
import { FAQ } from "@/components/sections/FAQ";
import { Integrations } from "@/components/sections/Integrations";
import { PoweredBy } from "@/components/sections/PoweredBy";
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
        {/* The stack it runs on. TrustedBy.tsx stays parked for customer logos. */}
        <PoweredBy />
        {/* Who this is for, and how the order reaches us */}
        <BuiltFor />
        {/* The system the order lands in, and the stock it keeps */}
        <DashboardPreview />
        {/* Why it hurts today */}
        <Problem />
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
