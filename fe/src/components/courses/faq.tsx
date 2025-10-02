"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Sự khác biệt giữa gói Miễn phí và Pro là gì?",
    answer:
      "Gói Miễn phí cho bạn truy cập tất cả bài tập luyện tập và bài kiểm tra mini. Gói Pro bổ sung thêm bài giảng lý thuyết, mẹo chuyên gia, hướng dẫn video, bài kiểm tra checkpoint, và báo cáo hiệu suất chi tiết để giúp bạn thành thạo mọi khái niệm.",
  },
  {
    question: "Tôi có thể bỏ qua các bài học không?",
    answer:
      "Có! Bạn có thể bỏ qua và học trước, nhưng chúng tôi khuyến nghị hoàn thành các bài kiểm tra checkpoint để xác minh sự hiểu biết của bạn. Điều này đảm bảo bạn có nền tảng cần thiết cho các chủ đề nâng cao.",
  },
  {
    question: "Bài kiểm tra checkpoint hoạt động như thế nào?",
    answer:
      "Bài kiểm tra checkpoint xuất hiện sau các module quan trọng để kiểm tra sự hiểu biết của bạn. Bạn cần vượt qua chúng để mở khóa một số nội dung nâng cao, đảm bảo tiến độ chất lượng trong suốt khóa học.",
  },
  {
    question: "Có bản dùng thử cho gói Pro không?",
    answer:
      "Có! Gói Pro bao gồm bản dùng thử module 3 ngày để bạn có thể trải nghiệm các bài giảng lý thuyết và tính năng nâng cao trước khi cam kết với toàn bộ khóa học.",
  },
  {
    question:
      "Tôi có được giữ quyền truy cập sau khi hoàn thành khóa học không?",
    answer:
      "Pro là thanh toán một lần với quyền truy cập trọn đời. Bạn có thể xem lại bất kỳ bài học, bộ bài tập, hoặc tài nguyên nào bất cứ khi nào bạn cần ôn tập.",
  },
  {
    question: "Chính sách hoàn tiền của bạn là gì?",
    answer:
      "Chúng tôi cung cấp bảo hành hoàn tiền 30 ngày. Nếu bạn không hài lòng với gói Pro vì bất kỳ lý do gì, hãy liên hệ với chúng tôi trong vòng 30 ngày để được hoàn tiền đầy đủ.",
  },
  {
    question: "Mất bao lâu để hoàn thành khóa học?",
    answer:
      "Hầu hết học viên hoàn thành toàn bộ khóa học trong 6-8 tuần với việc luyện tập đều đặn. Tuy nhiên, bạn có thể học theo tốc độ của mình—một số hoàn thành nhanh hơn, những người khác mất nhiều thời gian hơn.",
  },
  {
    question: "Điều này có giúp tôi đạt được điểm mục tiêu không?",
    answer:
      "Học viên của chúng tôi thấy sự cải thiện trung bình 150+ điểm. Với các bài học có cấu trúc, mẹo chuyên gia, và phản hồi chi tiết, bạn sẽ có mọi thứ cần thiết để đạt được mục tiêu của mình.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-20 md:py-28 ">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Câu hỏi thường gặp
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Mọi thứ bạn cần biết về khóa học
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white border border-border rounded-2xl px-6 shadow-sm"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
