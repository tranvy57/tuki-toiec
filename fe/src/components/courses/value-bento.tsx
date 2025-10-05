"use client";

import { motion } from "framer-motion";
import { Target, CheckCircle2, BarChart3, Zap } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Giáo trình có cấu trúc",
    description:
      "Theo dõi chương trình học đã được chứng minh bởi các chuyên gia TOEIC",
  },
  {
    icon: CheckCircle2,
    title: "Tiến độ kỹ năng được xác minh",
    description:
      "Các bài kiểm tra checkpoint đảm bảo bạn thành thạo từng khái niệm",
  },
  {
    icon: BarChart3,
    title: "Phản hồi kỹ năng chi tiết",
    description: "Phân tích chi tiết cho từng phần và loại câu hỏi",
  },
  {
    icon: Zap,
    title: "Ôn tập nhanh & Bài kiểm tra mini",
    description: "Các phiên luyện tập nhanh phù hợp với lịch trình của bạn",
  },
];

export function ValueBento() {
  return (
    <section className="py-20 md:py-28 ">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Tại sao chọn khóa TOEIC của chúng tôi
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Mọi thứ bạn cần để đạt điểm mục tiêu, được tổ chức và tối ưu hóa cho
            sự thành công của bạn
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="group bg-white border border-border rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <value.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {value.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
