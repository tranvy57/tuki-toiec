import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Zap, Check, Star } from "lucide-react";

interface PremiumUpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentType?: string;
  courseId?: string;
  courseName?: string;
  price?: number;
}

export function PremiumUpgradeDialog({
  open,
  onOpenChange,
  contentType = "content",
  courseId,
  courseName,
  price,
}: PremiumUpgradeDialogProps) {
  const router = useRouter();
  const getContentTypeLabel = (type: string) => {
    const labels = {
      strategy: "Chiến lược",
      video: "Video",
      quiz: "Bài tập",
      explanation: "Giải thích",
      vocabulary: "Từ vựng",
      content: "nội dung",
    };
    return labels[type as keyof typeof labels] || "nội dung";
  };

  const premiumFeatures = [
    "Truy cập tất cả video bài giảng chất lượng cao",
    "Làm bài tập và kiểm tra không giới hạn",
    "Xem chi tiết giải thích cho mọi câu hỏi",
    "Theo dõi tiến độ học tập chi tiết",
    "Tải xuống tài liệu học offline",
    "Hỗ trợ ưu tiên từ giảng viên",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-xl font-bold">
            Nâng cấp lên Premium
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {getContentTypeLabel(contentType)} này chỉ dành cho thành viên
            Premium. Nâng cấp ngay để mở khóa tất cả nội dung!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Premium Badge */}
          <div className="flex justify-center">
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2">
              <Star className="w-4 h-4 mr-2" />
              Premium Content
            </Badge>
          </div>

          {/* Features List */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-gray-900 mb-3">
              Với Premium, bạn sẽ được:
            </h4>
            {premiumFeatures.slice(0, 4).map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-xl border">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">2,990,000₫</div>
              <div className="text-sm text-gray-500">
                Trọn đời - Chỉ thanh toán 1 lần
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="space-y-2 sm:space-y-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Để sau
          </Button>
          <Button
            className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white"
            onClick={() => {
              if (!courseId) return;
              router.push(`/payment?course=${courseId}`);
              onOpenChange(false);
            }}
            disabled={!courseId}
          >
            <Zap className="w-4 h-4 mr-2" />
            Nâng cấp ngay
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
