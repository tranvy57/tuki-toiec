"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { HeroSection } from "./hero-section"
import { PerformanceSummary } from "./performance-summary"
import { DetailedPartAnalysis } from "./detailed-part-analysis"
import { AnswerReview } from "./answer-review"
import { AIAnalysis } from "./ai-analysis"
import { StudyRecommendations } from "./study-recommendations"
import { FixedActionBar } from "./fixed-action-bar"
import { SummaryInfo } from "./summary-info"
import { usePracticeTest } from "@/hooks"
import { getDurationString } from "@/utils"

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

interface TestResultPageProps {
  data: TestData
}

export function TestResultPage({ data }: TestResultPageProps) {
  const [activeSection, setActiveSection] = useState<"analysis" | "review">("analysis")
  const { resultTest } = usePracticeTest();

  if(resultTest === null) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50/30 to-white pb-24">
      <HeroSection data={resultTest} />

      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
          <div className="lg:col-span-1">
            <SummaryInfo
              totalQuestions={200}
              correctCount={resultTest.accuracy || 0}
              duration={getDurationString(resultTest.startedAt, resultTest.finishAt) || "00:00:00"}
            />
          </div>

          <div className="lg:col-span-4">
            <PerformanceSummary data={resultTest} />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <DetailedPartAnalysis data={resultTest} />
        </motion.div>

        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <AnswerReview parts={data.parts} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <AIAnalysis analysis={data.aiAnalysis} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <StudyRecommendations recommendations={data.recommendations} />
        </motion.div> */}
      </div>

      {/* <FixedActionBar /> */}
    </div>
  );
}
