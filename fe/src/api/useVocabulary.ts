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


async function fetchVocab(word: string): Promise<Vocabulary | null> {
  try {
    const res = await api.get<VocabularyResponse>(`/vocabularies/lookup?word=${encodeURIComponent(word)}`);
    console.log(res)
    return res.data.data;
  } catch (err) {
    console.error("fetchVocab error", err);
    return null;
  }
}

export const useLookUp = (word: string) => {
  return useQuery({
    queryKey: ["vocab", word],
    queryFn: async () => {
      if (!word) return null;
      return await fetchVocab(word);
    },
    enabled: false,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

