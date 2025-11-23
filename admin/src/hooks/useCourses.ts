import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { coursesApi } from "@/api";
import type {
  Course,
  CreateCourseDto,
  UpdateCourseDto,
  PaginationParams,
} from "@/types/api";

export const COURSES_QUERY_KEY = "courses";

// Queries
export const useCourses = (params?: PaginationParams) => {
  return useQuery({
    queryKey: [COURSES_QUERY_KEY, params],
    queryFn: () => coursesApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCourse = (id: string) => {
  return useQuery({
    queryKey: [COURSES_QUERY_KEY, id],
    queryFn: () => coursesApi.getById(id),
    enabled: !!id,
  });
};

export const useUserCourses = () => {
  return useQuery({
    queryKey: [COURSES_QUERY_KEY, "user"],
    queryFn: () => coursesApi.getUserCourses(),
  });
};

// Mutations
export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCourseDto) => coursesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COURSES_QUERY_KEY] });
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & UpdateCourseDto) =>
      coursesApi.update({ id, ...data }),
    onSuccess: (updatedCourse) => {
      queryClient.invalidateQueries({ queryKey: [COURSES_QUERY_KEY] });
      queryClient.setQueryData(
        [COURSES_QUERY_KEY, updatedCourse.id],
        updatedCourse
      );
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => coursesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COURSES_QUERY_KEY] });
    },
  });
};
