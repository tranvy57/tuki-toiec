"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Target,
  BookOpen,
  Headphones,
  ChartBar as BarChart,
} from "lucide-react";

const features = [
  {
    title: "Đánh giá trình độ",
    description:
      "Kiểm tra năng lực hiện tại và xác định điểm yếu cần cải thiện",
    icon: Target,
    gradient: "from-blue-500 to-cyan-500",
    glowColor: "rgba(59, 130, 246, 0.5)",
  },
  {
    title: "Lộ trình học cá nhân",
    description:
      "Chương trình học được thiết kế riêng dựa trên mục tiêu của bạn",
    icon: BookOpen,
    gradient: "from-orange-500 to-pink-500",
    glowColor: "rgba(249, 115, 22, 0.5)",
  },
  {
    title: "Thư viện câu hỏi TOEIC",
    description: "Hàng nghìn câu hỏi thực tế theo chuẩn đề thi TOEIC",
    icon: Headphones,
    gradient: "from-emerald-500 to-teal-500",
    glowColor: "rgba(16, 185, 129, 0.5)",
  },
  {
    title: "Theo dõi tiến bộ",
    description: "Thống kê chi tiết giúp bạn nắm rõ quá trình học tập",
    icon: BarChart,
    gradient: "from-amber-500 to-yellow-500",
    glowColor: "rgba(245, 158, 11, 0.5)",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function FeaturesSection() {
  return (
    <section className="relative px-4 py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50/50 -z-10" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem] -z-10" />

      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-block"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 px-4 py-1.5 text-sm font-medium text-blue-700 ring-1 ring-blue-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Tính năng nổi bật
            </span>
          </motion.div>

          <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
            Mọi thứ bạn cần để{" "}
            <span className="bg-gradient-to-r from-fuchsia-300 via-fuchsia-400 to-primary bg-clip-text text-transparent">
              chinh phục TOEIC
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 md:text-xl">
            Học thông minh hơn với công nghệ AI và phương pháp được chứng minh
          </p>
        </motion.div>

        <motion.ul
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature, index) => (
            <motion.li key={index} variants={item}>
              <Card className="group relative h-full overflow-hidden rounded-2xl border-0 bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 blur-xl -z-10"
                  style={{
                    background: `radial-gradient(circle at center, ${feature.glowColor}, transparent 70%)`,
                  }}
                />

                <CardContent className="relative p-8">
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6 inline-flex"
                  >
                    <div
                      className={`rounded-2xl bg-gradient-to-br ${feature.gradient} p-4 shadow-lg`}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                  </motion.div>

                  <h3 className="mb-3 text-xl font-bold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-base leading-relaxed text-gray-600 mb-4">
                    {feature.description}
                  </p>

                  {/* Tìm hiểu thêm link - appears on hover */}
                  <div
                    // initial={{ opacity: 0, y: 10 }}
                    // whileHover={{ opacity: 1, y: 0 }}
                    className=" transition-all duration-300"
                  >
                    <a
                      href="#"
                      className="items-center justify-end-safe text-sm font-medium text-primary  transition-colors duration-200 hover:underline flex "
                    >
                      Tìm hiểu thêm
                      <svg
                        className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 translate-y-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </a>
                  </div>

                  <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent"
                    initial={{ width: "0%" }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                    style={{
                      background: `linear-gradient(to right, transparent, ${feature.glowColor}, transparent)`,
                    }}
                  />
                </CardContent>
              </Card>
            </motion.li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-gray-500">
            Được tin dùng bởi hơn{" "}
            <span className="font-semibold text-gray-900">10,000+</span> học
            viên
          </p>
        </motion.div>
      </div>
    </section>
  );
}
