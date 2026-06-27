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

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* Above the fold */}
        <Hero />

        {/* Problem → Solution → Platform → Social proof */}
        <Problem />
        <SolutionCards />
        <PlatformFeatures />
        <AIShowcase />
        <KnowledgeExperience />

        {/* Walkthrough → Outcomes → Industries */}
        <HowItWorks />
        <BusinessOutcomes />
        <IndustrySolutions />

        {/* Pricing → FAQ */}
        <PricingSection />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
