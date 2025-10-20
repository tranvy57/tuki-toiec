"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard } from "lucide-react";
import { useCreatePayment } from "@/api/usePayment";
import { toast } from "sonner";

interface PaymentButtonProps {
  courseId: string;
  courseName: string;
  amount: number;
  userId?: string;
  className?: string;
  disabled?: boolean;
}

export default function PaymentButton({
  courseId,
  courseName,
  amount,
  userId,
  className,
  disabled,
}: PaymentButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const createPayment = useCreatePayment();

  const handlePayment = async () => {
    if (disabled || isProcessing) return;

    setIsProcessing(true);

    try {
      const code = `COURSE${courseId}_${Date.now()}`;

      const result = await createPayment.mutateAsync({
        code,
        amount,
        qr: 1, 
        courseId,
        userId,
      });

      if (result.data.paymentUrl) {
        window.location.href = result.data.paymentUrl;
      } else {
        throw new Error("No payment URL received");
      }
    } catch (error) {
      console.error("Payment creation failed:", error);
      toast.error("Không thể tạo thanh toán. Vui lòng thử lại.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled || isProcessing}
      className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 ${className}`}
    >
      {isProcessing ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Đang xử lý...
        </>
      ) : (
        <>
          <CreditCard className="w-4 h-4 mr-2" />
          Thanh toán {amount.toLocaleString("vi-VN")}đ
        </>
      )}
    </Button>
  );
}
