"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface AIAnalysisProps {
  analysis: {
    summary?: {
      totalScore?: number;
      listeningScore?: number;
      readingScore?: number;
      accuracy?: string;
      comment?: string;
    };
    weakSkills?: string[];
    mistakePatterns?: string[];
    recommendations?: string[];
  };
}

export function AIAnalysis({ analysis }: AIAnalysisProps) {
  const { summary, weakSkills, mistakePatterns, recommendations } =
    analysis || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <Card className="bg-gradient-to-br from-pink-50 via-rose-50 to-white border border-primary/20 p-6 shadow-lg rounded-2xl">
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

        {/* Tổng quan */}
        {summary && (
          <div className="mb-6">
            <h3 className="font-semibold text-lg text-primary mb-2">
              Tổng quan
            </h3>
            <p className="text-gray-700">
              Điểm tổng: <b>{summary.totalScore ?? "—"}</b> | Listening:{" "}
              <b>{summary.listeningScore ?? "—"}</b> | Reading:{" "}
              <b>{summary.readingScore ?? "—"}</b> | Accuracy:{" "}
              <b>{summary.accuracy ?? "—"}</b>
            </p>
            {summary.comment && (
              <p className="text-gray-600 italic mt-1">{summary.comment}</p>
            )}
          </div>
        )}

        {/* Kỹ năng yếu */}
        {weakSkills?.length ? (
          <div className="mb-6">
            <h3 className="font-semibold text-lg text-primary mb-2">
              Kỹ năng yếu
            </h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              {weakSkills.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* Mẫu lỗi thường gặp */}
        {mistakePatterns?.length ? (
          <div className="mb-6">
            <h3 className="font-semibold text-lg text-primary mb-2">
              Mẫu lỗi thường gặp
            </h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              {mistakePatterns.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* Gợi ý học tập */}
        {recommendations?.length ? (
          <div>
            <h3 className="font-semibold text-lg text-primary mb-2">
              Gợi ý học tập
            </h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              {recommendations.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </Card>
    </motion.div>
  );
}
