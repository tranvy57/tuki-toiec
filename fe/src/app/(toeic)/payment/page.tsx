"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  Shield,
  Clock,
  CheckCircle,
  Star,
  ArrowRight,
  Gift,
  Users,
  BookOpen,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";
import PaymentButton from "@/components/PaymentButton";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import { useCourses } from "@/api/useCourse";

interface Course {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  features: string[];
  duration: string;
  lessons: number;
  level: string;
  instructor: string;
  rating: number;
  students: number;
  image?: string;
}

// Mock course data - in real app, this would come from props or API
const mockCourse: Course = {
  id: "550",
  name: "TOEIC Complete 550+",
  description:
    "Khóa học TOEIC toàn diện giúp bạn đạt 550+ điểm với phương pháp học hiệu quả nhất.",
  price: 199000,
  originalPrice: 299000,
  features: [
    "2000+ câu hỏi thực hành",
    "10 bộ đề thi thử hoàn chỉnh",
    "Video bài giảng chi tiết",
    "Chấm điểm và phân tích kết quả",
    "Hỗ trợ 24/7 từ giảng viên",
    "Cập nhật nội dung mới nhất",
    "Chứng chỉ hoàn thành",
    "Truy cập trọn đời",
  ],
  duration: "3 tháng",
  lessons: 120,
  level: "Beginner to Intermediate",
  instructor: "Thầy Nguyễn Văn A",
  rating: 4.8,
  students: 1250,
  image: "/images/toeic-course.jpg",
};

export default function PaymentPage() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("vnpay");
  const params = useSearchParams();

  const { data } = useCourses();
  const courseId = params.get("course");
  const course = data?.find((c) => c.id === courseId);

  const discountPercent = mockCourse.originalPrice
    ? Math.round(
        ((mockCourse.originalPrice - mockCourse.price) /
          mockCourse.originalPrice) *
          100
      )
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Hoàn tất thanh toán
            </h1>
            <p className="text-gray-600">
              Chỉ còn một bước nữa để bắt đầu hành trình học TOEIC của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    Thông tin khóa học
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Course Image */}
                    <div className="w-full sm:w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-12 h-12 text-blue-600" />
                    </div>

                    {/* Course Details */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">
                          {course?.title}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          <div
                            className="text-gray-700 text-sm leading-relaxed prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{
                              __html: course?.description || "",
                            }}
                          />
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>
                            {mockCourse.students.toLocaleString()} học viên
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>{mockCourse.rating}/5</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{mockCourse.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4" />
                          <span>{mockCourse.lessons} bài học</span>
                        </div>
                      </div>

                      <Badge variant="secondary" className="w-fit">
                        {mockCourse.level}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Course Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-green-600" />
                    Bạn sẽ nhận được
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {mockCourse.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Security */}
              <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                <CardContent className="py-4">
                  <div className="flex items-center gap-3">
                    <Shield className="w-8 h-8 text-green-600" />
                    <div>
                      <h4 className="font-semibold text-green-800">
                        Thanh toán an toàn 100%
                      </h4>
                      <p className="text-green-700 text-sm">
                        Được bảo mật bởi VNPay - Cổng thanh toán hàng đầu Việt
                        Nam
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Summary */}
            <div className="space-y-6">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                    Thanh toán
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Price Summary */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Giá gốc</span>
                      <span className="text-gray-500 ">
                        {course?.price.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                    {/* 
                    {mockCourse.originalPrice && (
                      <div className="flex justify-between items-center">
                        <span className="text-green-600 font-medium">
                          Giảm giá ({discountPercent}%)
                        </span>
                        <span className="text-green-600 font-medium">
                          -
                          {(
                            mockCourse.originalPrice - mockCourse.price
                          ).toLocaleString("vi-VN")}
                          đ
                        </span>
                      </div>
                    )} */}

                    <Separator />

                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-lg">Tổng cộng</span>
                      <span className="font-bold text-xl text-blue-600">
                        {course?.price.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  </div>

                  {/* Payment Method Selection */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">
                      Chọn phương thức thanh toán
                    </h4>

                    <div className="space-y-2">
                      <button
                        onClick={() => setSelectedPaymentMethod("vnpay")}
                        className={`w-full p-3 rounded-lg border-2 transition-all ${
                          selectedPaymentMethod === "vnpay"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              VP
                            </span>
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-gray-900">
                              VNPay
                            </div>
                            <div className="text-xs text-gray-600">
                              ATM, Visa, Mastercard, QR Code
                            </div>
                          </div>
                          {selectedPaymentMethod === "vnpay" && (
                            <CheckCircle className="w-5 h-5 text-blue-500 ml-auto" />
                          )}
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Payment Button */}
                  <PaymentButton
                    courseId={course?.id || ""}
                    courseName={course?.title || ""}
                    amount={course?.price || 0}
                    className="mt-4"
                  />

                  {/* Money Back Guarantee */}
                  <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Shield className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">
                        Đảm bảo hoàn tiền 100%
                      </span>
                    </div>
                    <p className="text-xs text-yellow-700">
                      Trong vòng 7 ngày nếu không hài lòng
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Support */}
              <Card>
                <CardContent className="py-4">
                  <div className="text-center">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Cần hỗ trợ?
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Liên hệ với chúng tôi để được tư vấn
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Chat với tư vấn viên
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
