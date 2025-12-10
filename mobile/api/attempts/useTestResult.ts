import { useMutation } from '@tanstack/react-query';
import { api } from '~/libs/axios';
import { ResultTestResponse, ResultTestResponseSchema } from '~/types/response/TestResponse';
import { useCurrentTest } from '~/hooks/useCurrentTest';

// Interfaces for result data
export interface QuestionResult {
  id: string;
  numberLabel: number;
  isCorrect: boolean | null;
  selectedAnswer: string | null;
  correctAnswer: string;
  content: string;
  explanation: string | null;
  answers: { id: string; answerKey: string; content: string; isCorrect: boolean }[];
  // Group context
  groupContext?: {
    paragraphEn: string | null;
    paragraphVn: string | null;
    imageUrl: string | null;
    audioUrl: string | null;
  };
}

export interface PartResult {
  partNumber: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedQuestions: number;
  accuracy: number;
  questions: QuestionResult[];
}

export interface TestResult {
  attemptId: string;
  testTitle: string;
  mode: 'practice' | 'test';
  startedAt: string;
  finishedAt: string | null;
  totalScore: number | null;
  listeningScore: number | null;
  readingScore: number | null;
  totalQuestions: number;
  totalCorrect: number;
  totalIncorrect: number;
  totalSkipped: number;
  accuracy: number;
  duration: string;
  status: 'in_progress' | 'submitted';
  parts: PartResult[];
}

// ResultTestResponse has all needed data - no separate interface needed

// Convert ResultTestResponse (from submitTest) to TestResult for display
export function convertResultToTestResult(result: ResultTestResponse): TestResult {
  const parts = result.parts || [];

  // Calculate duration
  const startTime = new Date(result.startedAt);
  const endTime = result.finishAt ? new Date(result.finishAt) : new Date();
  const durationMs = endTime.getTime() - startTime.getTime();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  const duration = `${hours}h ${minutes}m`;

  // Build part results from the API response
  const partResults: PartResult[] = parts.map((part: any) => {
    const questions: QuestionResult[] = [];

    part.groups?.forEach((group: any) => {
      group.questions?.forEach((question: any) => {
        // Backend returns isCorrect + userAnswerId directly on question
        const isCorrect = question.isCorrect ?? null;
        const correctAnswer = question.answers?.find((a: any) => a.isCorrect)?.answerKey || 'A';
        const selectedAnswer = question.userAnswerId
          ? (question.answers?.find((a: any) => a.id === question.userAnswerId)?.answerKey ?? null)
          : null;

        questions.push({
          id: question.id,
          numberLabel: question.numberLabel,
          content: question.content,
          isCorrect: isCorrect,
          selectedAnswer,
          correctAnswer,
          explanation: question.explanation || null,
          answers: question.answers || [],
          groupContext: {
            paragraphEn: group.paragraphEn || null,
            paragraphVn: group.paragraphVn || null,
            imageUrl: group.imageUrl || null,
            audioUrl: group.audioUrl || null,
          },
        });
      });
    });

    const correctAnswers = questions.filter((q) => q.isCorrect === true).length;
    const incorrectAnswers = questions.filter((q) => q.isCorrect === false).length;
    const skippedQuestions = questions.filter((q) => q.isCorrect === null).length;
    const accuracy = questions.length > 0 ? (correctAnswers / questions.length) * 100 : 0;

    return {
      partNumber: part.partNumber,
      totalQuestions: questions.length,
      correctAnswers,
      incorrectAnswers,
      skippedQuestions,
      accuracy,
      questions,
    };
  });

  // Calculate totals from parts
  const totalQuestions = partResults.reduce((sum, part) => sum + part.totalQuestions, 0);
  const totalCorrect = partResults.reduce((sum, part) => sum + part.correctAnswers, 0);
  const totalIncorrect = partResults.reduce((sum, part) => sum + part.incorrectAnswers, 0);
  const totalSkipped = partResults.reduce((sum, part) => sum + part.skippedQuestions, 0);
  const accuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

  // Calculate listening and reading scores from parts
  const listeningParts = partResults.filter((p) => p.partNumber <= 4);
  const readingParts = partResults.filter((p) => p.partNumber >= 5);

  const listeningCorrect = listeningParts.reduce((sum, part) => sum + part.correctAnswers, 0);
  const listeningTotal = listeningParts.reduce((sum, part) => sum + part.totalQuestions, 0);
  const readingCorrect = readingParts.reduce((sum, part) => sum + part.correctAnswers, 0);
  const readingTotal = readingParts.reduce((sum, part) => sum + part.totalQuestions, 0);

  const listeningScore =
    listeningTotal > 0 ? Math.round((listeningCorrect / listeningTotal) * 495) : null;
  const readingScore = readingTotal > 0 ? Math.round((readingCorrect / readingTotal) * 495) : null;

  // Calculate total score from listening and reading scores (not from backend which might be 0)
  let totalScore: number | null = null;
  if (listeningScore !== null && readingScore !== null) {
    totalScore = listeningScore + readingScore;
  }

  return {
    attemptId: result.id,
    testTitle: `Test Attempt`,
    mode: result.mode,
    startedAt: result.startedAt,
    finishedAt: result.finishAt,
    totalScore: totalScore,
    listeningScore: listeningScore,
    readingScore: readingScore,
    totalQuestions,
    totalCorrect,
    totalIncorrect,
    totalSkipped,
    accuracy,
    duration,
    status: result.status,
    parts: partResults,
  };
}

export const submitTest = async (attemptId: string): Promise<ResultTestResponse> => {
  try {
    const response = await api.patch(`/attempts/${attemptId}/submit`);
    const parsed = ResultTestResponseSchema.parse(response.data.data);
    console.log(parsed);
    return parsed;
  } catch (error) {
    console.error('[submitTest] Error submitting test:', error);
    throw error;
  }
};

export const useSubmitTestResult = () => {
  const { setResultTest } = useCurrentTest();

  return useMutation({
    mutationFn: async (attemptId: string) => {
      const result = await submitTest(attemptId);
      // Save to store to avoid refetching
      setResultTest(result);
      // Convert to TestResult format for display
      const converted = convertResultToTestResult(result);
      return converted;
    },
    onError: (error) => {
      console.error('[useSubmitTestResult] Mutation failed:', error);
    },
  });
};

// Hook to get test result - lấy từ store hoặc return null nếu chưa submit
export function useTestResult(attemptId: string) {
  // Get result from store
  const { resultTest } = useCurrentTest();

  if (!resultTest) {
    return {
      data: null,
      isLoading: false,
      error: null,
    };
  }

  // Convert and return cached result
  const testResult = convertResultToTestResult(resultTest);
  return {
    data: testResult,
    isLoading: false,
    error: null,
  };
}
