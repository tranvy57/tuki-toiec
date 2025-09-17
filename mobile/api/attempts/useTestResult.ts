import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '~/libs/axios';
import { ResultTestResponse, ResultTestResponseSchema } from '~/types/response/TestResponse';

// Interfaces for result data
export interface QuestionResult {
  id: string;
  numberLabel: number;
  isCorrect: boolean | null;
  selectedAnswer: string | null;
  correctAnswer: string;
  content: string;
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

// API Response interface
interface AttemptResultResponse {
  attempt: {
    id: string;
    startedAt: string;
    finishAt: string | null;
    totalScore: number | null;
    score: number | null;
    status: 'in_progress' | 'submitted';
    mode: 'practice' | 'test';
    test: {
      id: string;
      title: string;
      parts: Array<{
        id: string;
        partNumber: number;
        groups: Array<{
          id: string;
          questions: Array<{
            id: string;
            numberLabel: number;
            content: string;
            answers: Array<{
              id: string;
              content: string;
              answerKey: string;
              isCorrect: boolean;
            }>;
          }>;
        }>;
      }>;
    };
    attemptAnswers: Array<{
      question: {
        id: string;
        numberLabel: number;
        content: string;
      };
      answer: {
        id: string;
        answerKey: string;
        isCorrect: boolean;
      } | null;
      isCorrect: boolean | null;
    }>;
  };
}

async function fetchAttemptResult(attemptId: string): Promise<TestResult> {
  const response = await api.get<{ data: AttemptResultResponse }>(`/attempts/${attemptId}/result`);
  const data = response.data.data;

  const attempt = data.attempt;
  const test = attempt.test;

  // Calculate duration
  const startTime = new Date(attempt.startedAt);
  const endTime = attempt.finishAt ? new Date(attempt.finishAt) : new Date();
  const durationMs = endTime.getTime() - startTime.getTime();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  const duration = `${hours}h ${minutes}m`;

  // Group questions by part
  const partQuestions: { [partNumber: number]: QuestionResult[] } = {};
  const answerMap = new Map(attempt.attemptAnswers.map((aa) => [aa.question.id, aa]));

  // Initialize parts
  test.parts.forEach((part) => {
    partQuestions[part.partNumber] = [];

    part.groups.forEach((group) => {
      group.questions.forEach((question) => {
        const attemptAnswer = answerMap.get(question.id);
        const correctAnswer = question.answers.find((a) => a.isCorrect)?.answerKey || 'A';

        partQuestions[part.partNumber].push({
          id: question.id,
          numberLabel: question.numberLabel,
          content: question.content,
          isCorrect: attemptAnswer?.isCorrect ?? null,
          selectedAnswer: attemptAnswer?.answer?.answerKey ?? null,
          correctAnswer,
        });
      });
    });
  });

  // Calculate part results
  const parts: PartResult[] = test.parts.map((part) => {
    const questions = partQuestions[part.partNumber];
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

  // Calculate totals
  const totalQuestions = parts.reduce((sum, part) => sum + part.totalQuestions, 0);
  const totalCorrect = parts.reduce((sum, part) => sum + part.correctAnswers, 0);
  const totalIncorrect = parts.reduce((sum, part) => sum + part.incorrectAnswers, 0);
  const totalSkipped = parts.reduce((sum, part) => sum + part.skippedQuestions, 0);
  const accuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

  // Calculate listening and reading scores (Parts 1-4 = Listening, Parts 5-7 = Reading)
  const listeningParts = parts.filter((p) => p.partNumber <= 4);
  const readingParts = parts.filter((p) => p.partNumber >= 5);

  const listeningCorrect = listeningParts.reduce((sum, part) => sum + part.correctAnswers, 0);
  const listeningTotal = listeningParts.reduce((sum, part) => sum + part.totalQuestions, 0);
  const readingCorrect = readingParts.reduce((sum, part) => sum + part.correctAnswers, 0);
  const readingTotal = readingParts.reduce((sum, part) => sum + part.totalQuestions, 0);

  // TOEIC scoring approximation (simplified)
  const listeningScore =
    listeningTotal > 0 ? Math.round((listeningCorrect / listeningTotal) * 495) : null;
  const readingScore = readingTotal > 0 ? Math.round((readingCorrect / readingTotal) * 495) : null;

  return {
    attemptId: attempt.id,
    testTitle: test.title,
    mode: attempt.mode,
    startedAt: attempt.startedAt,
    finishedAt: attempt.finishAt,
    totalScore: attempt.totalScore,
    listeningScore: listeningScore,
    readingScore: readingScore,
    totalQuestions,
    totalCorrect,
    totalIncorrect,
    totalSkipped,
    accuracy,
    duration,
    status: attempt.status,
    parts,
  };
}

export function useTestResult(attemptId: string) {
  return useQuery({
    queryKey: ['test-result', attemptId],
    queryFn: () => fetchAttemptResult(attemptId),
    enabled: !!attemptId,
  });
}

export const submitTest = async (attemptId: string): Promise<ResultTestResponse> => {
  try {
    const response = await api.patch(`/attempts/${attemptId}/submit`);
    const parsed = ResultTestResponseSchema.parse(response.data.data);
    return parsed;
  } catch (error) {
    console.error('Error submitting test:', error);
    throw error;
  }
}


export const useSubmitTestResult =  () => {
  return useMutation({
    mutationFn: (attemptId: string) => submitTest(attemptId),
  });
}