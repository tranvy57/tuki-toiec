"use client";

import ClozeDemoPage from "@/components/listening/exercises/ClozeDemoPage";
import DictationDemo from "@/components/listening/exercises/DictationDemo";
import DictationExerciseList from "@/components/listening/exercises/DictationExerciseList";
import MCQItemDemo from "@/components/listening/exercises/MCQItemDemo";
import InteractiveListeningDemo from "@/components/listening/InteractiveListeningDemo";
import { ExerciseType } from "@/types/exercise";
import { useParams } from "next/navigation";
import { useState } from "react";

export function MCQPage() {
  const { slug } = useParams<{ slug: string }>();
  if (slug === "mcq") {
    return <MCQItemDemo />;
  } else if (slug === "dictation") {
    return <DictationExerciseList onBack={() => {}} />;
  } else if (slug === "cloze") {
    return <ClozeDemoPage onBack={() => {}} />;
  }
}

export default MCQPage;
