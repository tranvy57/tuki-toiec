"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle, Circle } from "lucide-react";

interface PartDetail {
  type: string;
  correct: number;
  wrong: number;
  skipped: number;
  questionIds: number[];
}

interface Part {
  part: number;
  name: string;
  accuracy: number;
  details: PartDetail[];
}

interface DetailedPartAnalysisProps {
  parts: Part[];
}

export function DetailedPartAnalysis({ parts }: DetailedPartAnalysisProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const renderQuestionCircles = (detail: PartDetail) => {
    const total = detail.correct + detail.wrong + detail.skipped;
    return (
      <div className="flex flex-wrap gap-1">
        {Array.from({ length: detail.correct }).map((_, i) => (
          <CheckCircle2
            key={`correct-${i}`}
            className="w-4 h-4 text-green-500"
          />
        ))}
        {Array.from({ length: detail.wrong }).map((_, i) => (
          <XCircle key={`wrong-${i}`} className="w-4 h-4 text-red-500" />
        ))}
        {Array.from({ length: detail.skipped }).map((_, i) => (
          <Circle key={`skipped-${i}`} className="w-4 h-4 text-gray-300" />
        ))}
      </div>
    );
  };

  const renderPartTable = (part: Part) => {
    const totalCorrect = part.details.reduce((sum, d) => sum + d.correct, 0);
    const totalWrong = part.details.reduce((sum, d) => sum + d.wrong, 0);
    const totalSkipped = part.details.reduce((sum, d) => sum + d.skipped, 0);

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Loại
              </th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                Đúng
              </th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                Sai
              </th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                Bỏ qua
              </th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                Độ chính xác
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Câu hỏi
              </th>
            </tr>
          </thead>
          <tbody>
            {part.details.map((detail, index) => {
              const total = detail.correct + detail.wrong + detail.skipped;
              const accuracy =
                total > 0 ? Math.round((detail.correct / total) * 100) : 0;
              return (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-pink-50 transition-colors"
                >
                  <td className="py-3 px-4 text-sm text-gray-900">
                    [Part {part.part}] {detail.type}
                  </td>
                  <td className="text-center py-3 px-4 text-sm text-green-600 font-medium">
                    {detail.correct}
                  </td>
                  <td className="text-center py-3 px-4 text-sm text-red-600 font-medium">
                    {detail.wrong}
                  </td>
                  <td className="text-center py-3 px-4 text-sm text-gray-400 font-medium">
                    {detail.skipped}
                  </td>
                  <td className="text-center py-3 px-4 text-sm font-semibold text-gray-900">
                    {accuracy}%
                  </td>
                  <td className="py-3 px-4">{renderQuestionCircles(detail)}</td>
                </tr>
              );
            })}
            <tr className="bg-gray-50 font-semibold">
              <td className="py-3 px-4 text-sm text-gray-900">Tổng cộng</td>
              <td className="text-center py-3 px-4 text-sm text-green-600">
                {totalCorrect}
              </td>
              <td className="text-center py-3 px-4 text-sm text-red-600">
                {totalWrong}
              </td>
              <td className="text-center py-3 px-4 text-sm text-gray-400">
                {totalSkipped}
              </td>
              <td className="text-center py-3 px-4 text-sm text-gray-900">
                {Math.round(part.accuracy)}%
              </td>
              <td className="py-3 px-4"></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderOverview = () => {
    return (
      <div className="space-y-4">
        {parts.map((part) => (
          <div
            key={part.part}
            className="border-b border-gray-100 pb-4 last:border-0"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">
                Part {part.part}: {part.name}
              </h4>
              <span className="text-sm font-semibold text-primary">
                {Math.round(part.accuracy)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary to-primary-2 h-2 rounded-full transition-all duration-500"
                style={{ width: `${part.accuracy}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border border-primary/10 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        📘 Phân tích Chi tiết từng Phần
      </h2>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 flex-wrap h-auto">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          {parts.map((part) => (
            <TabsTrigger key={part.part} value={`part-${part.part}`}>
              Part {part.part}
            </TabsTrigger>
          ))}
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent value="overview" className="mt-0">
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {renderOverview()}
            </motion.div>
          </TabsContent>

          {parts.map((part) => (
            <TabsContent
              key={part.part}
              value={`part-${part.part}`}
              className="mt-0"
            >
              <motion.div
                key={`part-${part.part}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {renderPartTable(part)}
              </motion.div>
            </TabsContent>
          ))}
        </AnimatePresence>
      </Tabs>
    </Card>
  );
}
