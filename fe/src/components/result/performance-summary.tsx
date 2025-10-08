"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import type { TestData } from "./test-result-page";
import { CheckCircle2, XCircle, MinusCircle, Flag } from "lucide-react";
import { ResultTestResponse } from "@/types";

export function PerformanceSummary({ data }: { data: ResultTestResponse }) {
  const stats = [
    {
      icon: CheckCircle2,
      label: "Câu trả lời đúng",
      value: data.correctCount,
      subtitle: "câu trả lời chính xác",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      icon: XCircle,
      label: "Câu trả lời sai",
      value: data.wrongCount,
      subtitle: "câu trả lời không chính xác",
      color: "text-red-500",
      bg: "bg-red-50",
    },
    {
      icon: MinusCircle,
      label: "Bỏ qua",
      value: data.skippedCount,
      subtitle: "câu hỏi không trả lời",
      color: "text-gray-500",
      bg: "bg-gray-50",
    },
    {
      icon: Flag,
      label: "Tổng điểm",
      value: data.totalScore,
      subtitle: "điểm TOEIC",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card
            className={`rounded-xl shadow-sm hover:shadow-md border border-gray-100 transition-all ${stat.bg} py-5 text-center`}
          >
            <div className="flex flex-col items-center justify-center space-y-2">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
              <div className="text-base font-medium text-gray-700">
                {stat.label}
              </div>
              <div className="text-3xl font-extrabold text-gray-900">
                {stat.value}
              </div>
              <div className="text-xs text-gray-500">{stat.subtitle}</div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
