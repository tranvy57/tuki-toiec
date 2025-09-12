import { useMutation } from '@tanstack/react-query';
import { api } from '~/libs/axios';
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


export function useStartTestPractice() {
  return useMutation({
    mutationFn: (testId: string) => startTestPractice(testId),
  });
}
