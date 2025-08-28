import { router } from "expo-router";
import TestStartScreen from "~/components/practice/StartTest";

export default function TestStartPage() {
  const handleStartTest = () => {
    console.log('[v0] Starting test...');
    // Navigate to test screen
  };

  const handleGoBack = () => {
    router.back();
    // Navigate back to test list
  };

  return (
    <TestStartScreen
      testTitle="TOEIC Practice Test - Full Length"
      testId="TEST001"
      onStartTest={handleStartTest}
      onGoBack={handleGoBack}
    />
  );
}
