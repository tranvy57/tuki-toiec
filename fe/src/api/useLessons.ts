import api from "@/libs/axios-config";
import { useQuery } from "@tanstack/react-query";

// Types based on the API response structure
export interface LessonItem {
  id: string;
  modality: string;
  title: string;
  bandHint: number;
  difficulty: string;
  promptJsonb: {
    // Email response fields
    content?: string;
    directions?: string;
    writing_type?: string;
    // Describe picture fields
    keywords?: string[];
    image_url?: string;
    // Speaking fields
    question_text?: string;
    speaking_time?: number;
    question_number?: number;
    preparation_time?: number;
  };
  solutionJsonb: {
    tips?: string;
    sample_answer?: string;
    // Speaking fields
    audio_url?: string;
    sample_text?: string;
  };
}

export interface LessonByModality {
  lessonId: string;
  items: LessonItem[];
}

export interface LessonsByModalityResponse {
  statusCode: number;
  message: string;
  data: LessonByModality[];
}

interface UseLessonsByModalityOptions {
  modality: string;
  enabled?: boolean;
}

async function fetchLessonsByModality(
  modality: string
): Promise<LessonByModality[]> {
  try {
    const res = await api.get(`/lesson/by-modality?modality=${modality}`);

    // Validate response structure
    if (!res.data || typeof res.data !== "object") {
      throw new Error("Invalid response format");
    }

    const response = res.data as LessonsByModalityResponse;

    if (response.statusCode !== 200) {
      throw new Error(response.message || "API request failed");
    }

    return response.data || [];
  } catch (error) {
    console.error("Error fetching lessons by modality:", error);
    throw error;
  }
}

export function useLessonsByModality({
  modality,
  enabled = true,
}: UseLessonsByModalityOptions) {
  return useQuery({
    queryKey: ["lessons", "by-modality", modality],
    queryFn: () => fetchLessonsByModality(modality),
    enabled: enabled && !!modality,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (garbage collection time)
    retry: 2,
  });
}
