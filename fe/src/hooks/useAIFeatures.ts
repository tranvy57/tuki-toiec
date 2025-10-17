import { useState } from "react";
import {
  GenerateEmailRequest,
  GenerateEmailResponse,
  EvaluateEmailRequest,
  EvaluateEmailResponse,
  EvaluateImageDescriptionRequest,
  EvaluateImageDescriptionResponse,
  EvaluateOpinionEssayRequest,
  EvaluateOpinionEssayResponse,
  AIApiErrorResponse,
} from "@/types/ai-features";

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

// ==== Evaluate Email Hook ====
export const useEvaluateEmail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const evaluateEmail = async (
    request: EvaluateEmailRequest
  ): Promise<EvaluateEmailResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/evaluate-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData: AIApiErrorResponse = await response.json();
        throw new Error(errorData.error || "Failed to evaluate email");
      }

      const data: EvaluateEmailResponse = await response.json();
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

  return { evaluateEmail, isLoading, error };
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

// ==== Evaluate Opinion Essay Hook ====
export const useEvaluateOpinionEssay = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const evaluateOpinionEssay = async (
    request: EvaluateOpinionEssayRequest
  ): Promise<EvaluateOpinionEssayResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/evaluate-opinion-essay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData: AIApiErrorResponse = await response.json();
        throw new Error(errorData.error || "Failed to evaluate opinion essay");
      }

      const data: EvaluateOpinionEssayResponse = await response.json();
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

  return { evaluateOpinionEssay, isLoading, error };
};

// ==== Combined Hook for all AI features ====
export const useAIFeatures = () => {
  const generateEmailHook = useGenerateEmail();
  const evaluateEmailHook = useEvaluateEmail();
  const evaluateImageDescriptionHook = useEvaluateImageDescription();
  const evaluateOpinionEssayHook = useEvaluateOpinionEssay();

  return {
    generateEmail: generateEmailHook,
    evaluateEmail: evaluateEmailHook,
    evaluateImageDescription: evaluateImageDescriptionHook,
    evaluateOpinionEssay: evaluateOpinionEssayHook,
  };
};
