import { api } from "@/lib/axios";
import type {
  Course,
  CreateCourseDto,
  UpdateCourseDto,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from "@/types/api";

export const coursesApi = {
  // Get all courses
  getAll: async (params?: PaginationParams): Promise<Course[]> => {
    const { data } = await api.get<ApiResponse<Course[]>>("/courses", {
      params,
    });
    return data.data || (data as any); // Handle both wrapped and direct responses
  },

  // Get course by ID
  getById: async (id: string): Promise<Course> => {
    const { data } = await api.get<ApiResponse<Course>>(`/courses/${id}`);
    return data.data || (data as any);
  },

  // Create new course
  create: async (courseData: CreateCourseDto): Promise<Course> => {
    const { data } = await api.post<ApiResponse<Course>>(
      "/courses",
      courseData
    );
    return data.data || (data as any);
  },

  // Update course
  update: async ({
    id,
    ...updateData
  }: { id: string } & UpdateCourseDto): Promise<Course> => {
    const { data } = await api.patch<ApiResponse<Course>>(
      `/courses/${id}`,
      updateData
    );
    return data.data || (data as any);
  },

  // Delete course
  delete: async (id: string): Promise<void> => {
    await api.delete(`/courses/${id}`);
  },

  // Get user's purchased courses
  getUserCourses: async (): Promise<Course[]> => {
    const { data } = await api.get<ApiResponse<Course[]>>("/courses/latest");
    return data.data || (data as any);
  },
};
