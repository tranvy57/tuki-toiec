"use client";

import { motion } from "framer-motion";
import { Check, X, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { name: "Bộ bài tập & Luyện tập", free: true, pro: true },
  { name: "Bài kiểm tra mini & Câu đố", free: true, pro: true },
  { name: "Theo dõi tiến độ cơ bản", free: true, pro: true },
  { name: "Bài giảng lý thuyết & Bài học", free: false, pro: true },
  { name: "Mẹo chuyên gia & Video", free: false, pro: true },
  { name: "Bài kiểm tra checkpoint", free: false, pro: true },
  { name: "Báo cáo hiệu suất chi tiết", free: false, pro: true },
  { name: "Lộ trình tính năng ưu tiên", free: false, pro: true },
];

export function PlanCompare() {
  return (
    <section className="py-20 md:py-28 ">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Miễn phí vs Mua khóa học: Bạn nhận được gì
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Bắt đầu luyện tập miễn phí, nâng cấp lên Pro khi bạn sẵn sàng cho sự
            thành thạo hoàn chỉnh
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Free Plan Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white border-2 border-border rounded-2xl p-8"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Miễn phí
              </h3>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-4xl font-bold text-foreground">0₫</span>
                <span className="text-muted-foreground">mãi mãi</span>
              </div>
              <p className="text-muted-foreground">
                Hoàn hảo để bắt đầu với các bài tập luyện tập
              </p>
            </div>

            <Button
              variant="outline"
              className="w-full rounded-xl border-2 mb-6 bg-transparent"
              size="lg"
            >
              Bắt đầu miễn phí
            </Button>

            <div className="space-y-3">
              {features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  {feature.free ? (
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  ) : (
                    <X className="w-5 h-5 text-muted-foreground/40 flex-shrink-0 mt-0.5" />
                  )}
                  <span
                    className={`text-sm ${
                      feature.free
                        ? "text-foreground"
                        : "text-muted-foreground/60"
                    }`}
                  >
                    {feature.name}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Pro Plan Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-primary-lighter to-primary-light border-2 border-primary/30 rounded-2xl p-8 relative overflow-hidden shadow-xl"
          >
            <div className="absolute top-4 right-4">
              <div className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                Phổ biến
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-foreground mb-2">Pro</h3>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-4xl font-bold text-foreground">
                  199.000₫ - 599.000₫
                </span>
                <span className="text-muted-foreground">một khóa</span>
              </div>
              <p className="text-foreground/80">
                Khóa học hoàn chỉnh với lý thuyết, mẹo và phân tích chi tiết
              </p>
            </div>

            <Button
              className="w-full rounded-xl bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/25 mb-6"
              size="lg"
            >
              Nâng cấp lên Pro
            </Button>

            <div className="space-y-3">
              {features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">
                    {feature.name}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-primary/20">
              <div className="flex items-center gap-2 text-sm text-foreground/80">
                <Lock className="w-4 h-4" />
                <span>Bao gồm dùng thử module 3 ngày</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
