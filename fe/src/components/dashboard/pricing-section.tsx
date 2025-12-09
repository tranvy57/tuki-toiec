import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RippleButton } from "../ui/ripple-button";
import { cn } from "@/utils";

export const pricingPlans = [
  {
    name: "Free",
    price: "0đ",
    description: "Khởi đầu miễn phí, làm quen TOEIC",
    features: [
      "10 bài luyện tập cơ bản",
      "50 từ vựng TOEIC thiết yếu",
      "Theo dõi tiến độ cơ bản",
      "Hỗ trợ cộng đồng",
    ],
    highlighted: false,
  },
  {
    name: "450",
    price: "199,000đ",
    description: "Mục tiêu vượt qua 450 điểm",
    features: [
      "Tất cả tính năng Free",
      "30+ bài luyện tập kỹ năng cơ bản",
      "Ngữ pháp trọng tâm Part 5",
      "Listening Part 1-2 dễ hiểu",
      "Gợi ý cải thiện cá nhân",
    ],
    highlighted: false,
  },

  {
    name: "750+",
    price: "599,000đ",
    description: "Chinh phục TOEIC 750+",
    features: [
      "Tất cả tính năng 550",
      "Bài tập thực chiến không giới hạn",
      "AI coach 1-1 cá nhân",
      "Mô phỏng thi thật",
      "Đảm bảo đạt mục tiêu",
      "Chứng chỉ hoàn thành",
    ],
    highlighted: true,
  },
  {
    name: "550",
    price: "299,000đ",
    description: "Đạt mục tiêu 550 điểm",
    features: [
      "Tất cả tính năng 450",
      "100+ bài luyện tập nâng cao",
      "AI phân tích điểm yếu",
      "Lộ trình học cá nhân hóa",
      "Hỗ trợ ưu tiên",
    ],
    highlighted: false,
  },
];

export default function PricingSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 ">
      {/* <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 text-balance">
            Chọn gói học phù hợp với bạn
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto text-pretty">
            Học TOEIC thông minh với AI, tiết kiệm thời gian và đạt mục tiêu
            nhanh chóng
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
          {pricingPlans.map((plan, index) => {
            return (
              <Card
                key={plan.name}
                style={{ transform: `scale(${1 + index * 0.03})` }}
                className="relative rounded-2xl transition-all duration-300 bg-gradient-to-r from-white via-pink-100 to-primary-2 shadow-lg hover:shadow-xl"
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
        </div>
      </div> */}
    </section>
  );
}
