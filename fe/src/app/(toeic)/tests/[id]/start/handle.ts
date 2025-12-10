import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// API hooks
import {
  useAddAttemptAnswer,
  useStartTestPractice,
  useSubmitTestResult,
} from "@/api/useAttempt";

// Store

// Types
import { usePracticeTest } from "@/hooks";
import { Part, Question } from "@/types/implements/test";

// Constants
const TEST_DURATION = 120 * 60; // 2 hours in seconds
const TRANSITION_DELAY = 200;

// Utility types for UI components

// Custom hooks for optimized data access
export const useTestData = (fullTest: any) => {
  return useMemo(() => {
    if (!fullTest) {
      return {
        allQuestions: [],
        partTabs: [],
        allGroups: [],
        questionMap: new Map(),
        groupMap: new Map(),
      };
    }

    const questions: Question[] = [];
    const groups: any[] = [];
    const parts: Part[] = [];
    const questionMap = new Map<number, Question>();
    const groupMap = new Map<string, any>();

    fullTest.parts.forEach((part: any) => {
      const partQuestionNumbers: number[] = [];

      part.groups.forEach((group: any) => {
        questions.push(...group.questions);
        partQuestionNumbers.push(
          ...group.questions.map((q: any) => q.numberLabel)
        );
        groups.push(group);
        groupMap.set(group.id, group);
      });

      parts.push({
        partNumber: part.partNumber,
        ...part,
      });
    });

    // Sort and create maps for O(1) lookups
    questions.sort((a, b) => a.numberLabel - b.numberLabel);
    groups.sort((a, b) => a.orderIndex - b.orderIndex);

    questions.forEach((q) => questionMap.set(q.numberLabel, q));

    return {
      allQuestions: questions,
      partTabs: parts.sort((a, b) => a.partNumber - b.partNumber),
      allGroups: groups,
      questionMap,
      groupMap,
    };
  }, [fullTest]);
};

// Custom hook for answer mapping optimization
export const useAnswerMapping = (
  selectedAnswers: Record<string, string>,
  allQuestions: Question[]
) => {
  return useMemo(() => {
    const questionIdToNumber = new Map<string, number>();
    const answerIdToKey = new Map<string, string>();

    allQuestions.forEach((q) => {
      questionIdToNumber.set(q.id, q.numberLabel);
      q.answers.forEach((a) => {
        answerIdToKey.set(a.id, a.answerKey);
      });
    });

    return Object.fromEntries(
      Object.entries(selectedAnswers).map(([qId, aId]) => {
        const questionNumber = questionIdToNumber.get(qId);
        const answerKey = answerIdToKey.get(aId);
        return [questionNumber || qId, answerKey || aId];
      })
    );
  }, [selectedAnswers, allQuestions]);
};

