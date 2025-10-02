"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Lock, PlayCircle, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const modules = [
  {
    id: 1,
    title: "Nền tảng Nghe",
    lessons: 12,
    duration: "3.5 giờ",
    lessons_detail: [
      { name: "Part 1: Mô tả hình ảnh", type: "practice", locked: false },
      { name: "Part 1: Lý thuyết & Mẹo", type: "theory", locked: true },
      { name: "Part 2: Câu hỏi-Đáp án", type: "practice", locked: false },
    ],
  },
  {
    id: 2,
    title: "Đọc hiểu",
    lessons: 15,
    duration: "4 giờ",
    lessons_detail: [
      { name: "Part 5: Ngữ pháp cơ bản", type: "practice", locked: false },
      { name: "Part 5: Chiến lược nâng cao", type: "theory", locked: true },
      { name: "Part 6: Hoàn thành đoạn văn", type: "practice", locked: false },
    ],
  },
  {
    id: 3,
    title: "Kỹ thuật nâng cao",
    lessons: 10,
    duration: "2.5 giờ",
    lessons_detail: [
      { name: "Quản lý thời gian", type: "theory", locked: true },
      { name: "Bẫy thường gặp & Lỗi sai", type: "theory", locked: true },
      {
        name: "Bài kiểm tra thực hành đầy đủ",
        type: "practice",
        locked: false,
      },
    ],
  },
];

export function SyllabusPreview() {
  const [expandedModule, setExpandedModule] = useState<number | null>(null);

  return (
    <section id="syllabus" className="py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Giáo trình khóa học
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Lộ trình có cấu trúc từ cơ bản đến thành thạo. Gói miễn phí bao gồm
            luyện tập, Pro mở khóa lý thuyết và mẹo.
          </p>
        </motion.div>

        <div className="space-y-4">
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() =>
                  setExpandedModule(
                    expandedModule === module.id ? null : module.id
                  )
                }
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-foreground">
                      {module.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {module.lessons} bài học · {module.duration}
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground transition-transform ${
                    expandedModule === module.id ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {expandedModule === module.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-border"
                  >
                    <div className="px-6 py-4 space-y-3">
                      {module.lessons_detail.map((lesson, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <PlayCircle className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">
                              {lesson.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {lesson.locked && (
                              <>
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-primary-light text-primary border-primary/20"
                                >
                                  Pro
                                </Badge>
                                <Lock className="w-4 h-4 text-muted-foreground" />
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
