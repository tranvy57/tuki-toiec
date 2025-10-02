"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Nguyễn Thị Hoa",
    role: "Chuyên viên Marketing",
    avatar: "/diverse-woman-portrait.png",
    content:
      "Tôi đã tăng từ 650 lên 850 điểm chỉ trong 2 tháng! Các bài giảng lý thuyết trong gói Pro thực sự tạo nên sự khác biệt.",
    rating: 5,
  },
  {
    name: "Trần Minh Đức",
    role: "Sinh viên Kỹ thuật",
    avatar: "/man.jpg",
    content:
      "Các bài kiểm tra checkpoint giúp tôi luôn theo dõi tiến độ. Cuối cùng tôi đã hiểu được điểm yếu và cải thiện chúng.",
    rating: 5,
  },
  {
    name: "Lê Thị Mai",
    role: "Chuyên viên Phân tích Kinh doanh",
    avatar: "/professional-woman.png",
    content:
      "Khóa học TOEIC tốt nhất mà tôi từng thử. Giáo trình có cấu trúc và phản hồi chi tiết thực sự thay đổi cuộc chơi.",
    rating: 5,
  },
];

export function Testimonials() {
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
            Được yêu thích bởi học viên toàn cầu
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Tham gia cùng hàng nghìn người đã đạt được điểm mục tiêu
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>

              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-primary-light px-6 py-3 rounded-full">
            <Star className="w-5 h-5 fill-primary text-primary" />
            <span className="font-semibold text-foreground">
              Đánh giá trung bình 4.9/5
            </span>
            <span className="text-muted-foreground">từ 2.400+ đánh giá</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
