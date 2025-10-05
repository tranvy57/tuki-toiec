"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-primary-lighter via-white to-primary-light relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.1),transparent_70%)]" />

      <div className="max-w-4xl mx-auto px-4 md:px-6 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-primary-light px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Tham gia cùng 10.000+ học viên thành công
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Sẵn sàng chinh phục TOEIC?
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-pretty leading-relaxed">
            Bắt đầu luyện tập miễn phí ngay hôm nay, hoặc mở khóa toàn bộ khóa
            học với Pro để có lý thuyết, mẹo, và phản hồi chi tiết.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary-hover text-white rounded-xl shadow-lg shadow-primary/25 text-base group"
            >
              Bắt đầu miễn phí ngay
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-xl border-2 border-primary text-primary hover:bg-primary/5 text-base bg-transparent"
            >
              Nâng cấp lên Pro
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Không cần thẻ tín dụng cho gói Miễn phí · Bảo hành hoàn tiền 30 ngày
            cho Pro
          </p>
        </motion.div>
      </div>
    </section>
  );
}
