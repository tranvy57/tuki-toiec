"use client";

import InteractiveListeningDemo from "@/components/listening/InteractiveListeningDemo";
import { ExerciseType } from "@/types/exercise";
import { useState } from "react";

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
    <>
      <InteractiveListeningDemo onBack={handleBackToOverview} />
    </>
  );
}

export default App;
