import { Hero } from "@/components/hero/Hero";
import { ModelBanner } from "@/components/sections/ModelBanner";
import { CategoryShowcase } from "@/components/sections/CategoryShowcase";
import { FeatureShowcase } from "@/components/sections/FeatureShowcase";
import { AboutSection } from "@/components/sections/AboutSection";
import { IndustriesServed } from "@/components/sections/IndustriesServed";
import { ClientLogos } from "@/components/sections/ClientLogos";
import { Testimonials } from "@/components/sections/Testimonials";
import { CapabilitiesSection } from "@/components/sections/CapabilitiesSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { VideoBanner } from "@/components/sections/VideoBanner";
import { GallerySection } from "@/components/sections/GallerySection";
import { PricingSection } from "@/components/sections/PricingSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { BlogSection } from "@/components/sections/BlogSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <div className="flex flex-col gap-0">
      {/* <Hero /> */}
      <ModelBanner />
      <AboutSection />
      <FeatureShowcase />
      <CategoryShowcase />
      <IndustriesServed />
      <ClientLogos />
      <Testimonials />
      {/* <ProcessSection /> */}
      {/* <CapabilitiesSection /> */}
      {/* <GallerySection /> */}
      {/* <VideoBanner /> */}
      {/* <PricingSection /> */}
      <FaqSection />
      <BlogSection />
      <ContactSection />
    </div>
  );
}
