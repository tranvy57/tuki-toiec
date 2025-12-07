"use client";

import { Card } from "@/components/ui/card";
import { CheckCircle, Target, Clock } from "lucide-react";

interface SummaryInfoProps {
  totalQuestions: number;
  correctCount: number;
  duration: string;
}

export function SummaryInfo({
  totalQuestions,
  correctCount,
  duration,
}: SummaryInfoProps) {
  const accuracy = totalQuestions
    ? ((correctCount / totalQuestions) * 100).toFixed(1)
    : "0.0";

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm p-5 rounded-xl hidden">
      <div className="space-y-4 text-gray-700 text-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-primary" />
            <span className="font-medium">Kết quả làm bài</span>
          </div>
          <span className="font-bold text-gray-900">0/{totalQuestions}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <span className="font-medium">Độ chính xác</span>
          </div>
          <span className="font-bold text-gray-900">{accuracy}%</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="font-medium">Thời gian hoàn thành</span>
          </div>
          <span className="font-bold text-gray-900">{duration}</span>
        </div>
      </div>
    </Card>
  );
}
