import { api } from "@/lib/axios";
import type {
  Vocabulary,
  CreateVocabularyDto,
  UpdateVocabularyDto,
  ApiResponse,
  PaginationParams,
} from "@/types/api";

export const vocabulariesApi = {
  // Get all vocabularies with search and pagination
  getAll: async (
    params?: PaginationParams & {
      search?: string;
      type?: string;
      partOfSpeech?: string;
    }
  ): Promise<{
    data: Vocabulary[];
    meta: { page: number; limit: number; total: number; pages: number };
  }> => {
    const { data } = await api.get<
      ApiResponse<{ data: Vocabulary[]; meta: any }>
    >("/vocabularies", {
      params,
    });

    console.log("Check", data.data)
    return data.data || data;
  },

  // Get vocabulary by ID
  getById: async (id: string): Promise<Vocabulary> => {
    const { data } = await api.get<ApiResponse<Vocabulary>>(
      `/vocabularies/${id}`
    );
    return data.data || (data as any);
  },

  // Update vocabulary
  update: async ({
    id,
    ...updateData
  }: { id: string } & UpdateVocabularyDto): Promise<Vocabulary> => {
    const { data } = await api.patch<ApiResponse<Vocabulary>>(
      `/vocabularies/${id}`,
      updateData
    );
    return data.data || (data as any);
  },

  // Delete vocabulary
  delete: async (id: string): Promise<void> => {
    await api.delete(`/vocabularies/${id}`);
  },

  // Import vocabularies from Excel
  importFromExcel: async (
    file: File
  ): Promise<{ success: boolean; count: number }> => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await api.post<
      ApiResponse<{ success: boolean; count: number }>
    >("/vocabularies/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data.data || (data as any);
  },

  // Create vocabulary
  create: async (createData: CreateVocabularyDto): Promise<Vocabulary> => {
    const { data } = await api.post<ApiResponse<Vocabulary>>(
      "/vocabularies",
      createData
    );
    return data.data || (data as any);
  },

  // Lookup word
  lookup: async (word: string): Promise<Vocabulary | null> => {
    try {
      const { data } = await api.get<ApiResponse<Vocabulary>>(
        "/vocabularies/lookup",
        {
          params: { word },
        }
      );
      return data.data || (data as any);
    } catch (error: any) {
      if (error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  },
};
