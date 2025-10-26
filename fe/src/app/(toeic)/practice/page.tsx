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
import { CustomCard } from "@/components/CustomCard";
import { speakingExerciseTypes } from "@/data/mockMenuSpeaking";
import { dataListening } from "@/components/listening/InteractiveListeningDemo";

const SKILLS = skillsData;

const PracticePage = () => {
  return (
    <div className="mt-4 flex flex-col gap-4">
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
      <div className="container mx-auto px-6 ">
        <h1 className="text-2xl font-bold text-[#23085A] mb-4">
          Ôn luyện TOEIC theo 4 kỹ năng
        </h1>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {SKILLS.map((skill, i) => {
            console.log("skill", skill);

            const Icon = skill.icon;
            return (
              <CustomCard
                key={skill.name}
                slug={skill.id}
                name={skill.name}
                description={skill.description}
                imageUrl={skill.image}
                icon={Icon}
                href={`/practice/${skill.id}`}
              />
            );
          })}
        </div>
      </div>

      {/* Writting Section */}
      <div className="container mx-auto px-6 ">
        <div className="flex gap-2 justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Pencil className="w-7 h-7 text-[#23085A] " />
              <h1 className="text-2xl font-bold text-[#23085A]">Writting </h1>
            </div>
            <div className="flex items-center gap-1.5">
              {/* <Target className="w-4 h-4" /> */}
              <span>(3 bài tập)</span>
            </div>
          </div>
          <p className="underline">Xem tất cả </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 w-full">
          {writingExerciseTypes.map((exercise, i) => (
            <CustomCard
              key={exercise.slug}
              slug={exercise.slug}
              name={exercise.name}
              description={exercise.description}
              imageUrl={exercise.imageUrl}
              icon={exercise.icon}
              href={`/practice/writing/${exercise.slug}`}
            />
          ))}
        </div>
      </div>

      {/* Speaking Section */}
      <div className="container mx-auto px-6 ">
        <div className="flex gap-2 justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Mic className="w-7 h-7 text-[#23085A] " />
              <h1 className="text-2xl font-bold text-[#23085A]">Speaking </h1>
            </div>
            <div className="flex items-center gap-1.5">
              {/* <Target className="w-4 h-4" /> */}

              <span>(3 bài tập)</span>
            </div>
          </div>
          <p className="underline">Xem tất cả </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 w-full">
          {speakingExerciseTypes.map((exercise, i) => (
            <CustomCard
              key={exercise.slug}
              slug={exercise.slug}
              name={exercise.name}
              description={exercise.description}
              imageUrl={exercise.imageUrl}
              icon={exercise.icon}
              href={`/practice/speaking/${exercise.slug}`}
            />
          ))}
        </div>
      </div>

      {/* Listening Section */}
      <div className="container mx-auto px-6 ">
        <div className="flex gap-2 justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Mic className="w-7 h-7 text-[#23085A] " />
              <h1 className="text-2xl font-bold text-[#23085A]">Listening </h1>
            </div>
            <div className="flex items-center gap-1.5">
              {/* <Target className="w-4 h-4" /> */}

              <span>(3 bài tập)</span>
            </div>
          </div>
          <p className="underline">Xem tất cả </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 w-full">
          {dataListening.map((exercise, index) => {
            const IconComponent = exercise.icon;

            return (
              <motion.div
                key={exercise.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CustomCard
                  slug={exercise.id}
                  name={exercise.name}
                  description={exercise.description}
                  icon={exercise.icon}
                  href={exercise.href}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PracticePage;
