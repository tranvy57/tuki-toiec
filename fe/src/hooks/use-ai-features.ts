import { useState } from "react";
import {
  GenerateEmailRequest,
  GenerateEmailResponse,
  EvaluateImageDescriptionRequest,
  EvaluateImageDescriptionResponse,
  AIApiErrorResponse,
} from "@/types/ai-features";

export interface EvaluateWritingRequest {
  type: "email" | "opinion-essay";
  content: string;
  title?: string;
  topic?: string;
  context?: string;
  requiredLength?: number;
  timeLimit?: number;
}

export interface EvaluateWritingResponse {
  type: "email" | "opinion-essay";
  overallScore: number;
  breakdown: {
    content: number;
    structure: number;
    vocabulary: number;
    grammar: number;
    style: number;
    effectiveness: number;
  };
  strengths: string[];
  weaknesses: string[];
  grammarErrors: Array<{
    type: string;
    error: string;
    correction: string;
    explanation: string;
  }>;
  vocabularyFeedback: {
    range: number;
    accuracy: number;
    appropriateness: number;
    improvements: Array<{
      original: string;
      suggested: string;
      reason: string;
    }>;
  };
  structureAnalysis: {
    organization: number;
    flow: number;
    transitions: number;
    feedback: string;
  };
  improvementSuggestions: string[];
  rewrittenVersion?: string;
  estimatedTOEICScore: number;
}

// ==== Generate Email Hook ====
export const useGenerateEmail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateEmail = async (
    request: GenerateEmailRequest
  ): Promise<GenerateEmailResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData: AIApiErrorResponse = await response.json();
        throw new Error(errorData.error || "Failed to generate email");
      }

      const data: GenerateEmailResponse = await response.json();
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { generateEmail, isLoading, error };
};

// ==== Evaluate Writing Hook (API chung) ====
export const useEvaluateWriting = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const evaluateWriting = async (
    request: EvaluateWritingRequest
  ): Promise<EvaluateWritingResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/evaluate-writing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData: AIApiErrorResponse = await response.json();
        throw new Error(errorData.error || "Failed to evaluate writing");
      }

      const data: EvaluateWritingResponse = await response.json();
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { evaluateWriting, isLoading, error };
};

// ==== Convenience hooks cho từng loại ====
export const useEvaluateEmail = () => {
  const { evaluateWriting, isLoading, error } = useEvaluateWriting();

  const evaluateEmail = async (request: {
    subject?: string;
    body: string;
    purpose?: string;
    targetRecipient?: string;
  }): Promise<EvaluateWritingResponse | null> => {
    return evaluateWriting({
      type: "email",
      content: request.body,
      title: request.subject,
      topic: request.purpose,
      context: request.targetRecipient,
    });
  };

  return { evaluateEmail, isLoading, error };
};

export const useEvaluateOpinionEssay = () => {
  const { evaluateWriting, isLoading, error } = useEvaluateWriting();

  const evaluateOpinionEssay = async (request: {
    essay: string;
    topic?: string;
    requiredLength?: number;
    timeLimit?: number;
    essayType?:
      | "agree-disagree"
      | "opinion"
      | "problem-solution"
      | "advantages-disadvantages";
  }): Promise<EvaluateWritingResponse | null> => {
    return evaluateWriting({
      type: "opinion-essay",
      content: request.essay,
      topic: request.topic,
      context: request.essayType,
      requiredLength: request.requiredLength,
      timeLimit: request.timeLimit,
    });
  };

  return { evaluateOpinionEssay, isLoading, error };
};

// ==== Evaluate Image Description Hook ====
export const useEvaluateImageDescription = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const evaluateImageDescription = async (
    request: EvaluateImageDescriptionRequest
  ): Promise<EvaluateImageDescriptionResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/evaluate-image-description", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData: AIApiErrorResponse = await response.json();
        throw new Error(
          errorData.error || "Failed to evaluate image description"
        );
      }

      const data: EvaluateImageDescriptionResponse = await response.json();
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { evaluateImageDescription, isLoading, error };
};

export const useAIFeatures = () => {
  const generateEmailHook = useGenerateEmail();
  const evaluateWritingHook = useEvaluateWriting();
  const evaluateEmailHook = useEvaluateEmail();
  const evaluateOpinionEssayHook = useEvaluateOpinionEssay();
  const evaluateImageDescriptionHook = useEvaluateImageDescription();

  return {
    generateEmail: generateEmailHook,
    evaluateWriting: evaluateWritingHook,
    evaluateEmail: evaluateEmailHook,
    evaluateOpinionEssay: evaluateOpinionEssayHook,
    evaluateImageDescription: evaluateImageDescriptionHook,
  };
};
