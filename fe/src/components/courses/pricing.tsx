"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Shield, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { pricingPlans } from "../dashboard/pricing-section";
import { RippleButton } from "../ui/ripple-button";
import { cn } from "@/utils";
import { useCourses } from "@/api/useCourse";
import { Alert, AlertDescription } from "../ui/alert";

export function Pricing() {
  const { data: courses, isLoading, isError, error, refetch } = useCourses();

  // Loading State Component
  const LoadingCard = () => (
    <Card className="relative rounded-2xl bg-gradient-to-r from-white via-pink-100 to-primary-2 shadow-lg">
      <CardHeader className="text-center pb-4 pt-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-300 rounded"></div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-start gap-3 animate-pulse">
            <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
            <div className="h-4 bg-gray-200 rounded flex-1"></div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <div className="w-full h-12 bg-gray-300 rounded-xl animate-pulse"></div>
      </CardFooter>
    </Card>
  );

  // Error State Component
  const ErrorCard = () => (
    <Card className="relative rounded-2xl bg-gradient-to-r from-red-50 via-red-100 to-red-200 shadow-lg border-red-200">
      <CardHeader className="text-center pb-4 pt-8">
        <div className="flex flex-col items-center gap-3">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <CardTitle className="text-2xl font-bold text-red-700">
            Không thể tải dữ liệu
          </CardTitle>
          <CardDescription className="text-red-600">
            Đã xảy ra lỗi khi tải thông tin khóa học
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="text-center pb-8">
        <p className="text-sm text-red-600 mb-4">
          {error?.message || "Vui lòng thử lại sau"}
        </p>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => refetch()}
          variant="outline"
          className="w-full border-red-300 text-red-700 hover:bg-red-50"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Thử lại
        </Button>
      </CardFooter>
    </Card>
  );
  return (
    <section id="pricing" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Bảng giá đơn giản, minh bạch
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Chọn gói phù hợp với mục tiêu học tập của bạn
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
          {/* Show loading state */}
          {isLoading && (
            <>
              {[...Array(4)].map((_, index) => (
                <LoadingCard key={`loading-${index}`} />
              ))}
            </>
          )}

          {/* Show error state */}
          {isError && !isLoading && (
            <div className="col-span-full">
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-700">
                  Không thể tải thông tin khóa học.
                  <Button
                    variant="link"
                    className="p-0 ml-1 h-auto text-red-700 underline"
                    onClick={() => refetch()}
                  >
                    Thử lại
                  </Button>
                </AlertDescription>
              </Alert>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8">
                {[...Array(4)].map((_, index) => (
                  <ErrorCard key={`error-${index}`} />
                ))}
              </div>
            </div>
          )}

          {/* Show success state with data */}
          {!isLoading && !isError && courses && (
            <>
              {courses.map((course, index) => {
                // Determine if this is the most popular plan (highest price)
                const maxPrice = Math.max(...courses.map((c) => c.price ?? 0));
                const isHighlighted =
                  course.price === maxPrice && course.price > 0;

                return (
                  <Card
                    key={course.id}
                    style={{ transform: `scale(${1 + index * 0.03})` }}
                    className="relative rounded-2xl transition-all duration-300 bg-gradient-to-r from-white via-pink-100 to-primary-2 shadow-lg hover:shadow-xl"
                  >
                    {isHighlighted && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-2 to-pink-400 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                        Phổ biến nhất
                      </div>
                    )}

                    <CardHeader className="text-center pb-4 pt-8">
                      <CardTitle className="text-3xl font-bold mb-2">
                        {course.title}
                      </CardTitle>
                      <CardDescription className="text-base">
                        Mục tiêu: {course.band} điểm TOEIC
                      </CardDescription>
                      <div className="mt-4">
                        <span className="text-4xl font-bold bg-gradient-to-r from-pink-300 via-pink-400 to-primary bg-clip-text text-transparent">
                          {course.price === 0
                            ? "Miễn phí"
                            : `${course.price.toLocaleString("vi-VN")}đ`}
                        </span>
                        {course.price !== 0 && (
                          <span className="text-gray-500 text-lg">/khóa</span>
                        )}
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        Thời gian: {course.durationDays} ngày
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3 pb-8">
                      <div
                        className="text-gray-700 text-sm leading-relaxed prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: course.description || "",
                        }}
                      />
                    </CardContent>

                    <CardFooter>
                      <RippleButton
                        className={cn(
                          "relative w-full rounded-xl py-3 px-4 font-semibold text-lg",
                          "bg-gradient-to-r from-primary-2 to-primary",
                          "text-white drop-shadow-[0_1px_0_rgba(0,0,0,0.1)] shadow-lg transition-all duration-300",
                          "hover:shadow-2xl hover:brightness-110 active:scale-95"
                        )}
                        rippleColor="rgba(255,255,255,0.5)"
                      >
                        <span className="flex items-center justify-center gap-2">
                          {course.price === 0
                            ? "Bắt đầu miễn phí"
                            : "Đăng ký ngay"}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </span>
                      </RippleButton>
                    </CardFooter>
                  </Card>
                );
              })}
            </>
          )}

          {/* Fallback when no data but no error */}
          {!isLoading && !isError && !courses && (
            <>
              {pricingPlans.map((plan, index) => {
                return (
                  <Card
                    key={plan.name}
                    style={{ transform: `scale(${1 + index * 0.03})` }}
                    className="relative rounded-2xl transition-all duration-300 bg-gradient-to-r from-white via-pink-100 to-primary-2 shadow-lg hover:shadow-xl opacity-75"
                  >
                    {plan.highlighted && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-2 to-pink-400 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                        Phổ biến nhất
                      </div>
                    )}

                    <CardHeader className="text-center pb-4 pt-8">
                      <CardTitle className="text-3xl font-bold mb-2">
                        {plan.name}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {plan.description}
                      </CardDescription>
                      <div className="mt-4">
                        <span className="text-4xl font-bold bg-gradient-to-r from-pink-300 via-pink-400 to-primary bg-clip-text text-transparent">
                          {plan.price === "0đ" ? "Miễn phí" : plan.price}
                        </span>
                        {plan.price !== "0đ" && (
                          <span className="text-gray-500 text-lg">/khóa</span>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3 pb-8">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="rounded-full bg-gradient-to-r from-fuchsia-200 to-primary p-1 mt-0.5">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-gray-700 text-sm leading-relaxed">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </CardContent>

                    <CardFooter>
                      <RippleButton
                        className={cn(
                          "relative w-full rounded-xl py-3 px-4 font-semibold text-lg",
                          "bg-gradient-to-r from-primary-2 to-primary",
                          "text-white drop-shadow-[0_1px_0_rgba(0,0,0,0.1)] shadow-lg transition-all duration-300",
                          "hover:shadow-2xl hover:brightness-110 active:scale-95"
                        )}
                        rippleColor="rgba(255,255,255,0.5)"
                      >
                        <span className="flex items-center justify-center gap-2">
                          {plan.price === "0đ"
                            ? "Bắt đầu miễn phí"
                            : "Đăng ký ngay"}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </span>
                      </RippleButton>
                    </CardFooter>
                  </Card>
                );
              })}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
