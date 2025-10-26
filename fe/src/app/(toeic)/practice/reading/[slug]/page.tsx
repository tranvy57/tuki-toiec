"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import Link from "next/link";
import { Check, Edit3 } from "lucide-react";
import { speakingExerciseTypes } from "@/data/mockMenuSpeaking";
import { PracticeBreadcrumb } from "@/components/practice/PracticeBreadcrumb";

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

export default function SpeakingTopicsPage() {
  const params = useParams();
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const exercise = speakingExerciseTypes.find((ex) => ex.slug === params.slug);
  console.log(exercise)

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

  return (
    <div className="min-h-screen bg-gray-50  px-6">
      <div className="container mx-auto pt-6">
        <PracticeBreadcrumb
          items={[
            { label: "Reading", href: "/practice/reading" },
            { label: exercise?.name || 'Bài tập' }
          ]}
        />
      </div>

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
            <div className="p-3  rounded-xl ">
              <Edit3 className="w-4 h-4 " />
            </div>
            <h1 className="text-4xl md:text-3xl font-bold text-[#23085A]">
              Speaking
            </h1>
          </div>

          <div className="flex item-start gap-6">
            <Image
              src={exercise.imageUrl}
              width={500}
              height={500}
              alt="hehe"
            />

            {exercise && (
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

        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className=" flex  gap-6 w-full mx-auto "
        >
          <div className="flex gap-6 flex-col w-[75%]">
            {exercise.subTopics.map((topic) => (
              <motion.div
                key={topic.id}
                variants={itemVariants}
                onMouseEnter={() => setHoveredCard(topic.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Link
                  href={`/practice/speaking/${exercise.slug}/${topic.slug}`}
                  className="block"
                >
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-stretch   transition-all duration-300 rounded-lg overflow-hidden group bg-white">
                      <div className=" flex flex-col justify-between border-l bg-white">
                        <Image
                          src={
                            topic.imageUrl ||
                            "https://working.vn/vnt_upload/news/hinh_ky_nang/H24-min.gif"
                          }
                          width={600}
                          height={600}
                          alt={exercise.name}
                          className="object-cover w-full h-40"
                        />

                        {/* <div className="p-4">
                      <Link href={`/practice/writing/${exercise.slug}/topics`}>
                        <Button
                          className="w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
                          size="lg"
                        >
                          <span>Chọn chủ đề</span>
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </Button>
                      </Link>
                    </div> */}
                      </div>
                      <div className="flex-1 p-5 flex flex-col justify-between">
                        {/* Header */}
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            {/* <div className="p-3 bg-gray-50 rounded-lg border shadow-sm group-hover:scale-110 transition-transform duration-300">
                          <exercise.icon className="w-6 h-6 text-gray-700" />
                        </div> */}
                            <h3 className="text-xl font-semibold text-[#23085A]  group-hover:text-gray-800 transition-colors">
                              {topic.title}
                            </h3>
                          </div>

                          {/* Description */}
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {topic.description}
                          </p>

                          {/* Info */}
                          {/* <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Target className="w-4 h-4" />
                          <span>{exercise.exerciseCount} bài tập</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          <span>{exercise.estimatedTime}</span>
                        </div>
                      </div> */}
                        </div>
                        {/* Progress */}
                        {/* <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Tiến độ</span>
                        <span>0/{exercise.exerciseCount}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-gradient-to-r from-pink-400 to-blue-500 h-2 rounded-full w-0 transition-all duration-300" />
                      </div>
                    </div> */}
                      </div>

                      {/* RIGHT IMAGE + BUTTON */}
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="p-4 round-sm bg-white  w-80">
            <h3 className="text-lg font-semibold text-[#23085A] mb-3">
              🎯 Các dạng khác
            </h3>
            <ul className="space-y-4 text-gray-800">
              {speakingExerciseTypes.map((item) => {
                return (
                  <Link href={"abc"} key={item.slug}>
                    <li className="flex items-start gap-2 hover:underline">
                      <Check className="w-5 h-5 text-[#23085A] mt-0.5" />
                      <span>{item?.name}</span>
                    </li>
                  </Link>
                );
              })}
            </ul>
          </div>
        </motion.div>
      </div>
      {/* Topics list */}
    </div>
  );
}
