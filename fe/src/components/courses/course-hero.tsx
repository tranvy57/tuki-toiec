"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Shield } from "lucide-react";

export function CourseHero() {
  return (
    <section
      id="overview"
      className="relative overflow-hidden bg-gradient-to-br from-primary-lighter via-white to-primary-light pt-24 pb-20 md:pt-32 md:pb-28"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(236,72,153,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.08),transparent_50%)]" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              Lộ trình học có cấu trúc
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance leading-tight">
              Chinh phục TOEIC nhanh hơn với khóa học hướng dẫn
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty leading-relaxed">
              Bắt đầu với gói luyện tập miễn phí, hoặc nâng cấp lên Pro để có
              đầy đủ bài giảng lý thuyết, mẹo từ chuyên gia và đánh giá hiệu
              suất chi tiết.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary-hover text-white rounded-xl shadow-lg shadow-primary/25 text-base"
              >
                Bắt đầu miễn phí
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl border-2 border-primary text-primary hover:bg-primary/5 text-base bg-transparent"
              >
                Mua khóa học
              </Button>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">10.000+ học viên</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">4.9/5 đánh giá</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Bảo hành 30 ngày</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-border">
              <div className="absolute -top-4 -right-4 bg-primary text-white px-4 py-2 rounded-xl font-semibold shadow-lg">
                +150 điểm TB
              </div>

              <div className="space-y-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Tiến độ của bạn
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "68%" }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-primary to-primary-hover rounded-full"
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Hoàn thành 68%
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary-light rounded-xl p-4">
                    <div className="text-2xl font-bold text-primary">850</div>
                    <div className="text-xs text-muted-foreground">
                      Điểm hiện tại
                    </div>
                  </div>
                  <div className="bg-primary-light rounded-xl p-4">
                    <div className="text-2xl font-bold text-primary">24</div>
                    <div className="text-xs text-muted-foreground">
                      Bài đã học
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="text-sm font-medium mb-3">
                    Hoạt động gần đây
                  </div>
                  <div className="space-y-2">
                    {["Nghe Part 2", "Đọc Part 5", "Ôn tập ngữ pháp"].map(
                      (item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <span className="text-sm text-muted-foreground">
                            {item}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
