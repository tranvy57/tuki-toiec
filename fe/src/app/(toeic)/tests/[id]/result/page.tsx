"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { PartPerformance } from "../../../../../components/result/PartPerformance";
import { TabContent } from "../../../../../components/result/TabContent";
import { TestOverview } from "../../../../../components/result/TestOverview";
import { Recommendations } from "../../../../../components/result/Recommendations";
import { ScoreOverview } from "@/components/result/ScoreOverview";

interface QuestionResult {
  questionNumber: number;
  userAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
  isSkipped: boolean;
}

interface TestPart {
  partNumber: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedQuestions: number;
  accuracy: number;
  questions: QuestionResult[];
}

interface TestResult {
  totalScore: number | null;
  listeningScore: number | null;
  readingScore: number | null;
  duration: string;
  accuracy: number;
  totalCorrect: number;
  totalIncorrect: number;
  totalSkipped: number;
  totalQuestions: number;
  testDate: string;
  proficiencyLevel: string;
  parts: TestPart[];
}

const mockResult: TestResult = {
  totalScore: 850,
  listeningScore: 420,
  readingScore: 430,
  duration: "2h 15m",
  accuracy: 85.5,
  totalCorrect: 171,
  totalIncorrect: 25,
  totalSkipped: 4,
  totalQuestions: 200,
  testDate: "December 15, 2024",
  proficiencyLevel: "Advanced",
  parts: [
    {
      partNumber: 1,
      totalQuestions: 6,
      correctAnswers: 5,
      incorrectAnswers: 1,
      skippedQuestions: 0,
      accuracy: 83.3,
      questions: [
        {
          questionNumber: 1,
          userAnswer: "A",
          correctAnswer: "B",
          isCorrect: false,
          isSkipped: false,
        },
        {
          questionNumber: 2,
          userAnswer: "A",
          correctAnswer: "A",
          isCorrect: true,
          isSkipped: false,
        },
        {
          questionNumber: 3,
          userAnswer: "C",
          correctAnswer: "C",
          isCorrect: true,
          isSkipped: false,
        },
        {
          questionNumber: 4,
          userAnswer: "D",
          correctAnswer: "D",
          isCorrect: true,
          isSkipped: false,
        },
        {
          questionNumber: 5,
          userAnswer: "A",
          correctAnswer: "A",
          isCorrect: true,
          isSkipped: false,
        },
        {
          questionNumber: 6,
          userAnswer: "B",
          correctAnswer: "B",
          isCorrect: true,
          isSkipped: false,
        },
      ],
    },
    {
      partNumber: 2,
      totalQuestions: 25,
      correctAnswers: 22,
      incorrectAnswers: 2,
      skippedQuestions: 1,
      accuracy: 88.0,
      questions: Array.from({ length: 25 }, (_, i) => ({
        questionNumber: i + 7,
        userAnswer:
          i === 0
            ? "B"
            : i === 13
            ? null
            : ["A", "B", "C", "D"][Math.floor(Math.random() * 4)],
        correctAnswer: ["A", "B", "C", "D"][Math.floor(Math.random() * 4)],
        isCorrect: i !== 0 && i !== 7,
        isSkipped: i === 13,
      })),
    },
    {
      partNumber: 3,
      totalQuestions: 39,
      correctAnswers: 35,
      incorrectAnswers: 3,
      skippedQuestions: 1,
      accuracy: 89.7,
      questions: [],
    },
    {
      partNumber: 4,
      totalQuestions: 30,
      correctAnswers: 26,
      incorrectAnswers: 3,
      skippedQuestions: 1,
      accuracy: 86.7,
      questions: [],
    },
    {
      partNumber: 5,
      totalQuestions: 30,
      correctAnswers: 25,
      incorrectAnswers: 4,
      skippedQuestions: 1,
      accuracy: 83.3,
      questions: [],
    },
    {
      partNumber: 6,
      totalQuestions: 16,
      correctAnswers: 14,
      incorrectAnswers: 2,
      skippedQuestions: 0,
      accuracy: 87.5,
      questions: [],
    },
    {
      partNumber: 7,
      totalQuestions: 54,
      correctAnswers: 44,
      incorrectAnswers: 10,
      skippedQuestions: 0,
      accuracy: 81.5,
      questions: [],
    },
  ],
};

export default function TOEICResultPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<TestResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setResult(mockResult);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleGoHome = () => {
    router.push("/tests");
  };

  const handleReviewTest = () => {
    router.push("/test-results/review");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-foreground">
            {"Loading your TOEIC results..."}
          </p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Unable to load results
          </h2>
          <p className="text-muted-foreground mb-6">Please try again later</p>
          <Button onClick={handleGoHome}>Back to Tests</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ScoreOverview
        totalScore={result.totalScore || 0}
        listeningScore={result.listeningScore || 0}
        readingScore={result.readingScore || 0}
        levelLabel={result.proficiencyLevel}
      />

      <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
        <TestOverview
          duration={result.duration}
          accuracy={result.accuracy}
          testDate={result.testDate}
          totalCorrect={result.totalCorrect}
          totalIncorrect={result.totalIncorrect}
          totalSkipped={result.totalSkipped}
        />
        <PartPerformance parts={result.parts} />

        <TabContent parts={result.parts} />

        <Recommendations />
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-lg p-4">
        <div className="max-w-4xl mx-auto flex space-x-3">
          <Button
            variant="outline"
            onClick={handleReviewTest}
            className="flex-1 h-12 bg-transparent"
          >
            <Eye className="w-4 h-4 mr-2" />
            Review Answers
          </Button>

          <Button
            onClick={handleGoHome}
            className="flex-1 h-12 bg-primary hover:bg-primary/90"
          >
            Back to Tests
          </Button>
        </div>
      </div>
    </div>
  );
}
 
