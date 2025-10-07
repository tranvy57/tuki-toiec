import api from "@/libs/axios-config";
import { FullTestResponse, FullTestResponseSchema, Test, TestSchema } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const fetchTest = async (): Promise<Test[]> => {
  try {
    const res = await api.get(`/tests`);
    const parsed = TestSchema.array().parse(res.data.data);
    console.log(parsed);
    return parsed;
  } catch (error) {
    console.error("Error fetching tests:", error);
    throw error;
  }
};

export const fetchTestById = async (id: string): Promise<FullTestResponse> => {
  try {
    const res = await api.get(`/tests/${id}`);
    const parsed = FullTestResponseSchema.parse(res.data.data);
    console.log(parsed)
    return parsed;
  } catch (error) {
    console.error(`Error fetching test with id ${id}:`, error);
    throw error;
  }
};

export const useTest = () => {
  return useQuery({
    queryKey: ["test"],
    queryFn: () => fetchTest(),
    staleTime: 24 * 60 * 60 * 1000,
  });
};

export const useTestById = (id: string) => {
  return useQuery({
    queryKey: ["test", id],
    queryFn: () => fetchTestById(id),
    enabled: !!id,
    staleTime: 24 * 60 * 60 * 1000,
  });
}
