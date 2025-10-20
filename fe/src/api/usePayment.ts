import { useMutation, useQuery } from "@tanstack/react-query";

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

export interface OrderStatus {
  code: string;
  amount: number;
  status: "PENDING" | "PAID" | "FAILED" | "CANCELLED";
  courseId?: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
  vnpayData?: any;
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

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}vnpay/create?${queryParams}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create payment");
      }

      return response.json();
    },
  });
};

// Get order status
export const useGetOrderStatus = (code: string) => {
  return useQuery<OrderStatus, Error>({
    queryKey: ["order-status", code],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}orders/${code}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get order status");
      }

      return response.json();
    },
    enabled: !!code,
    refetchInterval: 5000, // Poll every 5 seconds
  });
};
