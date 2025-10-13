"use client";

import ExercisePage from "@/components/listening/ExercisePage";
import ListeningOverview from "@/components/listening/ListeningOverview";
import { ExerciseType } from "@/types/exercise";
import { useState } from "react";


export function App() {
  const [currentView, setCurrentView] = useState<"overview" | "exercise">(
    "overview"
  );
  const [selectedExerciseType, setSelectedExerciseType] =
    useState<ExerciseType | null>(null);

  const handleSelectExercise = (exerciseType: ExerciseType) => {
    setSelectedExerciseType(exerciseType);
    setCurrentView("exercise");
  };

  const handleBackToOverview = () => {
    setCurrentView("overview");
    setSelectedExerciseType(null);
  };

  return (
    <>
      {currentView === "overview" && (
        <ListeningOverview onSelectExercise={handleSelectExercise} />
      )}
      {currentView === "exercise" && selectedExerciseType && (
        <ExercisePage
          exerciseType={selectedExerciseType}
          onBack={handleBackToOverview}
        />
      )}
    </>
  );
}

export default App;
