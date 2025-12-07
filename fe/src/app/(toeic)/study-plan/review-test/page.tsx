"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Loader2 } from "lucide-react";
import { IntroScreen } from "./components/IntroScreen";
import { TestScreen } from "./components/TestScreen";
import { ResultsScreen } from "./components/ResultsScreen";
import { ReviewTestStage, TestResults, Question, Group, ApiTestData, ApiPart, ApiGroup } from "./types";
import { TOEIC_PARTS, BAND_SCORE_MAPPING, generateRecommendations } from "./constants";
import { useStartTestPractice, useSubmitTestReview, useAddAttemptAnswer } from "@/api";
import { usePracticeTest } from "@/hooks";
import api from "@/libs/axios-config";

// Helper function to convert API data to Question format
const convertApiDataToGroups = (apiData: ApiTestData): Group[] => {
  const groups: Group[] = [];
  let globalQuestionNumber = 1; // Global counter for question numbers

  // Sort parts by partNumber first
  const sortedParts = [...apiData.parts].sort((a, b) => a.partNumber - b.partNumber);

  sortedParts.forEach((part: ApiPart) => {
    // Sort groups by orderIndex within each part
    const sortedGroups = [...part.groups].sort((a, b) => a.orderIndex - b.orderIndex);

    sortedGroups.forEach((apiGroup: ApiGroup) => {
      const questions: Question[] = apiGroup.questions.map((apiQuestion) => {
        // Extract options from answers array
        const options = apiQuestion.answers.map(answer => answer.content);
        // Extract answer IDs
        const answerIds = apiQuestion.answers.map(answer => answer.id);

        // Find correct answer index
        const correctAnswerIndex = apiQuestion.answers.findIndex(answer => answer.isCorrect);

        // Use paragraphEn for Part 1 & 2, content for others
        let questionText = apiQuestion.content;
        if (part.partNumber <= 2 && apiGroup.paragraphEn) {
          questionText = "Choose the correct description/response.";
        }

        const question = {
          id: apiQuestion.id,
          part: part.partNumber,
          partName: getPartName(part.partNumber),
          question: questionText,
          options: options,
          answerIds: answerIds,
          correctAnswer: correctAnswerIndex,
          explanation: apiQuestion.explanation || undefined,
          questionNumber: globalQuestionNumber++, // Use global counter and increment
          groupId: apiGroup.id
        };

        return question;
      });

      const group: Group = {
        id: apiGroup.id,
        partNumber: part.partNumber,
        partName: getPartName(part.partNumber),
        orderIndex: apiGroup.orderIndex,
        audioUrl: apiGroup.audioUrl || undefined,
        imageUrl: apiGroup.imageUrl || undefined,
        paragraphEn: apiGroup.paragraphEn || undefined,
        paragraphVn: apiGroup.paragraphVn || undefined,
        questions: questions
      };

      groups.push(group);
    });
  });

  // Sort by part number first, then by orderIndex within each part
  const sortedGroups = groups.sort((a, b) => {
    if (a.partNumber !== b.partNumber) {
      return a.partNumber - b.partNumber;
    }
    return a.orderIndex - b.orderIndex;
  });

  return sortedGroups;
};

// Helper function to convert groups to flat questions array for compatibility
const convertGroupsToQuestions = (groups: Group[]): Question[] => {
  const questions: Question[] = [];
  groups.forEach(group => {
    questions.push(...group.questions);
  });
  return questions;
};

// Helper function to get part name
const getPartName = (partNumber: number): string => {
  const partNames = {
    1: "Pictures",
    2: "Question-Response",
    3: "Conversations",
    4: "Talks",
    5: "Incomplete Sentences",
    6: "Text Completion",
    7: "Reading Comprehension"
  };
  return partNames[partNumber as keyof typeof partNames] || `Part ${partNumber}`;
};

interface ReviewTestPageProps {
  onComplete?: (results: TestResults) => void;
}

