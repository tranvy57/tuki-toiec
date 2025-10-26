"use client";

import InteractiveListeningDemo from "@/components/listening/InteractiveListeningDemo";
import { ExerciseType } from "@/types/exercise";
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

export function App() {
  const [currentView, setCurrentView] = useState<
    "overview" | "exercise" | "demo"
  >("overview");
  const [selectedExerciseType, setSelectedExerciseType] =
    useState<ExerciseType | null>(null);

  const handleBackToOverview = () => {
    setCurrentView("overview");
    setSelectedExerciseType(null);
  };

  return (
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
            <BreadcrumbPage>Listening</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <InteractiveListeningDemo />
    </div>
  );
}

export default App;
