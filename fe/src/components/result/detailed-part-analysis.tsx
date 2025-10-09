"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle, Circle } from "lucide-react";
import { ResultTestResponse, SubmitPart } from "@/types";


export function DetailedPartAnalysis({ data }: { data: ResultTestResponse }) {
  const [activeTab, setActiveTab] = useState("overview");


  const renderQuestionCircles = (
    questions: { isCorrect: boolean | null }[]
  ) => {
    return (
      <div className="flex flex-wrap gap-1">
        {questions.map((q, index) => {
          if (q.isCorrect === true) {
            return (
              <CheckCircle2
                key={index}
                className="w-4 h-4 text-green-500"
              />
            );
          } else if (q.isCorrect === false) {
            return (
              <XCircle
                key={index}
                className="w-4 h-4 text-red-500"
              />
            );
          } else {
            return (
              <Circle
                key={index}
                className="w-4 h-4 text-gray-300"
              />
            );
          }
        })}
      </div>
    );
  };


  const renderPartTable = (part: SubmitPart) => {
    const allQuestions = part.groups.flatMap((g) => g.questions);

    const groupedBySkill = allQuestions.reduce((acc, q) => {
      const skill = q.skills?.[0]?.name || "Unknown Skill";
      console.log(q.skills);
      if (!acc[skill]) acc[skill] = [];
      acc[skill].push(q);
      return acc;
    }, {} as Record<string, typeof allQuestions>);

    const details = Object.entries(groupedBySkill).map(
      ([skillName, questions]) => {
        const correct = questions.filter((q) => q.isCorrect === true).length;
        const wrong = questions.filter((q) => q.isCorrect === false).length;
        const skipped = questions.filter((q) => q.isCorrect == null).length;
        return { skillName, correct, wrong, skipped, questions };
      }
    );

    const totalCorrect = allQuestions.filter(
      (q) => q.isCorrect === true
    ).length;
    const totalWrong = allQuestions.filter((q) => q.isCorrect === false).length;
    const totalSkipped = allQuestions.filter((q) => q.isCorrect == null).length;
    const partAccuracy =
      allQuestions.length > 0 ? (totalCorrect / allQuestions.length) * 100 : 0;

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Kỹ năng
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
            {details.map((detail, index) => {
              const total = detail.correct + detail.wrong + detail.skipped;
              const accuracy =
                total > 0 ? Math.round((detail.correct / total) * 100) : 0;
              return (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-pink-50 transition-colors"
                >
                  <td className="py-3 px-4 text-sm text-gray-900">
                    [Part {part.partNumber}] {detail.skillName}
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
                  <td className="py-3 px-4">
                    {renderQuestionCircles(detail.questions)}
                  </td>
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
                {Math.round(partAccuracy)}%
              </td>
              <td className="py-3 px-4"></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };



  const renderOverview = () => {
    // Tính accuracy cho từng part
    const partsWithAccuracy = data.parts.map((part) => {
      const allQuestions = part.groups.flatMap((group) => group.questions);
      const total = allQuestions.length;
      const correct = allQuestions.filter((q) => q.isCorrect).length;
      const accuracy = total > 0 ? (correct / total) * 100 : 0;
      return { ...part, accuracy };
    });

    // Render UI
    return (
      <div className="space-y-4">
        {partsWithAccuracy.map((part) => (
          <div
            key={part.partNumber}
            className="border-b border-gray-100 pb-4 last:border-0"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">
                Part {part.partNumber}
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
          {data.parts.map((part) => (
            <TabsTrigger key={part.partNumber} value={`part-${part.partNumber}`}>
              Part {part.partNumber}
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

          {data.parts.map((part) => (
            <TabsContent
              key={part.partNumber}
              value={`part-${part.partNumber}`}
              className="mt-0"
            >
              <motion.div
                key={`part-${part.partNumber}`}
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
