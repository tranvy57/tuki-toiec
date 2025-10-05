"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, BookOpen, Headphones, TrendingUp } from "lucide-react";

// MagicUI components thật sự có
import { AuroraText } from "@/components/ui/aurora-text";
import { RetroGrid } from "@/components/ui/retro-grid";
import { Particles } from "@/components/ui/particles";
import { SparklesText } from "../ui/sparkles-text";
import { RainbowButton } from "../ui/rainbow-button";
// import { Meteors } from "../ui/meteors";

export function HeroSection() {
  const color = "#FF5733"; // Màu cam sáng
  return (
    <section className="relative h-screen overflow-hidden px-4 py-20 md:py-32">
      <RetroGrid />
      <Particles
        className="absolute inset-0 z-0"
        quantity={75}
        ease={80}
        color={color}
        refresh
      />

      <div className="container relative z-10 mx-auto max-w-6xl">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-balance text-5xl font-bold leading-tight text-gray-900 md:text-6xl"
            >
              Cá nhân hóa lộ trình{" "}
              <SparklesText>
                <AuroraText className="px-2 text-6xl font-extrabold" colors={["#33CFFF", "#6A5CFF", "#FF6B6B"]}>
                  TOEIC
                </AuroraText>
              </SparklesText>
              của bạn
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg leading-relaxed text-gray-600 md:text-xl"
            >
              Học theo từng kỹ năng, luyện thi theo từng Part, theo dõi tiến bộ
              chi tiết. Nâng cao điểm số TOEIC của bạn với phương pháp học thông
              minh và hiệu quả.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <RainbowButton size="lg" variant={"primary"}>
                Bắt đầu học ngay
                <ChevronRight className="ml-2 h-5 w-5" />
              </RainbowButton>
              <Button
                size="lg"
                variant="outline"
                className="transition-transform duration-150 active:scale-95 active:opacity-80 rounded-lg"
              >
                Tìm hiểu thêm
              </Button>
            </motion.div>
          </motion.div>

          {/* Right illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative h-[350px] w-full max-w-full "
          >
            <FloatingIcon className="left-2/5">
              <BookOpen className="h-12 w-12 text-blue-600" />
            </FloatingIcon>
            <FloatingIcon className="right-1/12 top-1/4" delay={0.4}>
              <Headphones className="h-12 w-12 text-orange-500" />
            </FloatingIcon>
            <FloatingIcon className="bottom-1/6 left-1/2" delay={0.6}>
              <TrendingUp className="h-12 w-12 text-blue-600" />
            </FloatingIcon>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FloatingIcon({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      animate={{ y: [-12, 12, -12] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay,
      }}
      className={`absolute rounded-2xl bg-white p-6 shadow-xl ${className}`}
    >
      {children}
    </motion.div>
  );
}
