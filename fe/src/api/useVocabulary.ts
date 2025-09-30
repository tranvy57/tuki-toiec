import api from "@/libs/axios-config";
import { UserVocabulary, UserVocabularyResponse, UserVocabularyResponseSchema, Vocabulary } from "@/types/implements/vocabulary";
import { useQuery } from "@tanstack/react-query";


export interface VocabularyResponse {
  data: Vocabulary;
}

export interface VocabularySearchParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sort?: 'word' | 'category' | 'created_at';
  order?: 'asc' | 'desc';
}

// API Functions

// Lấy danh sách vocabularies với phân trang và filter
export const getUserVocabularies = async (): Promise<UserVocabularyResponse> => {
  try {
    const response = await api.get('/users/vocabularies');
    const parsed = UserVocabularyResponseSchema.parse(response.data.data);
    return parsed;
  } catch (error) {
    console.error('Error fetching vocabularies:', error);
    throw error;
  }
};

// Lấy vocabulary theo ID
export const getVocabularyById = async (id: number): Promise<VocabularyResponse> => {
  try {
    const response = await api.get(`/vocabularies/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching vocabulary with id ${id}:`, error);
    throw error;
  }
};

// Tạo vocabulary mới (nếu cần)
export const createVocabulary = async (
  vocabulary: Omit<Vocabulary, 'vocabulary_id'>
): Promise<VocabularyResponse> => {
  try {
    const response = await api.post('/vocabularies', vocabulary);
    return response.data;
  } catch (error) {
    console.error('Error creating vocabulary:', error);
    throw error;
  }
};

// Cập nhật vocabulary (nếu cần)
export const updateVocabulary = async (
  id: number,
  vocabulary: Partial<Vocabulary>
): Promise<VocabularyResponse> => {
  try {
    const response = await api.put(`/vocabularies/${id}`, vocabulary);
    return response.data;
  } catch (error) {
    console.error(`Error updating vocabulary with id ${id}:`, error);
    throw error;
  }
};

export const useGetVocabularies = () => {
  return useQuery({
    queryKey: ['user-vocabularies'],
    queryFn: () => getUserVocabularies(),
    staleTime: 1000 * 60 * 60,
  });
};

export const getWordAudioUrl = async (word: string): Promise<string | null> => {
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!res.ok) {
      console.warn('Word not found in dictionary API');
      return null;
    }

    const data = await res.json();

    // Kiểm tra field phonetics[].audio
    const phonetics = data?.[0]?.phonetics || [];
    const audio = phonetics.find((p: any) => p.audio)?.audio;

    return audio || null;
  } catch (err) {
    console.error('Error fetching audio:', err);
    return null;
  }
};