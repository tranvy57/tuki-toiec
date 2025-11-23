import { api } from "@/lib/axios";
import type {
  Phase,
  CreatePhaseDto,
  UpdatePhaseDto,
  Lesson,
  ApiResponse,
  PaginationParams,
} from "@/types/api";

export const phasesApi = {
  // Get all phases
  getAll: async (params?: PaginationParams): Promise<Phase[]> => {
    const { data } = await api.get<ApiResponse<Phase[]>>("/phases", { params });
    return data.data || (data as any);
  },

  // Get phase by ID
  getById: async (id: string): Promise<Phase> => {
    const { data } = await api.get<ApiResponse<Phase>>(`/phases/${id}`);
    return data.data || (data as any);
  },

  // Create new phase
  create: async (phaseData: CreatePhaseDto): Promise<Phase> => {
    const { data } = await api.post<ApiResponse<Phase>>("/phases", phaseData);
    return data.data || (data as any);
  },

  // Update phase
  update: async ({
    id,
    ...updateData
  }: { id: string } & UpdatePhaseDto): Promise<Phase> => {
    const { data } = await api.patch<ApiResponse<Phase>>(
      `/phases/${id}`,
      updateData
    );
    return data.data || (data as any);
  },

  // Delete phase
  delete: async (id: string): Promise<void> => {
    await api.delete(`/phases/${id}`);
  },

  // Get lessons in phase
  getLessons: async (phaseId: string): Promise<Lesson[]> => {
    const { data } = await api.get<ApiResponse<Lesson[]>>(
      `/phases/${phaseId}/lessons`
    );
    return data.data || (data as any);
  },
};
