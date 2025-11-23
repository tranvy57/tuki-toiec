import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { testsApi } from "@/api";
import type { Test, CreateTestDto, PaginationParams } from "@/types/api";

export const TESTS_QUERY_KEY = "tests";

// Queries
export const useTests = (params?: PaginationParams) => {
  return useQuery({
    queryKey: [TESTS_QUERY_KEY, params],
    queryFn: () => testsApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTest = (id: string) => {
  return useQuery({
    queryKey: [TESTS_QUERY_KEY, id],
    queryFn: () => testsApi.getById(id),
    enabled: !!id,
  });
};

// Mutations
export const useCreateTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTestDto) => testsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TESTS_QUERY_KEY] });
    },
  });
};

export const useUpdateTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      testsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TESTS_QUERY_KEY] });
    },
  });
};

export const useDeleteTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => testsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TESTS_QUERY_KEY] });
    },
  });
};

export const useImportTestFromExcel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      file,
      title,
      audioUrl,
    }: {
      file: File;
      title: string;
      audioUrl?: string;
    }) => testsApi.importExcel(file, title, audioUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TESTS_QUERY_KEY] });
    },
  });
};

export const useGenerateReviewTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => testsApi.generateReviewTest(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TESTS_QUERY_KEY] });
    },
  });
};
