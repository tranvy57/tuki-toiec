"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Clock, Edit3, Icon, Target, Loader2, Mail, Image as ImageIcon, BookOpen } from "lucide-react";
import { writingExerciseTypes } from "@/data/mockDataWritting";
import { CustomCard } from "@/components/CustomCard";
import { PracticeBreadcrumb } from "@/components/practice/PracticeBreadcrumb";
import { useLessonsByModality } from "@/api/useLessons";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockReadingExercises } from "@/data/mockMenuReading";

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
const data = mockReadingExercises;

export default function ReadingTopicsPage() {
  const params = useParams();
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const slug = params.slug as string;
  const exercise = data.find((ex) => ex.slug === slug);

  // Fetch API data - chỉ hỗ trợ MCQ cho Reading
  const { data: mcqLessons, isLoading: mcqLoading, error: mcqError } = useLessonsByModality({
    modality: "mcq",
    enabled: slug === "mcq",
    skillType: "reading"
  });

  // console.log("exercise", exercise);
  // console.log("emailLessons", emailLessons);

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
      {/* Breadcrumb */}
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
          {/* <div className="flex mx-auto items-center justify-start gap-3 mb-4 rounded-md">
            {exercise.icon && <exercise.icon className="w-5 h-5 text-primary" />}
            <h1 className="text-2xl md:text-3xl font-bold text-[#23085A]">
              {exercise.name}
            </h1>
          </div> */}

          <div className="flex item-start gap-6 bg-white p-4 rounded-md">
            <Image
              src={exercise?.imageUrl}
              width={300}
              height={300}
              alt="reading exercise"
            />

            {exercise.instruction && (
              <div className="">
                <h3 className="text-lg font-semibold text-[#23085A] mb-2 ">
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
          {/* Loading states */}
          {(slug === "mcq" && mcqLoading) && (
            <>
              {[1, 2, 3].map((skeleton) => (
                <div key={skeleton} className="relative group">
                  <Card className="h-full bg-white border-gray-200 shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-center h-40">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                      </div>
                      <div className="text-center">
                        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-3 bg-gray-100 rounded animate-pulse"></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </>
          )}

          {/* Error states */}
          {(slug === "mcq" && mcqError) && (
            <div className="col-span-4 text-center py-8">
              <div className="text-red-500 mb-4">
                <BookOpen className="w-12 h-12 mx-auto mb-2" />
                <h3 className="text-lg font-semibold">Không thể tải dữ liệu</h3>
                <p className="text-sm">Vui lòng thử lại sau</p>
              </div>
            </div>
          )}

          {/* Render API data for mcq */}
          {slug === "mcq" && mcqLessons && !mcqLoading && (
            <>
              {mcqLessons.map((lesson) => (
                <CustomCard
                  key={lesson.lessonId}
                  slug={lesson.lessonId}
                  name={lesson.name}
                  description={`Difficulty: easy | Band: 550`}
                  imageUrl="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                  icon={BookOpen}
                  href={`/practice/reading/${exercise.slug}/${lesson.lessonId}`}
                />
              ))}
            </>
          )}


        </div>
      </div>
      {/* Topics list */}
    </div>
  );
}
