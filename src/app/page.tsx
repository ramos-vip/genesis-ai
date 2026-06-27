import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import AIEmployees from "@/components/sections/AIEmployees";
import Features from "@/components/sections/Features";
import HowItWorks from "@/components/sections/HowItWorks";
import Testimonials from "@/components/sections/Testimonials";
import PricingPreview from "@/components/sections/PricingPreview";
import FAQ from "@/components/sections/FAQ";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <AIEmployees />
        <Features />
        <HowItWorks />
        <Testimonials />
        <PricingPreview />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
