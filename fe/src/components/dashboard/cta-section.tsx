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
    <section className="relative py-22 px-4 sm:px-6 lg:px-8 overflow-hidden ">
      <div className="w-[70%] mx-auto relative py-14 ">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-400 via-pink-400 to-rose-400 rounded-4xl" />

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 grid-pattern opacity-30 " />

        {/* Animated Particles */}
        <div className="absolute inset-0">
          {particles.map((p, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{ left: p.left, top: p.top }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Floating Icons */}
          <div className="absolute inset-0 pointer-events-none">
            {floatingIcons.map(({ Icon, delay, x, y }, index) => (
              <motion.div
                key={index}
                className="absolute left-1/2 top-1/2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.2, 1],
                  x: [x, x + 10, x],
                  y: [y, y - 10, y],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay,
                }}
              >
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl">
                  <Icon className="w-8 h-8 text-white" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Bắt đầu hành trình TOEIC của bạn ngay hôm nay
            </h2>

            <p className="text-xl sm:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              Học thông minh với AI, tiến bộ nhanh chóng, và đạt điểm số mơ ước
            </p>
            <div className="justify-center flex">
              <RippleButton
                rippleColor="var(--color-8)"
                className=" bg-white text-pink-400 hover:bg-gray-50 rounded-xl px-10 py-5 text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300"
              >
                Dùng thử miễn phí ngay
              </RippleButton>
            </div>

            <p className="mt-6 text-white/80 text-sm">
              Không cần thẻ tín dụng • Hủy bất cứ lúc nào
            </p>
          </motion.div>

          {/* Bottom Glow Effect */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-white/10 blur-3xl rounded-full pointer-events-none" />
        </div>
      </div>
    </section>
  );
};
