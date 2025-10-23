"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Headphones,
  BookOpen,
  Mic,
  Pencil,
  Icon,
  Target,
  Clock,
} from "lucide-react";
import { writingExerciseTypes } from "@/data/mockDataWritting";
import { skillsData } from "@/data/SKILL";

const SKILLS = skillsData;

const PracticePage = () => {
  return (
    <div className="mt-4 flex flex-col gap-4">
      <div className="container mx-auto px-6 ">
        <h1 className="text-3xl font-bold text-[#23085A] mb-4">
          Ôn luyện TOEIC theo 4 kỹ năng
        </h1>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {SKILLS.map((skill, i) => {
            const Icon = skill.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="group relative rounded-2xl shadow-sm hover:shadow-lg bg-white border border-gray-100 overflow-hidden"
              >
                <div className="relative h-40 w-full overflow-hidden">
                  <Image
                    src={skill.image}
                    alt={skill.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t  opacity-60`}
                  />
                  <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-white/80 text-sm font-semibold text-gray-800">
                    {skill.level}
                  </div>
                </div>

                <div className="p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`w-5 h-5 text-[oklch(0.22_0.15_283)]`} />
                      <h2 className="text-lg font-semibold text-gray-900">
                        {skill.name}
                      </h2>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {skill.description}
                    </p>
                  </div>

                  <Link
                    href={skill.href}
                    className="mt-4 inline-flex items-center justify-center rounded-lg bg-[oklch(0.22_0.15_283)] text-white px-4 py-2 text-sm font-medium hover:bg-[oklch(0.27_0.15_283)] transition-colors"
                  >
                    Bắt đầu ôn luyện
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      <div className="container mx-auto px-6 ">
        <div className="flex gap-2 justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Pencil className="w-7 h-7 text-[#23085A] " />
              <h1 className="text-3xl font-bold text-[#23085A]">Writting </h1>
            </div>
            <div className="flex items-center gap-1.5">
              {/* <Target className="w-4 h-4" /> */}
              <span>(3 bài tập)</span>
            </div>
          </div>
          <p className="underline">Xem tất cả </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 w-full">
          {writingExerciseTypes.map((exercise) => (
            <motion.div
              // key={skill.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              // transition={{ delay: i * 0.1, duration: 0.4 }}
              className="group relative rounded-2xl shadow-sm hover:shadow-lg bg-white border border-gray-100 overflow-hidden"
            >
              <Link href={`/practice/writing/${exercise.slug}`}>
                <div className="relative h-40 w-full overflow-hidden">
                  <Image
                    src={exercise.imageUrl}
                    alt={exercise.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t  opacity-60`}
                  />
                  <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-white/80 text-sm font-semibold text-gray-800">
                    {/* {skill.level}
                     */}
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>5-20 phút</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <exercise.icon className="w-5 h-5 text-[oklch(0.22_0.15_283)]" />
                      <h2 className="text-lg font-semibold text-gray-900">
                        {exercise.name}
                      </h2>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-3">
                      {exercise.description}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PracticePage;
