import { api } from "~/libs/axios";
import { Vocabulary } from "~/types/vocabulary";


// Response interfaces
export interface VocabulariesResponse {
  data: Vocabulary[];
  total: number;
  page: number;
  limit: number;
}

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
export const getVocabularies = async (): Promise<VocabulariesResponse> => {
  try {
    const response = await api.get('/vocabularies');
    return response.data;
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

// Tìm kiếm vocabularies
export const searchVocabularies = async (
  query: string,
  limit?: number
): Promise<VocabulariesResponse> => {
  try {
    const params = { search: query, limit: limit || 20 };
    const response = await api.get('/vocabularies/search', { params });
    return response.data;
  } catch (error) {
    console.error('Error searching vocabularies:', error);
    throw error;
  }
};

// Lấy vocabularies theo category
export const getVocabulariesByCategory = async (
  category: string,
  params?: Omit<VocabularySearchParams, 'category'>
): Promise<VocabulariesResponse> => {
  try {
    const response = await api.get(`/vocabularies/category/${category}`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching vocabularies for category ${category}:`, error);
    throw error;
  }
};

// Lấy vocabularies ngẫu nhiên (cho việc luyện tập)
export const getRandomVocabularies = async (
  count: number = 10,
  category?: string
): Promise<VocabulariesResponse> => {
  try {
    const params = { count, category };
    const response = await api.get('/vocabularies/random', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching random vocabularies:', error);
    throw error;
  }
};

// Lấy tất cả categories
export const getVocabularyCategories = async (): Promise<{
  data: Array<{ id: string; name: string; count: number }>;
}> => {
  try {
    const response = await api.get('/vocabularies/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching vocabulary categories:', error);
    throw error;
  }
};

// Lấy thống kê vocabulary
export const getVocabularyStats = async (): Promise<{
  data: {
    total: number;
    byCategory: Record<string, number>;
    recent: number;
  };
}> => {
  try {
    const response = await api.get('/vocabularies/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching vocabulary stats:', error);
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

// Xóa vocabulary (nếu cần)
export const deleteVocabulary = async (id: number): Promise<{ success: boolean }> => {
  try {
    const response = await api.delete(`/vocabularies/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting vocabulary with id ${id}:`, error);
    throw error;
  }
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