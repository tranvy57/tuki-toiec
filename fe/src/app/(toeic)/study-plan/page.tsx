"use client";

import { BandPickerDialog } from "@/components/toeic/study-plan/band-picker-dialog";
import { PhaseOverview } from "@/components/toeic/study-plan/phase-overview";
import { ReviewTestWizard } from "@/components/toeic/study-plan/review-test-wizard";
import { UpgradeProSheet } from "@/components/toeic/study-plan/upgrade-pro-sheet";
import { useState } from "react";


type OnboardingStep = "band" | "test" | "overview";

export default function LearnPage() {
  const [step, setStep] = useState<OnboardingStep>("band");
  const [targetBand, setTargetBand] = useState<string>("");
  const [testResults, setTestResults] = useState<any>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleBandSelected = (band: string) => {
    setTargetBand(band);
    setStep("test");
  };

  const handleTestComplete = (results: any) => {
    setTestResults(results);
    setStep("overview");
  };

  return (
    <div className="min-h-screen">
      {step === "band" && (
        <BandPickerDialog open={true} onBandSelected={handleBandSelected} />
      )}

      {step === "test" && (
        <ReviewTestWizard
          targetBand={targetBand}
          onComplete={handleTestComplete}
        />
      )}

      {step === "overview" && (
        <>
          <PhaseOverview
            testResults={testResults}
            onUpgradeClick={() => setShowUpgrade(true)}
          />
          <UpgradeProSheet open={showUpgrade} onOpenChange={setShowUpgrade} />
        </>
      )}
    </div>
  );
}
