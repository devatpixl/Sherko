import { Hero } from "@/components/hero/Hero";
import { Capabilities } from "@/components/sections/Capabilities";
import { ChannelStrip } from "@/components/sections/ChannelStrip";
import { Closing } from "@/components/sections/Closing";
import { Control } from "@/components/sections/Control";
import { FAQ } from "@/components/sections/FAQ";
import { Facts } from "@/components/sections/Facts";
import { HowItWorks } from "@/components/sections/HowItWorks";
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
        {/* Where orders come from */}
        <ChannelStrip />
        {/* Why it hurts today */}
        <Problem />
        {/* The mechanism */}
        <HowItWorks />
        {/* The surface area */}
        <Capabilities />
        {/* The numbers that are actually true */}
        <Facts />
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
