import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/libs/axios-config";

// Types
export interface CreatePaymentRequest {
  code: string;
  amount: number;
  qr?: number;
  courseId?: string;
  userId?: string;
}

export interface CreatePaymentResponse {
  data: {
    paymentUrl: string;
  };
  message: string;
  statusCode: number;
}

export interface OrderStatusData {
  id: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  code: string;
  amount: number;
  status: "pending" | "paid" | "failed" | "cancelled";
  bankCode?: string;
  vnpTransactionNo?: string;
  vnpPayDate?: string;
}

export interface OrderStatus {
  statusCode: number;
  message: string;
  data: OrderStatusData;
}

// Create payment
export const useCreatePayment = () => {
  return useMutation<CreatePaymentResponse, Error, CreatePaymentRequest>({
    mutationFn: async (data) => {
      const queryParams = new URLSearchParams({
        code: data.code,
        amount: data.amount.toString(),
        ...(data.qr && { qr: data.qr.toString() }),
        ...(data.courseId && { courseId: data.courseId }),
        ...(data.userId && { userId: data.userId }),
      });

      const response = await api.get(`/vnpay/create?${queryParams}`);
      return response.data;
    },
  });
};

// Get order status
export const useGetOrderStatus = (code: string) => {
  return useQuery<OrderStatus, Error>({
    queryKey: ["order-status", code],
    queryFn: async () => {
      const response = await api.get(`/orders/${code}`);
      return response.data;
    },
    enabled: !!code,
    refetchInterval: 5000,
  });
};
