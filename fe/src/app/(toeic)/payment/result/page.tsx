"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  RefreshCw,
  CreditCard,
  Calendar,
  DollarSign,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import { useGetOrderStatus } from "@/api/usePayment";
import { toast } from "sonner";

export default function PaymentResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Get URL params
  const orderCode = searchParams.get("order") || searchParams.get("vnp_TxnRef");
  const isSuccess =
    searchParams.get("success") === "true" ||
    searchParams.get("vnp_ResponseCode") === "00";

  // Fetch order status
  const {
    data: orderStatus,
    isLoading,
    error,
    refetch,
  } = useGetOrderStatus(orderCode || "");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (orderStatus?.status === "PAID") {
      toast.success("Thanh toán thành công!");
    } else if (orderStatus?.status === "FAILED") {
      toast.error("Thanh toán thất bại!");
    }
  }, [orderStatus?.status]);

  if (!mounted) {
    return null; // Prevent hydration errors
  }

  if (!orderCode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Không tìm thấy thông tin đơn hàng
            </h2>
            <p className="text-gray-600 mb-6">
              Vui lòng kiểm tra lại liên kết hoặc thử lại sau.
            </p>
            <Button onClick={() => router.push("/courses")} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Về trang khóa học
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Đang kiểm tra thanh toán...
            </h2>
            <p className="text-gray-600">Vui lòng đợi trong giây lát.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusInfo = () => {
    if (error) {
      return {
        icon: XCircle,
        color: "text-red-500",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        title: "Lỗi kiểm tra thanh toán",
        description:
          "Không thể kiểm tra trạng thái thanh toán. Vui lòng thử lại.",
        badgeVariant: "destructive" as const,
        status: "ERROR",
      };
    }

    switch (orderStatus?.status) {
      case "PAID":
        return {
          icon: CheckCircle,
          color: "text-green-500",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          title: "Thanh toán thành công!",
          description:
            "Đơn hàng của bạn đã được thanh toán thành công. Bạn có thể bắt đầu học ngay bây giờ.",
          badgeVariant: "default" as const,
          status: "PAID",
        };
      case "FAILED":
        return {
          icon: XCircle,
          color: "text-red-500",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          title: "Thanh toán thất bại",
          description:
            "Đơn hàng của bạn chưa được thanh toán thành công. Vui lòng thử lại.",
          badgeVariant: "destructive" as const,
          status: "FAILED",
        };
      case "CANCELLED":
        return {
          icon: XCircle,
          color: "text-orange-500",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
          title: "Thanh toán đã hủy",
          description: "Bạn đã hủy giao dịch thanh toán.",
          badgeVariant: "secondary" as const,
          status: "CANCELLED",
        };
      default:
        return {
          icon: Clock,
          color: "text-yellow-500",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          title: "Đang xử lý thanh toán...",
          description:
            "Đơn hàng của bạn đang được xử lý. Vui lòng đợi trong giây lát.",
          badgeVariant: "secondary" as const,
          status: "PENDING",
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className={`${statusInfo.borderColor} border-2`}>
            <CardHeader className={`${statusInfo.bgColor} text-center`}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <StatusIcon
                  className={`w-16 h-16 ${statusInfo.color} mx-auto mb-4`}
                />
              </motion.div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {statusInfo.title}
              </CardTitle>
              <p className="text-gray-600 mt-2">{statusInfo.description}</p>
            </CardHeader>

            <CardContent className="p-6">
              {orderStatus && (
                <div className="space-y-4">
                  {/* Order Details */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Thông tin đơn hàng
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Mã đơn hàng:</span>
                        <code className="bg-white px-2 py-1 rounded text-sm font-mono">
                          {orderStatus.code}
                        </code>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Trạng thái:</span>
                        <Badge variant={statusInfo.badgeVariant}>
                          {orderStatus.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          Số tiền:
                        </span>
                        <span className="font-semibold text-blue-600">
                          {orderStatus.amount.toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Ngày tạo:
                        </span>
                        <span className="text-gray-900">
                          {new Date(orderStatus.createdAt).toLocaleString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                      {orderStatus.updatedAt !== orderStatus.createdAt && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">
                            Cập nhật lần cuối:
                          </span>
                          <span className="text-gray-900">
                            {new Date(orderStatus.updatedAt).toLocaleString(
                              "vi-VN"
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* VNPay Transaction Details */}
                  {orderStatus.vnpayData && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Thông tin giao dịch VNPay
                      </h3>
                      <div className="space-y-2 text-sm">
                        {orderStatus.vnpayData.vnp_TransactionNo && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Mã giao dịch VNPay:
                            </span>
                            <code className="bg-white px-2 py-1 rounded font-mono">
                              {orderStatus.vnpayData.vnp_TransactionNo}
                            </code>
                          </div>
                        )}
                        {orderStatus.vnpayData.vnp_BankCode && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Ngân hàng:</span>
                            <span className="font-medium">
                              {orderStatus.vnpayData.vnp_BankCode}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <Separator className="my-6" />

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {statusInfo.status === "PAID" ? (
                  <>
                    <Button
                      onClick={() => router.push("/courses")}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Bắt đầu học ngay
                    </Button>
                    <Button
                      onClick={() => router.push("/profile/orders")}
                      variant="outline"
                      className="flex-1"
                    >
                      Xem đơn hàng
                    </Button>
                  </>
                ) : statusInfo.status === "PENDING" ? (
                  <>
                    <Button
                      onClick={() => refetch()}
                      variant="outline"
                      className="flex-1"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Kiểm tra lại
                    </Button>
                    <Button
                      onClick={() => router.push("/courses")}
                      variant="outline"
                      className="flex-1"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Về trang khóa học
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => router.push("/courses")}
                      className="flex-1"
                    >
                      Thử thanh toán lại
                    </Button>
                    <Button
                      onClick={() => router.push("/support")}
                      variant="outline"
                      className="flex-1"
                    >
                      Liên hệ hỗ trợ
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
