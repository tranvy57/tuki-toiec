import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vocabulariesApi } from "@/api";
import type { UpdateVocabularyDto, PaginationParams } from "@/types/api";
import { toast } from "sonner";

export const VOCABULARIES_QUERY_KEY = "vocabularies";

// Queries
export const useVocabularies = (
  params?: PaginationParams & {
    search?: string;
    type?: string;
    partOfSpeech?: string;
  }
) => {
  return useQuery({
    queryKey: [VOCABULARIES_QUERY_KEY, params],
    queryFn: () => vocabulariesApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateVocabulary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: vocabulariesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VOCABULARIES_QUERY_KEY] });
      toast.success("Tạo từ vựng thành công!");
    },
    onError: (error: any) => {
      toast.error("Có lỗi xảy ra khi tạo từ vựng", {
        description: error?.response?.data?.message || "Vui lòng thử lại.",
      });
    },
  });
};

export const useVocabulary = (id: string) => {
  return useQuery({
    queryKey: [VOCABULARIES_QUERY_KEY, id],
    queryFn: () => vocabulariesApi.getById(id),
    enabled: !!id,
  });
};

export const useVocabularyLookup = (word: string) => {
  return useQuery({
    queryKey: [VOCABULARIES_QUERY_KEY, "lookup", word],
    queryFn: () => vocabulariesApi.lookup(word),
    enabled: !!word && word.length > 2,
  });
};

// Mutations
export const useUpdateVocabulary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & UpdateVocabularyDto) =>
      vocabulariesApi.update({ id, ...data }),
    onSuccess: (updatedVocabulary) => {
      queryClient.invalidateQueries({ queryKey: [VOCABULARIES_QUERY_KEY] });
      queryClient.setQueryData(
        [VOCABULARIES_QUERY_KEY, updatedVocabulary.id],
        updatedVocabulary
      );
      toast.success("Cập nhật từ vựng thành công!");
    },
    onError: (error: any) => {
      toast.error("Có lỗi xảy ra khi cập nhật từ vựng", {
        description: error?.response?.data?.message || "Vui lòng thử lại.",
      });
    },
  });
};

export const useDeleteVocabulary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => vocabulariesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VOCABULARIES_QUERY_KEY] });
      toast.success("Xóa từ vựng thành công!");
    },
    onError: (error: any) => {
      toast.error("Có lỗi xảy ra khi xóa từ vựng", {
        description: error?.response?.data?.message || "Vui lòng thử lại.",
      });
    },
  });
};

export const useImportVocabulariesFromExcel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => vocabulariesApi.importFromExcel(file),
    onSuccess: (data: { success: boolean; count: number }) => {
      queryClient.invalidateQueries({ queryKey: [VOCABULARIES_QUERY_KEY] });
      toast.success("Import thành công!", {
        description: `Đã thêm ${data.count} từ vựng.`,
      });
    },
    onError: (error: any) => {
      toast.error("Có lỗi xảy ra khi import", {
        description:
          error?.response?.data?.message || "Vui lòng kiểm tra file Excel.",
      });
    },
  });
};
