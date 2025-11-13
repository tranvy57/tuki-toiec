import api from "@/libs/axios-config";
import { CreateAttemptAnswerReq } from "@/types/implements/attempt-answer";
import {
  PracticeTestResponse,
  PracticeTestResponseSchema,
  ResultTestResponse,
  ResultTestResponseSchema,
} from "@/types/implements/test";
import { useMutation, useQuery } from "@tanstack/react-query";

// Type for submit review response
interface ReviewSubmitResponse {
  attemptId: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  updatedSkills: {
    skillId: string;
    proficiency: number;
  }[];
  parts: any[]; // We'll use the existing part structure
}

type StartTestVariables = {
  testId?: string | undefined;
  mode?: "test" | "review";
};

async function startTestPractice(
  testId: string | undefined,
  mode: "test" | "review" = "test"
): Promise<PracticeTestResponse> {
  const res = await api.post(`/attempts`, {
    testId,
    mode,
  });

  const parsed = PracticeTestResponseSchema.parse(res.data.data);

  return parsed;
}

async function addAttemptAnswer(attemptAnswer: CreateAttemptAnswerReq) {
  const res = await api.patch(
    `/attempts/${attemptAnswer.attemptId}/answers`,
    attemptAnswer
  );

  return res;
}

export function useStartTestPractice() {
  return useMutation({
    mutationFn: ({ testId, mode }: StartTestVariables) =>
      startTestPractice(testId, mode),
  });
}

export function useAddAttemptAnswer() {
  return useMutation({
    mutationFn: (attemptAnswer: CreateAttemptAnswerReq) =>
      addAttemptAnswer(attemptAnswer),
  });
}

// export function useTestResult(attemptId: string) {
//   return useQuery({
//     queryKey: ["test-result", attemptId],
//     queryFn: () => fetchAttemptResult(attemptId),
//     enabled: !!attemptId,
//   });
// }

export const submitTest = async (
  attemptId: string
): Promise<ResultTestResponse> => {
  try {
    const response = await api.patch(`/attempts/${attemptId}/submit`);
    const parsed = ResultTestResponseSchema.parse(response.data.data);
    return parsed;
  } catch (error) {
    console.error("Error submitting test:", error);
    throw error;
  }
};

export const submitTestReview = async (
  attemptId: string
): Promise<ReviewSubmitResponse> => {
  try {
    const response = await api.patch(`/attempts/${attemptId}/submit-review`);

    // Return the raw data structure since it's different from ResultTestResponse
    return response.data.data;
  } catch (error) {
    console.error("Error submitting test review:", error);
    throw error;
  }
};

export const useSubmitTestReview = () => {
  return useMutation({
    mutationFn: (attemptId: string) => submitTestReview(attemptId),
  });
};

export const useSubmitTestResult = () => {
  return useMutation({
    mutationFn: (attemptId: string) => submitTest(attemptId),
  });
};
