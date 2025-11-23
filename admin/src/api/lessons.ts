import { api } from "@/lib/axios";
import type {
  Lesson,
  CreateLessonDto,
  UpdateLessonDto,
  ApiResponse,
  PaginationParams,
} from "@/types/api";

export const lessonsApi = {
  // Get all lessons
  getAll: async (params?: PaginationParams): Promise<Lesson[]> => {
    const { data } = await api.get<ApiResponse<Lesson[]>>("/lesson", {
      params,
    });
    return data.data || (data as any);
  },

  // Get lesson by ID
  getById: async (id: string): Promise<Lesson> => {
    const { data } = await api.get<ApiResponse<Lesson>>(`/lesson/${id}`);
    return data.data || (data as any);
  },

  // Create new lesson
  create: async (lessonData: CreateLessonDto): Promise<Lesson> => {
    const { data } = await api.post<ApiResponse<Lesson>>("/lesson", lessonData);
    return data.data || (data as any);
  },

  // Update lesson
  update: async ({
    id,
    ...updateData
  }: { id: string } & UpdateLessonDto): Promise<Lesson> => {
    const { data } = await api.patch<ApiResponse<Lesson>>(
      `/lesson/${id}`,
      updateData
    );
    return data.data || (data as any);
  },

  // Delete lesson
  delete: async (id: string): Promise<void> => {
    await api.delete(`/lesson/${id}`);
  },

  // Get lessons by modality
  getByModality: async (
    modality: string,
    skillType?: string
  ): Promise<Lesson[]> => {
    const { data } = await api.get<ApiResponse<Lesson[]>>(
      "/lesson/by-modality",
      {
        params: { modality, skillType },
      }
    );
    return data.data || (data as any);
  },
};
