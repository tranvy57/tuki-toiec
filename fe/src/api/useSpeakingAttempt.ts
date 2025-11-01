import api from "@/libs/axios-config";
import { EvaluateSpeakingResponse } from "@/types/implements/attempt-speaking";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";



export interface EvaluateSpeakingInput {
  audio: File | Blob;
  question: string;
  type: string;
  context: string;
}

/**
 * Gọi API chấm điểm Speaking (FormData: audio + question)
 */
export async function evaluateSpeakingAttempt({
  audio,
  question,
  type,
  context = ''
}: EvaluateSpeakingInput): Promise<EvaluateSpeakingResponse> {
  const formData = new FormData();
  formData.append("audio", audio);
  formData.append("question", question);
  formData.append("type", type);
  formData.append("context", context);

  const res = await api.post<EvaluateSpeakingResponse>(
    "/speaking-attempt/evaluate",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
}

export function useEvaluateSpeakingAttempt() {
  return useMutation<EvaluateSpeakingResponse, Error, EvaluateSpeakingInput>({
    mutationFn: evaluateSpeakingAttempt,
  });
}
