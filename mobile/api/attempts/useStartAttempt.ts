import { useMutation } from '@tanstack/react-query';
import { api } from '~/libs/axios';
import { CreateAttemptAnswerReq } from '~/types/request/attemptAnswerReq';
import { BaseResponseSchema } from '~/types/response/BaseResponse';
import { BaseResponse, PracticeTestResponse, PracticeTestResponseSchema } from '~/types/response/TestResponse';


async function startTestPractice(
  testId: string
): Promise<PracticeTestResponse> {
  const res = await api.post(`/attempts`, {
    testId,
    mode: 'test',
  });

  const parsed = PracticeTestResponseSchema.parse(res.data.data);

  return parsed;
}

async function addAttemptAnswer(attemptAnswer: CreateAttemptAnswerReq) {
  const res = await api.patch(`/attempts/${attemptAnswer.attemptId}/answers`, attemptAnswer);

  return res;
}

export function useStartTestPractice() {
  return useMutation({
    mutationFn: (testId: string) => startTestPractice(testId),
  });
}

export function useAddAttemptAnswer() {
  return useMutation({
    mutationFn: (attemptAnswer: CreateAttemptAnswerReq) => addAttemptAnswer(attemptAnswer),
  });
}
