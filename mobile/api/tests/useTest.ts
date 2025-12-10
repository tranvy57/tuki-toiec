import { useQuery } from '@tanstack/react-query';
import { api } from '~/libs/axios';
import { TestSchema } from '~/types/response/TestResponse';

export const fetchTests = async () => {
  try {
    const res = await api.get(`/tests`);
    const parsed = TestSchema.array().parse(res.data.data);
    return parsed;
  } catch (error) {
    console.error('Error fetching tests:', error);
    throw error;
  }
};

export const fetchTestById = async (id: string) => {
  try {
    const res = await api.get(`/tests/${id}`);
    const parsed = TestSchema.parse(res.data.data);
    return parsed;
  } catch (error) {
    console.error(`Error fetching test with id ${id}:`, error);
    throw error;
  }
};

export const useTests = () => {
  return useQuery({
    queryKey: ['tests'],
    queryFn: () => fetchTests(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

export const useTestById = (id: string) => {
  return useQuery({
    queryKey: ['test', id],
    queryFn: () => fetchTestById(id),
    enabled: !!id,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};