// Main custom hook for test logic
export const useTestLogic = () => {
  const params = useParams();
  const router = useRouter();
  const testId = params.id as string;

  const startTestMutation = useStartTestPractice();
  const addAnswerMutation = useAddAttemptAnswer();

  const {
    fullTest,
    currentPart,
    selectedAnswers,
    attemptId,
    setFullTest,
    setCurrentPart,
    setAnswer,
    setAttemptId,
    partCache,
    nextPart,
  } = usePracticeTest();

  // Local state for UI
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(TEST_DURATION);
  const [highlightContent, setHighlightContent] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoadingTest, setIsLoadingTest] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const { setResultTest } = usePracticeTest();
  const { mutateAsync: submitTest, isError, error } = useSubmitTestResult();

  const hasStartedTest = useRef(false);

  // Wait for Zustand persist hydration to avoid starting a new attempt too early
  useEffect(() => {
    const hasHydratedFn = usePracticeTest.persist?.hasHydrated;
    const onFinishHydration = usePracticeTest.persist?.onFinishHydration;

    if (hasHydratedFn && hasHydratedFn()) {
      setIsHydrated(true);
    }

    const unsub = onFinishHydration?.(() => setIsHydrated(true));
    return () => {
      unsub?.();
    };
  }, []);

  // If we already have attempt/test data from storage, stop loading indicator
  useEffect(() => {
    if (!isHydrated) return;
    if (fullTest || attemptId) {
      setIsLoadingTest(false);
    }
  }, [isHydrated, fullTest, attemptId]);

  // Recalculate remaining time after refresh using persisted startedAt
  useEffect(() => {
    if (!isHydrated) return;
    if (!fullTest?.startedAt) return;

    const startTimeMs = new Date(fullTest.startedAt).getTime();
    const nowMs = Date.now();
    const elapsed = Math.floor((nowMs - startTimeMs) / 1000);
    const remaining = Math.max(0, TEST_DURATION - elapsed);
    setTimeRemaining(remaining);
  }, [isHydrated, fullTest?.startedAt]);

  useEffect(() => {
    if (!isHydrated) return; // Wait until persisted state restored
    if (hasStartedTest.current) return;
    if (attemptId) return;
    if (fullTest) {
      setIsLoadingTest(false);
      return;
    }

    hasStartedTest.current = true;
    setIsLoadingTest(true);

    const startTest = async () => {
      try {
        const data = await startTestMutation.mutateAsync({
          testId: testId,
        });

        setFullTest(data);
        setAttemptId(data.id);

        const startTime = new Date(data.startedAt);
        const now = new Date();
        const elapsed = Math.floor(
          (now.getTime() - startTime.getTime()) / 1000
        );
        const remaining = Math.max(0, TEST_DURATION - elapsed);
        setTimeRemaining(remaining);

        setIsLoadingTest(false);
      } catch (error) {
        console.error("Failed to start test:", error);
        hasStartedTest.current = false;
        setIsLoadingTest(false);
        router.push(`/tests/${testId}`);
      }
    };

    startTest();
  }, [isHydrated, attemptId, fullTest, startTestMutation, testId, setFullTest]);

  // Rebuild caches when hydrated from persisted fullTest
  useEffect(() => {
    if (fullTest && partCache.size === 0) {
      setFullTest(fullTest);
    }
  }, [fullTest, partCache, setFullTest]);

  // Submit test
  const handleSubmit = useCallback(
    async (auto = false) => {
      if (auto) {
        router.push(`/tests/${testId}/result?attemptId=${attemptId}`);
        const result = await submitTest(attemptId || "");
        if (isError) {
          console.error("Error submitting test:", error);
          alert("There was an error submitting your test. Please try again.");
          return;
        }

        setResultTest(result);
        router.replace(`/tests/${fullTest?.id}/result?attemptId=${attemptId}`);
      } else {
        setOpen(true); // mở modal
      }
    },
    [router, testId, attemptId]
  );

  const confirmSubmit = useCallback(async () => {
    const result = await submitTest(fullTest?.id || "");
    if (isError) {
      console.error("Error submitting test:", error);
      alert("There was an error submitting your test. Please try again.");
      return;
    }

    setResultTest(result);
    router.replace(`/tests/${fullTest?.id}/result?attemptId=${attemptId}`);
  }, [router, testId, attemptId]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          confirmSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [confirmSubmit]);

  // Transform test data to usable format
  const { allQuestions, partTabs, allGroups, questionMap, groupMap } =
    useTestData(fullTest);

  // Optimized answer mapping
  const mappedAnswers = useAnswerMapping(selectedAnswers, allQuestions);

  // Auto update part khi đổi tab part
  useEffect(() => {
    const question = questionMap.get(currentQuestion);
    if (question && fullTest) {
      const group = allGroups.find((g: any) =>
        g.questions.some((gq: any) => gq.id === question.id)
      );
      if (group) {
        const part = fullTest.parts.find((p: any) =>
          p.groups.some((pg: any) => pg.id === group.id)
        );
        if (part && part.partNumber !== currentPart?.partNumber) {
          setCurrentPart(part.partNumber);
        }
      }
    }
  }, [
    currentQuestion,
    currentPart,
    questionMap,
    allGroups,
    fullTest,
    setCurrentPart,
  ]);

  // Scroll smooth lên đầu khi đổi câu
  const scrollToTop = useCallback(() => {
    // This will be passed from component
  }, []);

  // Change question with transition
  const handleQuestionChange = useCallback(
    (questionNumber: number, scrollToTop?: () => void) => {
      console.log("handleQuestionChange called with:", questionNumber);
      setIsTransitioning(true);

      // First, find the question and determine if we need to change part
      const question = questionMap.get(questionNumber);
      if (question && fullTest) {
        const group = allGroups.find((g: any) =>
          g.questions.some((gq: any) => gq.id === question.id)
        );
        if (group) {
          const part = fullTest.parts.find((p: any) =>
            p.groups.some((pg: any) => pg.id === group.id)
          );
          if (part && part.partNumber !== currentPart?.partNumber) {
            // Need to change part first
            setCurrentPart(part.partNumber);
          }
        }
      }

      setTimeout(() => {
        setCurrentQuestion(questionNumber);

        // Wait for both part change and question change to complete
        setTimeout(() => {
          // Scroll to specific question
          const questionElement = document.getElementById(
            `question-${questionNumber}`
          );
          console.log(
            "Looking for element:",
            `question-${questionNumber}`,
            "Found:",
            !!questionElement
          );

          if (questionElement) {
            questionElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
              inline: "nearest",
            });
          } else {
            console.log("Element not found, trying again in 200ms");
            // Try again after more delay
            setTimeout(() => {
              const retryElement = document.getElementById(
                `question-${questionNumber}`
              );
              if (retryElement) {
                retryElement.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                  inline: "nearest",
                });
              } else {
                scrollToTop?.();
              }
            }, 200);
          }

          setIsTransitioning(false);
        }, 300); // Increased delay for part change + DOM update
      }, TRANSITION_DELAY);
    },
    [questionMap, fullTest, allGroups, currentPart, setCurrentPart]
  );

  // Handle answer with API call
  const handleAnswerChange = useCallback(
    (questionId: string, answerId: string) => {
      setAnswer(questionId, answerId);

      // Save answer to backend
      if (attemptId) {
        addAnswerMutation.mutate({
          attemptId,
          questionId,
          answerId,
        });
      }
    },
    [setAnswer, attemptId, addAnswerMutation]
  );

  // Exit
  const handleExit = useCallback(() => {
    if (confirm("Exit the test? Your progress will be lost.")) {
      router.push(`/tests/${testId}`);
    }
  }, [router, testId]);

  // Get all questions for current part (optimized)
  const getCurrentPartQuestions = useCallback((): Question[] => {
    if (!currentPart || !fullTest) return [];

    const part = fullTest.parts.find(
      (p) => p.partNumber === currentPart.partNumber
    );
    if (!part) return [];

    // Get all questions from all groups in current part
    const allPartQuestions: Question[] = [];
    part.groups.forEach((group) => {
      allPartQuestions.push(...group.questions);
    });

    // Sort by numberLabel to maintain correct order
    return allPartQuestions.sort((a, b) => a.numberLabel - b.numberLabel);
  }, [currentPart, fullTest]);

  // Memoized question answer change handlers
  const handleQuestionAnswerChange = useCallback(
    (questionNumber: number, value: string) => {
      const question = questionMap.get(questionNumber);
      if (question) {
        const answer = question.answers.find((a: any) => a.answerKey === value);
        if (answer) {
          handleAnswerChange(question.id, answer.id);
        }
      }
    },
    [questionMap, handleAnswerChange]
  );

  // Memoized part change handler
  const handlePartChange = useCallback(
    (partNumber: number) => {
      const part = partTabs.find((p) => p.partNumber === partNumber);
      if (part && part.groups.length > 0) {
        handleQuestionChange(part.groups[0].questions[0].numberLabel);
      }
    },
    [partTabs, handleQuestionChange]
  );

  // Handle next part navigation
  const handleNextPart = useCallback(() => {
    if (currentPart && fullTest && partTabs) {
      const nextPart = partTabs.find(
        (p) => p.partNumber === currentPart.partNumber + 1
      );
      if (
        nextPart &&
        nextPart.groups.length > 0 &&
        nextPart.groups[0].questions.length > 0
      ) {
        const firstQuestionOfNextPart =
          nextPart.groups[0].questions[0].numberLabel;
        console.log(
          "Navigating to next part:",
          nextPart.partNumber,
          "Question:",
          firstQuestionOfNextPart
        );
        handleQuestionChange(firstQuestionOfNextPart);
      }
    }
  }, [currentPart, fullTest, partTabs, handleQuestionChange]);

  // Get necessary data for rendering
  const currentPartQuestions = getCurrentPartQuestions();

  // Auto-fill script exposed to window
  useEffect(() => {
    window.autoFill = async (delay = 100) => {
      console.log("🚀 Starting auto-fill...");
      if (!allQuestions || allQuestions.length === 0) {
        console.warn("No questions found!");
        return;
      }

      let count = 0;
      for (const question of allQuestions) {
        if (question.answers && question.answers.length > 0) {
          // Select the first answer choice (usually 'A')
          const answerToSelect = question.answers[0];

          // Call the existing handler which updates state + calls API
          handleAnswerChange(question.id, answerToSelect.id);
          count++;

          console.log(
            `Filled question ${question.numberLabel} (${count}/${allQuestions.length})`
          );

          // Small delay to prevent overwhelming the API/browser
          if (delay > 0) {
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      }
      console.log("✅ Auto-fill completed! You can now submit the test.");
      alert("Đã điền xong tất cả đáp án! Bạn có thể nộp bài ngay bây giờ.");
    };

    // Cleanup
    return () => {
      // @ts-ignore
      delete window.autoFill;
    };
  }, [allQuestions, handleAnswerChange]);

  return {
    // State
    fullTest,
    currentPart,
    currentQuestion,
    timeRemaining,
    highlightContent,
    isTransitioning,
    open,
    startTestMutation,
    isLoadingTest,

    // Data
    partTabs,
    mappedAnswers,
    currentPartQuestions,
    testId,
    isLastPart:
      currentPart && fullTest
        ? currentPart.partNumber ===
          fullTest.parts[fullTest.parts.length - 1].partNumber
        : false,

    // Handlers
    handleSubmit,
    confirmSubmit,
    handleQuestionChange,
    handleQuestionAnswerChange,
    handlePartChange,
    handleExit,
    setHighlightContent,
    setOpen,
    nextPart: handleNextPart,

    // Constants
    TEST_DURATION,
  };
};

declare global {
  interface Window {
    autoFill: (delay?: number) => Promise<void>;
  }
}
