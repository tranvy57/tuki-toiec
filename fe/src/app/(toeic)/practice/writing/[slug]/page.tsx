"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Clock, Edit3, Icon, Target } from "lucide-react";
import { writingExerciseTypes } from "@/data/mockDataWritting";

// Mock data tương tự phần bạn có

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};
const data = writingExerciseTypes;

export default function WritingTopicsPage() {
  const params = useParams();
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const exercise = data.find((ex) => ex.slug === params.slug);
  console.log("exercise", exercise);

  if (!exercise)
    return (
      <div className="p-8 text-center text-gray-600">
        Không tìm thấy dạng bài.
      </div>
    );

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  useEffect(() => {});

  return (
    <div className="min-h-screen bg-gray-50  px-6">
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 bg-pink-400/10 rounded-full blur-xl"
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-40 right-20 w-32 h-32 bg-blue-400/10 rounded-full blur-xl"
        animate={{
          y: [0, 20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      {/* Header */}

      <div className="container mx-auto px-4 py-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className=""
        >
          <div className="flex mx-auto items-center justify-start gap-3 mb-4">
            <exercise.icon className="w-8 h-8 text-[oklch(0.22_0.15_283)]" />
            <h1 className="text-2xl md:text-3xl font-bold text-[#23085A]">
              {exercise.name}
            </h1>
          </div>

          <div className="flex item-start gap-6 bg-white p-4">
            <Image
              src={exercise?.imageUrl}
              width={300}
              height={300}
              alt="hehe"
            />

            {exercise.instruction && (
              <div className="  ">
                <h3 className="text-lg font-semibold text-[#23085A] mb-2">
                  Hướng dẫn làm bài dạng {exercise.name.toLowerCase()}
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  {exercise.instruction.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </motion.div>

        <h1 className="text-4xl md:text-xl font-bold text-[#23085A] pb-4 mt-4">
          Danh sách chủ đề:
        </h1>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {exercise.subTopics.map((topic, i) => {
            console.log("name", topic);

            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="group relative rounded-2xl shadow-sm hover:shadow-lg bg-white border border-gray-100 overflow-hidden"
              >
                <Link href={`/practice/writing/${params.slug}/${topic.id}`}>
                  <div className="relative h-40 w-full overflow-hidden">
                    <Image
                      src={topic.imageUrl}
                      alt={topic.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t  opacity-60`}
                    />
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-white/80 text-sm font-semibold text-gray-800">
                      {topic.level}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col justify-between">
                    <div className="flex flex-col gap-2 mb-2">
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Target className="w-4 h-4" />
                          <span>5 bài tập</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          <span>5-20 phút</span>
                        </div>
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {topic.title}
                      </h2>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {topic.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
      {/* Topics list */}
    </div>
  );
}
