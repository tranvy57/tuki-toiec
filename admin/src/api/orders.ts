import { api } from "@/lib/axios";
import type {
  Order,
  CreateOrderDto,
  ApiResponse,
  PaginationParams,
} from "@/types/api";

export const ordersApi = {
  // Get all orders
  getAll: async (params?: PaginationParams): Promise<Order[]> => {
    const { data } = await api.get<ApiResponse<Order[]>>("/orders", { params });
    return data.data || (data as any);
  },

  // Get order by code
  getByCode: async (code: string): Promise<Order> => {
    const { data } = await api.get<ApiResponse<Order>>(`/orders/${code}`);
    return data.data || (data as any);
  },

  // Create new order
  create: async (orderData: CreateOrderDto): Promise<Order> => {
    const { data } = await api.post<ApiResponse<Order>>("/orders", orderData);
    return data.data || (data as any);
  },

  // Delete order
  delete: async (id: string): Promise<void> => {
    await api.delete(`/orders/${id}`);
  },
};
