import api from "@/libs/axios-config";
import { Test, TestSchema } from "@/types";
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

export const useTest = () => {
  return useQuery({
    queryKey: ["test"],
    queryFn: () => fetchTest(),
    staleTime: 24 * 60 * 60 * 1000,
  });
};
