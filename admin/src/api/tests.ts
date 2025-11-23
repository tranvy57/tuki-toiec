import { api } from "@/lib/axios";
import type {
  Test,
  CreateTestDto,
  UpdateTestDto,
  ApiResponse,
  PaginationParams,
} from "@/types/api";

export const testsApi = {
  // Get all tests
  getAll: async (params?: PaginationParams): Promise<Test[]> => {
    const { data } = await api.get<ApiResponse<Test[]>>("/tests", { params });
    return data.data || (data as any);
  },

  // Get test by ID
  getById: async (id: string): Promise<Test> => {
    const { data } = await api.get<ApiResponse<Test>>(`/tests/${id}`);
    return data.data || (data as any);
  },

  // Create new test
  create: async (testData: CreateTestDto): Promise<Test> => {
    const { data } = await api.post<ApiResponse<Test>>("/tests", testData);
    return data.data || (data as any);
  },

  // Update test
  update: async (id: string, testData: UpdateTestDto): Promise<Test> => {
    const { data } = await api.put<ApiResponse<Test>>(`/tests/${id}`, testData);
    return data.data || (data as any);
  },

  // Delete test
  delete: async (id: string): Promise<void> => {
    await api.delete(`/tests/${id}`);
  },

  // Import test from Excel
  importExcel: async (
    file: File,
    title: string,
    audioUrl?: string
  ): Promise<Test> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    if (audioUrl) {
      formData.append("audioUrl", audioUrl);
    }

    const { data } = await api.post<ApiResponse<Test>>(
      "/tests/import",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data.data || (data as any);
  },

  // Generate review test
  generateReviewTest: async (): Promise<Test> => {
    const { data } = await api.post<ApiResponse<Test>>(
      "/tests/gen-review-test"
    );
    return data.data || (data as any);
  },
};

// Legacy function for backward compatibility
export const importTestFromExcel = testsApi.importExcel;
