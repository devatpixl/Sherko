import { Hero } from "@/components/hero/Hero";
import { AdminSim } from "@/components/sections/AdminSim";
import { BuiltFor } from "@/components/sections/BuiltFor";
import { Closing } from "@/components/sections/Closing";
import { Control } from "@/components/sections/Control";
import { FAQ } from "@/components/sections/FAQ";
import { Integrations } from "@/components/sections/Integrations";
import { Problem } from "@/components/sections/Problem";
import { StockSim } from "@/components/sections/StockSim";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top" className="relative">
        {/* The pitch */}
        <Hero />
        {/* Who this is for, and how the order reaches us */}
        <BuiltFor />
        {/* The system the order lands in */}
        <AdminSim />
        {/* …and the stock it keeps */}
        <StockSim />
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
