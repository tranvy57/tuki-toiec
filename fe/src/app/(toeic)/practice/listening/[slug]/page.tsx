"use client";

import ClozeDemoPage from "@/components/listening/exercises/ClozeDemoPage";
import DictationDemo from "@/components/listening/exercises/DictationDemo";
import DictationExerciseList from "@/components/listening/exercises/DictationExerciseList";
import MCQItemDemo from "@/components/listening/exercises/MCQItemDemo";
import InteractiveListeningDemo from "@/components/listening/InteractiveListeningDemo";
import { ExerciseType } from "@/types/exercise";
import { useParams } from "next/navigation";
import { useState } from "react";
import { PracticeBreadcrumb, getExerciseName } from "@/components/practice/PracticeBreadcrumb";

export function MCQPage() {
  const { slug } = useParams<{ slug: string }>();

  const BreadcrumbWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="container mx-auto px-6 py-4">
      <PracticeBreadcrumb
        items={[
          { label: "Listening", href: "/practice/listening" },
          { label: getExerciseName(slug) }
        ]}
      />
      {children}
    </div>
  );

  if (slug === "mcq") {
    return (
      <BreadcrumbWrapper>
        <MCQItemDemo />
      </BreadcrumbWrapper>
    );
  } else if (slug === "dictation") {
    return (
      <BreadcrumbWrapper>
        <DictationExerciseList onBack={() => { }} />
      </BreadcrumbWrapper>
    );
  } else if (slug === "cloze") {
    return (
      <BreadcrumbWrapper>
        <ClozeDemoPage onBack={() => { }} />
      </BreadcrumbWrapper>
    );
  }
}

export default MCQPage;
