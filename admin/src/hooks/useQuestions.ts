import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { questionsApi, questionTagsApi } from "@/api";
import type {
  Question,
  QuestionTag,
  CreateQuestionDto,
  UpdateQuestionDto,
  PaginationParams,
} from "@/types/api";

export const QUESTIONS_QUERY_KEY = "questions";
export const QUESTION_TAGS_QUERY_KEY = "question-tags";

// Question Queries
export const useQuestions = (params?: PaginationParams) => {
  return useQuery({
    queryKey: [QUESTIONS_QUERY_KEY, params],
    queryFn: () => questionsApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useQuestion = (id: string) => {
  return useQuery({
    queryKey: [QUESTIONS_QUERY_KEY, id],
    queryFn: () => questionsApi.getById(id),
    enabled: !!id,
  });
};

// Question Tags Queries
export const useQuestionTags = (params?: PaginationParams) => {
  return useQuery({
    queryKey: [QUESTION_TAGS_QUERY_KEY, params],
    queryFn: () => questionTagsApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Question Mutations
export const useCreateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateQuestionDto) => questionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUESTIONS_QUERY_KEY] });
    },
  });
};

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & UpdateQuestionDto) =>
      questionsApi.update({ id, ...data }),
    onSuccess: (updatedQuestion) => {
      queryClient.invalidateQueries({ queryKey: [QUESTIONS_QUERY_KEY] });
      queryClient.setQueryData(
        [QUESTIONS_QUERY_KEY, updatedQuestion.id],
        updatedQuestion
      );
    },
  });
};

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => questionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUESTIONS_QUERY_KEY] });
    },
  });
};

export const useCreateQuestionWithTags = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (questionId: string) => questionsApi.createWithTags(questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUESTIONS_QUERY_KEY] });
    },
  });
};

export const useSyncVocabsQuestions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => questionsApi.syncVocabsQuestions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUESTIONS_QUERY_KEY] });
    },
  });
};

// Question Tag Mutations
export const useCreateQuestionTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string }) => questionTagsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUESTION_TAGS_QUERY_KEY] });
    },
  });
};

export const useUpdateQuestionTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      questionTagsApi.update({ id, name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUESTION_TAGS_QUERY_KEY] });
    },
  });
};

export const useDeleteQuestionTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => questionTagsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUESTION_TAGS_QUERY_KEY] });
    },
  });
};