export default function ReviewTestPage({ onComplete }: ReviewTestPageProps) {
  const [stage, setStage] = useState<ReviewTestStage>("intro");
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const [testResults, setTestResults] = useState<TestResults | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]); // Flattened for compatibility

  const { mutate: startTest, isPending, isSuccess } = useStartTestPractice();
  const { mutate: submitReview, isPending: isSubmittingReview } = useSubmitTestReview();
  const { mutate: addAttemptAnswer } = useAddAttemptAnswer();
  const { fullTest, setFullTest, setResultTest } = usePracticeTest();

  const handleStart = () => {
    startTest({ mode: "review" }, {
      onSuccess: (data) => {
        setFullTest(data);
        const convertedGroups = convertApiDataToGroups(data);
        setGroups(convertedGroups);

        const flatQuestions = convertGroupsToQuestions(convertedGroups);
        setQuestions(flatQuestions);

        setTimeout(() => {
          setStage("test");
        }, 800);
      },
      onError: (error) => {
        console.error("Failed to start test:", error);
      }
    });
  };
  const currentGroup = groups[currentGroupIndex];
  const totalGroups = groups.length;

  const handleAnswerForQuestion = (questionIndex: number, optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const handleGroupSelect = (groupIndex: number) => {
    setCurrentGroupIndex(groupIndex);
  };

  const handleNext = () => {
    if (currentGroupIndex < totalGroups - 1) {
      setCurrentGroupIndex(prev => prev + 1);
    } else {
      // Last group, submit test
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentGroupIndex > 0) {
      setCurrentGroupIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    if (fullTest?.id) {
      submitReview(fullTest.id, {
        onSuccess: async (reviewResult) => {
          console.log("Review result:", reviewResult);

          // Transform the review result into ResultTestResponse format for store compatibility
          const transformedResult = {
            id: reviewResult.attemptId,
            mode: "practice" as const,
            parts: reviewResult.parts,
            startedAt: new Date().toISOString(),
            finishAt: new Date().toISOString(),
            totalScore: reviewResult.score,
            listeningScore: null,
            readingScore: null,
            accuracy: Math.round((reviewResult.correctCount / reviewResult.totalQuestions) * 100),
            correctCount: reviewResult.correctCount,
            wrongCount: reviewResult.totalQuestions - reviewResult.correctCount,
            skippedCount: 0,
            status: "submitted" as const,
          };

          // Store raw review data for access in components
          localStorage.setItem('review-result', JSON.stringify(reviewResult));

          // Save the transformed result to store
          setResultTest(transformedResult);

          // Also calculate local results for compatibility
          calculateResults();

          // Automatically create study plan after successful test submission
          try {
            const planResponse = await api.post("/plans/my-plan");
            console.log("Study plan created:", planResponse.data);
            localStorage.setItem('plan-created', 'true');
          } catch (error) {
            console.error("Failed to create study plan:", error);
            // Don't block the flow if plan creation fails
          }

          setStage("results");
          setIsSubmitting(false);
        },
        onError: (error) => {
          console.error("Failed to submit test review:", error);
          // Fallback to local calculation on error
          calculateResults();
          setStage("results");
          setIsSubmitting(false);
        }
      });
    } else {
      console.error("No test ID available for submission");
      // Fallback to local calculation
      calculateResults();
      setStage("results");
      setIsSubmitting(false);
    }
  };

  const calculateResults = () => {
    const correctAnswers = questions.reduce((count, question, index) => {
      return count + (answers[index] === question.correctAnswer ? 1 : 0);
    }, 0);

    const accuracy = Math.round((correctAnswers / questions.length) * 100);
    const scoreMapping = BAND_SCORE_MAPPING[correctAnswers] || BAND_SCORE_MAPPING[0];

    const results: TestResults = {
      totalQuestions: questions.length,
      correctAnswers,
      incorrectAnswers: questions.length - correctAnswers,
      accuracy,
      estimatedBand: scoreMapping.band,
      level: scoreMapping.level,
      recommendations: generateRecommendations(correctAnswers),
      weakAreas: identifyWeakAreas(),
      strongAreas: identifyStrongAreas(),
    };

    setTestResults(results);
    onComplete?.(results);
  };

  const identifyWeakAreas = () => {
    const partResults = questions.map((q, index) => ({
      part: q.part,
      correct: answers[index] === q.correctAnswer
    }));

    const weakParts = TOEIC_PARTS.filter(part => {
      const partQuestions = partResults.filter(r => r.part === part.id);
      const correctCount = partQuestions.filter(r => r.correct).length;
      return partQuestions.length > 0 && correctCount / partQuestions.length < 0.7;
    });

    return weakParts.slice(0, 3);
  };

  const identifyStrongAreas = () => {
    const partResults = questions.map((q, index) => ({
      part: q.part,
      correct: answers[index] === q.correctAnswer
    }));

    const strongParts = TOEIC_PARTS.filter(part => {
      const partQuestions = partResults.filter(r => r.part === part.id);
      const correctCount = partQuestions.filter(r => r.correct).length;
      return partQuestions.length > 0 && correctCount / partQuestions.length >= 0.7;
    });

    return strongParts.slice(0, 3);
  };

  const handleRetake = () => {
    setStage("intro");
    setCurrentGroupIndex(0);
    setAnswers({});
    setTestResults(null);
    setIsSubmitting(false);
  };



  // Get current group for display
  const currentGroupData = groups[currentGroupIndex];

  // Expose helper for demo/testing
  useEffect(() => {
    // @ts-ignore
    window.autoFill = async (delay = 100) => {
      console.log("🚀 Starting auto-fill with backend sync...");

      if (questions.length === 0) {
        console.warn("No questions loaded yet!");
        return;
      }

      // 1. Iterate and fill answers
      let count = 0;
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (q.answerIds && q.answerIds.length > 0) {
          // Select first answer (index 0)
          const optionIndex = 0;
          const answerId = q.answerIds[optionIndex];

          // Update local state
          setAnswers(prev => ({
            ...prev,
            [i]: optionIndex
          }));

          // Sync with backend
          if (fullTest?.id) {
            addAttemptAnswer({
              attemptId: fullTest.id,
              questionId: q.id,
              answerId: answerId
            });
          }

          count++;
          console.log(`Filled question ${i + 1}/${questions.length}`);

          if (delay > 0) {
            await new Promise(r => setTimeout(r, delay));
          }
        }
      }

      // 2. Jump to last group
      if (groups.length > 0) {
        setCurrentGroupIndex(groups.length - 1);
      }

      console.log("✅ Auto-fill completed! Ready to submit.");
      alert("Đã điền xong tất cả đáp án và lưu lên server! Bạn có thể nộp bài.");
    };

    return () => {
      // @ts-ignore
      delete window.autoFill;
    };
  }, [questions, groups, fullTest, addAttemptAnswer]);

  // Loading Screen Component
  const LoadingScreen = () => {
    const [loadingProgress, setLoadingProgress] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 100);

      return () => clearInterval(interval);
    }, []);

    return (
      <m.div
        key="loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center min-h-[80vh] space-y-8"
      >
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Đang chuẩn bị bài test...</h2>
          <p className="text-gray-600">Vui lòng đợi trong giây lát</p>

          <div className="w-64 bg-gray-200 rounded-full h-2">
            <m.div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(loadingProgress, 90)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-sm text-gray-500">{Math.round(Math.min(loadingProgress, 90))}% hoàn thành</p>
        </div>

        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </m.div>
    );
  };

  // Submitting Screen Component
  const SubmittingScreen = () => (
    <m.div
      key="submitting"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex flex-col items-center justify-center min-h-[80vh] space-y-6"
    >
      <div className="relative">
        <div className="w-24 h-24 border-4 border-green-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-24 h-24 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-gray-800">Đang chấm điểm bài test...</h2>
        <p className="text-gray-600">Hệ thống đang phân tích kết quả của bạn</p>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-lg border max-w-md">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Kiểm tra đáp án</span>
            <Loader2 className="w-4 h-4 animate-spin text-green-600" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Tính toán điểm số</span>
            <Loader2 className="w-4 h-4 animate-spin text-green-600" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Tạo báo cáo</span>
            <Loader2 className="w-4 h-4 animate-spin text-green-600" />
          </div>
        </div>
      </div>
    </m.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="container mx-auto px-4 py-6">

        <AnimatePresence mode="wait">
          {stage === "intro" && (
            <IntroScreen onStart={handleStart} isLoading={isPending} />
          )}

          {isPending && (
            <LoadingScreen />
          )}

          {(isSubmitting || isSubmittingReview) && (
            <SubmittingScreen />
          )}

          {stage === "test" && !isPending && !isSubmitting && !isSubmittingReview && currentGroupData && (
            <TestScreen
              currentGroupIndex={currentGroupIndex}
              totalGroups={totalGroups}
              group={currentGroupData}
              allGroups={groups}
              allQuestions={questions}
              selectedAnswers={answers}
              timeLimit={7200} // 2 hours
              onAnswerForQuestion={(qIdx, oIdx) => {
                handleAnswerForQuestion(qIdx, oIdx);

                const q = questions[qIdx];
                if (fullTest?.id && q && q.answerIds) {
                  const answerId = q.answerIds[oIdx];
                  if (answerId) {
                    addAttemptAnswer({
                      attemptId: fullTest.id,
                      questionId: q.id,
                      answerId: answerId
                    });
                  }
                }
              }}
              onGroupSelect={handleGroupSelect}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSubmit={handleSubmit}
              canGoNext={true}
              canGoPrevious={currentGroupIndex > 0}
            />
          )}

          {stage === "results" && testResults && (
            <ResultsScreen
              onRetake={handleRetake}

            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    autoFill: (delay?: number) => Promise<void>;
  }
}