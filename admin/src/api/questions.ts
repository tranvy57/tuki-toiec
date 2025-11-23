import { api } from "@/lib/axios";
import type {
  Question,
  Answer,
  QuestionTag,
  CreateQuestionDto,
  UpdateQuestionDto,
  ApiResponse,
  PaginationParams,
} from "@/types/api";

export const questionsApi = {
  // Get all questions
  getAll: async (params?: PaginationParams): Promise<Question[]> => {
    const { data } = await api.get<ApiResponse<Question[]>>("/question", {
      params,
    });
    return data.data || (data as any);
  },

  // Get question by ID
  getById: async (id: string): Promise<Question> => {
    const { data } = await api.get<ApiResponse<Question>>(`/question/${id}`);
    return data.data || (data as any);
  },

  // Create new question
  create: async (questionData: CreateQuestionDto): Promise<Question> => {
    const { data } = await api.post<ApiResponse<Question>>(
      "/question",
      questionData
    );
    return data.data || (data as any);
  },

  // Update question
  update: async ({
    id,
    ...updateData
  }: { id: string } & UpdateQuestionDto): Promise<Question> => {
    const { data } = await api.patch<ApiResponse<Question>>(
      `/question/${id}`,
      updateData
    );
    return data.data || (data as any);
  },

  // Delete question
  delete: async (id: string): Promise<void> => {
    await api.delete(`/question/${id}`);
  },

  // Create question with tags
  createWithTags: async (questionId: string): Promise<Question> => {
    const { data } = await api.post<ApiResponse<Question>>(
      `/question/create-with-tags/${questionId}`
    );
    return data.data || (data as any);
  },

  // Sync vocabularies to questions
  syncVocabsQuestions: async (): Promise<void> => {
    await api.post("/question/sync-vocabs-questions");
  },
};

export const questionTagsApi = {
  // Get all question tags
  getAll: async (params?: PaginationParams): Promise<QuestionTag[]> => {
    const { data } = await api.get<ApiResponse<QuestionTag[]>>(
      "/question-tags",
      { params }
    );
    return data.data || (data as any);
  },

  // Get tag by ID
  getById: async (id: string): Promise<QuestionTag> => {
    const { data } = await api.get<ApiResponse<QuestionTag>>(
      `/question-tags/${id}`
    );
    return data.data || (data as any);
  },

  // Create new tag
  create: async (tagData: { name: string }): Promise<QuestionTag> => {
    const { data } = await api.post<ApiResponse<QuestionTag>>(
      "/question-tags",
      tagData
    );
    return data.data || (data as any);
  },

  // Update tag
  update: async ({
    id,
    ...updateData
  }: {
    id: string;
    name: string;
  }): Promise<QuestionTag> => {
    const { data } = await api.patch<ApiResponse<QuestionTag>>(
      `/question-tags/${id}`,
      updateData
    );
    return data.data || (data as any);
  },

  // Delete tag
  delete: async (id: string): Promise<void> => {
    await api.delete(`/question-tags/${id}`);
  },
};
