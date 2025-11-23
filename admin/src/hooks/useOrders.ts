import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "@/api";
import type { Order, CreateOrderDto, PaginationParams } from "@/types/api";

export const ORDERS_QUERY_KEY = "orders";

// Queries
export const useOrders = (params?: PaginationParams) => {
  return useQuery({
    queryKey: [ORDERS_QUERY_KEY, params],
    queryFn: () => ordersApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useOrderByCode = (code: string) => {
  return useQuery({
    queryKey: [ORDERS_QUERY_KEY, "code", code],
    queryFn: () => ordersApi.getByCode(code),
    enabled: !!code,
  });
};

// Mutations
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderDto) => ordersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] });
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ordersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] });
    },
  });
};
