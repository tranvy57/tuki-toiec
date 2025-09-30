import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

// API hooks
import {
  useAddAttemptAnswer,
  useStartTestPractice,
  useSubmitTestResult
} from "@/api/useAttempt";

// Store

// Types
import { usePracticeTest } from "@/hooks";
import { Question } from "@/types/implements/test";

// Constants
const TEST_DURATION = 120 * 60; // 2 hours in seconds
const TRANSITION_DELAY = 200;

// Utility types for UI components
interface PartTab {
  number: number;
  name: string;
  questions: number[]; // question numberLabels
}

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
    const parts: PartTab[] = [];
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
        number: part.partNumber,
        name: `Part ${part.partNumber}`,
        questions: partQuestionNumbers.sort((a, b) => a - b),
      });
    });

    // Sort and create maps for O(1) lookups
    questions.sort((a, b) => a.numberLabel - b.numberLabel);
    groups.sort((a, b) => a.orderIndex - b.orderIndex);

    questions.forEach((q) => questionMap.set(q.numberLabel, q));

    return {
      allQuestions: questions,
      partTabs: parts.sort((a, b) => a.number - b.number),
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
    setFullTest,
    setCurrentPart,
    setAnswer,
  } = usePracticeTest();

  // Local state for UI
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(TEST_DURATION);
  const [highlightContent, setHighlightContent] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [open, setOpen] = useState(false);
  const { setResultTest } = usePracticeTest();
  const { mutateAsync: submitTest, isError, error } = useSubmitTestResult();

  // Start test attempt when component mounts
  useEffect(() => {
    if (
      !isInitialized &&
      !attemptId &&
      !startTestMutation.isPending &&
      !fullTest
    ) {
      setIsInitialized(true);
      startTestMutation.mutate({
        mode: "review"
      }, {
        onSuccess: (data) => {
          setFullTest(data);
          setAttemptId(data.id);
          // Set timer from test duration if available
          const startTime = new Date(data.startedAt);
          const now = new Date();
          const elapsed = Math.floor(
            (now.getTime() - startTime.getTime()) / 1000
          );
          const remaining = Math.max(0, TEST_DURATION - elapsed);
          setTimeRemaining(remaining);
        },
        onError: (error) => {
          console.error("Failed to start test:", error);
          setIsInitialized(false); // Reset on error
          router.push(`/tests/${testId}`);
        },
      });
    }
  }, []);

  // Submit test
  const handleSubmit = useCallback(
    async (auto = false) => {
      if (auto) {
        // router.push(`/tests/${testId}/result?attemptId=${attemptId}`);
        const result = await submitTest(fullTest?.id || "");
        if (isError) {
          console.error("Error submitting test:", error);
          alert("There was an error submitting your test. Please try again.");
          return;
        }

        setResultTest(result);
        // router.replace("/(tabs)/(tests)/[id]/result");
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
    router.replace("/");

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
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestion(questionNumber);
        scrollToTop?.();
        setIsTransitioning(false);
      }, TRANSITION_DELAY);
    },
    []
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
      const part = partTabs.find((p) => p.number === partNumber);
      if (part && part.questions.length > 0) {
        handleQuestionChange(part.questions[0]);
      }
    },
    [partTabs, handleQuestionChange]
  );

  // Get necessary data for rendering
  const currentPartQuestions = getCurrentPartQuestions();

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

    // Data
    partTabs,
    mappedAnswers,
    currentPartQuestions,
    testId,

    // Handlers
    handleSubmit,
    confirmSubmit,
    handleQuestionChange,
    handleQuestionAnswerChange,
    handlePartChange,
    handleExit,
    setHighlightContent,
    setOpen,

    // Constants
    TEST_DURATION,
  };
};
