import type { Metadata } from "next";
import Navbar             from "@/components/layout/Navbar";
import Footer             from "@/components/layout/Footer";
import Hero               from "@/components/sections/Hero";
import Problem            from "@/components/sections/Problem";
import SolutionCards      from "@/components/sections/SolutionCards";
import PlatformFeatures   from "@/components/sections/PlatformFeatures";
import AIShowcase         from "@/components/sections/AIShowcase";
import KnowledgeExperience from "@/components/sections/KnowledgeExperience";
import HowItWorks         from "@/components/sections/HowItWorks";
import BusinessOutcomes   from "@/components/sections/BusinessOutcomes";
import IndustrySolutions  from "@/components/sections/IndustrySolutions";
import PricingSection     from "@/components/sections/PricingSection";
import FAQ                from "@/components/sections/FAQ";

export const metadata: Metadata = {
  title: "Genesis AI — Build Your AI Workforce in Minutes",
};

export default function Home() {
  return (
    <>
      <Navbar />

      <main id="main-content" tabIndex={-1}>
        {/* Hero */}
        <Hero />

        {/* Problem → Solution → Platform */}
        <div id="solutions"><Problem /></div>
        <SolutionCards />
        <div id="platform"><PlatformFeatures /></div>

        {/* Product in action */}
        <AIShowcase />
        <KnowledgeExperience />

        {/* Journey + Proof */}
        <HowItWorks />
        <BusinessOutcomes />
        <IndustrySolutions />

        {/* Conversion */}
        <PricingSection />
        <FAQ />
      </main>

      <Footer />
    </>
  );
}
