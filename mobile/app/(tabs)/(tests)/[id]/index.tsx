import { router } from 'expo-router';
import { useEffect } from 'react';
import { useStartTestPractice } from '~/api/attempts/useStartAttempt';
import TestStartScreen from '~/components/practice/StartTest';
import { useCurrentTest } from '~/hooks/useCurrentTest';

export default function TestStartPage() {
  const { mutate, data, isPending, isSuccess, isError } = useStartTestPractice();
  const { setCurrentPart, setFullTest } = useCurrentTest();

  useEffect(() => {
    // Start the test when the component mounts
    mutate('b6ee396d-5820-43b4-bbc7-4753f52d7cb4', {
      onSuccess: (res) => {
        setFullTest(res);
      },
      onError: (err) => {
        console.error('Mutation failed:', err);
      },
    });
  }, []);

  const handleStartTest = () => {
    // setCurrentPart(1); // Set the current part to 1 when starting the test
    router.push({
      pathname: '/(tabs)/(tests)/[id]/review-part',
      params: {
        id: 'TEST001',
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
