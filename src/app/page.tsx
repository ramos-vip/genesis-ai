import Navbar          from "@/components/layout/Navbar";
import Footer          from "@/components/layout/Footer";
import Hero            from "@/components/sections/Hero";
import Problem         from "@/components/sections/Problem";
import SolutionCards   from "@/components/sections/SolutionCards";
import PlatformFeatures from "@/components/sections/PlatformFeatures";
import AIShowcase          from "@/components/sections/AIShowcase";
import KnowledgeExperience from "@/components/sections/KnowledgeExperience";
import HowItWorks          from "@/components/sections/HowItWorks";
import Testimonials    from "@/components/sections/Testimonials";
import PricingPreview  from "@/components/sections/PricingPreview";
import FAQ             from "@/components/sections/FAQ";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* Above the fold */}
        <Hero />

        {/* Problem → Solution → Features narrative */}
        <Problem />
        <SolutionCards />
        <PlatformFeatures />
        <AIShowcase />
        <KnowledgeExperience />

        {/* How it works, social proof, pricing, FAQ */}
        <HowItWorks />
        <Testimonials />
        <PricingPreview />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
