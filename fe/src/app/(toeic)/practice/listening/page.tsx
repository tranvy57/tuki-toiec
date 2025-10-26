"use client";

import InteractiveListeningDemo from "@/components/listening/InteractiveListeningDemo";
import { ExerciseType } from "@/types/exercise";
import { useState } from "react";
import { PracticeBreadcrumb } from "@/components/practice/PracticeBreadcrumb";

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
      <PracticeBreadcrumb
        items={[
          { label: "Listening" }
        ]}
      />

      <InteractiveListeningDemo />
    </div>
  );
}

export default App;
