import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '~/libs/axios';

// Interfaces for vocabulary review
export interface UserVocabulary {
  vocabulary: {
    id: string;
    word: string;
    meaning: string;
    pronunciation: string;
    partOfSpeech: string;
    exampleEn: string;
    exampleVn: string;
    audioUrl?: string;
    lemma?: string;
    type?: string;
  };
  wrongCount: number;
  correctCount: number;
  status: 'learning' | 'learned' | 'review' | 'new';
  strength: number;
  timesReviewed: number;
  lastReviewedAt?: string;
  nextReviewAt?: string;
  isBookmarked: boolean;
  weaknessLevel?: 'critical' | 'moderate' | 'mild' | 'none';
}

export interface ReviewVocabulary {
  type: 'mcq' | 'cloze' | 'pronunciation';
  vocabId: string;
  content: {
    question: string;
    choices?: { key: string; value: string }[];
    correctKey?: string;
    answer?: string;
    word?: string;
    meaning?: string;
    audioUrl?: string;
  };
}

export interface ReviewVocabulariesResponse {
  items: ReviewVocabulary[];
  totalItems: number;
}

// Get user vocabularies (từ vựng của user)
export const getUserVocabularies = async (): Promise<UserVocabulary[]> => {
  try {
    const response = await api.get('/users/vocabularies');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching user vocabularies:', error);
    throw error;
  }
};

export const useGetUserVocabularies = () => {
  return useQuery({
    queryKey: ['user-vocabularies'],
    queryFn: getUserVocabularies,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get review vocabularies (danh sách từ để ôn tập - quiz)
export const getReviewVocabularies = async (): Promise<ReviewVocabulariesResponse> => {
  try {
    const response = await api.get('/users/vocabularies/review-list');
    return response.data.data || { items: [], totalItems: 0 };
  } catch (error: any) {
    // If endpoint doesn't exist (404), return empty data instead of throwing
    if (error?.response?.status === 404) {
      console.warn('Review vocabularies endpoint not found, returning empty list');
      return { items: [], totalItems: 0 };
    }
    console.error('Error fetching review vocabularies:', error);
    throw error;
  }
};

export const useGetReviewVocabularies = () => {
  return useQuery({
    queryKey: ['review-vocabularies'],
    queryFn: getReviewVocabularies,
    staleTime: 5 * 60 * 1000,
    retry: false, // Don't retry on 404
  });
};

// Mark/unmark vocabulary for review (bookmark)
export const markUserVocabulary = async (params: { id: string; status: boolean }): Promise<any> => {
  try {
    const response = await api.patch(`/user-vocabularies/${params.id}/mark`, {
      status: params.status,
    });
    return response.data;
  } catch (error) {
    console.error('Error marking vocabulary:', error);
    throw error;
  }
};

export const useMarkUserVocabulary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markUserVocabulary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-vocabularies'] });
    },
  });
};

// Update vocabulary progress (sau khi làm quiz)
export const updateVocabularyProgress = async (params: {
  vocabId: string;
  isCorrect: boolean;
}): Promise<any> => {
  try {
    const response = await api.patch(`/users/vocabularies/${params.vocabId}`, {
      isCorrect: params.isCorrect,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating vocabulary progress:', error);
    throw error;
  }
};

export const useUpdateVocabularyProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateVocabularyProgress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-vocabularies'] });
      queryClient.invalidateQueries({ queryKey: ['review-vocabularies'] });
    },
  });
};
