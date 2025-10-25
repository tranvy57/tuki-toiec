"use client";

import ClozeDemoPage from "@/components/listening/exercises/ClozeDemoPage";
import DictationDemo from "@/components/listening/exercises/DictationDemo";
import MCQItemDemo from "@/components/listening/exercises/MCQItemDemo";
import InteractiveListeningDemo from "@/components/listening/InteractiveListeningDemo";
import { ExerciseType } from "@/types/exercise";
import { useState } from "react";

export function ClozePage() {
  

  return (
    <ClozeDemoPage onBack={() => {}} />
  );
}

export default ClozePage;
