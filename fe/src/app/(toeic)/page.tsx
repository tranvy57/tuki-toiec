"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  Headphones,
  TrendingUp,
  Target,
  Star,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { HeroSection } from "@/components/dashboard/hero-section";
import FeaturesSection from "@/components/dashboard/feature-section";
import VocabularySection from "@/components/dashboard/vocabulary-section";
import PricingSection from "@/components/dashboard/pricing-section";
import { CTASection } from "@/components/dashboard/cta-section";

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
