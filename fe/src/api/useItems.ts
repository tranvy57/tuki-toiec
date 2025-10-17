import api from "@/libs/axios-config";
import { ItemsResponse, ItemsResponseSchema } from "@/types/implements/item";
import { useQuery } from "@tanstack/react-query";

interface UseItemsOptions {
  modality?: string;
  difficulty?: string;
  skill_type?: string;  
  limit?: number;
  offset?: number;
}

async function fetchItems({
  modality = "cloze",
  difficulty,
  skill_type,
  limit = 20,
  offset = 0,
}: UseItemsOptions): Promise<ItemsResponse> {
  const params = { modality, difficulty, skill_type, limit, offset };
  try {
    const res = await api.get(`/items`, { params });
    const parsed = ItemsResponseSchema.safeParse(res.data.data);
    if (!parsed.success) {
      throw new Error("Invalid items response schema");
    }
    return parsed.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
}

export function useItems(options?: UseItemsOptions) {
  const {
    modality = "cloze",
    difficulty,
    skill_type,
    limit,
    offset,
  } = options || {};

  return useQuery({
    queryKey: ["items", modality, difficulty, skill_type, limit, offset],
    queryFn: () => fetchItems({ modality, difficulty, skill_type, limit, offset }),
    staleTime: 5 * 60 * 1000,
  });
}
