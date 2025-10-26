"use client";

import ClozeDemoPage from "@/components/listening/exercises/ClozeDemoPage";
import DictationDemo from "@/components/listening/exercises/DictationDemo";
import DictationExerciseList from "@/components/listening/exercises/DictationExerciseList";
import MCQItemDemo from "@/components/listening/exercises/MCQItemDemo";
import InteractiveListeningDemo from "@/components/listening/InteractiveListeningDemo";
import { ExerciseType } from "@/types/exercise";
import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function MCQPage() {
  const { slug } = useParams<{ slug: string }>();

  // Get exercise name based on slug
  const getExerciseName = (slug: string) => {
    switch (slug) {
      case "mcq":
        return "Trắc nghiệm";
      case "dictation":
        return "Chính tả";
      case "cloze":
        return "Điền từ";
      default:
        return slug;
    }
  };

  const BreadcrumbWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="container mx-auto px-6 py-4">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Trang chủ</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/practice">Ôn luyện</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/practice/listening">Listening</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{getExerciseName(slug)}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
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
