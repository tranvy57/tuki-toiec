"use client";

import { motion } from "framer-motion";
import { AnimatedCounter } from "./animated-counter";
import { FloatingParticles } from "./floating-particles";
import { Badge } from "@/components/ui/badge";
import type { TestData } from "./test-result-page";

interface HeroSectionProps {
  data: TestData;
}

function getBandLevel(score: number): string {
  if (score >= 945) return "Chuyên gia";
  if (score >= 785) return "Nâng cao";
  if (score >= 550) return "Trung cấp";
  if (score >= 225) return "Cơ bản";
  return "Sơ cấp";
}

export function HeroSection({ data }: HeroSectionProps) {
  const bandLevel = getBandLevel(data.totalScore);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden bg-gradient-to-r from-[#ffb5a7] via-[#fcd5ce] to-[#fff0f5] py-20"
    >
      <FloatingParticles />

      <div className="container relative z-10 mx-auto px-4 text-center flex flex-col items-center">
        {/* Band badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15, type: "spring" }}
        >
          <Badge className="mb-5 bg-white/90 text-primary border border-primary/10 text-base font-semibold px-4 py-1.5 shadow-sm">
            {bandLevel}
          </Badge>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-2xl md:text-3xl font-medium text-gray-800 mb-3"
        >
          Điểm TOEIC của bạn
        </motion.h1>

        {/* Main score */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.6,
            delay: 0.35,
            type: "spring",
            stiffness: 180,
          }}
          className="mb-10"
        >
          <div className="text-7xl md:text-8xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">
            <AnimatedCounter value={data.totalScore} duration={2000} />
          </div>
        </motion.div>

        {/* Sub scores */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-5 justify-center items-center"
        >
          {/* Listening */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-5 shadow-md border border-white/60 min-w-[160px] hover:shadow-lg transition-all duration-300">
            <div className="text-3xl mb-1">🎧</div>
            <div className="text-sm text-gray-600 mb-1 font-medium">Nghe</div>
            <div className="text-2xl font-bold text-gray-900">
              <AnimatedCounter value={data.listeningScore} duration={2000} />
            </div>
          </div>

          {/* Reading */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-5 shadow-md border border-white/60 min-w-[160px] hover:shadow-lg transition-all duration-300">
            <div className="text-3xl mb-1">📖</div>
            <div className="text-sm text-gray-600 mb-1 font-medium">Đọc</div>
            <div className="text-2xl font-bold text-gray-900">
              <AnimatedCounter value={data.readingScore} duration={2000} />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
