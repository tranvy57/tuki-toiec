import { useQuery } from '@tanstack/react-query';
import { api } from '~/libs/axios';

// Types based on the API response structure
export interface LessonItem {
  id: string;
  modality: string;
  title: string;
  bandHint: number;
  difficulty: string;
  promptJsonb: {
    // General fields
    content?: string;
    directions?: string;
    title?: string;
    instructions?: string;
    // Email response fields
    writing_type?: string;
    // Describe picture fields
    keywords?: string[];
    image_url?: string;
    // Speaking fields
    question_text?: string;
    speaking_time?: number;
    question_number?: number;
    preparation_time?: number;
    // Respond using info fields
    basic_info?: string;
    basic_info_audio?: string;
    // Listening MCQ fields
    text?: string;
    choices?: Array<{
      content: string;
      answer_key: string;
    }>;
    audio_url?: string;
    transcript?: string;
    translation?: string;
    explanation?: string;
    // Dictation fields
    segments?: Array<{
      end: number;
      text: string;
      start: number;
    }>;
    source_url?: string;
  };
  solutionJsonb: {
    tips?: string;
    sample_answer?: string;
    // Speaking fields
    audio_url?: string;
    sample_text?: string;
    // Listening MCQ fields
    correct_answer?: string;
    explanation?: string;
    // Dictation fields
    sentences?: string[];
    correct_answers?: Array<{
      text: string;
      segment_index: number;
    }>;
    full_transcript?: string;
  };
}

export interface LessonByModality {
  lessonId: string;
  name: string;
  difficulty?: string;
  items: LessonItem[];
}

export interface LessonsByModalityResponse {
  statusCode: number;
  message: string;
  data: LessonByModality[];
}

interface UseLessonsByModalityOptions {
  modality?: string;
  skillType?: string;
  enabled?: boolean;
}

async function fetchLessonsByModality(
  modality?: string,
  skillType?: string
): Promise<LessonByModality[]> {
  try {
    let url = `/lesson/by-modality?`;
    if (skillType) {
      url += `skillType=${skillType}`;
    }
    if (modality) {
      url += `&modality=${modality}`;
    }

    const res = await api.get(url);


    if (!res.data || typeof res.data !== 'object') {
      throw new Error('Invalid response format');
    }

    const response = res.data as LessonsByModalityResponse;

    if (response.statusCode !== 200) {
      throw new Error(response.message || 'API request failed');
    }

    return response.data || [];
  } catch (error) {
    console.error('Error fetching lessons by modality:', error);
    throw error;
  }
}

export function useLessonsByModality({
  modality,
  skillType,
  enabled = true,
}: UseLessonsByModalityOptions) {
  return useQuery({
    queryKey: ['lessons', 'by-modality', modality, skillType],
    queryFn: () => fetchLessonsByModality(modality, skillType),
    enabled: enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
}
