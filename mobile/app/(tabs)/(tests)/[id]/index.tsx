import { router } from "expo-router";
import TestStartScreen from "~/components/practice/StartTest";

export default function TestStartPage() {
  const handleStartTest = () => {
    router.push({
      pathname: '/(tabs)/(tests)/[id]/[q]',
      params: {
        id: 'TEST001',
        q: 1,
      },
    });
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
