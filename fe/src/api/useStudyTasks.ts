import api from "@/libs/axios-config";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Types for study task operations
export interface CompleteTaskResponse {
  currentId: string;
  openedNextId: string | null;
  isPlanCompleted: boolean;
}

export interface StudyTask {
  id: string;
  status: "pending" | "in_progress" | "completed" | "skipped" | "locked";
  lessonId: string;
  lessonContentId: string;
}

// API functions
async function completeStudyTask(
  taskId: string
): Promise<CompleteTaskResponse> {
  const res = await api.patch(`/study-tasks/${taskId}`);
  if (!res.data) throw new Error("Failed to complete study task");
  return res.data;
}

async function skipStudyTask(taskId: string): Promise<CompleteTaskResponse> {
  // For now, we'll use the same endpoint but with a different body parameter
  // You might need to modify the backend to handle skip action
  const res = await api.patch(`/study-tasks/${taskId}`, { action: "skip" });
  if (!res.data) throw new Error("Failed to skip study task");
  return res.data;
}

// React Query hooks
export const useCompleteStudyTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeStudyTask,
    onSuccess: (data) => {
      // Invalidate relevant queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ["plans", "my-plan"] });
      queryClient.invalidateQueries({ queryKey: ["courses", "latest"] });
    },
    onError: (error: any) => {
      console.error("Failed to complete study task:", error);
    },
  });
};

export const useSkipStudyTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: skipStudyTask,
    onSuccess: (data) => {
      // Invalidate relevant queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ["plans", "my-plan"] });
      queryClient.invalidateQueries({ queryKey: ["courses", "latest"] });
    },
    onError: (error: any) => {
      console.error("Failed to skip study task:", error);
    },
  });
};
