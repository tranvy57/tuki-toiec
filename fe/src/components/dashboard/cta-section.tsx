"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BookOpen, Headphones, TrendingUp, Sparkles } from "lucide-react";
import { RippleButton } from "../ui/ripple-button";

const floatingIcons = [
  { Icon: BookOpen, delay: 0, x: -20, y: -30 },
  { Icon: Headphones, delay: 0.2, x: 20, y: -20 },
  { Icon: TrendingUp, delay: 0.4, x: -30, y: 20 },
  { Icon: Sparkles, delay: 0.6, x: 30, y: 30 },
];

export const CTASection = () => {
  const [particles, setParticles] = useState<
    { left: string; top: string; duration: number; delay: number }[]
  >([]);

  useEffect(() => {
    // generate random positions & timing once on client
    const generated = Array.from({ length: 20 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
    }));
    setParticles(generated);
  }, []);

  return (
    <section className="relative py-22 px-4 sm:px-6 lg:px-8 overflow-hidden "></section>
  );
};
