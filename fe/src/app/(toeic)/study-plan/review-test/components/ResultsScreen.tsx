"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { HeroSection } from "@/components/result/hero-section"
import { PerformanceSummary } from "@/components/result/performance-summary"
import { DetailedPartAnalysis } from "@/components/result/detailed-part-analysis"
import { AnswerReview } from "@/components/result/answer-review"
import { AIAnalysis } from "@/components/result/ai-analysis"
import { StudyRecommendations } from "@/components/result/study-recommendations"
import { FixedActionBar } from "@/components/result/fixed-action-bar"
import { SummaryInfo } from "@/components/result/summary-info"
import { usePracticeTest } from "@/hooks"
import { getDurationString } from "@/utils"
import { ResultTestResponse } from "@/types"
import { TestResults, Question } from "../types"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export interface TestData {
  testTitle: string
  totalScore: number
  listeningScore: number
  readingScore: number
  accuracy: number
  correctCount: number
  incorrectCount: number
  skippedCount: number
  duration: string
  testDate: string
  parts: {
    part: number
    name: string
    accuracy: number
    details: {
      type: string
      correct: number
      wrong: number
      skipped: number
      questionIds: number[]
    }[]
  }[]
  aiAnalysis: string
  recommendations: { icon: string; title: string; description: string }[]
}

interface ResultsScreenProps {
  onRetake: () => void
}

export function ResultsScreen({ onRetake }: ResultsScreenProps) {
  const [activeSection, setActiveSection] = useState<"analysis" | "review">("analysis")
  const { resultTest, fullTest } = usePracticeTest();
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [reviewData, setReviewData] = useState<any>(null); // Store raw review data
  const router = useRouter();

  console.log("TEST", resultTest)
  console.log("FULL_TEST", fullTest)

  // Store the raw review data from sessionStorage or state management
  useEffect(() => {
    // Try to get review data from localStorage or other storage
    const storedReviewData = localStorage.getItem('review-result');
    if (storedReviewData) {
      setReviewData(JSON.parse(storedReviewData));
    }

    // Check if plan was just created and show success message
    const planCreated = localStorage.getItem('plan-created');
    if (planCreated === 'true') {
      toast.success("Kế hoạch học tập của bạn đã được tạo thành công. Bạn có thể xem chi tiết kế hoạch ngay bây giờ.");
      // Clear the flag after showing the message
      localStorage.removeItem('plan-created');
    }

    // Cleanup function to remove data when component unmounts
    return () => {
      // Uncomment if you want to clean up on unmount
      // localStorage.removeItem('review-result');
    };
  }, []);

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/analyze-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resultTest || fullTest),
      });

      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      console.error("AI analysis error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Use resultTest if available (after test completion), otherwise fallback to fullTest for initial display
  const testData = resultTest || (fullTest ? {
    id: fullTest.id,
    mode: "practice" as const,
    parts: fullTest.parts,
    startedAt: new Date().toISOString(),
    finishAt: new Date().toISOString(),
    totalScore: 0, // Default when no results yet
    listeningScore: null,
    readingScore: null,
    accuracy: 0,
    correctCount: 0,
    wrongCount: 0,
    skippedCount: 0,
    status: "submitted" as const,
  } : null);

  if (!testData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold text-gray-700">Đang tải kết quả...</div>
          <div className="text-gray-500 mt-2">Vui lòng đợi trong giây lát</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50/30 to-white pb-24">
      <HeroSection data={testData} />

      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
          <div className="lg:col-span-1">
            <SummaryInfo
              totalQuestions={reviewData?.totalQuestions || 200}
              correctCount={testData.correctCount || 0}
              duration={
                getDurationString(testData.startedAt, testData.finishAt) ||
                "02:00:00"
              }
            />
          </div>

          <div className="lg:col-span-4">
            <PerformanceSummary data={testData} />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <DetailedPartAnalysis data={testData} />
        </motion.div>

        {/* Skills Proficiency Section */}
        {/* {reviewData?.updatedSkills && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="bg-white rounded-xl p-6 shadow-lg border"
          >
            <h3 className="text-xl font-semibold mb-4">Năng lực các kỹ năng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto">
              {reviewData.updatedSkills.slice(0, 12).map((skill: any, index: number) => {
                // Try to find skill name from the parts data
                let skillName = `Skill ${index + 1}`;

                // Look for skill name in the parts structure
                if (reviewData.parts) {
                  for (const part of reviewData.parts) {
                    for (const group of part.groups || []) {
                      for (const question of group.questions || []) {
                        const foundSkill = question.questionTags?.find((tag: any) =>
                          tag.skill?.id === skill.skillId
                        );
                        if (foundSkill) {
                          skillName = foundSkill.skill.name;
                          break;
                        }
                      }
                    }
                  }
                }

                const proficiencyPercent = Math.round(skill.proficiency * 100);
                const proficiencyColor = proficiencyPercent >= 70 ? 'text-green-600' :
                  proficiencyPercent >= 50 ? 'text-yellow-600' : 'text-red-600';
                const bgColor = proficiencyPercent >= 70 ? 'bg-green-100' :
                  proficiencyPercent >= 50 ? 'bg-yellow-100' : 'bg-red-100';

                return (
                  <div key={skill.skillId} className={`p-3 rounded-lg border ${bgColor}`}>
                    <div className="text-sm font-medium text-gray-800 mb-1 line-clamp-2" title={skillName}>
                      {skillName}
                    </div>
                    <div className={`text-lg font-bold ${proficiencyColor}`}>
                      {proficiencyPercent}%
                    </div>
                  </div>
                );
              })}
            </div>
            {reviewData.updatedSkills.length > 12 && (
              <div className="mt-3 text-sm text-gray-500 text-center">
                Và {reviewData.updatedSkills.length - 12} kỹ năng khác...
              </div>
            )}
          </motion.div>
        )} */}

        {/* Review specific content */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-lg border"
        >
          <h3 className="text-xl font-semibold mb-4">Kết quả chi tiết</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{testData.correctCount || 0}</div>
              <div className="text-sm text-gray-600">Câu đúng</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{testData.wrongCount || 0}</div>
              <div className="text-sm text-gray-600">Câu sai</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{testData.accuracy || 0}%</div>
              <div className="text-sm text-gray-600">Độ chính xác</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{testData.totalScore || 0}</div>
              <div className="text-sm text-gray-600">Điểm tổng</div>
            </div>
          </div>
        </motion.div> */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Đang phân tích..." : "Phân tích bằng AI"}
          </button>

          {/* Khi có kết quả AI, hiển thị component */}
          {analysis && (
            <div className="mt-8">
              <AIAnalysis analysis={analysis} />
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <StudyRecommendations recommendations={[
            {
              icon: "📚",
              title: "Ôn luyện thêm",
              description: "Gợi ý học tập dựa trên kết quả của bạn"
            }
          ]} />
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={onRetake}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
          >
            Làm lại bài test
          </button>
          <button
            onClick={() => router.push('/study-plan')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Xem kế hoạch học tập
          </button>
        </motion.div>
      </div>

      {/* Uncomment when needed
      <FixedActionBar />
      */}
    </div>
  );
}
