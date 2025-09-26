import api from "@/libs/axios-config";
import { CreateAttemptAnswerReq } from "@/types/implements/attempt-answer";
import { PracticeTestResponse, PracticeTestResponseSchema, ResultTestResponse, ResultTestResponseSchema } from "@/types/implements/test";
import { useMutation, useQuery } from "@tanstack/react-query";



async function startTestPractice(
  testId: string
): Promise<PracticeTestResponse> {
  const res = await api.post(`/attempts`, {
    testId,
    mode: "test",
  });

  const parsed = PracticeTestResponseSchema.parse(res.data.data);

  return parsed;
}

async function addAttemptAnswer(attemptAnswer: CreateAttemptAnswerReq) {
  const res = await api.patch(
    `/attempts/${attemptAnswer.attemptId}/answers`,
    attemptAnswer
  );
  console.log(res);

  return res;
}

export function useStartTestPractice() {
  return useMutation({
    mutationFn: (testId: string) => startTestPractice(testId),
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

export const useSubmitTestResult = () => {
  return useMutation({
    mutationFn: (attemptId: string) => submitTest(attemptId),
  });
};
