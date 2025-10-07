"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface AIAnalysisProps {
  analysis: string;
}

export function AIAnalysis({ analysis }: AIAnalysisProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <Card className="bg-gradient-to-br from-pink-50 via-rose-50 to-white border border-primary/20 p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <Sparkles className="w-6 h-6 text-primary" />
            <motion.div
              className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Phân tích Kết quả bằng AI
          </h2>
        </div>

        <p className="text-gray-700 leading-relaxed text-base">{analysis}</p>
      </Card>
    </motion.div>
  );
}
