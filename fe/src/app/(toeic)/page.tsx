"use client";

import { CTASection } from "@/components/dashboard/cta-section";
import FeaturesSection from "@/components/dashboard/feature-section";
import { HeroSection } from "@/components/dashboard/hero-section";
import PricingSection from "@/components/dashboard/pricing-section";
import VocabularySection from "@/components/dashboard/vocabulary-section";

export default function HomePage() {
  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 via-white to-slate-50/50">
      <HeroSection />
      <FeaturesSection />
      <VocabularySection />
      <PricingSection />
      <CTASection />
    </div>
  );
}
